'use strict';

function createIdempotentOrderedConsumer(handler) {
  const seen = new Set();
  const chains = new Map();

  return function consume(event) {
    if (!event?.id || !event?.aggregateKey) {
      return Promise.reject(new Error('event id and aggregateKey are required'));
    }

    if (seen.has(event.id)) {
      return Promise.resolve({ skipped: true });
    }

    // Reserve the id immediately so concurrent duplicates are skipped.
    seen.add(event.id);

    const key = event.aggregateKey;
    const previous = chains.get(key) ?? Promise.resolve();

    const next = previous
      .then(async () => {
        await handler(event);
        return { skipped: false };
      })
      .catch((error) => {
        // Keep chain alive for next events.
        return Promise.reject(error);
      });

    chains.set(
      key,
      next.then(
        () => undefined,
        () => undefined
      )
    );

    return next;
  };
}

module.exports = {
  createIdempotentOrderedConsumer
};

if (require.main === module) {
  const calls = [];
  const consume = createIdempotentOrderedConsumer(async (event) => {
    calls.push(event.id);
  });

  Promise.all([
    consume({ id: '1', aggregateKey: 'order-1' }),
    consume({ id: '1', aggregateKey: 'order-1' }),
    consume({ id: '2', aggregateKey: 'order-1' })
  ]).then(() => console.log(calls));
}
