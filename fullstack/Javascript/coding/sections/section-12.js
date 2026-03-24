function buildAdr({ title, context, options, decision, consequences }) {
  return {
    title,
    status: 'accepted',
    context,
    options,
    decision,
    consequences,
    reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

function principalReadinessScore(input) {
  const weights = {
    systemOwnership: 0.3,
    reliabilityPosture: 0.25,
    crossTeamInfluence: 0.25,
    mentoringImpact: 0.2,
  };

  return (
    input.systemOwnership * weights.systemOwnership +
    input.reliabilityPosture * weights.reliabilityPosture +
    input.crossTeamInfluence * weights.crossTeamInfluence +
    input.mentoringImpact * weights.mentoringImpact
  );
}

module.exports = { buildAdr, principalReadinessScore };
