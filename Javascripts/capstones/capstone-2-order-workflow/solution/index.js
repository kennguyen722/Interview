'use strict';
// Capstone 2: Scalable Order Workflow (Saga Pattern) — Reference Solution
// Covers: saga orchestration, compensation, outbox pattern, idempotent consumers, status tracking

const crypto = require('crypto');

// ─── Event Bus (in-memory) ────────────────────────────────────────────────────
function createEventBus() {
  const handlers = new Map();
  const published = [];

  function publish(event) {
    published.push({ ...event, publishedAt: new Date().toISOString() });
    const listeners = handlers.get(event.type) || [];
    return Promise.all(listeners.map(h => h(event)));
  }

  function subscribe(eventType, handler) {
    if (!handlers.has(eventType)) handlers.set(eventType, []);
    handlers.get(eventType).push(handler);
  }

  return { publish, subscribe, getPublished: () => [...published] };
}

// ─── Outbox Publisher (transactional outbox) ──────────────────────────────────
function createOutboxPublisher(eventBus) {
  const outbox   = [];
  const published = new Set();

  function stage(event) {
    outbox.push({ ...event, id: event.id || crypto.randomBytes(8).toString('hex') });
  }

  async function flush() {
    const pending = outbox.filter(e => !published.has(e.id));
    for (const event of pending) {
      await eventBus.publish(event);
      published.add(event.id);
    }
    return { flushed: pending.length };
  }

  return { stage, flush, pending: () => outbox.filter(e => !published.has(e.id)).length };
}

// ─── Idempotent Consumer ──────────────────────────────────────────────────────
function createIdempotentConsumer(handler) {
  const seen = new Set();
  return async function (event) {
    if (seen.has(event.id)) return { skipped: true, id: event.id };
    seen.add(event.id);
    const result = await handler(event);
    return { skipped: false, id: event.id, result };
  };
}

// ─── Service Stubs (in-memory) ────────────────────────────────────────────────
function createPaymentService() {
  const payments = new Map();
  return {
    charge: async ({ orderId, amount }) => {
      if (amount > 10000) throw new Error('Payment declined: over limit');
      const id = `pay-${orderId}`;
      payments.set(id, { id, orderId, amount, status: 'charged' });
      return { paymentId: id };
    },
    refund: async ({ orderId }) => {
      const id = `pay-${orderId}`;
      if (payments.has(id)) payments.get(id).status = 'refunded';
    },
    get: id => payments.get(id)
  };
}

function createInventoryService() {
  const reservations = new Map();
  return {
    reserve: async ({ orderId, items }) => {
      reservations.set(orderId, { orderId, items, status: 'reserved' });
      return { reservationId: `res-${orderId}` };
    },
    release: async ({ orderId }) => {
      if (reservations.has(orderId)) reservations.get(orderId).status = 'released';
    },
    get: id => reservations.get(id)
  };
}

function createShippingService() {
  const shipments = new Map();
  return {
    schedule: async ({ orderId, address }) => {
      const id = `ship-${orderId}`;
      shipments.set(id, { id, orderId, address, status: 'scheduled' });
      return { shipmentId: id };
    },
    cancel: async ({ orderId }) => {
      const id = `ship-${orderId}`;
      if (shipments.has(id)) shipments.get(id).status = 'cancelled';
    }
  };
}

