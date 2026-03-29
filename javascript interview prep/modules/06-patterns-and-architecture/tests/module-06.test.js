const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('strategy pattern applies VIP discount', () => {
  const vip = S.makeDiscountStrategy('vip');
  assert.equal(S.applyDiscount(100, vip), 85);
});

test('unknown strategy throws', () => {
  assert.throws(() => S.makeDiscountStrategy('x'), /UNKNOWN_STRATEGY/);
});
