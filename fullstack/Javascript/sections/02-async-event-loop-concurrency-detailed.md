# Section 2: Async JavaScript, Event Loop, and Concurrency (Full Detail)

This section focuses on interview-critical async reasoning and production-safe concurrency design in modern JavaScript (ES2023+) and Node.js.

## Problem 1: Predict Event Loop Output (Microtasks vs Macrotasks)

### Problem statement
Given this code, predict exact output order and explain each step:

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve()
  .then(() => {
    console.log('C');
    queueMicrotask(() => console.log('D'));
  })
  .then(() => console.log('E'));
console.log('F');
```

### Difficulty
Medium

### Interview expectations
- Clear model: call stack, microtask queue, macrotask queue.
- No guessing; deterministic explanation.
- Correct handling of chained Promise callbacks.

### Clarifying questions strong candidates should ask
- Browser or Node.js runtime?
- Any `process.nextTick` involved?
- Are there additional I/O callbacks in the tick?

### Brute-force approach
- Simulate line by line without queue abstractions.
- Often fails in chained microtask scenarios.

### Optimized approach
- Use queue-driven model:
1. Execute sync stack.
2. Drain all microtasks.
3. Run next macrotask.

### Time and space complexity
- Time: O(k) where k is number of scheduled callbacks.
- Space: O(k) queue storage.

### Clean JavaScript solution
Expected order:
1. A
2. F
3. C
4. E
5. D
6. B

Why:
- A/F are synchronous.
- First Promise callback logs C, then enqueues D as microtask.
- Chained `.then(() => E)` is also microtask and is queued before D in this flow.
- Timer callback B (macrotask) runs after microtasks drain.

### Alternative solutions when useful
- In Node.js, add `process.nextTick` to show higher-priority nextTick queue behavior.

### Edge cases
- Recursive microtask scheduling causing starvation.
- Large sync block delaying all async callbacks.

### Test cases
```javascript
// Interview extension: add process.nextTick in Node and ask for new ordering.
```

### Follow-up questions
- Why can `setTimeout(fn, 0)` still execute late?
- How do long microtask chains impact UI responsiveness?

### Real-world production relevance
- Critical for debugging race conditions in React state updates and Node request handlers.

---

## Problem 2: Implement Promise.all (Spec-Accurate Behavior)

### Problem statement
Implement `promiseAll(iterable)` that:
- resolves when all promises resolve
- preserves input order
- rejects immediately on first rejection

### Difficulty
Medium-Hard

### Interview expectations
- Correct short-circuit rejection.
- Ordered results independent of completion timing.
- Handle plain values and empty input.

### Clarifying questions strong candidates should ask
- Should non-promise values be supported?
- Should iterable errors reject immediately?
- Is thenable assimilation required?

### Brute-force approach
- `await` sequentially in loop.
- Preserves order but loses parallelism and fail-fast semantics.

### Optimized approach
- Wrap each item with `Promise.resolve`.
- Track remaining count and write by index.

### Time and space complexity
- Time: O(n) orchestration + promise runtimes.
- Space: O(n) results array.

### Clean JavaScript solution
```javascript
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const n = items.length;
    if (n === 0) {
      resolve([]);
      return;
    }

    const results = new Array(n);
    let remaining = n;
    let settled = false;

    items.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          if (settled) return;
          results[index] = value;
          remaining -= 1;
          if (remaining === 0) {
            settled = true;
            resolve(results);
          }
        })
        .catch((err) => {
          if (settled) return;
          settled = true;
          reject(err);
        });
    });
  });
}
```

### Alternative solutions when useful
- Implement `allSettled` variant for partial success use cases.

### Edge cases
- Empty iterable.
- Mixed values and promises.
- One rejection after many pending resolutions.

### Test cases
```javascript
import assert from 'node:assert/strict';

const out = await promiseAll([Promise.resolve(1), 2, Promise.resolve(3)]);
assert.deepEqual(out, [1, 2, 3]);

