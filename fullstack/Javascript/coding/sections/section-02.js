function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    if (items.length === 0) return resolve([]);

    const out = new Array(items.length);
    let remaining = items.length;
    let settled = false;

    items.forEach((item, i) => {
      Promise.resolve(item)
        .then((v) => {
          if (settled) return;
          out[i] = v;
          remaining -= 1;
          if (remaining === 0) {
            settled = true;
            resolve(out);
          }
        })
        .catch((err) => {
          if (settled) return;
          settled = true;
          reject(err);
        });
    });
  });
}

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

module.exports = { promiseAll, runPool };
