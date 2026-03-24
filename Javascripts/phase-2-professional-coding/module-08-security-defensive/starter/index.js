'use strict';

function validateSignupPayload(payload) {
  // TODO
  throw new Error('Not implemented');
}

function authorize(requiredRole, user) {
  // TODO
  throw new Error('Not implemented');
}

function createSlidingWindowLimiter(limit, windowMs) {
  // TODO
  throw new Error('Not implemented');
}

module.exports = {
  validateSignupPayload,
  authorize,
  createSlidingWindowLimiter
};

if (require.main === module) {
  console.log('Module 08 starter loaded. Complete TODOs in this file.');
}
