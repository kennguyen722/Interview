const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('runPool respects concurrency and preserves order', async () => {
  const tasks = [
    async () => 1,
    async () => 2,
    async () => 3,
  ];
  assert.deepEqual(await S.runPool(tasks, 2), [1, 2, 3]);
});

test('abort signal cancels delay', async () => {
  const controller = new AbortController();
  const promise = S.cancelableDelay(100, controller.signal);
  controller.abort();
  await assert.rejects(() => promise, /ABORTED/);
});

test('withTimeout rejects slow task', async () => {
  await assert.rejects(
    () => S.withTimeout(async () => new Promise((r) => setTimeout(() => r('ok'), 50)), 10),
    /TIMEOUT/
  );
});
