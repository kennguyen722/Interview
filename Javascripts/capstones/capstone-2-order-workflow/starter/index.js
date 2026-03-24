'use strict';
// Capstone 2: Scalable Order Workflow — Starter
//
// Implement a distributed order processing system with:
//   • Saga orchestration: sequential steps with compensation on failure
//   • Outbox pattern: events staged locally then flushed to an event bus
//   • Idempotent consumers: safely replay events without double-processing
//
// Complete every function/class below. Do NOT change the exported API.

// ─── Event Bus ────────────────────────────────────────────────────────────────
// Simple in-process publish/subscribe bus.
// on(type, handler), emit(type, event), off(type, handler)
function createEventBus() {
  // TODO
  throw new Error('Not implemented');
}

// ─── Idempotent Consumer ─────────────────────────────────────────────────────
// createIdempotentConsumer() → { process(eventId, handler) → Promise }
// handler is called only once per eventId — subsequent calls return cached result
function createIdempotentConsumer() {
  // TODO
  throw new Error('Not implemented');
}

// ─── Outbox Publisher ────────────────────────────────────────────────────────
// createOutboxPublisher(eventBus)
// stage(event)          — add event to local outbox (not yet published)
// flush()               — publish all staged events to event bus, clear outbox
// getPending()          — return array of staged (unflushed) events
function createOutboxPublisher(eventBus) {
  // TODO
  throw new Error('Not implemented');
}

// ─── Order Saga ───────────────────────────────────────────────────────────────
// createOrderSaga({ services, outbox })
//   services: { payment, inventory, shipping } — each has execute(data)→Promise and compensate(data)→Promise
//   outbox: createOutboxPublisher instance
//
// execute(orderData) → runs 3 steps in order:
//   1. payment.execute
//   2. inventory.execute
//   3. shipping.execute
// On any failure at step N, compensate all steps 1..N-1 in reverse order.
// Stages domain events to outbox (do NOT flush — caller flushes).
// Returns { success: bool, orderId, results?, error? }
function createOrderSaga({ services, outbox }) {
  // TODO
  throw new Error('Not implemented');
}

module.exports = { createEventBus, createIdempotentConsumer, createOutboxPublisher, createOrderSaga };
