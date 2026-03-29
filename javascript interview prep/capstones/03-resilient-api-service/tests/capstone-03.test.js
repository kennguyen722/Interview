const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('capstone-03 supports idempotent create and cursor pagination', () => {
  const logs = [];
  const metrics = [];
  const svc = S.createResilientApiService({ hooks: { log: (x) => logs.push(x), metric: (k, v) => metrics.push([k, v]) } });

  const a = svc.createOrderIdempotent('k1', { amount: 10, customerId: 'c1' });
  const b = svc.createOrderIdempotent('k1', { amount: 10, customerId: 'c1' });
  assert.equal(a.id, b.id);

  svc.createOrderIdempotent('k2', { amount: 20, customerId: 'c2' });
  svc.createOrderIdempotent('k3', { amount: 30, customerId: 'c3' });

  const p1 = svc.listOrders({ limit: 2 });
  assert.equal(p1.items.length, 2);
  assert.equal(typeof p1.nextCursor, 'string');

  const p2 = svc.listOrders({ cursor: p1.nextCursor, limit: 2 });
  assert.equal(p2.items.length >= 1, true);
  assert.equal(logs.length > 0, true);
  assert.equal(metrics.length > 0, true);
});

test('capstone-03 applies timeout/retry/circuit breaker and bulkhead', async () => {
  let calls = 0;
  const svc = S.createResilientApiService({
    downstream: {
      async charge() {
        calls += 1;
        throw new Error('DOWNSTREAM_FAIL');
      },
    },
    hooks: { retries: 0, breakerThreshold: 1, bulkheadLimit: 1, timeoutMs: 5 },
  });

  const order = svc.createOrderIdempotent('x1', { amount: 1 });
  await assert.rejects(() => svc.simulatePayment(order.id), /DOWNSTREAM_FAIL/);
  await assert.rejects(() => svc.simulatePayment(order.id), /CIRCUIT_OPEN/);

  svc.closeCircuit();
  assert.equal(svc.runtimeStatus().breakerState, 'CLOSED');
  assert.equal(calls >= 1, true);
});
