'use strict';

const { AsyncLocalStorage } = require('node:async_hooks');

function createOrdersHandler() {
  const idem = new Map();
  const orders = new Map();

  return {
    create(req) {
      const key = req.headers?.['idempotency-key'];
      if (!key) {
        return { status: 400, body: { error: 'idempotency-key required' } };
      }
      if (idem.has(key)) {
        return { status: 200, body: idem.get(key), reused: true };
      }

      const id = `ord_${Math.random().toString(36).slice(2, 10)}`;
      const order = {
        id,
        customerId: req.body.customerId,
        items: req.body.items ?? [],
        createdAt: new Date().toISOString()
      };

      orders.set(id, order);
      idem.set(key, order);
      return { status: 201, body: order, reused: false };
    }
  };
}

function validateRequest(schema) {
  return (req) => {
    const errors = [];
    for (const [field, rule] of Object.entries(schema)) {
      const value = req.body?.[field];
      if (rule.required && (value === undefined || value === null)) {
        errors.push(`${field} is required`);
        continue;
      }
      if (value !== undefined && rule.type && typeof value !== rule.type) {
        errors.push(`${field} must be ${rule.type}`);
      }
    }
    return {
      ok: errors.length === 0,
      errors
    };
  };
}

function paginateByCursor(items, cursor, limit) {
  const start = cursor ? Number(Buffer.from(cursor, 'base64').toString('utf8')) : 0;
  const slice = items.slice(start, start + limit);
  const nextStart = start + slice.length;
  const nextCursor = nextStart < items.length
    ? Buffer.from(String(nextStart), 'utf8').toString('base64')
    : null;
  return { items: slice, nextCursor };
}

function createSlidingWindowRateLimiter(limit, windowMs) {
  const hits = new Map();

  return function allow(clientId, now = Date.now()) {
    const active = (hits.get(clientId) ?? []).filter((ts) => now - ts < windowMs);
    if (active.length >= limit) {
      hits.set(clientId, active);
      return false;
    }
    active.push(now);
    hits.set(clientId, active);
    return true;
  };
}

function createCacheAside(store, options = {}) {
  const ttlMs = options.ttlMs ?? 5000;
  const cache = new Map();

  async function refresh(key) {
    const value = await store.get(key);
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
    return value;
  }

  return {
    async get(key) {
      const entry = cache.get(key);
      if (!entry) {
        return refresh(key);
      }

      if (entry.expiresAt < Date.now()) {
        refresh(key).catch(() => {});
      }
      return entry.value;
    }
  };
}

function createRequestDeduper() {
  const inFlight = new Map();
  return async function dedupe(key, task) {
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }
    const promise = task().finally(() => inFlight.delete(key));
    inFlight.set(key, promise);
    return promise;
  };
}

function createLogger() {
  const als = new AsyncLocalStorage();

  function runWithCorrelation(correlationId, fn) {
    return als.run({ correlationId }, fn);
  }

  function log(level, message, extra = {}) {
    const ctx = als.getStore() ?? {};
    const line = {
      ts: new Date().toISOString(),
      level,
      correlationId: ctx.correlationId ?? 'unknown',
      message,
      ...extra
    };
    return JSON.stringify(line);
  }

  return { runWithCorrelation, log };
}

async function withTimeoutPolicy(task, timeoutMs, fallback) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(fallback()), timeoutMs);
  });
  try {
    return await Promise.race([task(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  createOrdersHandler,
  validateRequest,
  paginateByCursor,
  createSlidingWindowRateLimiter,
  createCacheAside,
  createRequestDeduper,
  createLogger,
  withTimeoutPolicy
};
