'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createEventBus,
  debounce,
  throttle,
  createCancellableSearch,
  createListenerRegistry,
  promisePool,
  retryWithBackoff,
  createAutosavePipeline,
  createWebSocketReconnector
} = require('../solution/section-a-events-async.solution');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test('1) createEventBus supports on/off/once/wildcard', () => {
  const bus = createEventBus();
  let count = 0;
  let wildcard = 0;

  const unsub = bus.on('ready', () => {
    count += 1;
  });
  bus.once('ready', () => {
    count += 10;
  });
  bus.on('*', () => {
    wildcard += 1;
  });

  bus.emit('ready', {});
  bus.emit('ready', {});
  unsub();
  bus.emit('ready', {});

  assert.equal(count, 12);
  assert.equal(wildcard, 3);
});

test('2) debounce collapses burst calls', async () => {
  const values = [];
  const fn = debounce((v) => values.push(v), 20);

  fn(1);
  fn(2);
  fn(3);

  await sleep(35);
  assert.deepEqual(values, [3]);
});

test('2) throttle limits high-frequency calls', async () => {
  let count = 0;
  const fn = throttle(() => {
    count += 1;
  }, 25);

  fn();
  fn();
  fn();
  await sleep(30);
  fn();
  await sleep(30);

  assert.ok(count >= 2 && count <= 3);
});

test('3) createCancellableSearch cancels stale requests', async () => {
  const fetcher = (query, { signal }) => new Promise((resolve, reject) => {
    const delay = query === 'old' ? 40 : 10;
    const timer = setTimeout(() => resolve({ query }), delay);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      const err = new Error('aborted');
      err.name = 'AbortError';
      reject(err);
    });
  });

  const search = createCancellableSearch(fetcher);
  const p1 = search('old');
  await sleep(5);
  const p2 = search('new');

  const r1 = await p1;
  const r2 = await p2;

  assert.equal(r1.ignored, true);
  assert.equal(r2.ignored, false);
  assert.deepEqual(r2.result, { query: 'new' });
});

test('4) createListenerRegistry disposes listeners', () => {
  const target = {
    handlers: new Map(),
    addEventListener(event, fn) {
      this.handlers.set(event, fn);
    },
    removeEventListener(event) {
      this.handlers.delete(event);
    }
  };

  const registry = createListenerRegistry();
  registry.add(target, 'click', () => {});
  registry.add(target, 'keydown', () => {});
  assert.equal(target.handlers.size, 2);
  registry.disposeAll();
  assert.equal(target.handlers.size, 0);
});

test('5) promisePool runs with bounded concurrency and keeps order', async () => {
  const tasks = [
    () => sleep(20).then(() => 'a'),
    () => sleep(5).then(() => 'b'),
    () => sleep(10).then(() => 'c')
  ];

  const out = await promisePool(tasks, 2);
  assert.deepEqual(out, ['a', 'b', 'c']);
});

test('6) retryWithBackoff retries and succeeds', async () => {
  let attempt = 0;
  const value = await retryWithBackoff(async () => {
    attempt += 1;
    if (attempt < 3) {
      throw new Error('temp');
    }
    return 'ok';
  }, { retries: 4, baseDelayMs: 1 });

  assert.equal(value, 'ok');
  assert.equal(attempt, 3);
});

test('7) createAutosavePipeline saves latest draft', async () => {
  const saved = [];
  const pipeline = createAutosavePipeline(async (draft) => {
    saved.push(draft);
  }, { waitMs: 15, retries: 1 });

  pipeline.schedule('v1');
  pipeline.schedule('v2');
  await pipeline.flush();

  assert.equal(saved[saved.length - 1], 'v2');
});

test('8) createWebSocketReconnector retries then connects', async () => {
  let n = 0;
  const reconnector = createWebSocketReconnector(async () => {
    n += 1;
    if (n < 3) {
      throw new Error('down');
    }
    return { id: 'ws-1' };
  }, { maxRetries: 5, baseDelayMs: 1, breakerThreshold: 10 });

  const result = await reconnector.connect();
  assert.equal(result.connected, true);
  assert.deepEqual(result.socket, { id: 'ws-1' });
});
