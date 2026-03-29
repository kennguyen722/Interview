const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('estimateQps returns positive value', () => {
  const qps = S.estimateQps({ dau: 100000, requestsPerUserPerDay: 12 });
  assert.equal(qps > 0, true);
});

test('buildAdr returns accepted ADR object', () => {
  const adr = S.buildAdr({
    title: 'API Strategy',
    context: 'Need stable contracts',
    options: ['REST', 'GraphQL'],
    decision: 'REST',
    consequences: ['Simpler caching'],
  });
  assert.equal(adr.status, 'accepted');
  assert.equal(typeof adr.reviewDate, 'string');
});
