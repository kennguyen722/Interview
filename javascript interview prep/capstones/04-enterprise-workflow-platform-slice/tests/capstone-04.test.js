const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('capstone-04 enforces tenant isolation and outbox replay safety', () => {
  const processed = [];
  const wf = S.createWorkflowPlatform();

  wf.addTask('tenant-a', { id: 't1', title: 'A1' });
  wf.addTask('tenant-b', { id: 't1', title: 'B1' });

  assert.equal(wf.getTask('tenant-a', 't1').title, 'A1');
  assert.equal(wf.getTask('tenant-b', 't1').title, 'B1');

  wf.replayOutbox((evt) => processed.push(evt.id));
  const firstCount = processed.length;
  wf.replayOutbox((evt) => processed.push(evt.id));
  assert.equal(processed.length, firstCount);
});

test('capstone-04 executes saga with compensation on failure', () => {
  const state = [];
  const wf = S.createWorkflowPlatform();

  assert.throws(() => wf.runSaga({
    tenantId: 'tenant-a',
    workflowId: 'wf-1',
    steps: [
      { name: 'reserve', apply: () => state.push('reserve'), compensate: () => state.push('undo-reserve') },
      { name: 'charge', apply: () => { throw new Error('charge down'); }, compensate: () => state.push('undo-charge') },
    ],
  }), /SAGA_FAILED/);

  assert.deepEqual(state, ['reserve', 'undo-reserve']);
});

test('capstone-04 exposes SLO dashboard and incident runbook', () => {
  const wf = S.createWorkflowPlatform();

  wf.runSaga({
    tenantId: 'tenant-z',
    workflowId: 'wf-ok',
    steps: [
      { name: 'step-1', apply: () => {}, compensate: () => {} },
    ],
  });

  const dashboard = wf.getSloDashboard('tenant-z');
  assert.equal(dashboard.workflowsCompleted, 1);
  assert.equal(typeof dashboard.outboxDepth, 'number');

  const runbook = wf.getIncidentRunbook();
  assert.equal(Array.isArray(runbook), true);
  assert.equal(runbook.length >= 3, true);
});
