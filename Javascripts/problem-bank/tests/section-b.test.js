'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createOrdersHandler,
  validateRequest,
  paginateByCursor,
  createSlidingWindowRateLimiter,
  createCacheAside,
  createRequestDeduper,
  createLogger,
  withTimeoutPolicy
} = require('../solution/section-b-api-service.solution');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test('9) createOrdersHandler supports idempotent create', () => {
  const handler = createOrdersHandler();
  const req = {
    headers: { 'idempotency-key': 'k1' },
    body: { customerId: 'c1', items: [{ sku: 'a' }] }
  };

  const a = handler.create(req);
  const b = handler.create(req);

  assert.equal(a.status, 201);
  assert.equal(b.status, 200);
  assert.equal(a.body.id, b.body.id);
});

test('10) validateRequest returns schema errors', () => {
  const validate = validateRequest({
    name: { required: true, type: 'string' },
    age: { required: true, type: 'number' }
  });

  const out = validate({ body: { name: 'Ken', age: '20' } });
  assert.equal(out.ok, false);
  assert.ok(out.errors.length > 0);
});

test('11) paginateByCursor returns next cursor', () => {
  const items = [1, 2, 3, 4, 5];
  const first = paginateByCursor(items, null, 2);
  const second = paginateByCursor(items, first.nextCursor, 2);

  assert.deepEqual(first.items, [1, 2]);
  assert.deepEqual(second.items, [3, 4]);
  assert.equal(typeof first.nextCursor, 'string');
});

test('12) sliding window limiter blocks excess requests', () => {
  const allow = createSlidingWindowRateLimiter(2, 1000);
  assert.equal(allow('u1', 0), true);
  assert.equal(allow('u1', 100), true);
  assert.equal(allow('u1', 200), false);
  assert.equal(allow('u1', 1200), true);
});

test('13) cache aside returns cached value and refreshes stale', async () => {
  let version = 0;
  const store = {
    async get(key) {
      version += 1;
      return `${key}-v${version}`;
    }
  };

  const cache = createCacheAside(store, { ttlMs: 10 });
  const a = await cache.get('x');
  const b = await cache.get('x');
  assert.equal(a, 'x-v1');
  assert.equal(b, 'x-v1');

  await sleep(15);
  const c = await cache.get('x');
  assert.equal(c, 'x-v1');

  await sleep(10);
  const d = await cache.get('x');
  assert.equal(d, 'x-v2');
});

test('14) request deduper executes task once per key in-flight', async () => {
  const dedupe = createRequestDeduper();
  let count = 0;

  const task = async () => {
    count += 1;
    await sleep(10);
    return 'done';
  };

  const [a, b] = await Promise.all([
    dedupe('same', task),
    dedupe('same', task)
  ]);

  assert.equal(a, 'done');
  assert.equal(b, 'done');
  assert.equal(count, 1);
});

test('15) logger includes correlation ID across async boundary', async () => {
  const logger = createLogger();
  const line = await logger.runWithCorrelation('cid-1', async () => {
    await sleep(1);
    return logger.log('info', 'hello');
  });

  const json = JSON.parse(line);
  assert.equal(json.correlationId, 'cid-1');
  assert.equal(json.message, 'hello');
});

test('16) withTimeoutPolicy returns fallback on timeout', async () => {
  const out = await withTimeoutPolicy(
    async () => {
      await sleep(30);
      return 'slow';
    },
    5,
    () => 'fallback'
  );

  assert.equal(out, 'fallback');
});
