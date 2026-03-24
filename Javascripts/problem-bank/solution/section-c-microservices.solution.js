'use strict';

function createOrderWorkflow() {
  return {
    async run(order, deps) {
      await deps.payment.authorize(order);
      await deps.inventory.reserve(order);
      await deps.shipping.create(order);
      return { status: 'completed', orderId: order.id };
    }
  };
}

async function publishOutbox(outbox, eventBus) {
  for (const event of outbox) {
    if (event.state !== 'pending') {
      continue;
    }
    await eventBus.publish(event.topic, event.payload);
    event.state = 'sent';
    event.sentAt = new Date().toISOString();
  }
}

function createIdempotentConsumer(handler) {
  const seen = new Set();
  return async (event) => {
    if (seen.has(event.id)) {
      return { skipped: true };
    }
    seen.add(event.id);
    await handler(event);
    return { skipped: false };
  };
}

function createDeadLetterQueueHandler() {
  const dlq = [];

  return {
    async process(event, handler) {
      try {
        await handler(event);
        return { ok: true };
      } catch (error) {
        dlq.push({ event, error: error.message, ts: Date.now() });
        return { ok: false };
      }
    },
    list() {
      return [...dlq];
    },
    async replay(handler) {
      const copy = [...dlq];
      dlq.length = 0;
      for (const item of copy) {
        await this.process(item.event, handler);
      }
    }
  };
}

function createSagaOrchestrator(steps) {
  return {
    async execute(ctx) {
      const completed = [];
      try {
        for (const step of steps) {
          await step.run(ctx);
          completed.push(step);
        }
        return { ok: true };
      } catch (error) {
        for (let i = completed.length - 1; i >= 0; i -= 1) {
          await completed[i].compensate(ctx);
        }
        return { ok: false, error: error.message };
      }
    }
  };
}

function createEventVersioningRegistry() {
  const adapters = new Map();
  return {
    register(type, fromVersion, adapterFn) {
      adapters.set(`${type}:${fromVersion}`, adapterFn);
    },
    upgrade(event) {
      const key = `${event.type}:${event.version}`;
      if (!adapters.has(key)) {
        return event;
      }
      return adapters.get(key)(event);
    }
  };
}

function reconcileEventuallyConsistent(primary, projection) {
  const mismatches = [];
  for (const [id, state] of primary.entries()) {
    const projected = projection.get(id);
    if (JSON.stringify(state) !== JSON.stringify(projected)) {
      mismatches.push({ id, primary: state, projection: projected ?? null });
    }
  }
  return mismatches;
}

function contractTest(providerSchema, consumerSchema) {
  const missing = [];
  for (const field of consumerSchema.requiredFields) {
    if (!providerSchema.fields.includes(field)) {
      missing.push(field);
    }
  }
  return {
    pass: missing.length === 0,
    missing
  };
}

module.exports = {
  createOrderWorkflow,
  publishOutbox,
  createIdempotentConsumer,
  createDeadLetterQueueHandler,
  createSagaOrchestrator,
  createEventVersioningRegistry,
  reconcileEventuallyConsistent,
  contractTest
};
