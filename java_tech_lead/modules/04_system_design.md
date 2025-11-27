Module 4 — System Design

Q1: How do you design a scalable URL shortener?
Answer: API for create/resolve; unique ID generation (base62, DB sequence, or hash+collision handling); use caching (CDN/edge) for resolves; partitioning and replication for storage; consider consistency and analytics; rate limiting and abuse protection.

Example: `examples/Module04Q1.java` is a tiny in-memory shortener prototype.

Q2: How to design for high availability and failover?
Answer: Use redundancy, health checks, leader election where needed, automated failover, state replication, and graceful degradation; design for idempotency and retries.

Example: `examples/Module04Q2.java` demonstrates retry/backoff pattern.

Q3: How do you approach trade-offs between consistency and availability?
Answer: Use CAP reasoning; identify operations that require strong consistency and those that can be eventually consistent; pick appropriate data stores and patterns (leader-based ordering, CRDTs, etc.).

Example: `examples/Module04Q3.java` sketches a simple eventual-consistency reconciliation.
