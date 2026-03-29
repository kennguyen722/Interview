const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../solution/problems');

test('module-01 problems coverage', () => {
  assert.deepEqual(P.normalizeCustomerNames(['  Alice  Smith ']), ['alice smith']);
  assert.deepEqual(P.aggregateSalesByRegion([{ region: 'NA', amount: 2 }, { region: 'NA', amount: 3 }]), { NA: 5 });
  assert.deepEqual(P.findDuplicateIds([1, 2, 2, 3, 1]).sort(), [1, 2]);
  assert.equal(P.deepGet({ a: { b: 1 } }, 'a.b'), 1);
  assert.equal(P.validatePasswordPolicy('Abcdef12'), true);
  assert.equal(P.computeTaxBrackets(100, [{ limit: 50, rate: 0.1 }, { limit: 100, rate: 0.2 }]), 15);
  assert.deepEqual(P.flattenNestedArrays([1, [2, [3]]]), [1, 2, 3]);
  assert.equal(P.detectInvalidDateRanges([{ start: '2025-01-02', end: '2025-01-01' }]).length, 1);
  assert.equal(P.groupRecordsByStatus([{ status: 'open' }, { status: 'open' }]).open.length, 2);
  assert.deepEqual(P.mergeUniqueTags([{ tags: ['a', 'b'] }, { tags: ['b', 'c'] }]).sort(), ['a', 'b', 'c']);
  assert.equal(P.countWordFrequency('a a b').a, 2);
  assert.equal(P.parseRobustNumber('1,234.5'), 1234.5);
  assert.equal(P.validateUrlFormat('https://example.com'), true);
  assert.equal(P.simulateFetchFallback(false, 'fallback'), 'fallback');
  assert.equal(P.buildExpenseTracker([{ category: 'food', amount: 5 }]).total, 5);
});
