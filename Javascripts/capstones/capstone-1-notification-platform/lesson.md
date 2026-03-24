# Capstone 1: Event-Driven Notification Platform

## Problem Statement

Build a production-grade notification service that dispatches messages across multiple channels (email, SMS, push) with the following requirements:

## Requirements

- **Idempotent requests**: Each notification has a client-provided ID; duplicate sends must be silently ignored
- **Priority queue**: `priority: 10` messages are dispatched before `priority: 1`
- **Per-tenant rate limiting**: Each tenant is allowed N notifications/second (token bucket or sliding window)
- **Retry with exponential backoff + jitter**: Failed sends retry up to `maxRetries` times
- **Dead-letter queue**: Notifications that exhaust retries move to a DLQ for manual inspection
- **Delivery tracking**: Each notification tracks status: `queued → delivered | failed`
- **Multi-channel routing**: Route by `channel` field; validate channel exists before queueing

## Technical Constraints

- No external dependencies (Node.js builtins only)
- All channels are in-memory mocks for testability — real adapters would be plugged in
- Must be runnable with `node solution/index.js`

## Interview Focus Areas

1. **Priority queue implementation** — can you implement a max-heap from scratch?
2. **Idempotency** — what data structure ensures cheap O(1) dedup?
3. **Token bucket vs sliding window rate limiting** — explain the tradeoff
4. **Retry strategy** — why add jitter? What is the thundering herd problem?
5. **DLQ design** — what information should every DLQ entry contain?
6. **Backpressure** — what should happen if the queue grows unboundedly?

## Architecture Notes

```
Client sends → NotificationService.send()
  → idempotency check (Set<id>)
  → enqueue to PriorityQueue
  → async processQueue()
    → rate limiter check (per tenant)
    → channel dispatch with retry + backoff
    → on success: update delivery log
    → on failure: push to DLQ
```

## Deliverables

See `solution/index.js` for the full reference implementation.
Your implementation goes in `starter/index.js`.