await assert.rejects(
  () => promiseAll([Promise.resolve(1), Promise.reject(new Error('x'))]),
  /x/
);
```

### Follow-up questions
- Implement `Promise.any` with AggregateError.
- How would you cancel still-running tasks after first rejection?

### Real-world production relevance
- Batch API fan-out, startup initialization gates, and parallel data loading.

---

## Problem 3: Bounded Concurrency Runner with Ordered Results

### Problem statement
Implement `runPool(tasks, concurrency)`:
- `tasks`: array of async functions
- max `concurrency` in-flight
- preserve output order

### Difficulty
Hard

### Interview expectations
- Correct synchronization for shared cursor.
- No over-scheduling beyond concurrency limit.
- Predictable behavior under failures.

### Clarifying questions strong candidates should ask
- Fail fast on first error or collect all errors?
- Should continue running already-started tasks after failure?
- Is cancellation required?

### Brute-force approach
- `Promise.all(tasks.map(t => t()))`.
- No concurrency control.

### Optimized approach
- Worker pattern with shared next index.
- `Math.min(concurrency, tasks.length)` worker count.

### Time and space complexity
- Time: O(n) scheduling overhead + task runtimes.
- Space: O(n) results.

### Clean JavaScript solution
```javascript
async function runPool(tasks, concurrency = 4) {
  if (!Array.isArray(tasks)) throw new TypeError('tasks must be an array');
  if (!Number.isInteger(concurrency) || concurrency <= 0) {
    throw new RangeError('concurrency must be a positive integer');
  }

  const results = new Array(tasks.length);
  let cursor = 0;

  async function worker() {
    while (true) {
      const i = cursor;
      cursor += 1;
      if (i >= tasks.length) return;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => worker()
  );

  await Promise.all(workers);
  return results;
}
```

### Alternative solutions when useful
- Semaphore abstraction to improve composability.
- Async queue with backpressure and dynamic prioritization.

### Edge cases
- Zero tasks.
- `concurrency > tasks.length`.
- Synchronous throw in task function.

### Test cases
```javascript
import assert from 'node:assert/strict';

let inFlight = 0;
let maxInFlight = 0;
const tasks = Array.from({ length: 8 }, (_, i) => async () => {
  inFlight += 1;
  maxInFlight = Math.max(maxInFlight, inFlight);
  await new Promise((r) => setTimeout(r, 10));
  inFlight -= 1;
  return i;
});

const res = await runPool(tasks, 3);
assert.deepEqual(res, [0,1,2,3,4,5,6,7]);
assert.equal(maxInFlight <= 3, true);
```

### Follow-up questions
- Add retries only for retryable errors.
- Add `AbortSignal` cancellation support.

### Real-world production relevance
- Controlled fan-out for downstream APIs, ETL workers, and distributed job execution.

---

## Problem 4: Cancelable Fetch with Timeout and AbortController

### Problem statement
Implement `fetchWithTimeout(url, options)` that:
- aborts request when timeout is exceeded
- supports caller-provided AbortSignal composition
- cleans up timer reliably

### Difficulty
Medium-Hard

### Interview expectations
- Proper use of `AbortController`.
- No timer/resource leaks.
- Explicit timeout error semantics.

### Clarifying questions strong candidates should ask
- Should external cancellation and timeout share same signal?
- Should timeout be retried automatically?
- How to classify aborted vs network errors?

### Brute-force approach
- Wrap fetch with `Promise.race([fetch, sleep+reject])`.
- Leaves in-flight request alive unless aborted.

### Optimized approach
- Use `AbortController` to actually cancel request.
- Bridge external signal into internal controller.

### Time and space complexity
- Time: O(1) orchestration + network latency.
- Space: O(1).

### Clean JavaScript solution
```javascript
async function fetchWithTimeout(url, {
  timeoutMs = 3000,
  signal,
  ...rest
} = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onAbort, { once: true });
  }

  try {
    const response = await fetch(url, { ...rest, signal: controller.signal });
    return response;
  } catch (err) {
    if (controller.signal.aborted) {
      const timeoutError = new Error('Request aborted or timed out');
      timeoutError.code = 'ABORTED_OR_TIMEOUT';
      throw timeoutError;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
    if (signal) signal.removeEventListener('abort', onAbort);
  }
}
```

### Alternative solutions when useful
- `AbortSignal.timeout(timeoutMs)` where available.
- Unified cancellation utility for all async operations.

### Edge cases
- Caller signal already aborted.
- Timeout exactly when response resolves.
- Multiple cancellations.

### Test cases
```javascript
import assert from 'node:assert/strict';

