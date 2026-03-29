// Runtime wrapper that composes timeout, retry, breaker, and bulkhead controls.
function createResilienceRuntime({ timeoutMs = 50, retries = 1, breakerThreshold = 2, bulkheadLimit = 2, log = () => {}, metric = () => {} } = {}) {
  let breakerState = 'CLOSED';
  let failureCount = 0;
  let inflight = 0;

  async function withTimeout(task) {
    return Promise.race([
      task(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DOWNSTREAM_TIMEOUT')), timeoutMs)),
    ]);
  }

  async function call(task) {
    if (breakerState === 'OPEN') throw new Error('CIRCUIT_OPEN');
    if (inflight >= bulkheadLimit) throw new Error('BULKHEAD_REJECTED');

    inflight += 1;
    try {
      let lastErr;
      for (let i = 0; i <= retries; i += 1) {
        try {
          const out = await withTimeout(task);
          failureCount = 0;
          breakerState = 'CLOSED';
          metric('downstream.success', 1);
          return out;
        } catch (err) {
          lastErr = err;
          metric('downstream.retry', 1);
        }
      }

      failureCount += 1;
      if (failureCount >= breakerThreshold) breakerState = 'OPEN';
      throw lastErr;
    } finally {
      inflight -= 1;
      log({ level: 'info', msg: 'downstream.call.completed', breakerState, inflight });
    }
  }

  function status() {
    return { breakerState, failureCount, inflight };
  }

  function closeCircuit() {
    breakerState = 'CLOSED';
    failureCount = 0;
  }

  return { call, status, closeCircuit };
}

// API facade exposing idempotent create, listing, and resilient payment simulation.
function createResilientApiService({ downstream = {}, hooks = {} } = {}) {
  const log = hooks.log || (() => {});
  const metric = hooks.metric || (() => {});

  const runtime = createResilienceRuntime({
    timeoutMs: hooks.timeoutMs || 30,
    retries: hooks.retries || 1,
    breakerThreshold: hooks.breakerThreshold || 2,
    bulkheadLimit: hooks.bulkheadLimit || 2,
    log,
    metric,
  });

  const idempotencyStore = new Map();
  const orders = [];

  function createOrderIdempotent(idempotencyKey, payload) {
    // Fingerprint ensures same key cannot be reused with a different payload.
    const fingerprint = JSON.stringify(payload);
    if (idempotencyStore.has(idempotencyKey)) {
      const existing = idempotencyStore.get(idempotencyKey);
      if (existing.fingerprint !== fingerprint) {
        throw new Error('IDEMPOTENCY_PAYLOAD_MISMATCH');
      }
      return existing.order;
    }

    const order = {
      id: `ord-${orders.length + 1}`,
      status: payload.status || 'created',
      amount: Number(payload.amount || 0),
      customerId: payload.customerId || 'unknown',
      createdAt: Date.now() + orders.length,
    };

    orders.push(order);
    idempotencyStore.set(idempotencyKey, { fingerprint, order });
    log({ level: 'info', msg: 'order.created', orderId: order.id, idempotencyKey });
    metric('orders.created', 1);
    return order;
  }

  function listOrders({ cursor = null, limit = 2, status = null } = {}) {
    // Cursor is an encoded numeric offset for deterministic pagination.
    const sorted = orders.slice().sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
    const filtered = status ? sorted.filter((o) => o.status === status) : sorted;
    const start = cursor ? Number(Buffer.from(cursor, 'base64url').toString('utf8')) : 0;
    const items = filtered.slice(start, start + limit);
    const nextOffset = start + limit;
    const nextCursor = nextOffset < filtered.length ? Buffer.from(String(nextOffset), 'utf8').toString('base64url') : null;
    return { items, nextCursor };
  }

  async function simulatePayment(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('ORDER_NOT_FOUND');

    const downstreamTask = async () => {
      if (!downstream.charge) return { approved: true };
      return downstream.charge(order);
    };

    const result = await runtime.call(downstreamTask);
    order.status = result.approved ? 'paid' : 'payment_failed';
    metric('payments.processed', 1);
    return order;
  }

  return {
    createOrderIdempotent,
    listOrders,
    simulatePayment,
    runtimeStatus: runtime.status,
    closeCircuit: runtime.closeCircuit,
  };
}

module.exports = {
  createResilienceRuntime,
  createResilientApiService,
};
