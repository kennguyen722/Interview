function solidCleanArchitectureTopic(layers) {
  return layers.join(' > ');
}

function patternCatalogTopic(name) {
  const known = ['factory', 'strategy', 'observer', 'command', 'adapter'];
  return known.includes(name);
}

function repositoryServiceLayersTopic(repo, serviceFn) {
  return serviceFn(repo);
}

function bffApiGatewayPatternsTopic(services) {
  return services.reduce((acc, s) => ({ ...acc, ...s() }), {});
}

function eventDrivenSagaOutboxTopic(events) {
  return events.map((e) => ({ ...e, outbox: true }));
}

function monolithToModularMigrationTopic(modules) {
  return modules.filter((m) => m.extracted).length;
}

async function bffDashboardAggregatorLab(fetchers) {
  return bffApiGatewayPatternsTopic(fetchers);
}

function sagaOrchestrationSimulatorLab(steps, input) {
  return steps.reduce((v, s) => s(v), input);
}

function outboxProcessorReplayHandlerLab(outbox) {
  return outbox.filter((m) => m.status === 'pending').map((m) => ({ ...m, status: 'processed' }));
}

function pluggablePolicyEngineLab(policies, ctx) {
  return policies.every((p) => p(ctx));
}

function adrTemplateArchitectureScorecardsLab(items) {
  const pass = items.filter((i) => i.ok).length;
  return { pass, total: items.length };
}

module.exports = {
  solidCleanArchitectureTopic,
  patternCatalogTopic,
  repositoryServiceLayersTopic,
  bffApiGatewayPatternsTopic,
  eventDrivenSagaOutboxTopic,
  monolithToModularMigrationTopic,
  bffDashboardAggregatorLab,
  sagaOrchestrationSimulatorLab,
  outboxProcessorReplayHandlerLab,
  pluggablePolicyEngineLab,
  adrTemplateArchitectureScorecardsLab,
};
