# Mock 01: Idempotent Event Attribution Service (60 minutes)

## Scenario

You are building part of an advertising measurement pipeline.

Your service receives events from multiple partners:

- `impression`
- `click`
- `conversion`

Due to retries and network instability, duplicate events are common. Some events arrive out of order.

You need to ingest events and expose an API for campaign-level metrics.

## Requirements

Implement a small in-memory service in JavaScript (Node.js) with these behaviors.

### Data Model

Each incoming event has:

- `eventId` (string)
- `eventType` (`impression` | `click` | `conversion`)
- `campaignId` (string)
- `userId` (string)
- `timestampMs` (number)
- `value` (number, only for `conversion`, optional otherwise)

### API Surface

Implement these functions:

1. `createAttributionService(options)`
2. `ingest(event)`
3. `getCampaignMetrics(campaignId, startMs, endMs)`

You may choose class or closure style.

### Functional Rules

1. Idempotency:
- Duplicate events with same `eventId` must not be counted twice.

2. Validation:
- Reject invalid event objects with clear error messages.

3. Windowed metrics:
- `getCampaignMetrics` returns totals in `[startMs, endMs)`.
- Output shape:
  - `impressions`
  - `clicks`
  - `conversions`
  - `conversionValue`
  - `ctr` = `clicks / impressions` (0 if impressions=0)
  - `cvr` = `conversions / clicks` (0 if clicks=0)

4. Out-of-order events:
- Must still be counted correctly if timestamp is in window.

5. Performance constraint:
- Ingestion and query should be reasonably efficient for up to 1 million events in memory.

## Bonus (if time)

1. Add optional dedupe TTL behavior:
- Event IDs expire from dedupe index after N ms.

2. Add `AbortSignal` support:
- `ingest(event, { signal })` should throw quickly if aborted.

3. Add small test harness using Node's built-in test runner.

## Example

Input events:

- `e1 impression c1 u1 1000`
- `e2 click c1 u1 1010`
- `e3 conversion c1 u1 1020 value=20`
- `e3 conversion c1 u1 1020 value=20` (duplicate)

Query: `getCampaignMetrics('c1', 1000, 2000)`

Expected:

- impressions: 1
- clicks: 1
- conversions: 1
- conversionValue: 20
- ctr: 1
- cvr: 1

## What Interviewers Look For

- Correctness under duplicate and out-of-order input.
- Clear validation and edge-case handling.
- Thoughtful data structures and complexity explanation.
- Production-minded comments on observability and failure modes.
