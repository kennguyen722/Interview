'use strict';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function dayBucket(ms) {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function hourBucket(ms) {
  return Math.floor(ms / 3_600_000) * 3_600_000;
}

function normalizeBucket(ms, granularity) {
  if (granularity === 'hour') return hourBucket(ms);
  if (granularity === 'day') return dayBucket(ms);
  throw new ValidationError('granularity must be hour or day');
}

function buildKey(campaignId, startMs, endMs, granularity) {
  return `${campaignId}|${startMs}|${endMs}|${granularity}`;
}

function createReportingService(options = {}) {
  const cacheTtlMs = Number.isFinite(options.cacheTtlMs) ? Math.max(0, options.cacheTtlMs) : 60_000;

  const pointsByCampaign = new Map();

  const cache = new Map();
  const cacheKeysByCampaign = new Map();

  function assertPoint(point) {
    if (!point || typeof point !== 'object') {
      throw new ValidationError('point must be an object');
    }

    if (typeof point.campaignId !== 'string' || point.campaignId.trim() === '') {
      throw new ValidationError('campaignId must be a non-empty string');
    }

    if (typeof point.bucketStartMs !== 'number' || !Number.isFinite(point.bucketStartMs)) {
      throw new ValidationError('bucketStartMs must be a finite number');
    }

    const metricFields = ['impressions', 'clicks', 'conversions', 'spend'];
    for (const field of metricFields) {
      if (typeof point[field] !== 'number' || !Number.isFinite(point[field]) || point[field] < 0) {
        throw new ValidationError(`${field} must be a non-negative finite number`);
      }
    }
  }

  function addCacheKey(campaignId, key) {
    if (!cacheKeysByCampaign.has(campaignId)) {
      cacheKeysByCampaign.set(campaignId, new Set());
    }
    cacheKeysByCampaign.get(campaignId).add(key);
  }

  function upsertMetricPoint(point) {
    assertPoint(point);

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

    invalidateCampaign(point.campaignId);
  }

  function getReport(campaignId, startMs, endMs, granularity) {
    if (typeof campaignId !== 'string' || campaignId.trim() === '') {
      throw new ValidationError('campaignId must be a non-empty string');
    }
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
      throw new ValidationError('invalid range');
    }

    normalizeBucket(startMs, granularity);

    const now = Date.now();
    const cacheKey = buildKey(campaignId, startMs, endMs, granularity);
    const cached = cache.get(cacheKey);

    if (cached && cached.expiresAt > now) {
      return cached.value;
    }

    const byBucket = pointsByCampaign.get(campaignId) || new Map();

    let impressions = 0;
    let clicks = 0;
    let conversions = 0;
    let spend = 0;

    for (const point of byBucket.values()) {
      const normalizedBucket = normalizeBucket(point.bucketStartMs, granularity);
      if (normalizedBucket < startMs || normalizedBucket >= endMs) {
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

    cache.set(cacheKey, {
      value,
      expiresAt: now + cacheTtlMs,
      campaignId,
    });
    addCacheKey(campaignId, cacheKey);

    return value;
  }

  function invalidateCampaign(campaignId) {
    const keys = cacheKeysByCampaign.get(campaignId);
    if (!keys) return;

    for (const key of keys) {
      cache.delete(key);
    }
    keys.clear();
  }

  return {
    upsertMetricPoint,
    getReport,
    invalidateCampaign,
  };
}

module.exports = {
  createReportingService,
  ValidationError,
};
