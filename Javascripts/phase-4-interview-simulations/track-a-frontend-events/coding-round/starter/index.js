'use strict';

function createTypeaheadController(fetcher, waitMs) {
  // TODO: debounce + cancel stale requests + ignore stale results.
  throw new Error('Not implemented');
}

module.exports = {
  createTypeaheadController
};

if (require.main === module) {
  console.log('Track A coding starter loaded.');
}
