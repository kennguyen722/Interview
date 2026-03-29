'use strict';

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function validateCanonical(evt) {
  const stringFields = ['canonicalEventId', 'campaignId', 'userId', 'sourcePartner'];
  for (const field of stringFields) {
    if (typeof evt[field] !== 'string' || evt[field].trim() === '') {
      throw new Error(`${field} must be a non-empty string`);
    }
  }

  if (typeof evt.timestampMs !== 'number' || !Number.isFinite(evt.timestampMs)) {
    throw new Error('timestampMs must be a finite number');
  }
  if (typeof evt.conversionValue !== 'number' || !Number.isFinite(evt.conversionValue)) {
    throw new Error('conversionValue must be a finite number');
  }
}

function normalizePartnerA(event) {
  if (!event || typeof event !== 'object') {
    throw new Error('partner A event must be an object');
  }

  const canonical = {
    canonicalEventId: event.id,
    campaignId: event.campaignId,
    userId: event.userId,
    timestampMs: event.ts,
    conversionValue: event.value,
    sourcePartner: 'A',
  };

  validateCanonical(canonical);
  return canonical;
}

function normalizePartnerB(event) {
  if (!event || typeof event !== 'object') {
    throw new Error('partner B event must be an object');
  }

  const canonical = {
    canonicalEventId: event.event_id,
    campaignId: event.campaign,
    userId: event.external_user,
    timestampMs: event.timestamp_ms,
    conversionValue: event.revenue,
    sourcePartner: 'B',
  };

  validateCanonical(canonical);
  return canonical;
}

function buildBusinessKey(canonical) {
  const bucket10s = Math.floor(canonical.timestampMs / 10_000);
  const roundedValue = roundMoney(canonical.conversionValue);
  return `${canonical.campaignId}|${canonical.userId}|${bucket10s}|${roundedValue}`;
}

function createReconciler(config = {}) {
  const sourcePriority = Array.isArray(config.sourcePriority) ? config.sourcePriority : ['A', 'B'];
  const priorityRank = new Map(sourcePriority.map((source, idx) => [source, idx]));

  const rowsByCampaign = new Map();
  const dedupeIndex = new Map();

  let duplicateSuppressed = 0;
  const conflicts = {
    schemaErrors: 0,
    timestampConflicts: 0,
    valueMismatches: 0,
  };

  function normalize(partnerName, event) {
    if (partnerName === 'A') return normalizePartnerA(event);
    if (partnerName === 'B') return normalizePartnerB(event);
    throw new Error(`unsupported partnerName: ${partnerName}`);
  }

  function ingestPartnerEvent(partnerName, event) {
    let canonical;

    try {
      canonical = normalize(partnerName, event);
    } catch (err) {
      conflicts.schemaErrors += 1;
      return { accepted: false, reason: 'schema_error', error: err.message };
    }

    if (!rowsByCampaign.has(canonical.campaignId)) {
      rowsByCampaign.set(canonical.campaignId, []);
    }

    const key = buildBusinessKey(canonical);
    const existing = dedupeIndex.get(key);

    if (!existing) {
      const stored = {
        ...canonical,
        sourcePartners: [canonical.sourcePartner],
      };
      rowsByCampaign.get(canonical.campaignId).push(stored);
      dedupeIndex.set(key, stored);
      return { accepted: true, deduped: false };
    }

    duplicateSuppressed += 1;

    if (Math.abs(existing.timestampMs - canonical.timestampMs) > 10_000) {
      conflicts.timestampConflicts += 1;
    }
    if (Math.abs(existing.conversionValue - canonical.conversionValue) > 0.01) {
      conflicts.valueMismatches += 1;
    }

    if (!existing.sourcePartners.includes(canonical.sourcePartner)) {
      existing.sourcePartners.push(canonical.sourcePartner);
    }

    const existingRank = priorityRank.has(existing.sourcePartner)
      ? priorityRank.get(existing.sourcePartner)
      : Number.MAX_SAFE_INTEGER;
    const incomingRank = priorityRank.has(canonical.sourcePartner)
      ? priorityRank.get(canonical.sourcePartner)
      : Number.MAX_SAFE_INTEGER;

    if (incomingRank < existingRank) {
      existing.sourcePartner = canonical.sourcePartner;
      existing.canonicalEventId = canonical.canonicalEventId;
      existing.timestampMs = canonical.timestampMs;
      existing.conversionValue = canonical.conversionValue;
    }

    return { accepted: true, deduped: true };
  }

  function getCampaignAttribution(campaignId, startMs, endMs) {
    if (typeof campaignId !== 'string' || campaignId.trim() === '') {
      throw new Error('campaignId must be a non-empty string');
    }
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
      throw new Error('invalid time window');
    }

    const rows = rowsByCampaign.get(campaignId) || [];
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
};
