'use strict';
// Capstone 1: Event-Driven Notification Platform — Starter
//
// You are building a multi-channel notification system that must handle:
//   • Priority-based delivery (CRITICAL > HIGH > NORMAL > LOW)
//   • Per-tenant rate limiting (token bucket: N messages per time window)
//   • Retry with exponential backoff (max 3 attempts)
//   • Dead-letter queue for permanently failed notifications
//   • Idempotency (duplicate notification IDs are silently dropped)
//   • Delivery tracking (PENDING → DELIVERED | FAILED)
//
// Complete every function/class below. Do NOT change the exported API.

// ─── Priority Queue ───────────────────────────────────────────────────────────
// Max-heap: higher priority number = dequeued first.
// enqueue(item, priority), dequeue() → item | undefined, peek() → item | undefined, size()
class PriorityQueue {
  constructor() {
    // TODO: use a private heap array
  }

  enqueue(item, priority) {
    // TODO: push { item, priority } and bubble up
  }

  dequeue() {
    // TODO: swap root with last, pop, sink down
  }

  peek() {
    // TODO: return item at root without removing
  }

  size() {
    // TODO
  }
}

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
// Token-bucket per tenantId.
// createTenantRateLimiter({ tokensPerWindow, windowMs })
// → { tryConsume(tenantId) → boolean }
function createTenantRateLimiter({ tokensPerWindow, windowMs }) {
  // TODO
  throw new Error('Not implemented');
}

// ─── Notification Service ─────────────────────────────────────────────────────
// createNotificationService({ channels, rateLimiter })
//   channels: { email: fn(msg)→Promise, sms: fn(msg)→Promise, push: fn(msg)→Promise }
//   rateLimiter: returned by createTenantRateLimiter
//
// send(notification) → adds to priority queue if not duplicate
//   notification: { id, tenantId, channel, recipient, subject, body, priority }
//
// processQueue() → processes ALL pending notifications:
//   • Rate-limit check per tenant → if blocked, re-queue (do not drop)
//   • Attempt channel delivery → retry up to 3× with backoff (50ms, 100ms, 200ms)
//   • On permanent failure → add to dead-letter queue
//   • Track status: DELIVERED | FAILED
//
// getStatus(id) → { status, attempts, error? }
// getDeadLetterQueue() → array of failed notifications
function createNotificationService({ channels, rateLimiter }) {
  // TODO
  throw new Error('Not implemented');
}

module.exports = { PriorityQueue, createTenantRateLimiter, createNotificationService };
