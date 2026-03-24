'use strict';

function customMap(items, mapper) {
  // TODO
  throw new Error('Not implemented');
}

function customFilter(items, predicate) {
  // TODO
  throw new Error('Not implemented');
}

function customReduce(items, reducer, initialValue) {
  // TODO
  throw new Error('Not implemented');
}

function compose(...fns) {
  // TODO
  throw new Error('Not implemented');
}

function sanitizeUserInput(input) {
  // TODO: trim, collapse spaces, lowercase email-like strings.
  throw new Error('Not implemented');
}

module.exports = {
  customMap,
  customFilter,
  customReduce,
  compose,
  sanitizeUserInput
};

if (require.main === module) {
  console.log('Module 02 starter loaded. Complete TODOs in this file.');
}
