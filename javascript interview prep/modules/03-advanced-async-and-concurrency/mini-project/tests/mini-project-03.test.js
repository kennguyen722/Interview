const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable, Writable } = require('node:stream');
const S = require('../solution/index');

test('line parser emits each line in stream', async () => {
  const input = Readable.from(['a\n', 'b\n', 'c']);
  const parser = S.createLineParserTransform();
  const out = [];
  for await (const line of input.pipe(parser)) out.push(line);
  assert.deepEqual(out, ['a', 'b', 'c']);
});

test('runBoundedMap preserves output order', async () => {
  const out = await S.runBoundedMap([1, 2, 3], 2, async (n) => n * 3);
  assert.deepEqual(out, [3, 6, 9]);
});

test('ingestAbortable throws when signal is aborted', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    () => S.ingestAbortable(Readable.from(['x\n']), async () => {}, controller.signal),
    /ABORTED/
  );
});

test('writeJsonlSafe handles backpressure and writes all rows', async () => {
  const seen = [];
  const writable = new Writable({
    highWaterMark: 1,
    write(chunk, _enc, cb) {
      seen.push(chunk.toString());
      setTimeout(cb, 1);
    },
  });

  await S.writeJsonlSafe(writable, [{ id: 1 }, { id: 2 }]);
  assert.equal(seen.length, 2);
  assert.match(seen[0], /"id":1/);
  assert.match(seen[1], /"id":2/);
});
