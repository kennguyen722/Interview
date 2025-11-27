## Q1 Answer
Gateway centralizes cross-cutting concerns (auth, rate limit, routing) reducing client coupling.
## Q2 Answer
Trace event flow: confirm payment event emission, ordering guarantees, reconciliation logic.
## Q3 Answer
Async for latency tolerance & decoupling; sync only if immediate consistency required.
## Q4 Answer
Tune failure rate threshold first; aligns with resilience vs premature opening.
## Q5 Answer
Check propagation of trace IDs (HTTP headers) and ensure instrumentation on both sides.
## Q6 Answer
Database-per-service isolates schema evolution; trade-off: distributed transactions complexity.
## Q7 Answer
Sync call chains amplify latency & failure; introduce async messaging or bulk endpoints.
## Q8 Answer
Deploy read cache (e.g., Redis) with TTL & stampede protection for product detail lookups.

