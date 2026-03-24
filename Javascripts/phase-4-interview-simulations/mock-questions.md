# Mock Interview Questions (JavaScript, Real-World)

## Coding Round

1. Implement a concurrency-limited task runner that retries failed tasks with jitter.
2. Design an in-memory event bus with replay support for late subscribers.
3. Build a sliding-window rate limiter with tenant-level quotas.
4. Implement idempotent request handling for payment submission endpoint.
5. Build a circuit breaker wrapper for unstable third-party API calls.

## Debugging Round

1. CPU spikes every 15 minutes in Node.js service. How would you isolate root cause?
2. UI freezes during heavy input typing. How do you profile and fix it?
3. Message queue consumer duplicates order processing. How do you fix data corruption?
4. p95 latency regressed after adding cache. How do you diagnose and rollback safely?

## System Design Round

1. Design an event-driven notification system for 10M daily messages.
2. Design a scalable URL shortener with analytics and abuse detection.
3. Design distributed order processing with reliability guarantees.
4. Design API gateway strategy for multi-region microservices.

## Behavioral Engineering Round

1. Describe a production incident you handled and what changed afterward.
2. Explain a trade-off where you picked reliability over delivery speed.
3. Tell me about a design decision you reversed after observing metrics.
4. How do you decide whether to split a service or keep a modular monolith?
