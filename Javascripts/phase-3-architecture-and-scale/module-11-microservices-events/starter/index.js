'use strict';

function createEventBus() {
  // TODO: publish/subscribe API.
  throw new Error('Not implemented');
}

async function publishOutboxEvents(outbox, eventBus) {
  // TODO: publish pending events and mark them sent.
  throw new Error('Not implemented');
}

function createIdempotentConsumer(handler) {
  // TODO: avoid processing duplicate event IDs.
  throw new Error('Not implemented');
}

module.exports = {
  createEventBus,
  publishOutboxEvents,
  createIdempotentConsumer
};

if (require.main === module) {
  console.log('Module 11 starter loaded. Complete TODOs in this file.');
}