await assert.rejects(
  () => fetchWithTimeout('https://10.255.255.1', { timeoutMs: 10 }),
  /aborted|timed out|ABORTED_OR_TIMEOUT/i
);
```

### Follow-up questions
- Add retry with idempotency awareness.
- Emit structured metrics on timeout vs abort vs network failures.

### Real-world production relevance
- Prevents hung requests from consuming sockets and threadpool capacity.

---

## Problem 5: Retry with Exponential Backoff and Jitter

### Problem statement
Implement `retry(operation, options)` with:
- max attempts
- exponential backoff
- jitter
- retry predicate

### Difficulty
Hard

### Interview expectations
- Avoid retry storms.
- Distinguish transient vs permanent errors.
- Cleanly expose policy knobs.

### Clarifying questions strong candidates should ask
- Is operation idempotent?
- Per-attempt timeout vs total timeout budget?
- Should jitter be full, equal, or decorrelated?

### Brute-force approach
- Fixed-delay retries for all errors.
- Bad under incidents and for non-retryable failures.

### Optimized approach
- Retry only transient errors.
- Exponential delay with bounded jitter.

### Time and space complexity
- Time: O(a) attempts plus delays.
- Space: O(1).

### Clean JavaScript solution
```javascript
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry(operation, {
  maxAttempts = 4,
  baseDelayMs = 100,
  maxDelayMs = 5000,
  isRetryable = (err) => Boolean(err && err.retryable),
} = {}) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      return await operation({ attempt });
    } catch (err) {
      const isLast = attempt >= maxAttempts;
      if (isLast || !isRetryable(err)) {
        throw err;
      }

      const exp = Math.min(maxDelayMs, baseDelayMs * (2 ** (attempt - 1)));
      const jitter = Math.floor(Math.random() * Math.max(1, Math.floor(exp * 0.25)));
      await delay(exp + jitter);
    }
  }

  throw new Error('unreachable');
}
```

### Alternative solutions when useful
- Decorrelated jitter for smoother contention behavior.
- Token-bucket capped retries across service instances.

### Edge cases
- maxAttempts=1 (no retry).
- Retryable predicate throws.
- Non-idempotent operations retried accidentally.

### Test cases
```javascript
import assert from 'node:assert/strict';

let count = 0;
const result = await retry(async () => {
  count += 1;
  if (count < 3) {
    const err = new Error('transient');
    err.retryable = true;
    throw err;
  }
  return 'ok';
});

assert.equal(result, 'ok');
assert.equal(count, 3);
```

### Follow-up questions
- Integrate retry metrics and log correlation IDs.
- Combine with circuit breaker and bulkhead patterns.

### Real-world production relevance
- Core resilience primitive for database, queue, and third-party API communication.

---

## Problem 6: Deduplicate In-Flight Requests (Request Coalescing)

### Problem statement
Implement a utility that ensures concurrent requests for the same key share one in-flight promise.

### Difficulty
Medium-Hard

### Interview expectations
- Correct map lifecycle cleanup on resolve/reject.
- Avoid memory leaks from stale in-flight entries.

### Clarifying questions strong candidates should ask
- Should cache store completed results or only in-flight?
- TTL behavior?
- Should errors be coalesced too?

### Brute-force approach
- Fire every request independently.
- Causes duplicate load and thundering herd.

### Optimized approach
- Maintain `Map<key, Promise>` for active operations.
- Remove entry in `finally`.

### Time and space complexity
- Time: O(1) map operations.
- Space: O(m) active distinct keys.

### Clean JavaScript solution
```javascript
function createRequestCoalescer(loader) {
  const inFlight = new Map();

  return async function load(key) {
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }

    const p = (async () => loader(key))()
      .finally(() => {
        inFlight.delete(key);
      });

    inFlight.set(key, p);
    return p;
  };
}
```

### Alternative solutions when useful
- Add short-lived result cache (stale-while-revalidate).
- Batch keys via DataLoader-style scheduler.

### Edge cases
- Loader throws synchronously.
- Key serialization collisions.
- Massive key cardinality causing memory pressure.

### Test cases
```javascript
import assert from 'node:assert/strict';

