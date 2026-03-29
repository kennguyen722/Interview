const { Transform } = require('node:stream');
const { once } = require('node:events');

function createLineParserTransform() {
  let buffer = '';
  return new Transform({
    readableObjectMode: true,
    transform(chunk, _enc, cb) {
      buffer += chunk.toString('utf8');
      const parts = buffer.split(/\r?\n/);
      buffer = parts.pop();
      for (const line of parts) this.push(line);
      cb();
    },
    flush(cb) {
      if (buffer) this.push(buffer);
      cb();
    },
  });
}

async function runBoundedMap(items, concurrency, worker) {
  const out = new Array(items.length);
  let cursor = 0;

  async function runOne() {
    while (true) {
      const i = cursor;
      cursor += 1;
      if (i >= items.length) return;
      out[i] = await worker(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => runOne()));
  return out;
}

async function ingestAbortable(readable, onLine, signal) {
  const parser = createLineParserTransform();
  let count = 0;

  for await (const line of readable.pipe(parser)) {
    if (signal?.aborted) {
      const err = new Error('ABORTED');
      err.code = 'ABORTED';
      throw err;
    }
    await onLine(line);
    count += 1;
  }

  return count;
}

async function writeJsonlSafe(writable, rows, signal) {
  for (const row of rows) {
    if (signal?.aborted) {
      const err = new Error('ABORTED');
      err.code = 'ABORTED';
      throw err;
    }

    const chunk = JSON.stringify(row) + '\n';
    const ok = writable.write(chunk);
    if (!ok) {
      await once(writable, 'drain');
    }
  }

  writable.end();
  await once(writable, 'finish');
}

module.exports = {
  createLineParserTransform,
  runBoundedMap,
  ingestAbortable,
  writeJsonlSafe,
};
