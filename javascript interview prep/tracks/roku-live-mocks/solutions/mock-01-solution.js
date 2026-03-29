'use strict';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function assertNotAborted(signal) {
  if (signal && signal.aborted) {
    const err = new Error('Operation aborted');
    err.name = 'AbortError';
    throw err;
  }
}

function validateEvent(event) {
  if (!event || typeof event !== 'object') {
    throw new ValidationError('event must be an object');
  }

  const requiredStringFields = ['eventId', 'eventType', 'campaignId', 'userId'];
  for (const field of requiredStringFields) {
    if (typeof event[field] !== 'string' || event[field].trim() === '') {
      throw new ValidationError(`${field} must be a non-empty string`);
    }
  }

  const allowed = new Set(['impression', 'click', 'conversion']);
  if (!allowed.has(event.eventType)) {
    throw new ValidationError('eventType must be impression, click, or conversion');
  }

  if (typeof event.timestampMs !== 'number' || !Number.isFinite(event.timestampMs)) {
    throw new ValidationError('timestampMs must be a finite number');
  }

  if (event.eventType === 'conversion') {
    if (event.value !== undefined && (typeof event.value !== 'number' || !Number.isFinite(event.value))) {
      throw new ValidationError('conversion value must be a finite number when provided');
    }
  }
}

function createAttributionService(options = {}) {
  const dedupeTtlMs = Number.isFinite(options.dedupeTtlMs) ? Math.max(0, options.dedupeTtlMs) : null;

  const seenEventIds = new Set();
  const seenAt = new Map();
  const campaignEvents = new Map();

  function evictExpired(nowMs) {
    if (dedupeTtlMs == null) {
      return;
    }

    for (const [eventId, firstSeenMs] of seenAt.entries()) {
      if (nowMs - firstSeenMs >= dedupeTtlMs) {
        seenAt.delete(eventId);
        seenEventIds.delete(eventId);
      }
    }
  }

  function ingest(event, { signal } = {}) {
    assertNotAborted(signal);
    validateEvent(event);

    evictExpired(event.timestampMs);

    if (seenEventIds.has(event.eventId)) {
      return { accepted: false, reason: 'duplicate' };
    }

    seenEventIds.add(event.eventId);
    if (dedupeTtlMs != null) {
      seenAt.set(event.eventId, event.timestampMs);
    }

    if (!campaignEvents.has(event.campaignId)) {
      campaignEvents.set(event.campaignId, []);
    }

    campaignEvents.get(event.campaignId).push({
      eventId: event.eventId,
      eventType: event.eventType,
      campaignId: event.campaignId,
      userId: event.userId,
      timestampMs: event.timestampMs,
      value: event.eventType === 'conversion' ? Number(event.value ?? 0) : 0,
    });

    return { accepted: true };
  }

  function getCampaignMetrics(campaignId, startMs, endMs) {
    if (typeof campaignId !== 'string' || campaignId.trim() === '') {
      throw new ValidationError('campaignId must be a non-empty string');
    }
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
      throw new ValidationError('invalid time window');
    }

    const events = campaignEvents.get(campaignId) || [];
    let impressions = 0;
    let clicks = 0;
    let conversions = 0;
    let conversionValue = 0;

    for (const evt of events) {
      if (evt.timestampMs < startMs || evt.timestampMs >= endMs) {
        continue;
      }

      if (evt.eventType === 'impression') impressions += 1;
      if (evt.eventType === 'click') clicks += 1;
      if (evt.eventType === 'conversion') {
        conversions += 1;
        conversionValue += evt.value;
      }
    }

    return {
      impressions,
      clicks,
      conversions,
      conversionValue,
      ctr: impressions === 0 ? 0 : clicks / impressions,
      cvr: clicks === 0 ? 0 : conversions / clicks,
    };
  }

  return {
    ingest,
    getCampaignMetrics,
  };
}

module.exports = {
  createAttributionService,
  ValidationError,
};
