const { Transform } = require('node:stream');

function createLineParserTransform() {
  throw new Error('TODO: implement createLineParserTransform');
}

async function runBoundedMap(_items, _concurrency, _worker) {
  throw new Error('TODO: implement runBoundedMap');
}

async function ingestAbortable(_readable, _onLine, _signal) {
  throw new Error('TODO: implement ingestAbortable');
}

async function writeJsonlSafe(_writable, _rows, _signal) {
  throw new Error('TODO: implement writeJsonlSafe');
}

module.exports = {
  createLineParserTransform,
  runBoundedMap,
  ingestAbortable,
  writeJsonlSafe,
  Transform,
};
