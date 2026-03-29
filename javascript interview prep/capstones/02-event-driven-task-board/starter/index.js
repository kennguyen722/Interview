// Capstone 02 starter:
// Build an event-driven task board with validation, typed errors, and snapshots.
// Use correlation IDs in logs/events for traceability.
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

// Implement pub/sub registration and synchronous event emission.
function createEventBus() {
  throw new Error('TODO: implement createEventBus');
}

// Implement task CRUD, lifecycle events, snapshot/restore, and validation guards.
function createTaskBoard() {
  throw new Error('TODO: implement createTaskBoard');
}

module.exports = {
  ValidationError,
  NotFoundError,
  createEventBus,
  createTaskBoard,
};
