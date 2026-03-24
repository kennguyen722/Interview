# Section 8: Testing and Debugging at Senior/Principal Level (Full Detail)

## Problem 1: Deterministic Testing for Time-Dependent Retry Logic
### Problem statement
Write tests for retry with backoff without sleeping real time.
### Difficulty
Medium-Hard
### Interview expectations
- Fake timers and deterministic assertions.
### Clarifying questions a strong candidate should ask
- Which test runner and timer controls?
### Brute-force approach
Real sleep in tests.
### Optimized approach
Inject time controls and assert delay schedule explicitly.
### Time and space complexity
O(attempts).
### Clean JavaScript solution
```javascript
async function retryWithInjectedSleep(fn, { maxAttempts = 3, sleep }) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      return await fn({ attempt });
    } catch (err) {
      if (attempt >= maxAttempts) throw err;
      await sleep(2 ** attempt * 10);
    }
  }
}

async function testRetryDeterministically() {
  const delays = [];
  const fakeSleep = async (ms) => { delays.push(ms); };

  let calls = 0;
  const result = await retryWithInjectedSleep(async () => {
    calls += 1;
    if (calls < 3) throw new Error('temporary');
    return 'ok';
  }, { maxAttempts: 4, sleep: fakeSleep });

  if (result !== 'ok') throw new Error('unexpected result');
  if (calls !== 3) throw new Error('unexpected call count');
  if (JSON.stringify(delays) !== JSON.stringify([20, 40])) {
    throw new Error('unexpected backoff schedule');
  }
}
```
Explanation: injected `sleep` avoids wall-clock waiting, keeps tests deterministic, and verifies backoff behavior directly.
### Alternative solutions when useful
Dependency-inject Date.now for deterministic jitter checks.
### Edge cases
Retry stops on non-retryable error.
### Test cases
Attempts count and delay sequence equal expected values.
### Follow-up questions
How to test jitter deterministically?
### Real-world production relevance
Keeps CI fast and stable.

---

## Problem 2: Contract Test Between Frontend and Backend
### Problem statement
Define and test response contract for /api/user.
### Difficulty
Medium
### Interview expectations
- Contract as executable spec.
### Clarifying questions a strong candidate should ask
- Schema source (OpenAPI/Pact)?
### Brute-force approach
Only unit tests on local model.
### Optimized approach
Contract assertions in consumer and provider pipelines.
### Time and space complexity
O(test cases).
### Clean JavaScript solution
```javascript
function assertUserContract(body) {
  if (typeof body.id !== 'string') throw new Error('id invalid');
  if (typeof body.email !== 'string') throw new Error('email invalid');
}
```
Explanation: contract assertions catch wire-format drift before deployment.
### Alternative solutions when useful
OpenAPI schema validation in CI.
### Edge cases
Nullable optional fields.
### Test cases
Break contract and verify CI failure.
### Follow-up questions
How to manage version transitions?
### Real-world production relevance
Prevents production integration incidents.

---

## Problem 3: Root-Cause an Intermittent Race Condition
### Problem statement
Debug duplicate order creation under concurrent requests.
### Difficulty
Hard
### Interview expectations
- Repro strategy and instrumentation.
### Clarifying questions a strong candidate should ask
- Idempotency key presence?
- DB uniqueness constraints?
### Brute-force approach
Add random delays hoping to reproduce.
### Optimized approach
Enforce idempotency + uniqueness constraint under transaction.
### Time and space complexity
Depends on contention and retry policy.
### Clean JavaScript solution
```javascript
async function createOrderSafely(db, payload, idempotencyKey) {
  return db.transaction(async (tx) => {
    const existing = await tx.oneOrNone(
      'SELECT id, status FROM orders WHERE idempotency_key=$1',
      [idempotencyKey]
    );
    if (existing) return existing;

    return tx.one(
      `INSERT INTO orders(idempotency_key, external_id, status)
       VALUES($1, $2, 'CREATED')
       ON CONFLICT (external_id) DO UPDATE SET external_id = EXCLUDED.external_id
       RETURNING id, status`,
      [idempotencyKey, payload.externalId]
    );
  });
}
```
Explanation: this combines a replay-safe key with DB-level uniqueness for race-proof deduplication.
### Alternative solutions when useful
Serializable transaction with bounded retry.
### Edge cases
At-least-once message replay.
### Test cases
Concurrent requests produce exactly one order.
### Follow-up questions
How to prove fix in canary rollout?
### Real-world production relevance
Frequent cause of financial/ordering defects.

