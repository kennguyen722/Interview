const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../solution/topics-and-labs');

test('module-01 topics and labs coverage', () => {
  assert.equal(T.classifyValueType([]), 'array');
  assert.equal(T.evaluateConditionalRules(85), 'B');
  assert.equal(T.applyFunctionPipeline(2, [(x) => x + 1, (x) => x * 3]), 9);
  assert.equal(T.arrayObjectOps([{ id: 1, name: 'n', active: true }]).length, 1);
  const counter = T.scopeClosureCounter();
  assert.equal(counter(), 1);
  assert.equal(T.safeExecute(() => { throw new Error('x'); }).ok, false);
  assert.equal(T.invoiceTotalCalculator([{ price: 10, qty: 2 }], 0.1), 18);
  assert.equal(T.signupInputValidator({ email: 'a@b.com', password: '12345678' }).valid, true);
  assert.equal(T.productFilterSort([{ price: 5 }, { price: 3 }], 0)[0].price, 3);
  assert.deepEqual(T.roleBasedMenuVisibility('admin', [{ key: 'k', roles: ['admin'] }]), ['k']);
  assert.equal(T.gradebookAnalyzer([{ name: 'A', score: 90 }]).top, 'A');
});
