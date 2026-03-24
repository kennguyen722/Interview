'use strict';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout(taskPromise, timeoutMs) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
  });
  try {
    return await Promise.race([taskPromise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function retryWithBackoff(taskFn, options) {
  const retries = options?.retries ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 100;
  const shouldRetry = options?.shouldRetry ?? (() => true);

  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await taskFn(attempt);
    } catch (error) {
      if (attempt === retries || !shouldRetry(error)) {
        throw error;
      }
      const jitter = Math.floor(Math.random() * baseDelayMs);
      const delay = baseDelayMs * (2 ** attempt) + jitter;
      await sleep(delay);
      attempt += 1;
    }
  }
  throw new Error('unreachable');
}

async function promisePool(tasks, concurrency) {
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await tasks[current]();
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

module.exports = {
  withTimeout,
  retryWithBackoff,
  promisePool
};

if (require.main === module) {
  const tasks = [
    () => sleep(50).then(() => 'a'),
    () => sleep(10).then(() => 'b'),
    () => sleep(30).then(() => 'c')
  ];
  promisePool(tasks, 2).then((r) => console.log('pool:', r.join(',')));
}
