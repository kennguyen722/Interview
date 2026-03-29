function paymentProviderFactory(type) {
  const map = { stripe: { charge: (x) => `stripe:${x}` }, paypal: { charge: (x) => `paypal:${x}` } };
  if (!map[type]) throw new Error('UNKNOWN_PROVIDER');
  return map[type];
}

function strategyDiscountCalculator(amount, strategy) {
  return strategy(amount);
}

function observerPipelineAuditEvents(listeners, event) {
  listeners.forEach((l) => l(event));
  return listeners.length;
}

function commandBusWithMiddlewareChain(handler, middlewares = []) {
  return (cmd) => middlewares.reduceRight((next, mw) => () => mw(cmd, next), () => handler(cmd))();
}

function repositoryWithTenantGuard(rows, tenantId) {
  return rows.filter((r) => r.tenantId === tenantId);
}

function bffPartialFailureFallback(fetchers) {
  return Promise.all(fetchers.map((f) => f().catch(() => null)));
}

function workflowStateMachine(transitions, start) {
  let state = start;
  return { state: () => state, send(evt) { const next = transitions[state]?.[evt]; if (next) state = next; return state; } };
}

function outboxConsumerIdempotency(seen, messageId, process) {
  if (seen.has(messageId)) return false;
  seen.add(messageId); process(); return true;
}

function eventSchemaVersioningChecker(version, supported) {
  return supported.includes(version);
}

function adrGeneratorUtility({ title, decision }) {
  return `# ADR\nTitle: ${title}\nDecision: ${decision}`;
}

function buildVsBuyDecisionMatrixTool(scores) {
  return scores.sort((a, b) => b.score - a.score)[0];
}

function featureRolloutStrategyEvaluator(metrics) {
  return metrics.errorRate < 0.02 ? 'continue' : 'rollback';
}

function serviceBoundaryDecompositionExercise(capabilities) {
  return capabilities.reduce((acc, c) => ((acc[c.domain] ||= []).push(c.name), acc), {});
}

function migrationRouterStranglerPattern(routes) {
  return (path) => routes[path] || 'legacy';
}

function architectureReviewChecklistScorer(checks) {
  const pass = checks.filter((c) => c.ok).length;
  return { pass, total: checks.length, score: checks.length ? pass / checks.length : 0 };
}

module.exports = {
  paymentProviderFactory,
  strategyDiscountCalculator,
  observerPipelineAuditEvents,
  commandBusWithMiddlewareChain,
  repositoryWithTenantGuard,
  bffPartialFailureFallback,
  workflowStateMachine,
  outboxConsumerIdempotency,
  eventSchemaVersioningChecker,
  adrGeneratorUtility,
  buildVsBuyDecisionMatrixTool,
  featureRolloutStrategyEvaluator,
  serviceBoundaryDecompositionExercise,
  migrationRouterStranglerPattern,
  architectureReviewChecklistScorer,
};
