'use strict';

async function withTimeout(taskPromise, timeoutMs) {
  // TODO
  throw new Error('Not implemented');
}

async function retryWithBackoff(taskFn, options) {
  // TODO: options = { retries, baseDelayMs, shouldRetry }
  throw new Error('Not implemented');
}

async function promisePool(tasks, concurrency) {
  // TODO: tasks = array of () => Promise<any>
  throw new Error('Not implemented');
}

module.exports = {
  withTimeout,
  retryWithBackoff,
  promisePool
};

if (require.main === module) {
  console.log('Module 04 starter loaded. Complete TODOs in this file.');
}
