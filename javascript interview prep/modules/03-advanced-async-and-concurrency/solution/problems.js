async function promiseAllLite(promises) {
  const out = [];
  let i = 0;
  for (const p of promises) out[i++] = await p;
  return out;
}

async function promiseAnyLite(promises) {
  const errors = [];
  for (const p of promises) {
    try { return await p; } catch (e) { errors.push(e); }
  }
  throw new AggregateError(errors, 'All promises rejected');
}

async function queueWithMaxConcurrency(tasks, concurrency = 2) {
  const out = [];
  let idx = 0;
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      out[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
  return out;
}

function tokenBucketLimiterAdapter({ capacity = 2, refill = 1 }) {
  let tokens = capacity;
  return {
    allow() { if (tokens <= 0) return false; tokens -= 1; return true; },
    refillTick() { tokens = Math.min(capacity, tokens + refill); return tokens; },
  };
}

function circuitBreakerFsm() {
  let state = 'CLOSED';
  return { state: () => state, fail() { state = 'OPEN'; }, probe() { state = 'HALF_OPEN'; }, success() { state = 'CLOSED'; } };
}

function bulkheadGuard(limit) {
  let inflight = 0;
  return async (task) => {
    if (inflight >= limit) throw new Error('BULKHEAD_REJECTED');
    inflight += 1;
    try { return await task(); } finally { inflight -= 1; }
  };
}

function debouncedAutosaveWithCancellation(save, waitMs = 20) {
  let timer = null;
  return {
    schedule(payload) { if (timer) clearTimeout(timer); timer = setTimeout(() => save(payload), waitMs); },
    cancel() { if (timer) clearTimeout(timer); timer = null; },
  };
}

function asyncCacheSwr(loader) {
  const cache = new Map();
  return async (key) => {
    if (cache.has(key)) return cache.get(key);
    const value = await loader(key);
    cache.set(key, value);
    return value;
  };
}

function jobRetryScheduler(task, retries = 2) {
  return async () => {
    let last;
    for (let i = 0; i <= retries; i += 1) {
      try { return await task(); } catch (e) { last = e; }
    }
    throw last;
  };
}

function deadLetterQueueSimulation(results) {
  return results.filter((r) => r.status === 'failed');
}

function idempotentConsumerLogic(store, id, handler) {
  if (store.has(id)) return { duplicate: true, value: store.get(id) };
  const value = handler();
  store.set(id, value);
  return { duplicate: false, value };
}

function eventReplayOrderingChecks(events) {
  for (let i = 1; i < events.length; i += 1) if (events[i].seq < events[i - 1].seq) return false;
  return true;
}

function longRunningWorkflowHeartbeat(stepMs, maxMisses) {
  return { healthy: (misses) => misses <= maxMisses, intervalMs: stepMs };
}

async function connectionPoolTimeoutWrapper(task, timeoutMs = 20) {
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('POOL_TIMEOUT')), timeoutMs));
  return Promise.race([task(), timeout]);
}

function adaptiveTimeoutFromP95(history, multiplier = 1.5) {
  const sorted = history.slice().sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * 0.95) - 1));
  const p95 = sorted[idx] || 0;
  return Math.ceil(p95 * multiplier);
}

module.exports = {
  promiseAllLite,
  promiseAnyLite,
  queueWithMaxConcurrency,
  tokenBucketLimiterAdapter,
  circuitBreakerFsm,
  bulkheadGuard,
  debouncedAutosaveWithCancellation,
  asyncCacheSwr,
  jobRetryScheduler,
  deadLetterQueueSimulation,
  idempotentConsumerLogic,
  eventReplayOrderingChecks,
  longRunningWorkflowHeartbeat,
  connectionPoolTimeoutWrapper,
  adaptiveTimeoutFromP95,
};
