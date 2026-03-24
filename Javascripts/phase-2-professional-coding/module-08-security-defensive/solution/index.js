'use strict';

function validateSignupPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['payload is required'];
  }

  const email = String(payload.email ?? '').trim();
  const password = String(payload.password ?? '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('invalid email');
  }

  if (password.length < 8) {
    errors.push('password must be at least 8 chars');
  }

  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.push('password must contain uppercase and number');
  }

  return errors;
}

function authorize(requiredRole, user) {
  const roles = new Set(user?.roles ?? []);
  return roles.has(requiredRole);
}

function createSlidingWindowLimiter(limit, windowMs) {
  const hits = new Map();

  return function isAllowed(clientId, now = Date.now()) {
    const timestamps = hits.get(clientId) ?? [];
    const valid = timestamps.filter((ts) => now - ts < windowMs);

    if (valid.length >= limit) {
      hits.set(clientId, valid);
      return false;
    }

    valid.push(now);
    hits.set(clientId, valid);
    return true;
  };
}

module.exports = {
  validateSignupPayload,
  authorize,
  createSlidingWindowLimiter
};

if (require.main === module) {
  const limiter = createSlidingWindowLimiter(2, 1000);
  console.log(limiter('u1', 0), limiter('u1', 100), limiter('u1', 200));
}
