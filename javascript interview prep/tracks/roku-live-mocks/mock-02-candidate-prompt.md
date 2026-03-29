# Mock 02: Campaign Pacing and Budget Guardrails (60 minutes)

## Scenario

You are implementing core pacing logic for a self-serve ads platform.

A campaign has:

- total budget in dollars
- start and end timestamps
- optional daily cap

The service receives spend events throughout the day from multiple delivery systems.

You need to decide, at any point in time, whether the campaign can keep spending or should throttle/pause.

## Requirements

Implement a JavaScript module with these functions:

1. createPacingEngine(config)
2. ingestSpend(event)
3. getPacingDecision(campaignId, nowMs)

## Data

Campaign config:

- campaignId string
- totalBudget number
- startMs number
- endMs number
- dailyCap number optional

Spend event:

- eventId string
- campaignId string
- timestampMs number
- amount number

## Functional Rules

1. Idempotency
- duplicate spend eventId must not double count.

2. Lifetime budget
- cumulative spend must not exceed totalBudget.

3. Daily budget guardrail
- if dailyCap is set, spend for UTC day must not exceed it.

4. Pacing target
- compute expected spend by now as:
  - elapsedRatio = clamp((nowMs - startMs) / (endMs - startMs), 0..1)
  - expectedSpend = totalBudget * elapsedRatio

5. Decision output shape

Return:

- status: ACTIVE | THROTTLE | PAUSED | ENDED | NOT_STARTED
- spentTotal
- expectedSpend
- pacingDelta (spentTotal - expectedSpend)
- reason

Decision rules:

- if now < start => NOT_STARTED
- if now >= end => ENDED
- if spentTotal >= totalBudget => PAUSED
- if dailyCap exceeded => PAUSED
- if spentTotal is more than 10 percent above expectedSpend => THROTTLE
- otherwise ACTIVE

## Bonus

- add per-tenant quota support
- add explain mode with decision trace
- add tests with boundary timestamps

## What Interviewers Look For

- Correct boundary handling for time windows.
- Clean handling of idempotency and budget math.
- Practical explanation of how to avoid overspend under delayed events.
