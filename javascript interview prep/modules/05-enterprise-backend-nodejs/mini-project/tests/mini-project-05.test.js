const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('idempotent order create reuses prior response for same payload', () => {
  const store = S.createIdempotencyStore();
  const svc = S.createOrderService(store);

  const req = {
    idempotencyKey: 'k1',
    tenantId: 't1',
    payload: { amount: 120, createdAt: '2026-03-20T10:00:00.000Z' },
  };

  const a = svc.create(req);
  const b = svc.create(req);

  assert.equal(a.reused, false);
  assert.equal(b.reused, true);
  assert.equal(a.order.id, b.order.id);
});

test('idempotent order create rejects key reuse with different payload', () => {
  const store = S.createIdempotencyStore();
  const svc = S.createOrderService(store);

  svc.create({
    idempotencyKey: 'k2',
    tenantId: 't1',
    payload: { amount: 100, createdAt: '2026-03-20T10:00:00.000Z' },
  });

  assert.throws(
    () => svc.create({
      idempotencyKey: 'k2',
      tenantId: 't1',
      payload: { amount: 999, createdAt: '2026-03-20T10:00:00.000Z' },
    }),
    /IDEMPOTENCY_KEY_PAYLOAD_MISMATCH/
  );
});

test('cursor encode/decode round trip', () => {
  const c = S.encodeCursor({ createdAt: '2026-03-20', id: 'ord_1' });
  assert.deepEqual(S.decodeCursor(c), { createdAt: '2026-03-20', id: 'ord_1' });
});

test('paginateOrders returns stable pages', () => {
  const rows = [
    { id: 'ord_3', createdAt: '2026-03-20T10:00:02.000Z' },
    { id: 'ord_2', createdAt: '2026-03-20T10:00:01.000Z' },
    { id: 'ord_1', createdAt: '2026-03-20T10:00:00.000Z' },
  ];

  const page1 = S.paginateOrders(rows, 2, null);
  assert.equal(page1.items.length, 2);
  assert.equal(typeof page1.nextCursor, 'string');

  const page2 = S.paginateOrders(rows, 2, page1.nextCursor);
  assert.equal(page2.items.length, 1);
});

test('tenant rate limiter enforces token bucket', () => {
  const allow = S.createTenantRateLimiter({ capacity: 1, refillPerSec: 10 });
  assert.equal(allow('tenantA', 0), true);
  assert.equal(allow('tenantA', 1), false);
  assert.equal(allow('tenantA', 200), true);
});
