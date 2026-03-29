function classifyValueType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function evaluateConditionalRules(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return 'D';
}

function applyFunctionPipeline(value, fns) {
  return fns.reduce((v, fn) => fn(v), value);
}

function arrayObjectOps(products) {
  return products.filter((p) => p.active).map((p) => ({ id: p.id, name: p.name }));
}

function scopeClosureCounter() {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
}

function safeExecute(fn) {
  try {
    return { ok: true, value: fn() };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function invoiceTotalCalculator(items, discountRate = 0) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return Number((subtotal * (1 - discountRate)).toFixed(2));
}

function signupInputValidator(input) {
  const errors = [];
  if (!input.email || !input.email.includes('@')) errors.push('invalid_email');
  if (!input.password || input.password.length < 8) errors.push('weak_password');
  return { valid: errors.length === 0, errors };
}

function productFilterSort(products, minPrice = 0) {
  return products.filter((p) => p.price >= minPrice).sort((a, b) => a.price - b.price);
}

function roleBasedMenuVisibility(role, menuRules) {
  return menuRules.filter((m) => m.roles.includes(role)).map((m) => m.key);
}

function gradebookAnalyzer(rows) {
  const avg = rows.reduce((s, r) => s + r.score, 0) / (rows.length || 1);
  return { average: Number(avg.toFixed(2)), top: rows.sort((a, b) => b.score - a.score)[0]?.name || null };
}

module.exports = {
  classifyValueType,
  evaluateConditionalRules,
  applyFunctionPipeline,
  arrayObjectOps,
  scopeClosureCounter,
  safeExecute,
  invoiceTotalCalculator,
  signupInputValidator,
  productFilterSort,
  roleBasedMenuVisibility,
  gradebookAnalyzer,
};
