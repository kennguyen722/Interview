'use strict';

function createCircuitBreaker(action, options) {
  // TODO: closed/open/half-open states.
  throw new Error('Not implemented');
}

function createBulkhead(limit) {
  // TODO: enforce max concurrent tasks.
  throw new Error('Not implemented');
}

function createMetricsCollector() {
  // TODO: count calls, errors, and durations.
  throw new Error('Not implemented');
}

module.exports = {
  createCircuitBreaker,
  createBulkhead,
  createMetricsCollector
};

if (require.main === module) {
  console.log('Module 12 starter loaded. Complete TODOs in this file.');
}
