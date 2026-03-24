'use strict';

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

function createNotesService() {
  const notes = new Map();

  return {
    create({ title, content }) {
      const id = randomId();
      const note = {
        id,
        title,
        content,
        createdAt: new Date().toISOString()
      };
      notes.set(id, note);
      return note;
    },
    getById(id) {
      return notes.get(id) ?? null;
    },
    list() {
      return [...notes.values()];
    },
    update(id, patch) {
      const current = notes.get(id);
      if (!current) {
        return null;
      }
      const next = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString()
      };
      notes.set(id, next);
      return next;
    }
  };
}

function validateCreatePayload(body) {
  if (!body || typeof body !== 'object') {
    return 'body is required';
  }
  if (typeof body.title !== 'string' || body.title.trim().length < 3) {
    return 'title must be at least 3 characters';
  }
  if (typeof body.content !== 'string' || body.content.trim().length === 0) {
    return 'content is required';
  }
  return null;
}

function response(status, body, correlationId) {
  return {
    status,
    body,
    headers: {
      'x-correlation-id': correlationId
    }
  };
}

function createHandlers(service) {
  const idempotencyStore = new Map();

  return {
    createNote(request) {
      const correlationId = request.headers?.['x-correlation-id'] ?? randomId();
      const idempotencyKey = request.headers?.['idempotency-key'];

      if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
        return response(200, idempotencyStore.get(idempotencyKey), correlationId);
      }

      const error = validateCreatePayload(request.body);
      if (error) {
        return response(400, { error }, correlationId);
      }

      const note = service.create({
        title: request.body.title.trim(),
        content: request.body.content.trim()
      });

      if (idempotencyKey) {
        idempotencyStore.set(idempotencyKey, note);
      }

      return response(201, note, correlationId);
    },

    getNote(request) {
      const correlationId = request.headers?.['x-correlation-id'] ?? randomId();
      const note = service.getById(request.params?.id);
      if (!note) {
        return response(404, { error: 'Note not found' }, correlationId);
      }
      return response(200, note, correlationId);
    },

    listNotes(request = { headers: {} }) {
      const correlationId = request.headers?.['x-correlation-id'] ?? randomId();
      return response(200, { items: service.list() }, correlationId);
    }
  };
}

module.exports = {
  createNotesService,
  createHandlers
};

if (require.main === module) {
  const service = createNotesService();
  const handlers = createHandlers(service);
  const req = {
    headers: { 'idempotency-key': 'abc-1', 'x-correlation-id': 'trace-123' },
    body: { title: 'First Note', content: 'hello' }
  };
  console.log(handlers.createNote(req));
  console.log(handlers.createNote(req));
}
