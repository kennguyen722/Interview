const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../solution/problems');

test('module-07 problems coverage', async () => {
  const retry = P.retryTestWithFakeSleep(async () => 'ok', 1); assert.equal(await retry(), 'ok');
  assert.equal(P.contractDriftDetector({ a: 'n' }, { a: 's' }).length, 1);
  assert.equal(P.sqlInjectionSafeQueryRefactor('select * where id=:id', { id: 1 }).values[0], 1);
  assert.match(P.xssSafeRendererHelper('<b>x</b>'), /&lt;b&gt;/);
  assert.equal(P.csrfVerifierMiddleware({ cookies: { csrf: 'a' }, headers: { 'x-csrf-token': 'a' } }), true);
  assert.equal(P.jwtKeyRotationCheck('k1', ['k1', 'k2']), true);
  const cache = new Map();
  assert.equal(P.secretProviderFallbackCache(() => 's', cache, 'x'), 's');
  assert.equal(P.structuredErrorSanitizer({ code: 'E1' }).code, 'E1');
  assert.equal(P.p95p99Calculator([1, 2, 3, 4, 5]).p99 >= 1, true);
  const lockMap = new Map();
  assert.equal(await P.hotKeyCacheStampedeGuard(lockMap, 'k', async () => 'v'), 'v');
  await assert.rejects(() => P.circuitBreakerTimeoutComposition(() => new Promise((r) => setTimeout(r, 50)), 5), /TIMEOUT/);
  const bulk = P.bulkheadPressureTestHarness(1); assert.equal(await bulk(async () => 'x'), 'x');
  assert.equal(P.flakyTestClassifier([{ pass: true }, { pass: false }]), 'flaky');
  assert.equal(P.incidentTimelineReconstructionUtility([{ ts: 2 }, { ts: 1 }])[0].ts, 1);
  assert.equal(P.performanceRegressionDetector(100, 120, 0.1), true);
});
