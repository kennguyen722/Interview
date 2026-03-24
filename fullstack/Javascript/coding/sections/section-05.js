function encodeCursor(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
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
      return res.status(429).json({ error: 'RATE_LIMITED' });
    }

    entry.tokens -= 1;
    buckets.set(key, entry);
    return next();
  };
}

module.exports = { encodeCursor, decodeCursor, createTokenBucketLimiter };
