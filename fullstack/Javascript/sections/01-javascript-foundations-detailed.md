# Section 1: JavaScript Foundations for Senior/Principal Interviews (Full Detail)

This section targets deep JavaScript reasoning used in real interviews and production systems.

## Problem 1: Implement Function.prototype.bind (with partial arguments)

### Problem statement
Implement a function `myBind(fn, thisArg, ...presetArgs)` that behaves like native `bind` for normal usage:
- returns a new function
- sets `this` to `thisArg`
- prepends partial arguments before call-time arguments

### Difficulty
Medium (Senior baseline)

### Interview expectations
- Understand `this` binding mechanics and function application.
- Handle partial args cleanly.
- Explain behavior clearly and avoid mutating input.

### Clarifying questions strong candidates should ask
- Should constructor behavior (`new boundFn`) be supported?
- Do we need to preserve prototype chain and function `length`?
- Is strict mode assumed?

### Brute-force approach
- Return a wrapper function calling `fn.apply(thisArg, [...presetArgs, ...callArgs])`.
- Good for many practical interview cases.

### Optimized approach
- Same asymptotic complexity as brute-force.
- Improve readability and avoid repeated array allocations where possible.

### Complexity
- Time: O(p + c) per invocation, where `p` is preset arg count, `c` call-time arg count.
- Space: O(p + c) for merged args.

### Clean JavaScript solution
```javascript
function myBind(fn, thisArg, ...presetArgs) {
  if (typeof fn !== 'function') {
    throw new TypeError('myBind expects a function');
  }

  return function boundFunction(...callArgs) {
    return fn.apply(thisArg, [...presetArgs, ...callArgs]);
  };
}

// Example
const person = { name: 'Ken' };
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const sayHi = myBind(greet, person, 'Hi');
console.log(sayHi('!')); // Hi, Ken!
```

### Alternative solutions
- Use a closure with manual index copy instead of spread for micro-optimization.
- Full native-compatible polyfill with constructor semantics and prototype forwarding.

### Edge cases
- `fn` is not callable.
- `thisArg` is `null`/`undefined` in strict vs non-strict behavior.
- Bound function used as callback in async flow.

### Test cases
```javascript
import assert from 'node:assert/strict';

const ctx = { x: 10 };
function add(a, b) { return this.x + a + b; }
const bound = myBind(add, ctx, 2);
assert.equal(bound(3), 15);
assert.throws(() => myBind(123, ctx), /expects a function/);
```

### Follow-up questions
- Extend implementation to support constructor behavior.
- How does arrow function lexical `this` change this discussion?

### Real-world production relevance
- Common in event handlers and utility libraries.
- Misunderstanding bind causes subtle callback bugs in UI and Node services.

---

## Problem 2: Deep Clone with circular references (Date, Map, Set support)

### Problem statement
Implement `deepClone(value)` supporting:
- plain objects and arrays
- `Date`, `Map`, `Set`
- circular references

### Difficulty
Hard (Senior high-signal)

### Interview expectations
- Demonstrate graph-copy thinking with visited-node tracking.
- Avoid JSON stringify pitfalls.
- Preserve value semantics for supported built-ins.

### Clarifying questions strong candidates should ask
- Should functions be cloned or reference-copied?
- Should prototype chain be preserved?
- How should unsupported types (RegExp, Error, class instances) be handled?

### Brute-force approach
- `JSON.parse(JSON.stringify(obj))`.
- Fails for Date, Map, Set, undefined, circular refs, functions.

### Optimized approach
- DFS clone with `WeakMap` memo table for already-cloned references.

### Complexity
- Time: O(n), where `n` is number of reachable nodes/entries.
- Space: O(n) for clone graph + visited map.

### Clean JavaScript solution
```javascript
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof Map) {
    const mapClone = new Map();
    seen.set(value, mapClone);
    for (const [k, v] of value.entries()) {
      mapClone.set(deepClone(k, seen), deepClone(v, seen));
    }
    return mapClone;
  }

  if (value instanceof Set) {
    const setClone = new Set();
    seen.set(value, setClone);
    for (const item of value.values()) {
      setClone.add(deepClone(item, seen));
    }
    return setClone;
  }

  if (Array.isArray(value)) {
    const arrClone = [];
    seen.set(value, arrClone);
    for (const item of value) {
      arrClone.push(deepClone(item, seen));
    }
    return arrClone;
  }

  const objClone = {};
  seen.set(value, objClone);
  for (const [k, v] of Object.entries(value)) {
    objClone[k] = deepClone(v, seen);
  }
  return objClone;
}
```

