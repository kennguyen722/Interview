'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createBatchMemoizedEndpoint,
  monitorEventLoopLag,
  createCircuitBreaker,
  createAdaptiveTimeout,
  createHealthCheck,
  evaluateSLO,
  createTagCache,
  benchmark
} = require('../solution/section-d-performance-reliability.solution');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test('25) batch memoized endpoint fetches only missing IDs', async () => {
  let calls = 0;
  const endpoint = createBatchMemoizedEndpoint(async (ids) => {
    calls += 1;
    return ids.map((id) => ({ id, value: `v-${id}` }));
  });

  const a = await endpoint(['1', '2']);
  const b = await endpoint(['1', '2']);

  assert.equal(calls, 1);
  assert.equal(a[0].value, 'v-1');
  assert.equal(b[1].value, 'v-2');
});

test('26) event loop lag monitor returns p95 >= 0', async () => {
  const mon = monitorEventLoopLag(5);
  await sleep(25);
  const p95 = mon.p95();
  mon.stop();
  assert.ok(p95 >= 0);
});

test('27) circuit breaker opens after failures', async () => {
  let n = 0;
  const breaker = createCircuitBreaker(async () => {
    n += 1;
    throw new Error('down');
  }, { failureThreshold: 2, recoveryMs: 1000 });

  await assert.rejects(() => breaker());
  await assert.rejects(() => breaker());
  await assert.rejects(() => breaker(), /circuit-open/);
  assert.ok(n >= 2);
});

test('28) adaptive timeout tracks history', () => {
  const t = createAdaptiveTimeout(5);
  [100, 120, 130, 90, 110].forEach((x) => t.addLatency(x));
  const timeout = t.currentTimeout();
  assert.ok(timeout >= 100);
});

test('29) health check reports degraded when dependency fails', async () => {
  const check = createHealthCheck([
    { name: 'db', ping: async () => {} },
    { name: 'cache', ping: async () => { throw new Error('down'); } }
  ]);

  const out = await check();
  assert.equal(out.status, 'degraded');
  assert.equal(out.checks.length, 2);
});

test('30) evaluateSLO computes burn rate', () => {
  const out = evaluateSLO({ total: 1000, errors: 10 }, 0.995);
  assert.equal(out.meets, false);
  assert.ok(out.burnRate > 1);
});

test('31) tag cache invalidates by tag', () => {
  const cache = createTagCache();
  cache.set('k1', 'v1', ['user:1']);
  cache.set('k2', 'v2', ['user:1']);

  cache.invalidateTag('user:1');

  assert.equal(cache.get('k1'), undefined);
  assert.equal(cache.get('k2'), undefined);
});

test('32) benchmark compares two implementations', async () => {
  const out = await benchmark(
    'a',
    async (x) => x + 1,
    'b',
    async (x) => x + 2,
    1,
    100
  );

  assert.ok(['a', 'b'].includes(out.faster));
  assert.equal(out.results.length, 2);
});
