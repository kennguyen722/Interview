'use strict';

function createEventBus() {
  const subscribers = new Map();

  return {
    subscribe(topic, handler) {
      if (!subscribers.has(topic)) {
        subscribers.set(topic, new Set());
      }
      subscribers.get(topic).add(handler);
      return () => subscribers.get(topic)?.delete(handler);
    },
    async publish(topic, event) {
      const handlers = [...(subscribers.get(topic) ?? [])];
      for (const handler of handlers) {
        await handler(event);
      }
    }
  };
}

async function publishOutboxEvents(outbox, eventBus) {
  for (const event of outbox) {
    if (event.status !== 'pending') {
      continue;
    }
    await eventBus.publish(event.topic, event.payload);
    event.status = 'sent';
    event.sentAt = new Date().toISOString();
  }
}

function createIdempotentConsumer(handler) {
  const seen = new Set();
  return async (event) => {
    if (!event?.id) {
      throw new Error('event id is required');
    }
    if (seen.has(event.id)) {
      return { skipped: true };
    }
    seen.add(event.id);
    await handler(event);
    return { skipped: false };
  };
}

module.exports = {
  createEventBus,
  publishOutboxEvents,
  createIdempotentConsumer
};

if (require.main === module) {
  const bus = createEventBus();
  bus.subscribe('order.created', async (e) => console.log('processed', e.id));
  const consume = createIdempotentConsumer(async () => {});
  consume({ id: 'evt-1' }).then(console.log);
  consume({ id: 'evt-1' }).then(console.log);
}