let calls = 0;
const loader = async (k) => {
  calls += 1;
  await new Promise((r) => setTimeout(r, 20));
  return `v:${k}`;
};

const load = createRequestCoalescer(loader);
const [a, b, c] = await Promise.all([load('x'), load('x'), load('x')]);
assert.equal(a, 'v:x');
assert.equal(b, 'v:x');
assert.equal(c, 'v:x');
assert.equal(calls, 1);
```

### Follow-up questions
- Add key-scoped concurrency limits.
- Integrate with distributed cache/lock for multi-instance deployments.

### Real-world production relevance
- Reduces duplicate DB/API calls in high-traffic APIs and SSR data loaders.

---

## Problem 7: Implement a Minimal Circuit Breaker

### Problem statement
Implement `createCircuitBreaker(execute, options)` with states:
- CLOSED: normal calls
- OPEN: fail fast
- HALF_OPEN: allow limited probe calls

### Difficulty
Hard

### Interview expectations
- Correct state transitions.
- Recovery behavior after cool-down period.
- Safe handling under repeated failures.

### Clarifying questions strong candidates should ask
- Failure threshold count vs rate?
- One probe at HALF_OPEN or many?
- Metrics expectations for monitoring?

### Brute-force approach
- Retry forever on failure.
- Amplifies outages and increases latency.

### Optimized approach
- Fail fast while dependency is unhealthy.
- Probe after timeout to restore service cautiously.

### Time and space complexity
- Time: O(1) per call.
- Space: O(1).

### Clean JavaScript solution
```javascript
function createCircuitBreaker(execute, {
  failureThreshold = 3,
  resetTimeoutMs = 5000,
} = {}) {
  let state = 'CLOSED';
  let failures = 0;
  let nextTryAt = 0;

  return async function run(...args) {
    const now = Date.now();

    if (state === 'OPEN') {
      if (now < nextTryAt) {
        const err = new Error('Circuit is open');
        err.code = 'CIRCUIT_OPEN';
        throw err;
      }
      state = 'HALF_OPEN';
    }

    try {
      const out = await execute(...args);
      failures = 0;
      state = 'CLOSED';
      return out;
    } catch (err) {
      failures += 1;
      if (state === 'HALF_OPEN' || failures >= failureThreshold) {
        state = 'OPEN';
        nextTryAt = Date.now() + resetTimeoutMs;
      }
      throw err;
    }
  };
}
```

### Alternative solutions when useful
- Sliding window error rate (percentage) instead of fixed failure count.
- Bucketed metrics + adaptive thresholds.

### Edge cases
- Dependency flaps rapidly.
- Clock skew in distributed environments.
- Concurrent callers in HALF_OPEN.

### Test cases
```javascript
import assert from 'node:assert/strict';

let fail = true;
const breaker = createCircuitBreaker(async () => {
  if (fail) throw new Error('down');
  return 'ok';
}, { failureThreshold: 2, resetTimeoutMs: 50 });

await assert.rejects(() => breaker(), /down/);
await assert.rejects(() => breaker(), /down/);
await assert.rejects(() => breaker(), /Circuit is open/);

