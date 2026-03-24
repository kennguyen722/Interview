# Section E Sample Solutions (Problems 33-40)

## 33. Notification platform at scale
- Ingress API writes notification intents to durable queue.
- Worker pools by channel (email/sms/push) with per-tenant rate limits.
- Retry with exponential backoff; poison messages to DLQ.
- Idempotency key prevents duplicate sends.
- Metrics: delivery rate, retry depth, queue lag, cost per message.

## 34. Real-time collaboration backend
- Use websocket gateway + room-based fanout.
- Store operations log and apply OT/CRDT for conflict resolution.
- Preserve order with per-document sequence numbers.
- Snapshot + compaction to reduce replay time.

## 35. Monolith vs microservices
- Start modular monolith if domain boundaries and team count are still small.
- Move to microservices when bounded contexts, scaling needs, and ownership justify ops complexity.
- Avoid distributed monolith by preventing shared DB and tight synchronous chains.

## 36. Feature flag platform
- Control plane stores flag definitions and rollout rules.
- Data plane SDK evaluates rules locally with periodic refresh.
- Support canary, percentage rollout, and kill-switch.
- Require audit trail and approval workflow for high-risk flags.

## 37. Multi-tenant SaaS isolation
- Use tenant ID in auth token and row-level enforcement.
- Strong isolation for premium/security-sensitive tenants with separate DB/schema.
- Apply per-tenant quotas and circuit limits to avoid noisy neighbors.

## 38. Large upload processing pipeline
- Client uploads chunks with content hash and resumable session ID.
- Orchestrator assembles files, runs malware scan, then emits processing jobs.
- Deduplicate by content hash and enforce immutable object storage versioning.

## 39. Fraud detection event pipeline
- Stream transactions into low-latency broker.
- Rule engine handles immediate blocks; ML model scores asynchronous enrichments.
- Use feedback loop from chargeback outcomes to tune thresholds.

## 40. Global API regional failover
- Use geo DNS and active-active routing where possible.
- Replicate data with explicit consistency level per domain.
- Define failover runbook with health thresholds, traffic shift, and rollback criteria.
