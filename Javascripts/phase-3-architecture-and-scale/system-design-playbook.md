# System Design Playbook (JavaScript Interviews)

Use this structure for architecture interviews involving production-grade systems.

## 1. Clarify Requirements

- Functional: core user flows
- Non-functional: scale targets, latency goals, consistency, compliance
- Constraints: team size, timeline, cloud/on-prem, legacy dependencies

## 2. Estimate Scale

- Requests per second (average + peak)
- Data size growth and retention
- Read/write ratio
- Availability target (for example, 99.9 percent)

## 3. Define Core Architecture

- Entry point: API gateway/load balancer
- Service boundaries by domain capability
- Storage selection by access pattern
- Sync vs async communication paths

## 4. Reliability Strategy

- Timeouts on all external calls
- Retries with bounded policy and jitter
- Circuit breaker to stop cascading failures
- Dead-letter queue for non-processable events
- Idempotency keys for write operations

## 5. Scalability Strategy

- Stateless service instances for horizontal scale
- Caching at correct layers
- Queue-based buffering for burst traffic
- Partitioning/sharding for hot datasets

## 6. Data Consistency Strategy

- Strong consistency for critical state transitions
- Eventual consistency for read models/analytics
- Reconciliation jobs and repair workflows
- Versioned events and backward-compatible contracts

## 7. Observability Strategy

- Structured logs with correlation IDs
- RED metrics: rate, errors, duration
- Tracing across service boundaries
- SLOs and error budget policies

## 8. Security Strategy

- Authentication + authorization boundaries
- Input validation at edges
- Encryption in transit and at rest
- Secret management and rotation

## 9. Evolution Strategy

- Rollout plan with feature flags
- Migration plan from monolith to services (if needed)
- Backward compatibility and deprecation policy
- Incident runbooks and game days

## Interview Closing Template

In your final summary, include:
- Main architecture and why it fits constraints
- Major trade-offs and rejected alternatives
- Reliability and observability plan
- Bottlenecks and concrete next optimization steps
