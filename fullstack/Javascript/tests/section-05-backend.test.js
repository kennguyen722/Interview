const test = require('node:test');
const assert = require('node:assert/strict');

function encodeCursor(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function decodeCursor(cursor) {
  return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
}

function createTokenBucketLimiter({
  capacity = 20,
  refillPerSec = 5,
  keyFn = (req) => req.user?.id || req.ip,
} = {}) {
  const buckets = new Map();

  return function limiter(req, res, next) {
    const key = keyFn(req);
    const now = Date.now();
    const entry = buckets.get(key) || { tokens: capacity, last: now };

    const elapsed = (now - entry.last) / 1000;
    entry.tokens = Math.min(capacity, entry.tokens + elapsed * refillPerSec);
    entry.last = now;

    if (entry.tokens < 1) {
      buckets.set(key, entry);
      res.status(429).json({ error: 'RATE_LIMITED' });
      return;
    }

    entry.tokens -= 1;
    buckets.set(key, entry);
    next();
  };
}

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('cursor encode/decode round-trip', () => {
  const cursor = encodeCursor({ createdAt: '2026-01-01T00:00:00.000Z', id: 'o_1' });
  const parsed = decodeCursor(cursor);
  assert.deepEqual(parsed, { createdAt: '2026-01-01T00:00:00.000Z', id: 'o_1' });
});

test('token bucket allows up to capacity then blocks', () => {
  const limiter = createTokenBucketLimiter({ capacity: 2, refillPerSec: 0, keyFn: () => 'u1' });

  let nextCalls = 0;
  const next = () => {
    nextCalls += 1;
  };

  const req = { ip: '127.0.0.1' };

  const res1 = createMockRes();
  limiter(req, res1, next);
  assert.equal(res1.statusCode, 200);

  const res2 = createMockRes();
  limiter(req, res2, next);
  assert.equal(res2.statusCode, 200);

  const res3 = createMockRes();
  limiter(req, res3, next);
  assert.equal(res3.statusCode, 429);
  assert.deepEqual(res3.body, { error: 'RATE_LIMITED' });

  assert.equal(nextCalls, 2);
});

test('token bucket refills over time', async () => {
  const limiter = createTokenBucketLimiter({ capacity: 1, refillPerSec: 10, keyFn: () => 'u2' });

  const next = () => {};
  const req = { ip: '127.0.0.1' };

  const res1 = createMockRes();
  limiter(req, res1, next);
  assert.equal(res1.statusCode, 200);

  const res2 = createMockRes();
  limiter(req, res2, next);
  assert.equal(res2.statusCode, 429);

  await new Promise((resolve) => setTimeout(resolve, 150));

  const res3 = createMockRes();
  limiter(req, res3, next);
  assert.equal(res3.statusCode, 200);
});
