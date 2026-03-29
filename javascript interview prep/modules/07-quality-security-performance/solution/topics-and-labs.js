function testStrategyTopic(levels) {
  return { hasUnit: levels.includes('unit'), hasIntegration: levels.includes('integration') };
}

function deterministicAsyncTestingTopic(run) {
  return run();
}

function owaspBasicsTopic(vectors) {
  return vectors.filter((v) => ['sql-injection', 'xss', 'csrf'].includes(v));
}

function injectionXssCsrfSecretsTopic(input) {
  return { safeHtml: String(input.html).replace(/</g, '&lt;'), tokenMatch: input.csrfCookie === input.csrfHeader };
}

function profilingCachingLatencyTopic(samples) {
  const sorted = samples.slice().sort((a, b) => a - b);
  return { p95: sorted[Math.floor((sorted.length - 1) * 0.95)] || 0 };
}

function reliabilityDefensiveDefaultsTopic(config) {
  return { retries: config.retries ?? 2, timeoutMs: config.timeoutMs ?? 5000 };
}

function deterministicRetryHarnessLab(fn) {
  return deterministicAsyncTestingTopic(fn);
}

function contractTestGateLab(expected, actual) {
  return JSON.stringify(expected) === JSON.stringify(actual);
}

function injectionHardeningLab(sqlInput) {
  return { query: 'SELECT * FROM users WHERE id = ?', values: [sqlInput] };
}

function latencyDashboardProfilingLab(samples) {
  return profilingCachingLatencyTopic(samples);
}

function reliabilityWrapperDefaultsLab(config) {
  return reliabilityDefensiveDefaultsTopic(config);
}

module.exports = {
  testStrategyTopic,
  deterministicAsyncTestingTopic,
  owaspBasicsTopic,
  injectionXssCsrfSecretsTopic,
  profilingCachingLatencyTopic,
  reliabilityDefensiveDefaultsTopic,
  deterministicRetryHarnessLab,
  contractTestGateLab,
  injectionHardeningLab,
  latencyDashboardProfilingLab,
  reliabilityWrapperDefaultsLab,
};
