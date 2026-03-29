const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('verifyCsrf checks cookie/header parity', () => {
  assert.equal(S.verifyCsrf({ cookies: { csrf: 'a' }, headers: { 'x-csrf-token': 'a' } }), true);
  assert.equal(S.verifyCsrf({ cookies: { csrf: 'a' }, headers: { 'x-csrf-token': 'b' } }), false);
});

test('redactFields redacts sensitive keys', () => {
  const out = S.redactFields({ email: 'a@b.com', token: 'abc' }, ['token']);
  assert.equal(out.token, '[REDACTED]');
  assert.equal(out.email, 'a@b.com');
});

test('summarizePercentiles returns p50 p95 p99', () => {
  const out = S.summarizePercentiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(out.p50 >= 1, true);
  assert.equal(out.p99 >= out.p95, true);
});

test('createCircuitBreaker opens after threshold and blocks', async () => {
  const breaker = S.createCircuitBreaker({ failureThreshold: 2, resetMs: 100 });
  await assert.rejects(() => breaker.run(async () => { throw new Error('x'); }, 0), /x/);
  await assert.rejects(() => breaker.run(async () => { throw new Error('x'); }, 1), /x/);
  await assert.rejects(() => breaker.run(async () => 'ok', 2), /CIRCUIT_OPEN/);
});

test('scoreSecurityChecklist computes pass and missing', () => {
  const result = S.scoreSecurityChecklist({
    'authn-authz-validated': true,
    'input-validation-boundary': true,
    'injection-safe-queries': false,
    'secrets-not-hardcoded': true,
    'pii-redaction-logs': false,
  });

  assert.equal(result.pass, false);
  assert.equal(result.total, 5);
  assert.equal(result.score, 3);
  assert.deepEqual(result.missing.sort(), ['injection-safe-queries', 'pii-redaction-logs'].sort());
});
