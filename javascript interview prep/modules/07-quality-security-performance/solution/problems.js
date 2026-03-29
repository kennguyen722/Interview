function retryTestWithFakeSleep(fn, retries = 2) {
  return async () => {
    let last;
    for (let i = 0; i <= retries; i += 1) {
      try { return await fn(); } catch (e) { last = e; }
    }
    throw last;
  };
}

function contractDriftDetector(expected, actual) {
  return Object.keys(expected).filter((k) => expected[k] !== actual[k]);
}

function sqlInjectionSafeQueryRefactor(base, params) {
  return { text: base.replace(/:\w+/g, '?'), values: Object.values(params) };
}

function xssSafeRendererHelper(input) {
  return String(input).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function csrfVerifierMiddleware(req) {
  return req.cookies?.csrf && req.headers?.['x-csrf-token'] === req.cookies.csrf;
}

function jwtKeyRotationCheck(currentKid, validKids) {
  return validKids.includes(currentKid);
}

function secretProviderFallbackCache(primary, cache, key) {
  try { const v = primary(key); cache.set(key, v); return v; } catch { return cache.get(key); }
}

function structuredErrorSanitizer(err) {
  return { code: err.code || 'ERROR', message: 'sanitized', traceId: err.traceId || null };
}

function p95p99Calculator(samples) {
  const s = samples.slice().sort((a, b) => a - b);
  const pick = (p) => s[Math.floor((s.length - 1) * p)] || 0;
  return { p95: pick(0.95), p99: pick(0.99) };
}

function hotKeyCacheStampedeGuard(lockMap, key, loader) {
  if (!lockMap.has(key)) lockMap.set(key, loader().finally(() => lockMap.delete(key)));
  return lockMap.get(key);
}

function circuitBreakerTimeoutComposition(task, timeoutMs = 10) {
  return Promise.race([task(), new Promise((_, r) => setTimeout(() => r(new Error('TIMEOUT')), timeoutMs))]);
}

function bulkheadPressureTestHarness(limit) {
  let active = 0;
  return async (task) => {
    if (active >= limit) throw new Error('REJECTED');
    active += 1;
    try { return await task(); } finally { active -= 1; }
  };
}

function flakyTestClassifier(ciRuns) {
  const fails = ciRuns.filter((r) => !r.pass).length;
  return fails > 0 && fails < ciRuns.length ? 'flaky' : fails === ciRuns.length ? 'broken' : 'stable';
}

function incidentTimelineReconstructionUtility(events) {
  return events.slice().sort((a, b) => a.ts - b.ts);
}

function performanceRegressionDetector(baseline, current, threshold = 0.1) {
  return (current - baseline) / baseline > threshold;
}

module.exports = {
  retryTestWithFakeSleep,
  contractDriftDetector,
  sqlInjectionSafeQueryRefactor,
  xssSafeRendererHelper,
  csrfVerifierMiddleware,
  jwtKeyRotationCheck,
  secretProviderFallbackCache,
  structuredErrorSanitizer,
  p95p99Calculator,
  hotKeyCacheStampedeGuard,
  circuitBreakerTimeoutComposition,
  bulkheadPressureTestHarness,
  flakyTestClassifier,
  incidentTimelineReconstructionUtility,
  performanceRegressionDetector,
};
