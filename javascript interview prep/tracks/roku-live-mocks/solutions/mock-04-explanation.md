# Mock 04 Detailed Explanation

## Problem summary

Two partners provide similar conversion data with different schemas and eventual consistency behavior. You need canonical normalization and business-level dedupe so campaign reports remain trustworthy.

## Core design

1. Partner adapters
- Convert Partner A and Partner B payloads into a canonical event shape.
- Validate canonical fields once, regardless of source.

2. Business-key dedupe
- Key uses campaignId, userId, 10-second timestamp bucket, and rounded conversion value.
- This suppresses near-duplicate partner reports for the same user action.

3. Canonical record merge policy
- Keep one canonical record.
- Track all sourcePartners that reported the same business event.
- Optional source priority chooses winning canonical payload when conflicting details appear.

4. Conflict accounting
- schemaErrors increments when payloads fail normalization.
- timestampConflicts and valueMismatches track reconciliation quality drift.

5. Query and reporting
- Campaign window query aggregates conversions, value, and unique user count.
- Return duplicate suppression and conflicts for transparency.

## Why this works

- Adapter pattern isolates source schema differences.
- Business-level dedupe prevents over-attribution.
- Conflict counters make data quality visible instead of silent.

## Complexity

- Ingest: O(1) expected with map lookups.
- Query: O(k) over campaign records in memory.
- Space: O(n) canonical rows plus dedupe index.

## Senior-level production notes

- Add replay-safe event log with deterministic reducer for backfills.
- Add partner scorecards and quarantine workflows for low-quality feeds.
- Expose reconciliation lag and suppression ratio metrics per partner.
