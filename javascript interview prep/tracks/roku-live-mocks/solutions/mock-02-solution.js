'use strict';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function toUtcDayKey(timestampMs) {
  const d = new Date(timestampMs);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function validateCampaign(campaign) {
  if (!campaign || typeof campaign !== 'object') {
    throw new ValidationError('campaign config must be an object');
  }
  const requiredStrings = ['campaignId'];
  for (const field of requiredStrings) {
    if (typeof campaign[field] !== 'string' || campaign[field].trim() === '') {
      throw new ValidationError(`${field} must be a non-empty string`);
    }
  }

  const numericFields = ['totalBudget', 'startMs', 'endMs'];
  for (const field of numericFields) {
    if (typeof campaign[field] !== 'number' || !Number.isFinite(campaign[field])) {
      throw new ValidationError(`${field} must be a finite number`);
    }
  }

  if (campaign.endMs <= campaign.startMs) {
    throw new ValidationError('endMs must be greater than startMs');
  }

  if (campaign.totalBudget < 0) {
    throw new ValidationError('totalBudget must be non-negative');
  }

  if (campaign.dailyCap !== undefined) {
    if (typeof campaign.dailyCap !== 'number' || !Number.isFinite(campaign.dailyCap) || campaign.dailyCap < 0) {
      throw new ValidationError('dailyCap must be a non-negative finite number when provided');
    }
  }
}

function validateSpendEvent(event) {
  if (!event || typeof event !== 'object') {
    throw new ValidationError('spend event must be an object');
  }

  if (typeof event.eventId !== 'string' || event.eventId.trim() === '') {
    throw new ValidationError('eventId must be a non-empty string');
  }
  if (typeof event.campaignId !== 'string' || event.campaignId.trim() === '') {
    throw new ValidationError('campaignId must be a non-empty string');
  }
  if (typeof event.timestampMs !== 'number' || !Number.isFinite(event.timestampMs)) {
    throw new ValidationError('timestampMs must be a finite number');
  }
  if (typeof event.amount !== 'number' || !Number.isFinite(event.amount) || event.amount < 0) {
    throw new ValidationError('amount must be a non-negative finite number');
  }
}

function createPacingEngine(config = {}) {
  const campaignList = Array.isArray(config.campaigns) ? config.campaigns : [];

  const campaignConfigById = new Map();
  const campaignState = new Map();

  for (const campaign of campaignList) {
    validateCampaign(campaign);
    campaignConfigById.set(campaign.campaignId, { ...campaign });
    campaignState.set(campaign.campaignId, {
      seenEventIds: new Set(),
      spentTotal: 0,
      spentByDay: new Map(),
    });
  }

  function assertCampaign(campaignId) {
    if (!campaignConfigById.has(campaignId)) {
      throw new ValidationError(`unknown campaignId: ${campaignId}`);
    }
    return {
      config: campaignConfigById.get(campaignId),
      state: campaignState.get(campaignId),
    };
  }

  function ingestSpend(event) {
    validateSpendEvent(event);
    const { state } = assertCampaign(event.campaignId);

    if (state.seenEventIds.has(event.eventId)) {
      return { accepted: false, reason: 'duplicate' };
    }

    state.seenEventIds.add(event.eventId);
    state.spentTotal += event.amount;

    const dayKey = toUtcDayKey(event.timestampMs);
    state.spentByDay.set(dayKey, (state.spentByDay.get(dayKey) || 0) + event.amount);

    return { accepted: true };
  }

  function getPacingDecision(campaignId, nowMs) {
    if (!Number.isFinite(nowMs)) {
      throw new ValidationError('nowMs must be a finite number');
    }

    const { config: campaign, state } = assertCampaign(campaignId);

    if (nowMs < campaign.startMs) {
      return {
        status: 'NOT_STARTED',
        spentTotal: state.spentTotal,
        expectedSpend: 0,
        pacingDelta: state.spentTotal,
        reason: 'campaign has not started',
      };
    }

    if (nowMs >= campaign.endMs) {
      return {
        status: 'ENDED',
        spentTotal: state.spentTotal,
        expectedSpend: campaign.totalBudget,
        pacingDelta: state.spentTotal - campaign.totalBudget,
        reason: 'campaign has ended',
      };
    }

    const elapsedRatio = Math.max(
      0,
      Math.min(1, (nowMs - campaign.startMs) / (campaign.endMs - campaign.startMs))
    );
    const expectedSpend = campaign.totalBudget * elapsedRatio;
    const pacingDelta = state.spentTotal - expectedSpend;

    if (state.spentTotal >= campaign.totalBudget) {
      return {
        status: 'PAUSED',
        spentTotal: state.spentTotal,
        expectedSpend,
        pacingDelta,
        reason: 'lifetime budget exhausted',
      };
    }

    if (campaign.dailyCap !== undefined) {
      const dayKey = toUtcDayKey(nowMs);
      const spentToday = state.spentByDay.get(dayKey) || 0;
      if (spentToday > campaign.dailyCap) {
        return {
          status: 'PAUSED',
          spentTotal: state.spentTotal,
          expectedSpend,
          pacingDelta,
          reason: 'daily cap exceeded',
        };
      }
    }

    if (state.spentTotal > expectedSpend * 1.1) {
      return {
        status: 'THROTTLE',
        spentTotal: state.spentTotal,
        expectedSpend,
        pacingDelta,
        reason: 'ahead of pacing threshold',
      };
    }

    return {
      status: 'ACTIVE',
      spentTotal: state.spentTotal,
      expectedSpend,
      pacingDelta,
      reason: 'within pacing guardrails',
    };
  }

  return {
    ingestSpend,
    getPacingDecision,
  };
}

module.exports = {
  createPacingEngine,
  ValidationError,
};
