'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createOrderWorkflow,
  publishOutbox,
  createIdempotentConsumer,
  createDeadLetterQueueHandler,
  createSagaOrchestrator,
  createEventVersioningRegistry,
  reconcileEventuallyConsistent,
  contractTest
} = require('../solution/section-c-microservices.solution');

test('17) order workflow calls dependencies in sequence', async () => {
  const calls = [];
  const deps = {
    payment: { authorize: async () => calls.push('payment') },
    inventory: { reserve: async () => calls.push('inventory') },
    shipping: { create: async () => calls.push('shipping') }
  };

  const workflow = createOrderWorkflow();
  const out = await workflow.run({ id: 'o1' }, deps);

  assert.equal(out.status, 'completed');
  assert.deepEqual(calls, ['payment', 'inventory', 'shipping']);
});

test('18) publishOutbox publishes pending and marks sent', async () => {
  const sent = [];
  const outbox = [
    { state: 'pending', topic: 'a', payload: { id: 1 } },
    { state: 'sent', topic: 'b', payload: { id: 2 } }
  ];

  await publishOutbox(outbox, {
    async publish(topic, payload) {
      sent.push({ topic, payload });
    }
  });

  assert.equal(sent.length, 1);
  assert.equal(outbox[0].state, 'sent');
});

test('19) idempotent consumer skips duplicates', async () => {
  let count = 0;
  const consume = createIdempotentConsumer(async () => {
    count += 1;
  });

  const a = await consume({ id: 'e1' });
  const b = await consume({ id: 'e1' });

  assert.equal(a.skipped, false);
  assert.equal(b.skipped, true);
  assert.equal(count, 1);
});

test('20) dead letter handler stores failed events and replays', async () => {
  const dlq = createDeadLetterQueueHandler();
  const processed = [];

  await dlq.process({ id: 'x' }, async () => {
    throw new Error('boom');
  });
  assert.equal(dlq.list().length, 1);

  await dlq.replay(async (event) => {
    processed.push(event.id);
  });

  assert.deepEqual(processed, ['x']);
});

test('21) saga orchestrator compensates on failure', async () => {
  const calls = [];
  const saga = createSagaOrchestrator([
    {
      run: async () => calls.push('run-1'),
      compensate: async () => calls.push('comp-1')
    },
    {
      run: async () => {
        calls.push('run-2');
        throw new Error('fail');
      },
      compensate: async () => calls.push('comp-2')
    }
  ]);

  const out = await saga.execute({});
  assert.equal(out.ok, false);
  assert.deepEqual(calls, ['run-1', 'run-2', 'comp-1']);
});

test('22) versioning registry upgrades known version', () => {
  const reg = createEventVersioningRegistry();
  reg.register('order.created', 1, (e) => ({ ...e, version: 2, payload: { ...e.payload, source: 'migrated' } }));
  const out = reg.upgrade({ type: 'order.created', version: 1, payload: { id: 'o1' } });
  assert.equal(out.version, 2);
  assert.equal(out.payload.source, 'migrated');
});

test('23) reconcileEventuallyConsistent returns mismatches', () => {
  const primary = new Map([['1', { status: 'ok' }], ['2', { status: 'new' }]]);
  const projection = new Map([['1', { status: 'ok' }], ['2', { status: 'old' }]]);
  const out = reconcileEventuallyConsistent(primary, projection);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, '2');
});

test('24) contractTest detects missing required fields', () => {
  const out = contractTest(
    { fields: ['id', 'amount'] },
    { requiredFields: ['id', 'amount', 'currency'] }
  );
  assert.equal(out.pass, false);
  assert.deepEqual(out.missing, ['currency']);
});
