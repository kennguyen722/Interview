'use strict';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createEventBus() {
  const handlers = new Map();

  function on(event, fn) {
    if (!handlers.has(event)) {
      handlers.set(event, new Set());
    }
    handlers.get(event).add(fn);
    return () => off(event, fn);
  }

  function once(event, fn) {
    const unsub = on(event, (payload) => {
      unsub();
      fn(payload);
    });
    return unsub;
  }

  function off(event, fn) {
    handlers.get(event)?.delete(fn);
  }

  function emit(event, payload) {
    for (const fn of handlers.get(event) ?? []) {
      fn(payload, event);
    }
    for (const fn of handlers.get('*') ?? []) {
      fn(payload, event);
    }
  }

  return { on, once, off, emit };
}

function debounce(fn, waitMs) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

function throttle(fn, waitMs) {
  let last = 0;
  let trailing = null;
  return (...args) => {
    const now = Date.now();
    const remaining = waitMs - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
      return;
    }
    clearTimeout(trailing);
    trailing = setTimeout(() => {
      last = Date.now();
      fn(...args);
    }, remaining);
  };
}

function createCancellableSearch(fetcher) {
  let current = null;
  let sequence = 0;
  let latest = 0;

  return async function search(query) {
    sequence += 1;
    const requestId = sequence;
    if (current) {
      current.abort();
    }
    current = new AbortController();

    try {
      const result = await fetcher(query, { signal: current.signal });
      if (requestId < latest) {
        return { ignored: true, result: null };
      }
      latest = requestId;
      return { ignored: false, result };
    } catch (error) {
      if (error?.name === 'AbortError') {
        return { ignored: true, result: null };
      }
      throw error;
    }
  };
}

function createListenerRegistry() {
  const records = [];
  return {
    add(target, event, handler, options) {
      target.addEventListener(event, handler, options);
      records.push({ target, event, handler, options });
      return () => target.removeEventListener(event, handler, options);
    },
    disposeAll() {
      for (const r of records.splice(0, records.length)) {
        r.target.removeEventListener(r.event, r.handler, r.options);
      }
    }
  };
}

async function promisePool(tasks, concurrency) {
  const results = new Array(tasks.length);
  let i = 0;

  async function worker() {
    while (i < tasks.length) {
      const idx = i;
      i += 1;
      results[idx] = await tasks[idx]();
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker()));
  return results;
}

async function retryWithBackoff(task, options = {}) {
  const retries = options.retries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 100;
  const shouldRetry = options.shouldRetry ?? (() => true);

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task(attempt);
    } catch (error) {
      if (attempt === retries || !shouldRetry(error)) {
        throw error;
      }
      const jitter = Math.floor(Math.random() * baseDelayMs);
      await sleep(baseDelayMs * (2 ** attempt) + jitter);
    }
  }

  throw new Error('unreachable');
}

function createAutosavePipeline(saveFn, options = {}) {
  const waitMs = options.waitMs ?? 300;
  const retries = options.retries ?? 2;

  let timer = null;
  let latestDraft = null;
  let queue = Promise.resolve();

  async function persistWithRetry(draft) {
    return retryWithBackoff(
      async () => saveFn(draft),
      { retries, baseDelayMs: 100 }
    );
  }

  function schedule(draft) {
    latestDraft = draft;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const snapshot = latestDraft;
      queue = queue.then(() => persistWithRetry(snapshot));
    }, waitMs);
  }

  return {
    schedule,
    async flush() {
      clearTimeout(timer);
      if (latestDraft !== null) {
        queue = queue.then(() => persistWithRetry(latestDraft));
      }
      await queue;
    }
  };
}

function createWebSocketReconnector(connectFn, options = {}) {
  const maxRetries = options.maxRetries ?? 5;
  const baseDelayMs = options.baseDelayMs ?? 200;
  const breakerThreshold = options.breakerThreshold ?? 3;

  let failures = 0;
  let attempts = 0;

  async function connect() {
    if (failures >= breakerThreshold) {
      return { connected: false, reason: 'circuit-open' };
    }

    while (attempts < maxRetries) {
      try {
        const socket = await connectFn();
        failures = 0;
        attempts = 0;
        return { connected: true, socket };
      } catch (error) {
        attempts += 1;
        failures += 1;
        if (attempts >= maxRetries) {
          break;
        }
        await sleep(baseDelayMs * (2 ** (attempts - 1)));
      }
    }

    return { connected: false, reason: 'max-retries' };
  }

  return { connect };
}

module.exports = {
  createEventBus,
  debounce,
  throttle,
  createCancellableSearch,
  createListenerRegistry,
  promisePool,
  retryWithBackoff,
  createAutosavePipeline,
  createWebSocketReconnector
};
