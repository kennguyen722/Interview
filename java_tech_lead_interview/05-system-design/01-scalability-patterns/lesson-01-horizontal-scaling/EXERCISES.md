# Exercises: Horizontal Scaling

## Instructions
Work through these progressively. Use `code/starter/` for initial scaffolding if provided. Document assumptions. Provide complexity & capacity estimates where requested.

---

## Exercise 1: Stateless Refactor
You are given a sample controller storing user sessions in a local `Map`. Refactor to make the service horizontally scalable.

Requirements:
- Replace in-memory sessions with external store abstraction
- Ensure idempotent login endpoint
- Provide retry-safe token issuance
- Add simple rate limiting (in-memory ok for single node; explain multi-node path)

Deliverables:
1. Refactored controller (Java)
2. Explanation of stateless guarantees
3. Failure mode analysis (cache outage, store latency)

---

## Exercise 2: Consistent Hash Ring Implementation
Implement a consistent hash ring supporting:
- Node addition/removal
- Virtual nodes
- Lookup distribution test demonstrating >90% key stability when adding a node

Metrics to show:
- Distribution variance across nodes (standard deviation)
- Percentage of keys remapped after node insertion

Deliverables:
1. `ConsistentHashRing` class
2. Test harness producing metrics
3. Commentary on production considerations (hash choice, data migration)

---

## Exercise 3: Shard Expansion Plan
Current deployment: 4 physical shards, each with 32 virtual shards. Traffic projection requires moving to 6 physical shards.

Create a migration plan including:
- Steps for rebalancing (phase by phase)
- Dual-write strategy vs cutover
- Rollback criteria & monitoring signals
- Estimation of time window given 2 TB total data, average re-shard throughput 80 MB/s per shard pair

Output format: Markdown runbook section.

---

## Exercise 4: Hot Key Mitigation
A celebrity user (ID `999999`) generates 15% of read traffic. Queries saturate its shard. Design mitigation strategies.

Propose:
- 3 short-term mitigation tactics
- 2 long-term architectural changes
- Estimate expected improvement from each (qualitative or simple percentages)

Deliverable: Table summarizing approaches and impact.

---

## Exercise 5: Capacity Modeling
Given:
- Each app instance handles 450 req/s at 65% CPU
- Target peak: 9,000 req/s with 30% headroom
- Average response time baseline: 120ms P50

Tasks:
1. Calculate required instances (show formula)
2. Determine scale-out trigger thresholds
3. Provide autoscaling policy (cooldown, step size)

Deliverable: Calculations + policy YAML snippet.

---

## Exercise 6 (Advanced): Cross-Shard Saga Design
Design a saga to update user profile (Shard A) and billing record (Shard B) atomically from client perspective.

Include:
- Steps (Create, Confirm, Compensate)
- Idempotency keys & retry behavior
- Monitoring & dead letter handling
- Failure scenarios & compensation examples

Deliverable: Sequence diagram (ASCII) + explanation.

---

## Exercise 7 (Advanced): Predictive Scaling
Draft logic to pre-scale based on moving average + standard deviation of request rate.

Implement pseudocode:
- Sliding window (5 minutes, 1-min buckets)
- Trigger if forecasted next 10-min peak > current capacity * 0.8

Deliverable: Pseudocode + sample input/output.

---

## Bonus Exercise: Multi-Region Strategy
Design active-active deployment across 3 regions with latency-based routing.

Cover:
- Data geo-partition strategy
- Failover sequence
- Consistency implications
- DNS / Anycast routing notes

---

## Submission Checklist
- [ ] All code compiles
- [ ] Metrics collected where required
- [ ] Clear assumptions documented
- [ ] Trade-offs explained
- [ ] Edge cases considered

## Reflection Questions
1. Where did horizontal scaling introduce the most complexity?
2. Which abstractions reduced coupling to infrastructure?
3. What are the next bottlenecks after sharding?

---

*© Java Tech Lead Interview Course - MIT License*