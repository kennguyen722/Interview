// Multi-tenant workflow slice with saga execution and replay-safe outbox.
function createWorkflowPlatform({ hooks = {} } = {}) {
  const log = hooks.log || (() => {});
  const metrics = hooks.metric || (() => {});

  const tenants = new Map();
  const outbox = [];
  const processedOutbox = new Set();

  function ensureTenant(tenantId) {
    if (!tenants.has(tenantId)) {
      tenants.set(tenantId, {
        tasks: new Map(),
        workflows: new Map(),
        incidents: [],
      });
    }
    return tenants.get(tenantId);
  }

  // Applies steps in order and compensates in reverse order on first failure.
  function runSaga({ tenantId, workflowId, steps }) {
    const tenant = ensureTenant(tenantId);
    const applied = [];

    for (const step of steps) {
      try {
        step.apply();
        applied.push(step);
        outbox.push({
          id: `evt-${outbox.length + 1}`,
          tenantId,
          workflowId,
          type: 'STEP_APPLIED',
          step: step.name,
        });
      } catch (err) {
        for (let i = applied.length - 1; i >= 0; i -= 1) {
          applied[i].compensate();
          outbox.push({
            id: `evt-${outbox.length + 1}`,
            tenantId,
            workflowId,
            type: 'STEP_COMPENSATED',
            step: applied[i].name,
          });
        }
        tenant.incidents.push({ workflowId, reason: 'SAGA_FAILED', error: String(err.message || err) });
        throw new Error('SAGA_FAILED');
      }
    }

    tenant.workflows.set(workflowId, { state: 'COMPLETED', steps: steps.map((s) => s.name) });
    metrics('workflow.completed', 1);
    return tenant.workflows.get(workflowId);
  }

  function addTask(tenantId, task) {
    const tenant = ensureTenant(tenantId);
    tenant.tasks.set(task.id, { ...task });
    outbox.push({ id: `evt-${outbox.length + 1}`, tenantId, type: 'TASK_ADDED', taskId: task.id });
    log({ level: 'info', msg: 'task.added', tenantId, taskId: task.id });
  }

  function getTask(tenantId, taskId) {
    const tenant = ensureTenant(tenantId);
    return tenant.tasks.get(taskId) || null;
  }

  function replayOutbox(handler) {
    for (const evt of outbox) {
      // Process each outbox event once per tenant/event pair.
      const key = `${evt.tenantId}:${evt.id}`;
      if (processedOutbox.has(key)) continue;
      handler(evt);
      processedOutbox.add(key);
    }
  }

  // Simple SLO-style view for interview discussion and validation.
  function getSloDashboard(tenantId) {
    const tenant = ensureTenant(tenantId);
    return {
      tenantId,
      workflowsCompleted: Array.from(tenant.workflows.values()).filter((w) => w.state === 'COMPLETED').length,
      incidentCount: tenant.incidents.length,
      outboxDepth: outbox.filter((e) => e.tenantId === tenantId).length,
    };
  }

  function getIncidentRunbook() {
    return [
      '1) Identify impacted tenant and workflow IDs',
      '2) Verify outbox replay lag and consumer health',
      '3) Re-run compensation for failed saga steps',
      '4) Communicate incident status and ETA to stakeholders',
      '5) Capture postmortem and prevention actions',
    ];
  }

  return {
    runSaga,
    addTask,
    getTask,
    replayOutbox,
    getSloDashboard,
    getIncidentRunbook,
  };
}

module.exports = {
  createWorkflowPlatform,
};
