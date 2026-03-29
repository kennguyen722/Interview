'use strict';

function toUtcDayKey(timestampMs) {
  const d = new Date(timestampMs);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function validateCampaign(campaign) {
  if (!campaign || typeof campaign !== 'object') {
    throw new Error('campaign config must be an object');
  }

  if (typeof campaign.campaignId !== 'string' || campaign.campaignId.trim() === '') {
    throw new Error('campaignId must be a non-empty string');
  }

  const numericFields = ['totalBudget', 'startMs', 'endMs'];
  for (const field of numericFields) {
    if (typeof campaign[field] !== 'number' || !Number.isFinite(campaign[field])) {
      throw new Error(`${field} must be a finite number`);
    }
  }

  if (campaign.endMs <= campaign.startMs) {
    throw new Error('endMs must be greater than startMs');
  }

  if (campaign.dailyCap !== undefined) {
    if (typeof campaign.dailyCap !== 'number' || !Number.isFinite(campaign.dailyCap) || campaign.dailyCap < 0) {
      throw new Error('dailyCap must be a non-negative finite number when provided');
    }
  }
}

function validateSpendEvent(event) {
  if (!event || typeof event !== 'object') {
    throw new Error('spend event must be an object');
  }

  if (typeof event.eventId !== 'string' || event.eventId.trim() === '') {
    throw new Error('eventId must be a non-empty string');
  }
  if (typeof event.campaignId !== 'string' || event.campaignId.trim() === '') {
    throw new Error('campaignId must be a non-empty string');
  }
  if (typeof event.timestampMs !== 'number' || !Number.isFinite(event.timestampMs)) {
    throw new Error('timestampMs must be a finite number');
  }
  if (typeof event.amount !== 'number' || !Number.isFinite(event.amount) || event.amount < 0) {
    throw new Error('amount must be a non-negative finite number');
  }
}

function createPacingEngine(config = {}) {
  const campaigns = Array.isArray(config.campaigns) ? config.campaigns : [];

  const campaignConfigById = new Map();
  const campaignStateById = new Map();

  for (const campaign of campaigns) {
    validateCampaign(campaign);
    campaignConfigById.set(campaign.campaignId, { ...campaign });
    campaignStateById.set(campaign.campaignId, {
      seenEventIds: new Set(),
      spentTotal: 0,
      spentByDay: new Map(),
    });
  }

  function getCampaignOrThrow(campaignId) {
    if (!campaignConfigById.has(campaignId)) {
      throw new Error(`unknown campaignId: ${campaignId}`);
    }

    return {
      campaign: campaignConfigById.get(campaignId),
      state: campaignStateById.get(campaignId),
    };
  }

  function ingestSpend(event) {
    validateSpendEvent(event);
    const { state } = getCampaignOrThrow(event.campaignId);

    if (state.seenEventIds.has(event.eventId)) {
      return { accepted: false, reason: 'duplicate' };
    }

    state.seenEventIds.add(event.eventId);
    state.spentTotal += event.amount;

    const dayKey = toUtcDayKey(event.timestampMs);
    state.spentByDay.set(dayKey, (state.spentByDay.get(dayKey) || 0) + event.amount);

    return { accepted: true };
  }

  // Keep decision rules explicit and ordered to match interview requirements.
  function getPacingDecision(campaignId, nowMs) {
    if (typeof nowMs !== 'number' || !Number.isFinite(nowMs)) {
      throw new Error('nowMs must be a finite number');
    }

    const { campaign, state } = getCampaignOrThrow(campaignId);

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
      const todaySpend = state.spentByDay.get(toUtcDayKey(nowMs)) || 0;
      if (todaySpend > campaign.dailyCap) {
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
};
