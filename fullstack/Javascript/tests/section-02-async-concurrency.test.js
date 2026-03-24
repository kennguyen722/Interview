const test = require('node:test');
const assert = require('node:assert/strict');

function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const n = items.length;
    if (n === 0) {
      resolve([]);
      return;
    }

    const results = new Array(n);
    let remaining = n;
    let settled = false;

    items.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          if (settled) return;
          results[index] = value;
          remaining -= 1;
          if (remaining === 0) {
            settled = true;
            resolve(results);
          }
        })
        .catch((err) => {
          if (settled) return;
          settled = true;
          reject(err);
        });
    });
  });
}

async function runPool(tasks, concurrency = 4) {
  if (!Array.isArray(tasks)) throw new TypeError('tasks must be an array');
  if (!Number.isInteger(concurrency) || concurrency <= 0) {
    throw new RangeError('concurrency must be a positive integer');
  }

  const results = new Array(tasks.length);
  let cursor = 0;

  async function worker() {
    while (true) {
      const i = cursor;
      cursor += 1;
      if (i >= tasks.length) return;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => worker()
  );

  await Promise.all(workers);
  return results;
}

function createRequestCoalescer(loader) {
  const inFlight = new Map();

  return async function load(key) {
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }

    const p = Promise.resolve()
      .then(() => loader(key))
      .finally(() => {
        inFlight.delete(key);
      });

    inFlight.set(key, p);
    return p;
  };
}

test('promiseAll resolves in input order', async () => {
  const out = await promiseAll([
    new Promise((resolve) => setTimeout(() => resolve('a'), 15)),
    'b',
    Promise.resolve('c'),
  ]);

  assert.deepEqual(out, ['a', 'b', 'c']);
});

test('promiseAll rejects fast on first rejection', async () => {
  await assert.rejects(
    () => promiseAll([Promise.resolve(1), Promise.reject(new Error('x'))]),
    /x/
  );
});

test('runPool enforces max concurrency and preserves order', async () => {
  let inFlight = 0;
  let maxInFlight = 0;

  const tasks = Array.from({ length: 8 }, (_, i) => async () => {
    inFlight += 1;
    maxInFlight = Math.max(maxInFlight, inFlight);
    await new Promise((resolve) => setTimeout(resolve, 10));
    inFlight -= 1;
    return i * 2;
  });

  const out = await runPool(tasks, 3);
  assert.deepEqual(out, [0, 2, 4, 6, 8, 10, 12, 14]);
  assert.equal(maxInFlight <= 3, true);
});

test('createRequestCoalescer deduplicates concurrent requests by key', async () => {
  let calls = 0;
  const loader = async (key) => {
    calls += 1;
    await new Promise((resolve) => setTimeout(resolve, 20));
    return `value:${key}`;
  };

  const load = createRequestCoalescer(loader);

  const [a, b, c] = await Promise.all([
    load('x'),
    load('x'),
    load('x'),
  ]);

  assert.equal(a, 'value:x');
  assert.equal(b, 'value:x');
  assert.equal(c, 'value:x');
  assert.equal(calls, 1);
});
