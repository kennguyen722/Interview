'use strict';

function createNotesService() {
  // TODO: in-memory service with create/get/list/update.
  throw new Error('Not implemented');
}

function createHandlers(service) {
  // request shape: { headers, body, params }
  // response shape: { status, body, headers }

  return {
    createNote(request) {
      // TODO: support Idempotency-Key and validation.
      throw new Error('Not implemented');
    },
    getNote(request) {
      // TODO
      throw new Error('Not implemented');
    },
    listNotes() {
      // TODO
      throw new Error('Not implemented');
    }
  };
}

module.exports = {
  createNotesService,
  createHandlers
};

if (require.main === module) {
  console.log('Module 06 starter loaded. Complete TODOs in this file.');
}
