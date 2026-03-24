'use strict';

function createCircuitBreaker(action, options = {}) {
  const failureThreshold = options.failureThreshold ?? 3;
  const recoveryMs = options.recoveryMs ?? 2000;

  let state = 'closed';
  let failures = 0;
  let openedAt = 0;

  return async function run(...args) {
    if (state === 'open') {
      if (Date.now() - openedAt < recoveryMs) {
        throw new Error('Circuit is open');
      }
      state = 'half-open';
    }

    try {
      const result = await action(...args);
      failures = 0;
      state = 'closed';
      return result;
    } catch (error) {
      failures += 1;
      if (failures >= failureThreshold) {
        state = 'open';
        openedAt = Date.now();
      }
      throw error;
    }
  };
}

function createBulkhead(limit) {
  let inFlight = 0;

  return async function run(task) {
    if (inFlight >= limit) {
      throw new Error('Bulkhead limit reached');
    }
    inFlight += 1;
    try {
      return await task();
    } finally {
      inFlight -= 1;
    }
  };
}

function createMetricsCollector() {
  const data = {
    calls: 0,
    errors: 0,
    totalDurationMs: 0
  };

  return {
    async measure(task) {
      const start = Date.now();
      data.calls += 1;
      try {
        return await task();
      } catch (error) {
        data.errors += 1;
        throw error;
      } finally {
        data.totalDurationMs += Date.now() - start;
      }
    },
    snapshot() {
      const avgDurationMs = data.calls === 0 ? 0 : data.totalDurationMs / data.calls;
      return {
        ...data,
        avgDurationMs: Number(avgDurationMs.toFixed(2))
      };
    }
  };
}

module.exports = {
  createCircuitBreaker,
  createBulkhead,
  createMetricsCollector
};

if (require.main === module) {
  const metrics = createMetricsCollector();
  metrics.measure(async () => 1).then(() => console.log(metrics.snapshot()));
}
