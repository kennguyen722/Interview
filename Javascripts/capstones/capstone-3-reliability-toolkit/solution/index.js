'use strict';
// Capstone 3: Performance & Reliability Toolkit — Reference Solution
// Covers: timeout, retry with jitter, circuit breaker, bulkhead, metrics, SLO

// ─── 1. withTimeout ───────────────────────────────────────────────────────────
function withTimeout(fn, timeoutMs) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);
      Promise.resolve(fn(...args))
        .then(v => { clearTimeout(timer); resolve(v); })
        .catch(e => { clearTimeout(timer); reject(e); });
    });
  };
}

// ─── 2. withRetry ────────────────────────────────────────────────────────────
function withRetry(fn, {
  maxAttempts = 3,
  baseDelayMs = 100,
  maxDelayMs  = 10_000,
  jitter      = true,
  shouldRetry = () => true
} = {}) {
  return async function (...args) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try { return await fn(...args); }
      catch (e) {
        lastError = e;
        if (attempt === maxAttempts || !shouldRetry(e, attempt)) throw e;
        const backoff = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs);
        const delay   = jitter ? backoff * (0.5 + Math.random() * 0.5) : backoff;
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw lastError;
  };
}

// ─── 3. Circuit Breaker ───────────────────────────────────────────────────────
function createCircuitBreaker({
  failureThreshold = 5,
  successThreshold = 2,
  timeoutMs        = 30_000
} = {}) {
  let state          = 'CLOSED';
  let failureCount   = 0;
  let successCount   = 0;
  let lastOpenedAt   = null;

  function call(fn) {
    return async (...args) => {
      if (state === 'OPEN') {
        if (Date.now() - lastOpenedAt >= timeoutMs) {
          state = 'HALF_OPEN';
          successCount = 0;
        } else {
          throw new Error('Circuit breaker is OPEN — request rejected');
        }
      }

      try {
        const result = await fn(...args);
        onSuccess();
        return result;
      } catch (e) {
        onFailure();
        throw e;
      }
    };
  }

  function onSuccess() {
    failureCount = 0;
    if (state === 'HALF_OPEN') {
      successCount++;
      if (successCount >= successThreshold) state = 'CLOSED';
    }
  }

  function onFailure() {
    failureCount++;
    if (state === 'HALF_OPEN' || failureCount >= failureThreshold) {
      state = 'OPEN';
      lastOpenedAt = Date.now();
      failureCount = 0;
    }
  }

  return {
    call,
    getState:     () => state,
    getStats:     () => ({ state, failureCount, successCount }),
    reset:        () => { state = 'CLOSED'; failureCount = 0; successCount = 0; lastOpenedAt = null; }
  };
}

// ─── 4. Bulkhead (max concurrency + overflow queue) ──────────────────────────
function createBulkhead({ maxConcurrent = 10, maxQueue = 100 } = {}) {
  let active = 0;
  const waiting = [];
  const stats = { accepted: 0, rejected: 0, queued: 0 };

  async function execute(fn) {
    if (active >= maxConcurrent) {
      if (waiting.length >= maxQueue) {
        stats.rejected++;
        throw new Error(`Bulkhead overflow: ${active} active, ${waiting.length} queued`);
      }
      stats.queued++;
      await new Promise((resolve, reject) => waiting.push({ resolve, reject }));
    }
    active++;
    stats.accepted++;
    try {
      return await fn();
    } finally {
      active--;
      if (waiting.length > 0) {
        const next = waiting.shift();
        next.resolve();
      }
    }
  }

  return {
    execute,
    getStats: () => ({ ...stats, active, queueDepth: waiting.length })
  };
}

// ─── 5. Metrics Emitter ───────────────────────────────────────────────────────
function createMetricsEmitter() {
  const data = { success: 0, error: 0, latencies: [] };

  function record({ success, latencyMs }) {
    if (success) data.success++;
    else         data.error++;
    data.latencies.push(latencyMs);
  }

  function snapshot() {
    const sorted = [...data.latencies].sort((a, b) => a - b);
    const pct = (p) => {
      if (sorted.length === 0) return 0;
      return sorted[Math.ceil((p / 100) * sorted.length) - 1];
    };
    const total = data.success + data.error;
    return {
      total,
      success:    data.success,
      error:      data.error,
      errorRate:  total > 0 ? (data.error / total) : 0,
      p50:        pct(50),
      p95:        pct(95),
      p99:        pct(99),
      mean:       sorted.length > 0 ? sorted.reduce((a, b) => a + b, 0) / sorted.length : 0
    };
  }

  return { record, snapshot };
}

// ─── 6. createReliableClient (compose everything) ────────────────────────────
function createReliableClient({
  fn,
  timeoutMs       = 5000,
  retry           = { maxAttempts: 3, baseDelayMs: 200 },
  circuitBreaker  = { failureThreshold: 5, timeoutMs: 30_000 },
  bulkhead        = { maxConcurrent: 20, maxQueue: 50 }
} = {}) {
  const metrics = createMetricsEmitter();
  const breaker = createCircuitBreaker(circuitBreaker);
  const limiter = createBulkhead(bulkhead);

  const timedFn  = withTimeout(fn, timeoutMs);
  const retryFn  = withRetry(timedFn, retry);
  const brokenFn = breaker.call(retryFn);

  async function call(...args) {
    const start = Date.now();
    return limiter.execute(async () => {
      try {
        const result = await brokenFn(...args);
        metrics.record({ success: true, latencyMs: Date.now() - start });
        return result;
      } catch (e) {
        metrics.record({ success: false, latencyMs: Date.now() - start });
        throw e;
      }
    });
  }

  return {
    call,
    getMetrics: () => metrics.snapshot(),
    getCircuitState: () => breaker.getState(),
    getBulkheadStats: () => limiter.getStats()
  };
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  (async () => {
    let callCount = 0;
    let shouldFail = false;

    const externalService = async (value) => {
      callCount++;
      if (shouldFail) throw new Error('Service unavailable');
      await new Promise(r => setTimeout(r, 10));
      return `result-${value}`;
    };

    const client = createReliableClient({
      fn: externalService,
      timeoutMs:      1000,
      retry:          { maxAttempts: 2, baseDelayMs: 10 },
      circuitBreaker: { failureThreshold: 3, timeoutMs: 500 },
      bulkhead:       { maxConcurrent: 5, maxQueue: 10 }
    });

    // Successful calls
    const results = await Promise.all([1, 2, 3].map(i => client.call(i)));
    console.log('Success results:', results);

    // Trigger failures to trip circuit breaker
    shouldFail = true;
    for (let i = 0; i < 3; i++) {
      try { await client.call('fail'); }
      catch {}
    }

    console.log('Circuit state after failures:', client.getCircuitState());

    const metrics = client.getMetrics();
    console.log(`Metrics: success=${metrics.success} error=${metrics.error} errorRate=${(metrics.errorRate * 100).toFixed(1)}%`);
    console.log(`Latency: p50=${metrics.p50}ms p95=${metrics.p95}ms`);
  })();
}

module.exports = { withTimeout, withRetry, createCircuitBreaker, createBulkhead, createMetricsEmitter, createReliableClient };
