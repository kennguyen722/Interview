const test = require('node:test');
const assert = require('node:assert/strict');

function debounce(fn, wait) {
  let timer = null;
  let lastArgs = null;
  let lastThis = null;

  function wrapped(...args) {
    lastArgs = args;
    lastThis = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(lastThis, lastArgs);
    }, wait);
  }

  wrapped.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = null;
  };

  wrapped.flush = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    fn.apply(lastThis, lastArgs);
  };

  return wrapped;
}

function getWindowRange(scrollTop, viewportHeight, rowHeight, total, overscan = 5) {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(
    total - 1,
    Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan
  );
  return { start, end };
}

test('debounce invokes only last call after wait', async () => {
  const calls = [];
  const d = debounce((v) => calls.push(v), 20);

  d(1);
  d(2);
  d(3);
  await new Promise((resolve) => setTimeout(resolve, 40));

  assert.deepEqual(calls, [3]);
});

test('debounce cancel drops pending invocation', async () => {
  let called = false;
  const d = debounce(() => {
    called = true;
  }, 20);

  d();
  d.cancel();
  await new Promise((resolve) => setTimeout(resolve, 40));

  assert.equal(called, false);
});

test('debounce flush executes pending invocation immediately', () => {
  const calls = [];
  const d = debounce((v) => calls.push(v), 1000);

  d('x');
  d.flush();

  assert.deepEqual(calls, ['x']);
});

test('getWindowRange computes expected visible bounds', () => {
  const range = getWindowRange(200, 300, 50, 100, 2);
  assert.deepEqual(range, { start: 2, end: 12 });

  const nearEnd = getWindowRange(4800, 300, 50, 100, 2);
  assert.equal(nearEnd.end <= 99, true);
  assert.equal(nearEnd.start >= 0, true);
});
