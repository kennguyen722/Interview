const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('normalizeName formats mixed case and spaces', () => {
  assert.equal(S.normalizeName('  aLiCe   joHNson '), 'Alice Johnson');
});

test('sumByCategory aggregates totals', () => {
  const out = S.sumByCategory([
    { category: 'books', amount: 10 },
    { category: 'books', amount: 15 },
    { category: 'tools', amount: 5 },
  ]);
  assert.deepEqual(out, { books: 25, tools: 5 });
});