### Alternative solutions
- Use `structuredClone` in modern environments when available.
- Hybrid: `structuredClone` fallback to custom clone for unsupported runtimes.

### Edge cases
- Self-referential graph.
- Map keys are objects.
- Arrays containing maps/sets/dates.

### Test cases
```javascript
import assert from 'node:assert/strict';

const original = {
  now: new Date(),
  map: new Map([[{ id: 1 }, new Set([1, 2])]]),
  list: [1, 2, { a: 3 }],
};
original.self = original;

const cloned = deepClone(original);
assert.notEqual(cloned, original);
assert.equal(cloned.self, cloned);
assert.ok(cloned.now instanceof Date);
assert.ok(cloned.map instanceof Map);
assert.ok(cloned.list[2] !== original.list[2]);
```

### Follow-up questions
- Preserve prototypes for class instances.
- Clone property descriptors and symbols.

### Real-world production relevance
- Needed in state snapshotting, immutable workflows, audit comparisons, and safe data transformation.

---

## Problem 3: Event Loop Ordering and Diagnostic Reasoning

### Problem statement
Given mixed async constructs, predict output order and explain why.

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
queueMicrotask(() => console.log('D'));
console.log('E');
```

### Difficulty
Medium (Senior baseline, Principal communication signal)

### Interview expectations
- Distinguish call stack, microtask queue, macrotask queue.
- Explain deterministic ordering without guessing.

### Clarifying questions strong candidates should ask
- Browser or Node runtime?
- Any additional `process.nextTick` usage in Node?

### Brute-force approach
- Run code mentally line by line without queue model.
- Often leads to mistakes.

### Optimized approach
- Use queue model:
  1. Execute synchronous stack.
  2. Drain microtasks.
  3. Execute next macrotask.

### Complexity
- Time: O(k) where `k` is number of scheduled callbacks.
- Space: O(k) queue storage.

### Clean JavaScript solution
Expected order:
1. `A`
2. `E`
3. `C`
4. `D`
5. `B`

Reasoning:
- `A` and `E` are synchronous.
- Promise `.then` and `queueMicrotask` are microtasks; they run before timers.
- `setTimeout` callback is macrotask; runs after microtasks are drained.

### Alternative solutions
- In Node, include `process.nextTick` in model; it runs before Promise microtasks.

### Edge cases
- Nested microtasks creating starvation.
- Long synchronous task delaying all queued callbacks.

### Test cases
```javascript
// Interview-style test: ask candidate to modify code and preserve order A,E,C,D,B.
```

### Follow-up questions
- How would you prevent microtask starvation?
- Why can `setTimeout(..., 0)` still run much later?

### Real-world production relevance
- Critical for debugging UI race conditions, API sequencing bugs, and Node throughput issues.

---

## Problem 4: Build a Bounded Concurrency Task Runner

### Problem statement
Implement `runWithConcurrency(tasks, limit)`:
- `tasks` is an array of functions returning promises
- at most `limit` tasks run in parallel
- preserve result ordering by original index

### Difficulty
Hard (Senior high signal, Principal reliability crossover)

### Interview expectations
- Correct concurrency control with deterministic completion.
- No race condition on counters/results.
- Handle rejection policy explicitly.

### Clarifying questions strong candidates should ask
- Stop on first failure or collect all outcomes?
- Should completion order or input order be preserved?
- What if `limit <= 0`?

### Brute-force approach
- `Promise.all(tasks.map(t => t()))`.
- Violates concurrency limit.

### Optimized approach
- Worker loop: start `limit` workers, each pulls next index atomically.

### Complexity
- Time: O(n) task orchestration overhead plus task runtime.
- Space: O(n) for ordered results.

### Clean JavaScript solution
```javascript
async function runWithConcurrency(tasks, limit) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('tasks must be an array');
  }
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new RangeError('limit must be a positive integer');
  }

  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= tasks.length) {
        return;
      }
      results[current] = await tasks[current]();
    }
  }

  const workerCount = Math.min(limit, tasks.length);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);
  return results;
}
```

### Alternative solutions
- Queue abstraction with semaphore.
- Collect all settled results via `Promise.allSettled` behavior.

### Edge cases
- Empty task list.
- Task throws synchronously before returning promise.
- Very high limit compared to task count.

### Test cases
```javascript
import assert from 'node:assert/strict';

