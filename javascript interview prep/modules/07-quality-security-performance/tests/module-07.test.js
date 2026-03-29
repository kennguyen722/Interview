const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('verifyCsrf returns true for matching token', () => {
  assert.equal(S.verifyCsrf({ cookies: { csrf: 'a' }, headers: { 'x-csrf-token': 'a' } }), true);
  assert.equal(S.verifyCsrf({ cookies: { csrf: 'a' }, headers: { 'x-csrf-token': 'b' } }), false);
});

test('summarizePercentiles computes p50 p95 p99', () => {
  const out = S.summarizePercentiles([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  assert.equal(out.p50 >= 10, true);
  assert.equal(out.p99 >= out.p95, true);
});
