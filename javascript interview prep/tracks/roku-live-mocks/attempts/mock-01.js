'use strict';

function createAbortError() {
  const err = new Error('Operation aborted');
  err.name = 'AbortError';
  return err;
}

function assertNotAborted(signal) {
  if (signal && signal.aborted) {
    throw createAbortError();
  }
}

function validateEvent(event) {
  if (!event || typeof event !== 'object') {
    throw new Error('event must be an object');
  }

  const requiredStrings = ['eventId', 'eventType', 'campaignId', 'userId'];
  for (const field of requiredStrings) {
    if (typeof event[field] !== 'string' || event[field].trim() === '') {
      throw new Error(`${field} must be a non-empty string`);
    }
  }

  if (!['impression', 'click', 'conversion'].includes(event.eventType)) {
    throw new Error('eventType must be impression, click, or conversion');
  }

  if (typeof event.timestampMs !== 'number' || !Number.isFinite(event.timestampMs)) {
    throw new Error('timestampMs must be a finite number');
  }

  if (event.eventType === 'conversion') {
    if (event.value !== undefined && (typeof event.value !== 'number' || !Number.isFinite(event.value))) {
      throw new Error('conversion value must be a finite number');
    }
  }
}

function createAttributionService() {
  const seenEventIds = new Set();
  const eventsByCampaign = new Map();

  function ingest(event, { signal } = {}) {
    assertNotAborted(signal);
    validateEvent(event);

    if (seenEventIds.has(event.eventId)) {
      return { accepted: false, reason: 'duplicate' };
    }

    seenEventIds.add(event.eventId);

    if (!eventsByCampaign.has(event.campaignId)) {
      eventsByCampaign.set(event.campaignId, []);
    }

    eventsByCampaign.get(event.campaignId).push({
      eventId: event.eventId,
      eventType: event.eventType,
      campaignId: event.campaignId,
      userId: event.userId,
      timestampMs: event.timestampMs,
      value: event.eventType === 'conversion' ? Number(event.value ?? 0) : 0,
    });

    return { accepted: true };
  }

  // Query-time aggregation keeps ingestion simple for interview discussion.
  function getCampaignMetrics(campaignId, startMs, endMs) {
    if (typeof campaignId !== 'string' || campaignId.trim() === '') {
      throw new Error('campaignId must be a non-empty string');
    }
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
      throw new Error('invalid time window');
    }

    const rows = eventsByCampaign.get(campaignId) || [];

    let impressions = 0;
    let clicks = 0;
    let conversions = 0;
    let conversionValue = 0;

    for (const row of rows) {
      if (row.timestampMs < startMs || row.timestampMs >= endMs) {
        continue;
      }

      if (row.eventType === 'impression') impressions += 1;
      if (row.eventType === 'click') clicks += 1;
      if (row.eventType === 'conversion') {
        conversions += 1;
        conversionValue += row.value;
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
};
