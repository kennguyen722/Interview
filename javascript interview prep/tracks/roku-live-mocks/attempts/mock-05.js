'use strict';

function hourBucket(ms) {
  return Math.floor(ms / 3_600_000) * 3_600_000;
}

function dayBucket(ms) {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function normalizeBucket(ms, granularity) {
  if (granularity === 'hour') return hourBucket(ms);
  if (granularity === 'day') return dayBucket(ms);
  throw new Error('granularity must be hour or day');
}

function buildCacheKey(campaignId, startMs, endMs, granularity) {
  return `${campaignId}|${startMs}|${endMs}|${granularity}`;
}

function validatePoint(point) {
  if (!point || typeof point !== 'object') {
    throw new Error('point must be an object');
  }

  if (typeof point.campaignId !== 'string' || point.campaignId.trim() === '') {
    throw new Error('campaignId must be a non-empty string');
  }

  if (typeof point.bucketStartMs !== 'number' || !Number.isFinite(point.bucketStartMs)) {
    throw new Error('bucketStartMs must be a finite number');
  }

  const metrics = ['impressions', 'clicks', 'conversions', 'spend'];
  for (const m of metrics) {
    if (typeof point[m] !== 'number' || !Number.isFinite(point[m]) || point[m] < 0) {
      throw new Error(`${m} must be a non-negative finite number`);
    }
  }
}

function createReportingService(options = {}) {
  const cacheTtlMs = Number.isFinite(options.cacheTtlMs) ? Math.max(0, options.cacheTtlMs) : 60_000;

  const pointsByCampaign = new Map();
  const cache = new Map();
  const cacheKeysByCampaign = new Map();

  function addCampaignCacheKey(campaignId, key) {
    if (!cacheKeysByCampaign.has(campaignId)) {
      cacheKeysByCampaign.set(campaignId, new Set());
    }
    cacheKeysByCampaign.get(campaignId).add(key);
  }

  function invalidateCampaign(campaignId) {
    const keys = cacheKeysByCampaign.get(campaignId);
    if (!keys) return;

    for (const key of keys) {
      cache.delete(key);
    }
    keys.clear();
  }

  function upsertMetricPoint(point) {
    validatePoint(point);

    if (!pointsByCampaign.has(point.campaignId)) {
      pointsByCampaign.set(point.campaignId, new Map());
    }

    const byBucket = pointsByCampaign.get(point.campaignId);
    byBucket.set(point.bucketStartMs, {
      campaignId: point.campaignId,
      bucketStartMs: point.bucketStartMs,
      impressions: point.impressions,
      clicks: point.clicks,
      conversions: point.conversions,
      spend: point.spend,
    });

    // Critical fix: only invalidate cache entries for this campaign.
    invalidateCampaign(point.campaignId);
  }

  function getReport(campaignId, startMs, endMs, granularity) {
    if (typeof campaignId !== 'string' || campaignId.trim() === '') {
      throw new Error('campaignId must be a non-empty string');
    }
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
      throw new Error('invalid range');
    }

    normalizeBucket(startMs, granularity);

    const key = buildCacheKey(campaignId, startMs, endMs, granularity);
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now) {
      return cached.value;
    }

    const points = pointsByCampaign.get(campaignId) || new Map();

    let impressions = 0;
    let clicks = 0;
    let conversions = 0;
    let spend = 0;

    for (const point of points.values()) {
      const bucket = normalizeBucket(point.bucketStartMs, granularity);
      if (bucket < startMs || bucket >= endMs) {
        continue;
      }

      impressions += point.impressions;
      clicks += point.clicks;
      conversions += point.conversions;
      spend += point.spend;
    }

    const value = {
      impressions,
      clicks,
      conversions,
      spend,
      ctr: impressions === 0 ? 0 : clicks / impressions,
      cvr: clicks === 0 ? 0 : conversions / clicks,
    };

    cache.set(key, {
      value,
      expiresAt: now + cacheTtlMs,
      campaignId,
    });
    addCampaignCacheKey(campaignId, key);

    return value;
  }

  return {
    upsertMetricPoint,
    getReport,
    invalidateCampaign,
  };
}

module.exports = {
  createReportingService,
};
