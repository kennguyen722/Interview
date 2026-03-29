# Mock 05: Reporting API Performance and Cache Invalidation Debugging (60 minutes)

## Scenario

Your campaign reporting API is too slow during peak traffic.

A cache was added, but now clients intermittently receive stale totals for up to 15 minutes.

You need to implement a compact reporting service and fix invalidation logic.

## Requirements

Implement:

1. createReportingService(options)
2. upsertMetricPoint(point)
3. getReport(campaignId, startMs, endMs, granularity)
4. invalidateCampaign(campaignId)

## Data

Metric point:

- campaignId string
- bucketStartMs number
- impressions number
- clicks number
- conversions number
- spend number

## Behavior

1. Reporting:
- Return aggregated metrics for [startMs, endMs)
- granularity can be hour or day

2. Cache:
- Cache report results by query key.
- Cache entry has TTL in ms.

3. Invalidation bug to solve:
- After upsertMetricPoint for campaign C, stale cached reports for C must not be returned.
- Campaign-scoped invalidation should not flush other campaigns.

4. Response shape:
- impressions
- clicks
- conversions
- spend
- ctr
- cvr

## Constraints

- Upserts happen frequently.
- Reads are much more frequent than writes.
- Keep implementation in-memory.

## Bonus

- Add stale-while-revalidate mode.
- Add query latency metrics and cache hit ratio.

## What Interviewers Look For

- Correct invalidation strategy and keying.
- Balance between cache hit rate and freshness.
- Practical debugging narrative and safeguards.
