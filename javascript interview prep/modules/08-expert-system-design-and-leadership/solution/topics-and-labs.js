function largeScaleSystemDesignTopic(requirements) {
  return { services: requirements.services || 0, regions: requirements.regions || 1 };
}

function capacityCostPerformanceTradeoffTopic(qps, costPerUnit) {
  return { qps, estimatedCost: qps * costPerUnit };
}

function sloErrorBudgetGovernanceTopic(slo, actual) {
  return { met: actual >= slo, burn: Math.max(0, slo - actual) };
}

function multiRegionDisasterRecoveryTopic(regions) {
  return { primary: regions[0], secondary: regions[1] || null };
}

function incidentLeadershipPostmortemTopic(incident) {
  return { commander: incident.commander, actionItems: incident.actions.length };
}

function mentoringStrategyInfluenceTopic(plan) {
  return { mentees: plan.mentees || 0, roadmap: Boolean(plan.roadmap) };
}

function notificationPlatformDesignLab(channels) {
  return channels.map((c) => ({ channel: c, enabled: true }));
}

function incidentCommandSimulationLab(steps) {
  return steps.map((s, i) => ({ step: i + 1, action: s }));
}

function adrRoadmapSetLab(decisions) {
  return decisions.map((d) => ({ title: d, status: 'accepted' }));
}

function reliabilityScorecardLab(services) {
  return services.map((s) => ({ service: s.name, score: s.sloMet ? 1 : 0 }));
}

function principalReadinessRubricLab(criteria) {
  const pass = criteria.filter((c) => c.met).length;
  return { pass, total: criteria.length };
}

module.exports = {
  largeScaleSystemDesignTopic,
  capacityCostPerformanceTradeoffTopic,
  sloErrorBudgetGovernanceTopic,
  multiRegionDisasterRecoveryTopic,
  incidentLeadershipPostmortemTopic,
  mentoringStrategyInfluenceTopic,
  notificationPlatformDesignLab,
  incidentCommandSimulationLab,
  adrRoadmapSetLab,
  reliabilityScorecardLab,
  principalReadinessRubricLab,
};
