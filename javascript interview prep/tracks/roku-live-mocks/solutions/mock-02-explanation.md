# Mock 02 Detailed Explanation

## Problem summary

This mock evaluates budget safety and pacing decisions under real-time spend ingestion. The core challenge is deterministic decision ordering with idempotent writes.

## Core design

1. Campaign configuration index
- Map campaignId to campaign config for fast lookup.
- Validate start/end and budget constraints on startup.

2. Campaign runtime state
- seenEventIds Set for idempotent spend ingestion.
- spentTotal numeric accumulator.
- spentByDay Map keyed by UTC date for daily cap checks.

3. Decision engine
- Evaluate status in a strict rule order:
  - NOT_STARTED
  - ENDED
  - PAUSED by lifetime cap
  - PAUSED by daily cap
  - THROTTLE if more than 10 percent ahead of expectedSpend
  - ACTIVE otherwise

## Why this works

- Idempotency avoids accidental overspend from retries.
- UTC day keying makes daily cap behavior deterministic.
- Strict order prevents contradictory outputs.

## Complexity

- ingestSpend: O(1) expected.
- getPacingDecision: O(1) with incremental aggregates.
- Space: O(events dedupe keys + days touched).

## Edge cases addressed

- Unknown campaignId.
- Invalid timestamps and negative amounts.
- Boundary handling for now before start and at or beyond end.
- Zero or near-zero elapsed phase through clamped ratio.

## Senior-level production notes

- In distributed systems, synchronize spend counters with atomic operations.
- To prevent overspend under delayed telemetry, use reservation budgets and correction loops.
- Alert on pacing drift and daily cap breach rate, not only absolute spend.
