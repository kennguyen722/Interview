'use strict';

function createBatchMemoizedEndpoint(fetchFn) {
  const cache = new Map();
  return async function getMany(ids) {
    const missing = ids.filter((id) => !cache.has(id));
    if (missing.length > 0) {
      const rows = await fetchFn(missing);
      for (const row of rows) {
        cache.set(row.id, row);
      }
    }
    return ids.map((id) => cache.get(id) ?? null);
  };
}

function monitorEventLoopLag(sampleMs = 100) {
  let last = Date.now();
  const readings = [];

  const timer = setInterval(() => {
    const now = Date.now();
    const lag = Math.max(0, now - last - sampleMs);
    readings.push(lag);
    if (readings.length > 100) {
      readings.shift();
    }
    last = now;
  }, sampleMs);

  return {
    stop() {
      clearInterval(timer);
    },
    p95() {
      if (readings.length === 0) {
        return 0;
      }
      const sorted = [...readings].sort((a, b) => a - b);
      const idx = Math.floor(sorted.length * 0.95);
      return sorted[idx];
    }
  };
}

function createCircuitBreaker(action, options = {}) {
  const threshold = options.failureThreshold ?? 3;
  const recoveryMs = options.recoveryMs ?? 2000;

  let failures = 0;
  let state = 'closed';
  let openedAt = 0;

  return async (...args) => {
    if (state === 'open' && Date.now() - openedAt < recoveryMs) {
      throw new Error('circuit-open');
    }

    if (state === 'open') {
      state = 'half-open';
    }

    try {
      const result = await action(...args);
      failures = 0;
      state = 'closed';
      return result;
    } catch (error) {
      failures += 1;
      if (failures >= threshold) {
        state = 'open';
        openedAt = Date.now();
      }
      throw error;
    }
  };
}

function createAdaptiveTimeout(historyWindowSize = 20) {
  const history = [];

  return {
    addLatency(ms) {
      history.push(ms);
      if (history.length > historyWindowSize) {
        history.shift();
      }
    },
    currentTimeout() {
      if (history.length === 0) {
        return 500;
      }
      const sorted = [...history].sort((a, b) => a - b);
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      return Math.max(100, Math.ceil(p95 * 1.5));
    }
  };
}

function createHealthCheck(dependencies) {
  return async function check() {
    const results = await Promise.all(
      dependencies.map(async (dep) => {
        try {
          await dep.ping();
          return { name: dep.name, ok: true };
        } catch (error) {
          return { name: dep.name, ok: false, error: error.message };
        }
      })
    );

    const healthy = results.every((r) => r.ok);
    return {
      status: healthy ? 'ready' : 'degraded',
      checks: results
    };
  };
}

function evaluateSLO(metrics, target) {
  const availability = 1 - (metrics.errors / Math.max(1, metrics.total));
  const meets = availability >= target;
  const errorBudget = 1 - target;
  const usedBudget = 1 - availability;
  return {
    availability,
    meets,
    errorBudget,
    usedBudget,
    burnRate: usedBudget / Math.max(errorBudget, 0.00001)
  };
}

function createTagCache() {
  const entries = new Map();
  const tagToKeys = new Map();

  return {
    set(key, value, tags = []) {
      entries.set(key, value);
      for (const tag of tags) {
        if (!tagToKeys.has(tag)) {
          tagToKeys.set(tag, new Set());
        }
        tagToKeys.get(tag).add(key);
      }
    },
    get(key) {
      return entries.get(key);
    },
    invalidateTag(tag) {
      for (const key of tagToKeys.get(tag) ?? []) {
        entries.delete(key);
      }
      tagToKeys.delete(tag);
    }
  };
}

async function benchmark(nameA, fnA, nameB, fnB, input, iterations = 1000) {
  const run = async (name, fn) => {
    const start = process.hrtime.bigint();
    for (let i = 0; i < iterations; i += 1) {
      await fn(input);
    }
    const end = process.hrtime.bigint();
    return {
      name,
      durationMs: Number(end - start) / 1_000_000
    };
  };

  const a = await run(nameA, fnA);
  const b = await run(nameB, fnB);

  return {
    faster: a.durationMs <= b.durationMs ? a.name : b.name,
    results: [a, b]
  };
}

module.exports = {
  createBatchMemoizedEndpoint,
  monitorEventLoopLag,
  createCircuitBreaker,
  createAdaptiveTimeout,
  createHealthCheck,
  evaluateSLO,
  createTagCache,
  benchmark
};
