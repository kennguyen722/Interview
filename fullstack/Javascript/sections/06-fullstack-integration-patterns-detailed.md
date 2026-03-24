# Section 6: Full Stack Integration Patterns (Full Detail)

This section focuses on frontend-backend coordination patterns expected in senior/principal full stack interviews.

## Problem 1: Build a BFF Aggregator Endpoint
### Problem statement
Implement a Backend-for-Frontend endpoint that calls profile, orders, and recommendations services with partial-failure tolerance.
### Difficulty
Hard
### Interview expectations
- Parallel fan-out with bounded concurrency.
- Partial response strategy with explicit error envelope.
### Clarifying questions a strong candidate should ask
- Fail whole request or return partial data?
- Timeout budget per dependency?
### Brute-force approach
Call services sequentially and fail on first error.
### Optimized approach
Parallel fan-out with per-call timeout and structured fallback.
### Time and space complexity
Time O(n) service calls with parallel latency near max dependency latency; space O(n).
### Clean JavaScript solution
```javascript
async function bffDashboard({ services, timeoutMs = 800 }) {
  const calls = [
    ['profile', services.profile()],
    ['orders', services.orders()],
    ['recs', services.recommendations()],
  ];

  const out = { data: {}, errors: [] };

  await Promise.all(calls.map(async ([name, p]) => {
    try {
      const value = await Promise.race([
        p,
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeoutMs)),
      ]);
      out.data[name] = value;
    } catch (err) {
      out.data[name] = null;
      out.errors.push({ dependency: name, reason: err.message });
    }
  }));

  return out;
}
```
### Alternative solutions when useful
Use GraphQL federation or gateway resolvers with dependency-level timeouts.
### Edge cases
One dependency hangs indefinitely; two dependencies fail simultaneously.
### Test cases
Validate all-success and partial-failure outputs.
### Follow-up questions
How to add circuit breakers and cache layer per dependency?
### Real-world production relevance
Common in mobile/web product APIs and dashboard composition.

---

## Problem 2: Optimistic UI Update with Rollback
### Problem statement
Design optimistic update flow for a "like" button with rollback if API fails.
### Difficulty
Medium-Hard
### Interview expectations
- Deterministic temporary state and rollback path.
- Avoid double increments on retries.
### Clarifying questions a strong candidate should ask
- Should optimistic state persist across refresh?
- How to handle out-of-order responses?
### Brute-force approach
Wait for API then update UI.
### Optimized approach
Apply optimistic state immediately; reconcile response and rollback on failure.
### Time and space complexity
O(1) per interaction.
### Clean JavaScript solution
```javascript
function applyOptimisticLike(state, postId) {
  const prev = state.posts[postId].likes;
  state.posts[postId].likes = prev + 1;
  return () => {
    state.posts[postId].likes = prev;
  };
}
```
### Alternative solutions when useful
Command log with reducer replay for robust reconciliation.
### Edge cases
User toggles rapidly; duplicate requests due to network retries.
### Test cases
Verify rollback restores exact prior count.
### Follow-up questions
How to merge server truth with optimistic value under eventual consistency?
### Real-world production relevance
Social interactions, cart updates, and collaborative UI actions.

---

## Problem 3: Feature Flag Deterministic Bucketing
### Problem statement
Implement user bucketing for feature rollout using stable hash.
### Difficulty
Medium
### Interview expectations
- Stable assignment for same user and flag.
- Percentage rollout control.
### Clarifying questions a strong candidate should ask
- Sticky per user across environments?
- Namespace collisions between flags?
### Brute-force approach
Random assignment each request.
### Optimized approach
Hash(userId + flagKey) -> bucket 0-99.
### Time and space complexity
O(1).
### Clean JavaScript solution
```javascript
function hashDjb2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i += 1) h = ((h << 5) + h) + str.charCodeAt(i);
  return h >>> 0;
}

function isEnabled(flagKey, userId, rolloutPercent) {
  const bucket = hashDjb2(`${flagKey}:${userId}`) % 100;
  return bucket < rolloutPercent;
}
```
### Alternative solutions when useful
Use centralized flag platform with audit and targeting rules.
### Edge cases
rolloutPercent 0 or 100.
### Test cases
Same user/flag repeatedly returns same result.
### Follow-up questions
How to do cohort-based rollouts and kill switches?
### Real-world production relevance
Safe progressive delivery.

