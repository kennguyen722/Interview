async function runPool(tasks, concurrency = 4) {
  const out = new Array(tasks.length);
  let cursor = 0;

  async function worker() {
    while (true) {
      const i = cursor;
      cursor += 1;
      if (i >= tasks.length) return;
      out[i] = await tasks[i]();
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker()));
  return out;
}

function cancelableDelay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      resolve('done');
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      cleanup();
      const err = new Error('ABORTED');
      err.code = 'ABORTED';
      reject(err);
    }

    function cleanup() {
      if (signal) signal.removeEventListener('abort', onAbort);
    }

    if (signal) {
      if (signal.aborted) return onAbort();
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

async function withTimeout(task, timeoutMs, signal) {
  const timeoutPromise = cancelableDelay(timeoutMs, signal).then(() => {
    const err = new Error('TIMEOUT');
    err.code = 'TIMEOUT';
    throw err;
  });

  return Promise.race([task(), timeoutPromise]);
}

module.exports = { runPool, cancelableDelay, withTimeout };