// ─── Saga Orchestrator ────────────────────────────────────────────────────────
function createOrderSaga({ paymentService, inventoryService, shippingService, outbox }) {
  const sagaLog = new Map(); // orderId → saga state

  async function execute(order) {
    const { orderId, customerId, items, amount, shippingAddress } = order;
    const saga = {
      orderId, status: 'started', steps: [],
      paymentId: null, reservationId: null, shipmentId: null
    };
    sagaLog.set(orderId, saga);

    try {
      // Step 1: Process payment
      const { paymentId } = await paymentService.charge({ orderId, amount });
      saga.paymentId = paymentId;
      saga.steps.push('payment_charged');

      // Step 2: Reserve inventory
      const { reservationId } = await inventoryService.reserve({ orderId, items });
      saga.reservationId = reservationId;
      saga.steps.push('inventory_reserved');

      // Step 3: Schedule shipping
      const { shipmentId } = await shippingService.schedule({ orderId, address: shippingAddress });
      saga.shipmentId = shipmentId;
      saga.steps.push('shipping_scheduled');

      saga.status = 'completed';

      // Outbox: emit completion event
      outbox.stage({ type: 'order.completed', id: `ev-${orderId}-completed`, orderId, paymentId, reservationId, shipmentId });

      return { success: true, orderId, paymentId, reservationId, shipmentId };

    } catch (error) {
      saga.status = 'compensating';
      await compensate(saga, error);
      return { success: false, orderId, error: error.message };
    }
  }

  async function compensate(saga, originalError) {
    const { orderId } = saga;
    const compensations = [];

    if (saga.steps.includes('shipping_scheduled')) {
      compensations.push(shippingService.cancel({ orderId }).catch(() => {}));
    }
    if (saga.steps.includes('inventory_reserved')) {
      compensations.push(inventoryService.release({ orderId }).catch(() => {}));
    }
    if (saga.steps.includes('payment_charged')) {
      compensations.push(paymentService.refund({ orderId }).catch(() => {}));
    }

    await Promise.all(compensations);
    saga.status = 'compensated';
    saga.compensationReason = originalError.message;

    outbox.stage({ type: 'order.cancelled', id: `ev-${orderId}-cancelled`, orderId, reason: originalError.message });
  }

  return {
    execute,
    getSagaState: orderId => sagaLog.get(orderId),
    getAllSagas:   () => [...sagaLog.values()]
  };
}

// ─── Order Service ────────────────────────────────────────────────────────────
function createOrderService({ saga, outbox, eventBus }) {
  const orders = new Map();

  async function createOrder({ customerId, items, amount, shippingAddress }) {
    const orderId = `ord-${crypto.randomBytes(6).toString('hex')}`;
    orders.set(orderId, { orderId, customerId, items, amount, status: 'pending', createdAt: new Date().toISOString() });

    const result = await saga.execute({ orderId, customerId, items, amount, shippingAddress });

    const order = orders.get(orderId);
    order.status = result.success ? 'confirmed' : 'cancelled';
    order.sagaResult = result;

    await outbox.flush();
    return order;
  }

  return { createOrder, getOrder: id => orders.get(id) };
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  (async () => {
    const eventBus  = createEventBus();
    const outbox    = createOutboxPublisher(eventBus);
    const payment   = createPaymentService();
    const inventory = createInventoryService();
    const shipping  = createShippingService();

    // Subscribe to events
    eventBus.subscribe('order.completed', ev => console.log('Order completed event received:', ev.orderId));
    eventBus.subscribe('order.cancelled', ev => console.log('Order cancelled event received:', ev.orderId, ev.reason));

    const saga = createOrderSaga({ paymentService: payment, inventoryService: inventory, shippingService: shipping, outbox });
    const orderService = createOrderService({ saga, outbox, eventBus });

    // Successful order
    const order1 = await orderService.createOrder({ customerId: 'c1', items: [{ sku: 'A1', qty: 2 }], amount: 99.99, shippingAddress: '123 Main St' });
    console.log('\n=== Order 1 ===');
    console.log('Status:', order1.status);
    console.log('Saga steps:', saga.getSagaState(order1.orderId)?.steps);

    // Failed order (over payment limit → compensation triggered)
    const order2 = await orderService.createOrder({ customerId: 'c2', items: [{ sku: 'B1', qty: 1 }], amount: 20000, shippingAddress: '456 Elm St' });
    console.log('\n=== Order 2 (compensation) ===');
    console.log('Status:', order2.status);
    const sagaState = saga.getSagaState(order2.orderId);
    console.log('Saga status:', sagaState?.status);
    console.log('Compensation reason:', sagaState?.compensationReason);

    // Total published events
    console.log('\nTotal events published:', eventBus.getPublished().length);
  })();
}

module.exports = { createOrderSaga, createOrderService, createOutboxPublisher, createIdempotentConsumer, createEventBus };
