function buildNotificationJob({ userId, channels, templateId, idempotencyKey }) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userId,
    channels,
    templateId,
    idempotencyKey,
    attempts: 0,
    status: 'queued',
  };
}

function nextRetryDelayMs(attempt) {
  return Math.min(60000, 1000 * (2 ** attempt));
}

function estimateQps({ dau, requestsPerUserPerDay, activeHoursPerDay = 12 }) {
  const activeSeconds = activeHoursPerDay * 3600;
  return (dau * requestsPerUserPerDay) / activeSeconds;
}

function estimateStorageGbPerDay({ eventsPerDay, avgEventBytes }) {
  return (eventsPerDay * avgEventBytes) / (1024 ** 3);
}

module.exports = {
  buildNotificationJob,
  nextRetryDelayMs,
  estimateQps,
  estimateStorageGbPerDay,
};