let inFlight = 0;
let maxInFlight = 0;
const tasks = Array.from({ length: 10 }, (_, i) => async () => {
  inFlight += 1;
  maxInFlight = Math.max(maxInFlight, inFlight);
  await new Promise((r) => setTimeout(r, 10));
  inFlight -= 1;
  return i * 2;
});

const out = await runWithConcurrency(tasks, 3);
assert.equal(maxInFlight <= 3, true);
assert.deepEqual(out, [0,2,4,6,8,10,12,14,16,18]);
```

### Follow-up questions
- Add timeout and cancellation support.
- Add retry policy only for transient failures.

### Real-world production relevance
- Used in batch processing, ETL jobs, API fan-out control, and worker orchestration.

---

## Problem 5: Implement O(1) LRU Cache

### Problem statement
Implement `LRUCache(capacity)` supporting:
- `get(key)` returns value or `-1`
- `put(key, value)` inserts/updates
- both operations average O(1)

### Difficulty
Hard (classic senior algorithm + practical cache design)

### Interview expectations
- Combine hashmap + doubly linked list.
- Correct recency updates and evictions.
- Handle overwrite and boundary cases.

### Clarifying questions strong candidates should ask
- Capacity minimum (>=1)?
- What to return on cache miss?
- Any TTL requirement?

### Brute-force approach
- Array recency tracking + map lookup.
- `put` and recency updates become O(n).

### Optimized approach
- Map from key to node, linked list for recency.
- Head = most recent, tail = least recent.

### Complexity
- Time: O(1) average for get/put.
- Space: O(capacity).

### Clean JavaScript solution
```javascript
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class LRUCache {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new RangeError('capacity must be a positive integer');
    }
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node(null, null);
    this.tail = new Node(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _moveToFront(node) {
    this._remove(node);
    this._addToFront(node);
  }

  _evictLeastRecent() {
    const lru = this.tail.prev;
    this._remove(lru);
    this.map.delete(lru.key);
  }

  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }
    const node = this.map.get(key);
    this._moveToFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._moveToFront(node);
      return;
    }

    const node = new Node(key, value);
    this.map.set(key, node);
    this._addToFront(node);

    if (this.map.size > this.capacity) {
      this._evictLeastRecent();
    }
  }
}
```

### Alternative solutions
- Use `Map` insertion order trick in JavaScript for simplified interviews.
- Add TTL for production cache behavior.

### Edge cases
- Repeated puts on same key.
- Capacity = 1.
- Non-string keys (Map supports object keys).

### Test cases
```javascript
import assert from 'node:assert/strict';
import { LRUCache } from './lru-cache.js';

const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
assert.equal(cache.get(1), 1);
cache.put(3, 3);
assert.equal(cache.get(2), -1);
cache.put(4, 4);
assert.equal(cache.get(1), -1);
assert.equal(cache.get(3), 3);
assert.equal(cache.get(4), 4);
```

### Follow-up questions
- Add TTL and lazy/active expiration strategy.
- Make cache thread-safe in worker/multi-process context.

### Real-world production relevance
- Core to API response caching, DB query memoization, and expensive computation reuse.

---

## Problem 6: Detect and Fix Memory Leak in Event-Driven Module

### Problem statement
You have an event-driven class that registers listeners but never removes them for disposed sessions. Identify the leak pattern and propose a safe fix.

### Difficulty
Medium-Hard (senior debugging signal)

### Interview expectations
- Understand object reachability and event-listener retention.
- Propose lifecycle cleanup and prove why objects can now be GC-collected.

### Clarifying questions strong candidates should ask
- Who owns listener lifecycle?
- Is there a `dispose`/`close` event already?
- Is listener identity stable for removal?

### Brute-force approach
- Restart process or periodically clear all listeners globally.
- Not safe; hides root cause.

### Optimized approach
- Store listener reference and remove on cleanup path.
- Introduce explicit lifecycle API and guard duplicate registration.

### Complexity
- Time: O(1) registration/removal per session.
- Space: bounded by active sessions only.

### Clean JavaScript solution
```javascript
import { EventEmitter } from 'node:events';

