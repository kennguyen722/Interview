const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('capstone-01 deterministic output for same input', () => {
  const config = {
    rules: [
      { id: 'high-subtotal', type: 'percent', field: 'subtotal', op: 'gte', value: 100, discountPct: 10, priority: 2 },
      { id: 'gold-tier', type: 'percent', field: 'customerTier', op: 'eq', value: 'gold', discountPct: 5, priority: 1 },
    ],
  };
  const order = { subtotal: 200, customerTier: 'gold' };
  const a = S.evaluateOrderDiscount(order, config);
  const b = S.evaluateOrderDiscount(order, config);
  assert.deepEqual(a, b);
  assert.deepEqual(a.appliedRules, ['gold-tier', 'high-subtotal']);
  assert.equal(a.finalTotal, 170);
});

test('capstone-01 validates bad schema and duplicate id', () => {
  assert.throws(
    () => S.parseRules({ rules: [{ id: 'r1', type: 'percent', field: 'subtotal', op: 'bad', value: 1, discountPct: 1, priority: 1 }] }),
    /rule\.op/
  );

  assert.throws(
    () => S.parseRules({ rules: [
      { id: 'dup', type: 'percent', field: 'subtotal', op: 'gte', value: 1, discountPct: 1, priority: 1 },
      { id: 'dup', type: 'percent', field: 'subtotal', op: 'gte', value: 1, discountPct: 1, priority: 2 },
    ] }),
    /duplicate rule id/
  );
});
