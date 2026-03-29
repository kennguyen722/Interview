function verifyCsrf(req) {
  const cookie = req.cookies?.csrf;
  const header = req.headers?.['x-csrf-token'];
  return Boolean(cookie && header && cookie === header);
}

function redactFields(obj, fields) {
  const out = { ...obj };
  for (const f of fields) {
    if (f in out) out[f] = '[REDACTED]';
  }
  return out;
}

function summarizePercentiles(samples) {
  if (!samples.length) return { p50: 0, p95: 0, p99: 0 };
  const sorted = samples.slice().sort((a, b) => a - b);
  const pick = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))];
  return {
    p50: pick(0.5),
    p95: pick(0.95),
    p99: pick(0.99),
  };
}

function createCircuitBreaker({ failureThreshold = 2, resetMs = 1000 } = {}) {
  let failures = 0;
  let state = 'closed';
  let nextTryAt = 0;

  return {
    async run(fn, now = Date.now()) {
      if (state === 'open' && now < nextTryAt) {
        throw new Error('CIRCUIT_OPEN');
      }

      if (state === 'open' && now >= nextTryAt) {
        state = 'half-open';
      }

      try {
        const out = await fn();
        failures = 0;
        state = 'closed';
        return out;
      } catch (err) {
        failures += 1;
        if (failures >= failureThreshold || state === 'half-open') {
          state = 'open';
          nextTryAt = now + resetMs;
        }
        throw err;
      }
    },
    state() {
      return state;
    },
  };
}

function scoreSecurityChecklist(state) {
  const required = [
    'authn-authz-validated',
    'input-validation-boundary',
    'injection-safe-queries',
    'secrets-not-hardcoded',
    'pii-redaction-logs',
  ];

  const missing = required.filter((k) => !state[k]);
  return {
    pass: missing.length === 0,
    score: required.length - missing.length,
    total: required.length,
    missing,
  };
}

module.exports = {
  verifyCsrf,
  redactFields,
  summarizePercentiles,
  createCircuitBreaker,
  scoreSecurityChecklist,
};
