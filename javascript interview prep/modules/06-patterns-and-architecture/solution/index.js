function makeDiscountStrategy(type) {
  if (type === 'none') return (amount) => amount;
  if (type === 'vip') return (amount) => amount * 0.85;
  if (type === 'employee') return (amount) => amount * 0.7;
  throw new Error('UNKNOWN_STRATEGY');
}

function applyDiscount(amount, strategy) {
  return Number(strategy(amount).toFixed(2));
}

module.exports = { makeDiscountStrategy, applyDiscount };