---

## Problem 4: Reconcile Eventual Consistency in UI
### Problem statement
UI receives stale read model while write model accepted mutation. Design consistency UX.
### Difficulty
Hard
### Interview expectations
- Explain read-your-write strategies.
- User-centric consistency communication.
### Clarifying questions a strong candidate should ask
- SLA for read model propagation?
- Is polling or push channel available?
### Brute-force approach
Show stale data without feedback.
### Optimized approach
Mark pending state with reconciliation polling/subscription.
### Time and space complexity
O(1) per state transition.
### Clean JavaScript solution
```javascript
function makePendingEntity(entity) {
  return { ...entity, _sync: { pending: true, startedAt: Date.now() } };
}
```
### Alternative solutions when useful
Outbox + websocket confirmation events.
### Edge cases
Reconciliation timeout; conflicting updates from another session.
### Test cases
Pending marker clears on ack and remains on timeout.
### Follow-up questions
How to avoid duplicate writes while pending?
### Real-world production relevance
CQRS/event-driven systems with async projections.

---

## Problem 5: Contract Drift Detection Between Frontend and Backend
### Problem statement
Design an approach to detect API schema drift early.
### Difficulty
Medium-Hard
### Interview expectations
- Consumer-driven contract tests.
- Versioning and deprecation process.
### Clarifying questions a strong candidate should ask
- OpenAPI/GraphQL source of truth?
- Backward compatibility guarantees?
### Brute-force approach
Manual QA catches breakages late.
### Optimized approach
Automated contract checks in CI.
### Time and space complexity
Depends on test suite size; typically O(test cases).
### Clean JavaScript solution
```javascript
function assertUserContract(payload) {
  if (typeof payload.id !== 'string') throw new Error('id must be string');
  if (typeof payload.email !== 'string') throw new Error('email must be string');
}
```
### Alternative solutions when useful
Pact tests and schema diff gate.
### Edge cases
Nullable field introduced; enum value expansion.
### Test cases
Fail CI on breaking contract.
### Follow-up questions
How to version safely without endpoint explosion?
### Real-world production relevance
Prevents silent production breakage across teams.

---

## Problem 6: Full Stack Trace Correlation
### Problem statement
Propagate correlation IDs from browser to gateway to services.
### Difficulty
Medium
### Interview expectations
- End-to-end traceability across boundaries.
- No PII leakage.
### Clarifying questions a strong candidate should ask
- Existing trace format (W3C traceparent)?
- Sampling policy?
### Brute-force approach
Independent random IDs per layer.
### Optimized approach
Carry incoming trace ID; create only if missing.
### Time and space complexity
O(1).
### Clean JavaScript solution
```javascript
function getTraceId(headers) {
  return headers['x-correlation-id'] || crypto.randomUUID();
}
```
### Alternative solutions when useful
OpenTelemetry SDK with automatic context propagation.
### Edge cases
Malformed headers; missing trace in async jobs.
### Test cases
Ensure same trace ID appears in client, gateway, and service logs.
### Follow-up questions
How to correlate async queue events with request traces?
### Real-world production relevance
Essential for incident debugging and latency analysis.

---

## Section 6 Mock Drill
- Build BFF endpoint with partial fallback.
- Implement optimistic mutation with rollback and stale reconciliation.
- Explain rollout, contract governance, and trace propagation tradeoffs.

## Section 6 Exit Criteria
- You can design integration patterns balancing UX, consistency, and reliability.
- You can explain full stack failure handling with practical tradeoffs.
