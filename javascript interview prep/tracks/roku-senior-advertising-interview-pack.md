# Roku Senior Software Engineer (Advertising) Interview Pack

This guide is tailored for a Senior Software Engineer interview loop focused on Roku Advertising engineering.

## Role Signals to Prepare For

From Roku Advertising public pages and resources, likely engineering themes include:

- Campaign setup and optimization workflows in a self-serve product (Ads Manager).
- Audience segmentation and custom audiences.
- Interactive ad experiences (Action Ads) and conversion-focused formats.
- Measurement and attribution with multiple external partners.
- High-volume event ingestion, dashboarding, and reporting with near real-time expectations.
- Verified identity, privacy constraints, and cross-device/cross-channel measurement concerns.

## Most Likely Interview Rounds

1. Coding Round (JavaScript/Node): data structures, async pipelines, edge-case handling.
2. Practical Backend Round: API design, idempotency, pagination, retries, backpressure, observability.
3. Debugging Round: stale metrics, duplicate events, race conditions, timeout cascades.
4. System Design Round: ad delivery + measurement platform design and tradeoffs.
5. Behavioral/Leadership Round: ownership, cross-team alignment, incident handling, mentoring.

## High-Probability Coding Topics

- Event deduplication by idempotency key with TTL and replay handling.
- Campaign pacing and budget allocation over time windows.
- Cursor-based pagination with stable ordering.
- Rate limiting and tenant quotas.
- Retry with jitter, timeout budgets, cancellation with AbortController.
- Stream processing and backpressure-safe writing.
- Joining impression/click/conversion streams under late or missing data.
- Data validation and schema evolution safety.

## 20 Practice Questions (Role-Targeted)

1. Build an ad impression deduper that tolerates retries and out-of-order delivery.
2. Implement an hourly pacing algorithm to avoid campaign underspend/overspend.
3. Design a cursor pagination API for campaign reports with deterministic ordering.
4. Implement a token bucket limiter for advertiser and workspace scopes.
5. Build an abortable fan-out call that queries 3 partner services with per-hop timeout.
6. Parse JSONL telemetry via Node streams and write batches safely under backpressure.
7. Detect and mitigate duplicate conversion attribution across two providers.
8. Design an API for creating audience segments with include/exclude precedence.
9. Implement a rolling 95th percentile latency calculator for endpoint SLO tracking.
10. Build idempotent POST semantics for campaign creation with conflict detection.
11. Debug why dashboard totals lag raw ingestion by 10 minutes intermittently.
12. Debug why one tenant receives 429 spikes after a deploy.
13. Design a resilient async worker with retry, poison queue, and DLQ re-drive.
14. Build a safe config loader using property descriptors and immutable defaults.
15. Implement cancelable workflows where user edits should stop in-flight optimization jobs.
16. Design schema/version handling for telemetry events from multiple SDK versions.
17. Design cross-service tracing strategy for request correlation.
18. Explain CommonJS vs ESM migration strategy for a mixed Node codebase.
19. Propose safeguards for privacy and PII minimization in reporting pipelines.
20. Create an incident response plan for delayed conversion reporting.

## System Design Prompts

1. Design a campaign management service for create/update/pause/resume with auditability.
2. Design near-real-time reporting for impressions, clicks, conversions, spend, and ROAS.
3. Design a measurement ingestion platform integrating multiple external partners.
4. Design a budget pacing and optimization service with controllable aggressiveness.
5. Design an ad telemetry pipeline with exactly-once effect semantics at business level.

For each prompt, cover:

- APIs and data contracts.
- Data model and indexing.
- Throughput assumptions and capacity envelope.
- Consistency model and replay strategy.
- Failure modes and mitigations.
- SLOs, alerts, and dashboards.
- Security/privacy controls.

## Behavioral Stories to Prepare (Senior)

- A production incident you led end-to-end and what changed permanently after.
- A cross-team disagreement on architecture and how you aligned stakeholders.
- A time you traded speed for reliability (or vice versa) with explicit risk management.
- A mentoring example where you improved team quality bar.
- A roadmap decision you made with incomplete data.

Use STAR format with measurable outcomes.

## 10-Day Focus Plan

1. Day 1: Review core ad-tech workflows and prepare domain vocabulary.
2. Day 2: Implement dedupe + idempotency + TTL exercise.
3. Day 3: Implement pacing + rate limiting exercises.
4. Day 4: Implement stream/backpressure + abortable fan-out exercise.
5. Day 5: Reporting API design + cursor pagination coding.
6. Day 6: Debugging drills (stale dashboard, duplicate attribution, timeout cascade).
7. Day 7: System design prompt 1 and 2 with diagrams.
8. Day 8: System design prompt 3 and 4 with tradeoff matrix.
9. Day 9: Behavioral stories rehearsal + leadership Q&A.
10. Day 10: Full mock loop (coding + design + behavioral) with strict timing.

## Use Existing Repo Assets

- Run role-specific mocks:
  - `npm run mock:roku`
  - `npm run mock:run -- --level roku --seed 42`
- Run a full 60-minute live coding simulation:
  - `tracks/roku-live-mocks/mock-01-candidate-prompt.md`
  - `tracks/roku-live-mocks/mock-01-interviewer-rubric.md`
  - `tracks/roku-live-mocks/mock-01-strong-answer-outline.md`
  - `tracks/roku-live-mocks/mock-02-candidate-prompt.md`
  - `tracks/roku-live-mocks/mock-02-interviewer-rubric.md`
  - `tracks/roku-live-mocks/mock-02-strong-answer-outline.md`
  - `tracks/roku-live-mocks/mock-03-candidate-prompt.md`
  - `tracks/roku-live-mocks/mock-03-interviewer-rubric.md`
  - `tracks/roku-live-mocks/mock-03-strong-answer-outline.md`
  - `tracks/roku-live-mocks/mock-04-candidate-prompt.md`
  - `tracks/roku-live-mocks/mock-04-interviewer-rubric.md`
  - `tracks/roku-live-mocks/mock-04-strong-answer-outline.md`
  - `tracks/roku-live-mocks/mock-05-candidate-prompt.md`
  - `tracks/roku-live-mocks/mock-05-interviewer-rubric.md`
  - `tracks/roku-live-mocks/mock-05-strong-answer-outline.md`
- Run a full interview day simulation:
  - `tracks/roku-live-mocks/roku-full-loop-timed-script.md`
- Reuse these modules for targeted practice:
  - Module 03 for cancellation, retries, concurrency.
  - Module 05 for streams, API reliability, idempotency.
  - Module 07 for security/performance and incident readiness.

## Interview-Day Checklist

- Confirm assumptions before coding.
- Prioritize correctness and edge cases over premature optimization.
- Explain operational safeguards (timeouts, retries, observability, rollout).
- Highlight tradeoffs clearly and propose a pragmatic next iteration.
- Close each answer with how success would be measured.
