# Real-World Exercises (Phase 2)

## Exercise 1: Event Delegation for Dynamic UI

Scenario:
- You render a dynamic list where items are added/removed frequently.

Task:
- Implement click handling using event delegation.
- Ensure removed elements do not keep stale listeners.

Production checks:
- Memory use remains stable after 1,000 add/remove cycles.
- No duplicate event handler execution.

## Exercise 2: Cancellable Search With Race Protection

Scenario:
- User types quickly and old requests should not overwrite new results.

Task:
- Use `AbortController` to cancel stale requests.
- Ignore out-of-order responses.

Production checks:
- No stale result rendering.
- Proper loading/error states.

## Exercise 3: Idempotent Order Creation Endpoint

Scenario:
- Client retries `POST /orders` due to timeout.

Task:
- Accept `Idempotency-Key` header.
- Return same response for duplicate keys.

Production checks:
- No duplicate order records under repeated submissions.
- Include audit logs for duplicate detection.

## Exercise 4: Retry Policy for External Service

Scenario:
- Third-party dependency has intermittent failures.

Task:
- Add retry with exponential backoff + jitter.
- Stop retrying on non-retriable errors.

Production checks:
- Max retry cap enforced.
- Retry metrics emitted.

## Exercise 5: Request-Level Observability

Scenario:
- Need to debug random failures across async layers.

Task:
- Generate correlation ID per request.
- Include ID in logs across all async operations.

Production checks:
- Can trace a single request end-to-end from logs.
- Error logs include useful context without leaking sensitive data.

## Exercise 6: Rate Limiter With Graceful Degradation

Scenario:
- Traffic spikes threaten service availability.

Task:
- Implement per-client sliding window limit.
- Return explicit retry hints on throttled responses.

Production checks:
- Correctly throttles abusive clients.
- Healthy clients remain unaffected.