---

## Problem 4: Memory Leak Hunt in Node Process
### Problem statement
Find leak from listener accumulation and unbounded cache.
### Difficulty
Hard
### Interview expectations
- Heap snapshot interpretation.
### Clarifying questions a strong candidate should ask
- Leak growth pattern and trigger path?
### Brute-force approach
Restart process periodically.
### Optimized approach
Bound caches and ensure listener lifecycle cleanup.
### Time and space complexity
O(1) cache operations.
### Clean JavaScript solution
```javascript
class BoundedCache {
  constructor(max = 1000) {
    this.max = max;
    this.map = new Map();
  }

  set(k, v) {
    if (this.map.has(k)) this.map.delete(k);
    this.map.set(k, v);
    if (this.map.size > this.max) {
      this.map.delete(this.map.keys().next().value);
    }
  }
}
```
Explanation: bounded structures prevent unbounded retention, which is a common leak class in long-lived Node services.
### Alternative solutions when useful
TTL caches with periodic pruning.
### Edge cases
Large objects retained by closure.
### Test cases
Heap growth stabilizes under steady load.
### Follow-up questions
Which alerts detect leak early?
### Real-world production relevance
Protects uptime and prevents OOM crashes.

---

## Problem 5: Production Debugging Playbook
### Problem statement
Define a stepwise debugging protocol for sev-1 outage.
### Difficulty
Principal-level
### Interview expectations
- Structured incident handling, not ad hoc guesses.
### Clarifying questions a strong candidate should ask
- Current blast radius and user impact?
- Rollback options available?
### Brute-force approach
Random code changes in production.
### Optimized approach
Build timeline from correlated logs and classify fault domain.
### Time and space complexity
O(n log n) by log count for sort.
### Clean JavaScript solution
```javascript
function buildIncidentTimeline(logs, traceId) {
  return logs
    .filter((entry) => entry.traceId === traceId)
    .sort((a, b) => a.ts - b.ts)
    .map((entry) => `${entry.ts} ${entry.service} ${entry.level} ${entry.msg}`);
}

function classifyLikelyFault(timeline) {
  const hasDbTimeout = timeline.some((line) => line.includes('DB_TIMEOUT'));
  const hasCircuitOpen = timeline.some((line) => line.includes('CIRCUIT_OPEN'));
  if (hasDbTimeout) return 'database saturation';
  if (hasCircuitOpen) return 'downstream dependency outage';
  return 'application-layer regression';
}
```
Explanation: deterministic trace timelines reduce noise and speed root-cause isolation.
### Alternative solutions when useful
Feature-flag rollback and traffic shedding.
### Edge cases
Observability gaps.
### Test cases
Run game-day incident rehearsal.
### Follow-up questions
How to convert postmortem into engineering backlog?
### Real-world production relevance
Core principal expectation.

---

## Problem 6: Flaky Test Reduction Strategy
### Problem statement
Design a plan to reduce flaky tests across repos.
### Difficulty
Principal-level
### Interview expectations
- Classification and ownership model.
### Clarifying questions a strong candidate should ask
- Top flaky suites and failure signatures?
### Brute-force approach
Rerun failed tests until green.
### Optimized approach
Quantify flake rate and quarantine above threshold.
### Time and space complexity
O(n) by history rows.
### Clean JavaScript solution
```javascript
function summarizeFlakyTests(historyRows) {
  const totals = new Map();
  for (const row of historyRows) {
    const key = row.testName;
    const entry = totals.get(key) || { runs: 0, fails: 0 };
    entry.runs += 1;
    entry.fails += row.status === 'fail' ? 1 : 0;
    totals.set(key, entry);
  }

  return Array.from(totals.entries())
    .map(([testName, s]) => ({
      testName,
      flakeRate: s.runs === 0 ? 0 : s.fails / s.runs,
      runs: s.runs,
    }))
    .filter((x) => x.runs >= 20 && x.flakeRate >= 0.05)
    .sort((a, b) => b.flakeRate - a.flakeRate);
}
```
Explanation: a thresholded metric keeps the process objective and prevents endless noise-driven reruns.
### Alternative solutions when useful
Statistical flake detector over CI history.
### Edge cases
Non-deterministic external dependencies.
### Test cases
Flake rate trend drops week-over-week.
### Follow-up questions
How to enforce ownership for flaky suites?
### Real-world production relevance
Improves delivery confidence and velocity.

---

## Section 8 Exit Criteria
- You can design deterministic testing and run structured production debugging.
