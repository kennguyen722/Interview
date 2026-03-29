function estimateQps({ dau, requestsPerUserPerDay, activeHoursPerDay = 12 }) {
  const activeSeconds = activeHoursPerDay * 3600;
  return (dau * requestsPerUserPerDay) / activeSeconds;
}

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

module.exports = { estimateQps, buildAdr };
