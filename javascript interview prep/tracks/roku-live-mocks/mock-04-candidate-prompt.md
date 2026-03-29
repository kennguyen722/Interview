# Mock 04: Multi-Partner Attribution Reconciliation (60 minutes)

## Scenario

You ingest attribution events from two measurement partners.

Each partner reports conversions for the same campaign, but event schemas differ and delivery is eventually consistent.

You need to reconcile records into a canonical campaign report while preventing double-counting.

## Requirements

Implement an in-memory reconciliation module with:

1. createReconciler(config)
2. ingestPartnerEvent(partnerName, event)
3. getCampaignAttribution(campaignId, startMs, endMs)

## Input Event Shapes

Partner A:

- id string
- campaignId string
- userId string
- ts number
- value number

Partner B:

- event_id string
- campaign string
- external_user string
- timestamp_ms number
- revenue number

## Canonical Event

Normalize to:

- canonicalEventId
- campaignId
- userId
- timestampMs
- conversionValue
- sourcePartner

## Reconciliation Rules

1. Normalize both partner schemas.
2. Deduplicate using business key:
- same campaignId + userId + timestamp bucket (10s) + similar value (absolute diff <= 0.01)

3. Keep one canonical record and track source partners list.
4. Maintain conflict counters:
- schema errors
- timestamp conflicts
- value mismatches

5. Query API returns:
- conversions
- conversionValue
- uniqueUsers
- duplicateSuppressed
- conflicts object

Window semantics: [startMs, endMs)

## Bonus

- Add source-of-truth priority (A over B) when conflicts occur.
- Add per-partner quality score: accepted/received.

## What Interviewers Look For

- Practical normalization and reconciliation strategy.
- Clear dedupe key and conflict policy.
- Correct metrics and explainable tradeoffs.
