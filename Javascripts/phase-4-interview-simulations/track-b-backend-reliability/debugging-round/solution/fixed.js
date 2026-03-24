'use strict';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryBounded(task, options = {}) {
  const retries = options.retries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 100;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task(attempt);
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      await sleep(baseDelayMs * (2 ** attempt));
    }
  }

  throw new Error('unreachable');
}

module.exports = { retryBounded };
