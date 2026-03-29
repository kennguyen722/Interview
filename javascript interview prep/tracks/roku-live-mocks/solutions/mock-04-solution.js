'use strict';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function buildBusinessKey(canonical) {
  const bucket10s = Math.floor(canonical.timestampMs / 10_000);
  const roundedValue = roundMoney(canonical.conversionValue);
  return `${canonical.campaignId}|${canonical.userId}|${bucket10s}|${roundedValue}`;
}

function normalizeA(event) {
  if (!event || typeof event !== 'object') {
    throw new ValidationError('partner A event must be an object');
  }

  const mapped = {
    canonicalEventId: event.id,
    campaignId: event.campaignId,
    userId: event.userId,
    timestampMs: event.ts,
    conversionValue: event.value,
    sourcePartner: 'A',
  };

  validateCanonical(mapped);
  return mapped;
}

function normalizeB(event) {
  if (!event || typeof event !== 'object') {
    throw new ValidationError('partner B event must be an object');
  }

  const mapped = {
    canonicalEventId: event.event_id,
    campaignId: event.campaign,
    userId: event.external_user,
    timestampMs: event.timestamp_ms,
    conversionValue: event.revenue,
    sourcePartner: 'B',
  };

  validateCanonical(mapped);
  return mapped;
}

function validateCanonical(evt) {
  const stringFields = ['canonicalEventId', 'campaignId', 'userId', 'sourcePartner'];
  for (const field of stringFields) {
    if (typeof evt[field] !== 'string' || evt[field].trim() === '') {
      throw new ValidationError(`${field} must be a non-empty string`);
    }
  }

  if (typeof evt.timestampMs !== 'number' || !Number.isFinite(evt.timestampMs)) {
    throw new ValidationError('timestampMs must be a finite number');
  }
  if (typeof evt.conversionValue !== 'number' || !Number.isFinite(evt.conversionValue)) {
    throw new ValidationError('conversionValue must be a finite number');
  }
}

function createReconciler(config = {}) {
  const sourcePriority = config.sourcePriority || ['A', 'B'];
  const priorityRank = new Map(sourcePriority.map((p, idx) => [p, idx]));

  const recordsByCampaign = new Map();
  const dedupeIndex = new Map();
  const conflicts = {
    schemaErrors: 0,
    timestampConflicts: 0,
    valueMismatches: 0,
  };
  let duplicateSuppressed = 0;

  function normalize(partnerName, event) {
    if (partnerName === 'A') return normalizeA(event);
    if (partnerName === 'B') return normalizeB(event);
    throw new ValidationError(`unsupported partnerName: ${partnerName}`);
  }

  function ingestPartnerEvent(partnerName, event) {
    let canonical;
    try {
      canonical = normalize(partnerName, event);
    } catch (err) {
      conflicts.schemaErrors += 1;
      return { accepted: false, reason: 'schema_error', error: err.message };
    }

    const key = buildBusinessKey(canonical);
    const existingRef = dedupeIndex.get(key);

    if (!recordsByCampaign.has(canonical.campaignId)) {
      recordsByCampaign.set(canonical.campaignId, []);
    }
    const campaignRecords = recordsByCampaign.get(canonical.campaignId);

    if (!existingRef) {
      const stored = {
        ...canonical,
        sourcePartners: [canonical.sourcePartner],
      };
      campaignRecords.push(stored);
      dedupeIndex.set(key, stored);
      return { accepted: true, deduped: false };
    }

    duplicateSuppressed += 1;

    if (Math.abs(existingRef.timestampMs - canonical.timestampMs) > 10_000) {
      conflicts.timestampConflicts += 1;
    }
    if (Math.abs(existingRef.conversionValue - canonical.conversionValue) > 0.01) {
      conflicts.valueMismatches += 1;
    }

    if (!existingRef.sourcePartners.includes(canonical.sourcePartner)) {
      existingRef.sourcePartners.push(canonical.sourcePartner);
    }

    const existingRank = priorityRank.has(existingRef.sourcePartner)
      ? priorityRank.get(existingRef.sourcePartner)
      : Number.MAX_SAFE_INTEGER;
    const incomingRank = priorityRank.has(canonical.sourcePartner)
      ? priorityRank.get(canonical.sourcePartner)
      : Number.MAX_SAFE_INTEGER;

    if (incomingRank < existingRank) {
      existingRef.sourcePartner = canonical.sourcePartner;
      existingRef.canonicalEventId = canonical.canonicalEventId;
      existingRef.timestampMs = canonical.timestampMs;
      existingRef.conversionValue = canonical.conversionValue;
    }

    return { accepted: true, deduped: true };
  }

  function getCampaignAttribution(campaignId, startMs, endMs) {
    if (typeof campaignId !== 'string' || campaignId.trim() === '') {
      throw new ValidationError('campaignId must be a non-empty string');
    }
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
      throw new ValidationError('invalid time window');
    }

    const rows = recordsByCampaign.get(campaignId) || [];
    let conversions = 0;
    let conversionValue = 0;
    const userSet = new Set();

    for (const row of rows) {
      if (row.timestampMs < startMs || row.timestampMs >= endMs) {
        continue;
      }
      conversions += 1;
      conversionValue += row.conversionValue;
      userSet.add(row.userId);
    }

    return {
      conversions,
      conversionValue,
      uniqueUsers: userSet.size,
      duplicateSuppressed,
      conflicts: {
        schemaErrors: conflicts.schemaErrors,
        timestampConflicts: conflicts.timestampConflicts,
        valueMismatches: conflicts.valueMismatches,
      },
    };
  }

  return {
    ingestPartnerEvent,
    getCampaignAttribution,
  };
}

module.exports = {
  createReconciler,
  ValidationError,
};
