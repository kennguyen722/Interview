'use strict';
// Capstone 1: Event-Driven Notification Platform — Reference Solution
// Covers: priority queues, retry + dead-letter, idempotency, rate limiting, delivery tracking

const crypto = require('crypto');

// ─── Channel Adapters (in-memory mocks) ──────────────────────────────────────
function createEmailChannel()  { return { type: 'email',  delivered: [], send: async (n) => { createEmailChannel.prototype.calls = (createEmailChannel.prototype.calls||0)+1; return { channel: 'email', id: n.id }; } }; }
function createSMSChannel()    { return { type: 'sms',    delivered: [], send: async (n) => ({ channel: 'sms',   id: n.id }) }; }
function createPushChannel()   { return { type: 'push',   delivered: [], send: async (n) => ({ channel: 'push',  id: n.id }) }; }

// ─── Priority Queue ───────────────────────────────────────────────────────────
class PriorityQueue {
  #heap = [];

  enqueue(item, priority) {
    this.#heap.push({ item, priority });
    this.#bubbleUp(this.#heap.length - 1);
  }

  dequeue() {
    if (this.#heap.length === 0) return null;
    this.#swap(0, this.#heap.length - 1);
    const { item } = this.#heap.pop();
    this.#sinkDown(0);
    return item;
  }

  size() { return this.#heap.length; }

  #bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.#heap[parent].priority >= this.#heap[idx].priority) break;
      this.#swap(parent, idx);
      idx = parent;
    }
  }

  #sinkDown(idx) {
    const n = this.#heap.length;
    while (true) {
      let largest = idx;
      const l = 2 * idx + 1, r = 2 * idx + 2;
      if (l < n && this.#heap[l].priority > this.#heap[largest].priority) largest = l;
      if (r < n && this.#heap[r].priority > this.#heap[largest].priority) largest = r;
      if (largest === idx) break;
      this.#swap(idx, largest);
      idx = largest;
    }
  }

  #swap(a, b) { [this.#heap[a], this.#heap[b]] = [this.#heap[b], this.#heap[a]]; }
}

// ─── Rate Limiter (token bucket per tenant) ───────────────────────────────────
function createTenantRateLimiter({ ratePerSecond = 10 }) {
  const buckets = new Map(); // tenantId → { tokens, lastRefill }

  function consume(tenantId) {
    const now = Date.now();
    if (!buckets.has(tenantId)) buckets.set(tenantId, { tokens: ratePerSecond, lastRefill: now });
    const bucket = buckets.get(tenantId);

    // Refill tokens based on elapsed time
    const elapsed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(ratePerSecond, bucket.tokens + elapsed * ratePerSecond);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) { bucket.tokens -= 1; return true; }
    return false;
  }

  return { consume };
}

// ─── Dead Letter Queue ────────────────────────────────────────────────────────
function createDeadLetterQueue() {
  const entries = [];
  return {
    push(notification, reason) {
      entries.push({ notification, reason, failedAt: new Date().toISOString() });
    },
    entries: () => [...entries],
    size: () => entries.length
  };
}

// ─── Notification Service ─────────────────────────────────────────────────────
function createNotificationService({
  channels = {},
  ratePerSecond = 100,
  maxRetries = 3,
  baseRetryDelayMs = 100
} = {}) {
  const queue         = new PriorityQueue();
  const seen          = new Set(); // idempotency: notificationId → true
  const deliveryLog   = new Map(); // notificationId → status record
  const rateLimiter   = createTenantRateLimiter({ ratePerSecond });
  const deadLetter    = createDeadLetterQueue();
  let processing      = false;

  async function retryWithBackoff(fn, maxAttempts, baseDelayMs) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try { return await fn(); }
      catch (e) {
        if (attempt === maxAttempts) throw e;
        const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 50;
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  async function dispatch(notification) {
    const channelImpl = channels[notification.channel];
    if (!channelImpl) throw new Error(`Unknown channel: ${notification.channel}`);

    await retryWithBackoff(
      () => channelImpl.send(notification),
      maxRetries,
      baseRetryDelayMs
    );
  }

  async function processQueue() {
    if (processing) return;
    processing = true;

    while (queue.size() > 0) {
      const notification = queue.dequeue();
      const record = deliveryLog.get(notification.id);

      if (!rateLimiter.consume(notification.tenantId)) {
        // Re-enqueue with slight penalty to allow other tenants through
        queue.enqueue(notification, notification.priority - 1);
        await new Promise(r => setTimeout(r, 50));
        continue;
      }

      try {
        await dispatch(notification);
        if (record) { record.status = 'delivered'; record.deliveredAt = new Date().toISOString(); }
      } catch (e) {
        if (record) { record.status = 'failed'; record.error = e.message; }
        deadLetter.push(notification, e.message);
      }
    }

    processing = false;
  }

  function send({ id, tenantId, channel, payload, priority = 5 }) {
    const notifId = id || crypto.randomBytes(8).toString('hex');

    // Idempotency: skip duplicates
    if (seen.has(notifId)) return { id: notifId, status: 'duplicate' };
    seen.add(notifId);

    const notification = { id: notifId, tenantId, channel, payload, priority };
    deliveryLog.set(notifId, { id: notifId, status: 'queued', queuedAt: new Date().toISOString() });
    queue.enqueue(notification, priority);

    // Kick off processing asynchronously
    setImmediate(() => processQueue());

    return { id: notifId, status: 'queued' };
  }

  function getStatus(id) { return deliveryLog.get(id) || null; }

  return {
    send,
    getStatus,
    getDeadLetterQueue: () => deadLetter.entries(),
    getQueueDepth: () => queue.size(),
    flush: processQueue
  };
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  (async () => {
    const service = createNotificationService({
      channels: { email: createEmailChannel(), sms: createSMSChannel() },
      ratePerSecond: 50,
      maxRetries: 2,
      baseRetryDelayMs: 10
    });

    // Send 5 notifications
    const ids = [];
    for (let i = 1; i <= 3; i++) {
      const r = service.send({ id: `notif-${i}`, tenantId: 'tenant-a', channel: 'email', payload: { to: `user${i}@x.com`, body: `Message ${i}` }, priority: i === 1 ? 10 : 5 });
      ids.push(r.id);
    }

    // Idempotency: duplicate
    const dupe = service.send({ id: 'notif-1', tenantId: 'tenant-a', channel: 'email', payload: {}, priority: 5 });
    console.log('Duplicate status:', dupe.status);

    // Flush the queue
    await service.flush();
    await new Promise(r => setTimeout(r, 200));

    console.log('Queue depth after flush:', service.getQueueDepth());
    console.log('notif-1 status:', service.getStatus('notif-1')?.status);
    console.log('DLQ size:', service.getDeadLetterQueue().length);
  })();
}

module.exports = { createNotificationService, PriorityQueue, createTenantRateLimiter, createDeadLetterQueue };
