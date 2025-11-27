## Q1 Answer
Cache lowers read latency & backend load for frequently accessed data.
## Q2 Answer
Inspect write path components: queue, DB commit latency, replication.
## Q3 Answer
QPS = users * req/min / 60 = 10000*5/60 ≈ 833 QPS.
## Q4 Answer
Eventual consistency for feed reduces write coordination; trade-off: temporary staleness.
## Q5 Answer
Partition by user ID for consistent hashing; aids horizontal scaling & isolation.
## Q6 Answer
Add synthetic checks (DB connectivity, downstream dependency latency).
## Q7 Answer
Over-sharding increases ops overhead; consolidate shards or apply auto-scaling thresholds.
## Q8 Answer
Introduce denormalized materialized view to reduce multi-read joins.

