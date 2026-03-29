class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.code = 'NOT_FOUND';
  }
}

// Minimal in-memory event bus for lifecycle notifications.
function createEventBus() {
  const listeners = new Map();
  return {
    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push(handler);
    },
    emit(event, payload) {
      for (const h of listeners.get(event) || []) h(payload);
    },
  };
}

// Task board keeps state local while emitting auditable domain events.
function createTaskBoard({ logger = () => {} } = {}) {
  const bus = createEventBus();
  const tasks = new Map();
  const events = [];

  function log(action, correlationId, data) {
    logger({ ts: Date.now(), action, correlationId, data });
  }

  function assertCorrelationId(correlationId) {
    if (typeof correlationId !== 'string' || !correlationId.trim()) {
      throw new ValidationError('correlationId is required');
    }
  }

  function assertTitle(title) {
    if (typeof title !== 'string' || !title.trim()) {
      throw new ValidationError('title is required');
    }
  }

  function appendEvent(type, correlationId, payload) {
    // Event IDs are monotonic to keep replay order stable in tests.
    const evt = { id: `evt-${events.length + 1}`, type, correlationId, payload, ts: Date.now() };
    events.push(evt);
    bus.emit(type, evt);
    log(type, correlationId, payload);
    return evt;
  }

  return {
    on: bus.on,
    createTask(input, correlationId) {
      assertCorrelationId(correlationId);
      assertTitle(input?.title);
      const task = {
        id: input.id || `task-${tasks.size + 1}`,
        title: input.title,
        status: input.status || 'todo',
      };
      tasks.set(task.id, task);
      appendEvent('task.created', correlationId, { taskId: task.id });
      return task;
    },
    updateTask(taskId, patch, correlationId) {
      assertCorrelationId(correlationId);
      if (!tasks.has(taskId)) throw new NotFoundError('task not found');
      const next = { ...tasks.get(taskId), ...patch };
      if (next.title !== undefined) assertTitle(next.title);
      tasks.set(taskId, next);
      appendEvent('task.updated', correlationId, { taskId });
      return next;
    },
    moveTask(taskId, status, correlationId) {
      return this.updateTask(taskId, { status }, correlationId);
    },
    removeTask(taskId, correlationId) {
      assertCorrelationId(correlationId);
      if (!tasks.has(taskId)) throw new NotFoundError('task not found');
      tasks.delete(taskId);
      appendEvent('task.removed', correlationId, { taskId });
      return true;
    },
    snapshot() {
      // Snapshot supports quick persistence/restore in memory-only workflows.
      return {
        tasks: [...tasks.values()],
        events: events.slice(),
      };
    },
    restore(snapshot) {
      tasks.clear();
      events.length = 0;
      for (const t of snapshot.tasks || []) tasks.set(t.id, t);
      for (const e of snapshot.events || []) events.push(e);
    },
    listTasks() {
      return [...tasks.values()];
    },
    listEvents() {
      return events.slice();
    },
  };
}

module.exports = {
  ValidationError,
  NotFoundError,
  createEventBus,
  createTaskBoard,
};