class SessionManager {
  constructor(bus) {
    this.bus = bus;
    this.listeners = new Map();
  }

  attachSession(sessionId) {
    if (this.listeners.has(sessionId)) {
      return;
    }

    const handler = (event) => {
      if (event.sessionId === sessionId) {
        // Handle event for active session only.
      }
    };

    this.listeners.set(sessionId, handler);
    this.bus.on('message', handler);
  }

  detachSession(sessionId) {
    const handler = this.listeners.get(sessionId);
    if (!handler) {
      return;
    }
    this.bus.off('message', handler);
    this.listeners.delete(sessionId);
  }
}

// Example usage
const bus = new EventEmitter();
const manager = new SessionManager(bus);
manager.attachSession('s1');
manager.detachSession('s1');
```

### Alternative solutions
- WeakRef patterns for metadata where applicable.
- Scoped event channels to avoid global listener fan-out.

### Edge cases
- Detach called twice.
- Listener throws; ensure cleanup still runs.
- Session crash path skipping detach (must use finally blocks).

### Test cases
```javascript
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

const bus = new EventEmitter();
const manager = new SessionManager(bus);
manager.attachSession('s1');
assert.equal(bus.listenerCount('message'), 1);
manager.detachSession('s1');
assert.equal(bus.listenerCount('message'), 0);
```

### Follow-up questions
- How would you detect this leak in production?
- Which metrics/alerts indicate listener accumulation?

### Real-world production relevance
- Listener leaks are common in chat systems, websocket servers, and long-lived Node processes.

---

## Problem 7: Safe Deep Merge Without Prototype Pollution

### Problem statement
Implement `safeDeepMerge(target, source)` that merges nested objects while preventing prototype pollution attacks.

### Difficulty
Hard (security + language fundamentals)

### Interview expectations
- Recognize dangerous keys (`__proto__`, `prototype`, `constructor`).
- Produce secure recursive merge behavior.

### Clarifying questions strong candidates should ask
- Merge arrays by replace or concatenate?
- Is target allowed to be mutated?
- Should non-plain objects be copied by reference?

### Brute-force approach
- Naive recursion over all keys.
- Vulnerable to polluted prototype chain.

### Optimized approach
- Restrict to own enumerable properties.
- Block dangerous keys explicitly.
- Merge only plain objects recursively.

### Complexity
- Time: O(n) over visited keys.
- Space: O(d) recursion depth.

### Clean JavaScript solution
```javascript
const BLOCKED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function isPlainObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}

function safeDeepMerge(target, source) {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    throw new TypeError('target and source must be plain objects');
  }

  for (const key of Object.keys(source)) {
    if (BLOCKED_KEYS.has(key)) {
      continue;
    }

    const srcVal = source[key];
    const tgtVal = target[key];

    if (isPlainObject(srcVal) && isPlainObject(tgtVal)) {
      safeDeepMerge(tgtVal, srcVal);
    } else if (isPlainObject(srcVal)) {
      target[key] = safeDeepMerge({}, srcVal);
    } else {
      target[key] = srcVal;
    }
  }

  return target;
}
```

### Alternative solutions
- Create immutable merged output instead of mutating target.
- Schema-validated merge where allowed keys are whitelisted.

### Edge cases
- Nested dangerous key.
- Null values in merge payload.
- Arrays and Dates in source object.

### Test cases
```javascript
import assert from 'node:assert/strict';

const out = safeDeepMerge({ a: { b: 1 } }, { a: { c: 2 }, d: 3 });
assert.deepEqual(out, { a: { b: 1, c: 2 }, d: 3 });

