const { Transform } = require('node:stream');

function createLineSplitTransform() {
  throw new Error('TODO: implement createLineSplitTransform');
}

async function writeWithBackpressure(writable, chunks) {
  throw new Error('TODO: implement writeWithBackpressure');
}

module.exports = { createLineSplitTransform, writeWithBackpressure, Transform };
