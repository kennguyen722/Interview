const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../solution/topics-and-labs');

test('module-07 topics and labs coverage', () => {
  assert.equal(T.testStrategyTopic(['unit', 'integration']).hasUnit, true);
  assert.equal(T.deterministicAsyncTestingTopic(() => 'ok'), 'ok');
  assert.equal(T.owaspBasicsTopic(['xss', 'foo']).length, 1);
  assert.equal(T.injectionXssCsrfSecretsTopic({ html: '<b>x</b>', csrfCookie: 'a', csrfHeader: 'a' }).tokenMatch, true);
  assert.equal(T.profilingCachingLatencyTopic([1, 2, 3]).p95 >= 1, true);
  assert.equal(T.reliabilityDefensiveDefaultsTopic({}).retries, 2);
  assert.equal(T.deterministicRetryHarnessLab(() => 1), 1);
  assert.equal(T.contractTestGateLab({ a: 1 }, { a: 1 }), true);
  assert.equal(T.injectionHardeningLab('1 or 1=1').values[0], '1 or 1=1');
  assert.equal(T.latencyDashboardProfilingLab([10, 20]).p95 >= 10, true);
  assert.equal(T.reliabilityWrapperDefaultsLab({ timeoutMs: 10 }).timeoutMs, 10);
});