const polluted = safeDeepMerge({}, JSON.parse('{"__proto__": {"pwned": true}}'));
assert.equal(({}).pwned, undefined);
assert.deepEqual(polluted, {});
```

### Follow-up questions
- How would you enforce schema-first input safety before merge?
- What are tradeoffs between blacklist and whitelist security models?

### Real-world production relevance
- Critical in config merge utilities, API payload patch handlers, and plugin systems.

---

## Problem 8: Implement a Retry Wrapper with Timeout and Jitter

### Problem statement
Implement `withRetry(operation, options)` with:
- `maxAttempts`
- per-attempt timeout
- exponential backoff + jitter
- retry only on retryable errors

### Difficulty
Hard (senior practical + principal reliability)

### Interview expectations
- Model failure classes and retry policy.
- Avoid unbounded retries and synchronized retry storms.
- Keep implementation readable and testable.

### Clarifying questions strong candidates should ask
- Which errors are retryable?
- Are operations idempotent?
- Global timeout budget vs per-attempt timeout?

### Brute-force approach
- Loop retries with fixed delay and no timeout.
- Causes long hangs and thundering herd under incident.

### Optimized approach
- Per-attempt timeout race.
- Exponential backoff with bounded jitter.
- Policy-based retryability check.

### Complexity
- Time: O(a) orchestration for `a = maxAttempts` plus operation duration.
- Space: O(1) excluding operation payload.

### Clean JavaScript solution
```javascript
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeoutPromise(ms) {
  return new Promise((_, reject) => {
    const err = new Error('timeout');
    err.code = 'TIMEOUT';
    setTimeout(() => reject(err), ms);
  });
}

export async function withRetry(operation, {
  maxAttempts = 3,
  baseDelayMs = 100,
  maxDelayMs = 2000,
  attemptTimeoutMs = 1000,
  isRetryable = (err) => err && (err.code === 'TIMEOUT' || err.retryable === true),
} = {}) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      return await Promise.race([
        operation({ attempt }),
        timeoutPromise(attemptTimeoutMs),
      ]);
    } catch (err) {
      const lastAttempt = attempt >= maxAttempts;
      if (lastAttempt || !isRetryable(err)) {
        throw err;
      }

      const exp = Math.min(maxDelayMs, baseDelayMs * (2 ** (attempt - 1)));
      const jitter = Math.floor(Math.random() * Math.max(1, Math.floor(exp * 0.2)));
      await sleep(exp + jitter);
    }
  }

  throw new Error('unreachable');
}
```

### Alternative solutions
- Token-bucket limited retries to avoid burst amplification.
- Circuit breaker integration for dependency-level failure isolation.

### Edge cases
- Non-idempotent operation should not be retried blindly.
- Retryable predicate misconfigured.
- Timeout smaller than typical p99 latency.

### Test cases
```javascript
import assert from 'node:assert/strict';
import { withRetry } from './with-retry.js';

let tries = 0;
const result = await withRetry(async () => {
  tries += 1;
  if (tries < 3) {
    const err = new Error('temporary');
    err.retryable = true;
    throw err;
  }
  return 'ok';
}, { maxAttempts: 4, attemptTimeoutMs: 500 });

assert.equal(result, 'ok');
assert.equal(tries, 3);
```

### Follow-up questions
- Add observability hooks (`onAttempt`, `onBackoff`).
- Integrate with circuit breaker and budget-based retries.

### Real-world production relevance
- Standard resilience primitive in payment APIs, notification services, and external API integrations.

---

## Section 1 Interview Simulation Prompts

1. Rebuild Problem 4 (bounded concurrency) from scratch in 20 minutes, then add cancellation.
2. Explain exactly when to use retries and when not to use retries.
3. Compare naive deep merge vs secure merge and identify exploit path.
4. Diagnose a memory leak from growing listener counts and propose a production rollout fix.

## Section 1 Exit Criteria (Senior/Principal)

- You can solve Problems 1, 3, 4, and 5 in a timed setting with clear communication.
- You can explain why Problems 7 and 8 are reliability/security-critical in production.
- You can discuss tradeoffs, not just correctness (latency, memory, complexity, failure behavior).
