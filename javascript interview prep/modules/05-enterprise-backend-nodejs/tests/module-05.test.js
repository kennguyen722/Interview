const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable, Writable } = require('node:stream');
const S = require('../solution/index');

test('Node streams basics line split transform works', async () => {
  const input = Readable.from(['a\n', 'b\nc']);
  const splitter = S.createLineSplitTransform();
  const out = [];
  for await (const line of input.pipe(splitter)) out.push(line);
  assert.deepEqual(out, ['a', 'b', 'c']);
});

test('backpressure-aware writer writes all chunks', async () => {
  const seen = [];
  const writable = new Writable({
    highWaterMark: 1,
    write(chunk, _enc, cb) {
      seen.push(chunk.toString());
      setTimeout(cb, 1);
    },
  });

  await S.writeWithBackpressure(writable, ['x', 'y', 'z']);
  assert.deepEqual(seen, ['x', 'y', 'z']);
});