await new Promise((r) => setTimeout(r, 60));
fail = false;
assert.equal(await breaker(), 'ok');
```

### Follow-up questions
- Compose with retry and timeout in correct order.
- Emit state transition events for dashboards/alerts.

### Real-world production relevance
- Prevents cascading failures during downstream outages.

---

## Problem 8: Async Queue with Backpressure and Graceful Shutdown

### Problem statement
Design an async queue processor:
- bounded queue capacity
- bounded worker concurrency
- producer backpressure when queue full
- graceful shutdown waiting for in-flight jobs

### Difficulty
Hard (Principal-leaning)

### Interview expectations
- Understand throughput vs latency tradeoffs.
- Prevent unbounded memory growth.
- Clean shutdown semantics.

### Clarifying questions strong candidates should ask
- Reject on full queue or block producer?
- At-least-once or at-most-once delivery semantics?
- Retry and dead-letter policy requirements?

### Brute-force approach
- Infinite queue + unrestricted workers.
- Eventually crashes or overloads dependencies.

### Optimized approach
- Capacity limit + worker pool + enqueue rejection/await policy.
- Drain in-flight tasks before shutdown completion.

### Time and space complexity
- Time: O(1) enqueue/dequeue.
- Space: O(capacity + concurrency).

### Clean JavaScript solution
```javascript
class AsyncQueue {
  constructor({ capacity = 100, concurrency = 4, handler }) {
    if (!handler || typeof handler !== 'function') {
      throw new TypeError('handler is required');
    }
    this.capacity = capacity;
    this.concurrency = concurrency;
    this.handler = handler;
    this.queue = [];
    this.inFlight = 0;
    this.closed = false;
    this.waiters = [];
  }

  async enqueue(item) {
    if (this.closed) throw new Error('queue is closed');
    if (this.queue.length >= this.capacity) {
      throw new Error('queue is full');
    }

    this.queue.push(item);
    this._pump();
  }

  _pump() {
    while (this.inFlight < this.concurrency && this.queue.length > 0) {
      const item = this.queue.shift();
      this.inFlight += 1;

      Promise.resolve()
        .then(() => this.handler(item))
        .finally(() => {
          this.inFlight -= 1;
          this._pump();
          this._resolveWaitersIfIdle();
        });
    }
  }

  _resolveWaitersIfIdle() {
    if (this.closed && this.inFlight === 0 && this.queue.length === 0) {
      while (this.waiters.length > 0) {
        const resolve = this.waiters.shift();
        resolve();
      }
    }
  }

  async closeAndDrain() {
    this.closed = true;
    this._resolveWaitersIfIdle();
    if (this.inFlight === 0 && this.queue.length === 0) return;

    await new Promise((resolve) => {
      this.waiters.push(resolve);
    });
  }
}
```

### Alternative solutions when useful
- Blocking enqueue with awaitable capacity semaphore.
- DLQ and retry policies per job type.

### Edge cases
- Handler failures and poison jobs.
- Close called multiple times.
- Burst producer traffic exceeding capacity.

### Test cases
```javascript
import assert from 'node:assert/strict';

const processed = [];
const q = new AsyncQueue({
  capacity: 3,
  concurrency: 2,
  handler: async (x) => {
    await new Promise((r) => setTimeout(r, 5));
    processed.push(x);
  },
});

await q.enqueue(1);
await q.enqueue(2);
await q.enqueue(3);
await assert.rejects(() => q.enqueue(4), /queue is full/);
await q.closeAndDrain();
assert.deepEqual(processed.sort((a, b) => a - b), [1, 2, 3]);
```

### Follow-up questions
- Add visibility timeout and requeue for failed jobs.
- How would you evolve this into distributed queue processing?

### Real-world production relevance
- Backbone for notification processors, ingestion pipelines, and high-throughput worker services.

---

## Section 2 Mock Interview Drill

1. Solve Problem 3 in 20 minutes, then add fail-fast and all-settled modes.
2. Explain Problem 7 state transitions on a timeline and when alerts should fire.
3. Refactor Problem 8 to support retry + DLQ without breaking shutdown guarantees.
4. Compare request coalescing vs result caching for p95 latency improvements.

## Section 2 Exit Criteria

- You can reason about event loop ordering without execution.
- You can write bounded-concurrency code that is correct and testable.
- You can discuss retry/circuit-breaker tradeoffs with idempotency awareness.
- You can design backpressure controls to protect service stability.
