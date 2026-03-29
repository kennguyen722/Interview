const crypto = require('node:crypto');

function createIdempotencyStore() {
  const map = new Map();
  return {
    get(key) {
      return map.get(key) || null;
    },
    set(key, value) {
      map.set(key, value);
    },
  };
}

function fingerprintPayload(payload) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(payload || {}))
    .digest('hex');
}

function createOrderService(store) {
  let seq = 0;
  return {
    create({ idempotencyKey, tenantId, payload }) {
      const scope = `${tenantId}:${idempotencyKey}`;
      const fp = fingerprintPayload(payload);
      const existing = store.get(scope);

      if (existing) {
        if (existing.fingerprint !== fp) {
          const err = new Error('IDEMPOTENCY_KEY_PAYLOAD_MISMATCH');
          err.code = 'IDEMPOTENCY_KEY_PAYLOAD_MISMATCH';
          throw err;
        }
        return { reused: true, order: existing.order };
      }

      seq += 1;
      const order = {
        id: `ord_${seq}`,
        tenantId,
        amount: payload.amount,
        createdAt: payload.createdAt,
      };
      store.set(scope, { fingerprint: fp, order });
      return { reused: false, order };
    },
  };
}

function encodeCursor(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodeCursor(cursor) {
  return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
}

function paginateOrders(rows, pageSize, cursor = null) {
  const sorted = rows.slice().sort((a, b) => {
    if (a.createdAt === b.createdAt) return a.id < b.id ? 1 : -1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });

  let start = 0;
  if (cursor) {
    const c = decodeCursor(cursor);
    start = sorted.findIndex((r) => r.createdAt === c.createdAt && r.id === c.id) + 1;
  }

  const page = sorted.slice(start, start + pageSize);
  const tail = page[page.length - 1];
  const nextCursor = tail && start + pageSize < sorted.length
    ? encodeCursor({ createdAt: tail.createdAt, id: tail.id })
    : null;

  return { items: page, nextCursor };
}

function createTenantRateLimiter({ capacity = 2, refillPerSec = 1 } = {}) {
  const buckets = new Map();
  return function allow(tenantId, now = Date.now()) {
    const key = String(tenantId);
    const entry = buckets.get(key) || { tokens: capacity, last: now };
    const elapsed = (now - entry.last) / 1000;
    entry.tokens = Math.min(capacity, entry.tokens + elapsed * refillPerSec);
    entry.last = now;

    if (entry.tokens < 1) {
      buckets.set(key, entry);
      return false;
    }

    entry.tokens -= 1;
    buckets.set(key, entry);
    return true;
  };
}

module.exports = {
  createIdempotencyStore,
  createOrderService,
  encodeCursor,
  decodeCursor,
  paginateOrders,
  createTenantRateLimiter,
};
