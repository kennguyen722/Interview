/*

 * 1. createLineSplitTransform - creates a Transform stream that splits incoming
 *    data into lines, emitting each line as a separate chunk.
 * 2. writeWithBackpressure - writes chunks to a writable stream while respecting
 *    backpressure, awaiting the 'drain' event when necessary.
 */

const { Transform } = require('node:stream');
const { once } = require('node:events');

function createLineSplitTransform() {
  let buffer = '';
  return new Transform({
    readableObjectMode: true,
    transform(chunk, _enc, callback) {
      buffer += chunk.toString('utf8');
      const parts = buffer.split(/\r?\n/);
      buffer = parts.pop();
      for (const line of parts) this.push(line);
      callback();
    },
    flush(callback) {
      if (buffer) this.push(buffer);
      callback();
    },
  });
}

async function writeWithBackpressure(writable, chunks) {
  for (const chunk of chunks) {
    const canContinue = writable.write(chunk);
    if (!canContinue) {
      await once(writable, 'drain');
    }
  }
  writable.end();
  await once(writable, 'finish');
}

module.exports = { createLineSplitTransform, writeWithBackpressure };
