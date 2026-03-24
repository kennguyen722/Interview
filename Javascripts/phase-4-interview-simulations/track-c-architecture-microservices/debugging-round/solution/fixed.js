'use strict';

async function processEvents(events, handler) {
  const chains = new Map();

  function enqueueByKey(key, task) {
    const prev = chains.get(key) ?? Promise.resolve();
    const next = prev.then(task, task);
    chains.set(
      key,
      next.then(
        () => undefined,
        () => undefined
      )
    );
    return next;
  }

  await Promise.all(
    events.map((event) =>
      enqueueByKey(event.aggregateKey, async () => {
        await handler(event);
      })
    )
  );
}

module.exports = { processEvents };
