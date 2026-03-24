# Senior / Principal Full Stack JavaScript — Complete Interview Preparation Course

> **Audience:** Engineers targeting Senior, Staff, or Principal Full Stack roles at top-tier companies.  
> **Format:** 12 major modules, 20 weeks, progressing from production-grade fundamentals to principal-level engineering judgment.  
> **Philosophy:** Every concept is taught through the lens of *interview performance* and *real production impact* — not academic theory alone.

---

## How to Use This Document

Each module below defines:
- **Learning Objectives** — what you must be able to do, not just know
- **Key Concepts** — the topics covered with enough depth for a principal-level conversation
- **Coding Interview Categories** — the question types you will face under time pressure
- **Real-World Applications** — production contexts that deepen your answers
- **Senior / Principal Interview Outcomes** — the bar you are being measured against

Before each module, complete the linked code exercises. After each module, conduct one timed mock interview. Track your readiness in [assets/interview-scorecard.md](assets/interview-scorecard.md).

---

## Module Map

| # | Module | Phase | Difficulty | Weeks |
|---|--------|-------|------------|-------|
| 1 | [JavaScript Fundamentals Revisited](#module-1) | Phase 1 | ★★★☆☆ | 1–2 |
| 2 | [Advanced Functions, Closures, and Execution Context](#module-2) | Phase 1 | ★★★★☆ | 2–3 |
| 3 | [Async JavaScript, Event Loop, Promises, and Concurrency](#module-3) | Phase 1–2 | ★★★★☆ | 3–5 |
| 4 | [Data Structures and Algorithms in JavaScript](#module-4) | Phase 1 | ★★★★☆ | 4–6 |
| 5 | [Object-Oriented and Functional Programming](#module-5) | Phase 1–2 | ★★★★☆ | 5–7 |
| 6 | [DOM, Browser APIs, and Frontend Engineering](#module-6) | Phase 2 | ★★★★☆ | 6–8 |
| 7 | [Node.js, APIs, and Backend Engineering](#module-7) | Phase 2–3 | ★★★★☆ | 7–10 |
| 8 | [Performance Optimization and Reliability](#module-8) | Phase 3 | ★★★★★ | 9–12 |
| 9 | [Security and Secure Coding](#module-9) | Phase 2–5 | ★★★★★ | 10–13 |
| 10 | [Testing and Debugging](#module-10) | Phase 2 | ★★★★☆ | 11–14 |
| 11 | [System Design for Full Stack Engineers](#module-11) | Phase 3–5 | ★★★★★ | 13–18 |
| 12 | [Principal-Level Engineering Judgment and Leadership](#module-12) | Phase 4–5 | ★★★★★ | 17–20 |

---

## Module 1 — JavaScript Fundamentals Revisited for Senior Engineers {#module-1}

**Linked Exercises:** [phase-1-foundations/module-01-core-runtime/](phase-1-foundations/module-01-core-runtime/)

### Learning Objectives

After this module you will be able to:
- Explain `var`, `let`, and `const` scoping at the spec level — not just "let is block-scoped"
- Predict evaluation order for coercion, equality, and type conversion edge cases
- Explain what the JavaScript engine does during parsing, compilation, and execution
- Describe the prototype chain and distinguish it from classical inheritance
- Use `WeakMap` and `WeakRef` correctly to avoid hidden memory retention

### Key Concepts

**Variables and Scope**
- Temporal Dead Zone (TDZ): why `let`/`const` throw `ReferenceError` before their declaration line
- Hoisting: function declarations are fully hoisted; `let`/`const` declarations are hoisted but not initialized
- Lexical vs. dynamic scope: JavaScript is lexical — closures capture the environment, not values

**Types and Coercion**
- Primitive vs. reference types: stack vs. heap allocation
- Abstract equality (`==`) coercion rules: `null == undefined`, number-string coercion, object-to-primitive
- `typeof` quirks: `typeof null === 'object'`, `typeof function === 'function'`
- `Symbol` as unique property keys; `Symbol.iterator`, `Symbol.toPrimitive`

**Prototype System**
- `[[Prototype]]` chain lookup: own property ← prototype ← Object.prototype ← null
- `Object.create(proto)` vs. `new Constructor()` vs. `class` syntax (all equivalent under the hood)
- `hasOwnProperty` vs. `in` operator; pitfall of shadowing inherited properties
- `Object.getOwnPropertyDescriptors()` — value, writable, enumerable, configurable

**Memory Management**
- Mark-and-sweep GC: reachability from GC roots
- Heap snapshots: identifying detached DOM nodes, retained closures, accumulating event listeners
- `WeakMap`/`WeakSet`: keys are weakly-held — safe for private object metadata without preventing GC
- `FinalizationRegistry`: post-GC cleanup hooks (use sparingly)

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Scope & hoisting | "What does this code print? Explain why." |
| Prototype manipulation | Implement `Object.create` from scratch; implement `instanceof` |
| Type coercion traps | "Fix this comparison bug without changing the API" |
| Memory-safe patterns | "Rewrite this module to prevent the memory leak" |
| Immutability | Deep freeze an object tree; implement `deepClone` without JSON |

### Real-World Applications

- Framework internals (React uses `WeakMap` for component metadata)
- Plugin systems that extend third-party objects without polluting their prototypes
- Serialization/deserialization bugs caused by prototype pollution (`__proto__` injection)
- Memory leak triage in long-lived browser applications (SPAs with router-level leaks)

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| Spec-level accuracy | Can explain *why* something behaves a certain way, not just *that* it does |
| Bug anticipation | Spots coercion or hoisting bugs in a code review without running the code |
| Memory reasoning | Can propose a fix for a memory leak and explain which objects will be collected |
| Prototype literacy | Can implement inheritance patterns in 3 different ways and name the trade-offs |

---

## Module 2 — Advanced Functions, Closures, Scope, and Execution Context {#module-2}

**Linked Exercises:** [phase-1-foundations/module-02-functions-clean-code/](phase-1-foundations/module-02-functions-clean-code/)

### Learning Objectives

After this module you will be able to:
- Trace the call stack and execution context for any JavaScript program
- Implement and explain currying, partial application, and function composition
- Identify and fix closure-related memory leaks and stale reference bugs
- Explain `this` binding rules and fix binding bugs in React event handlers and callbacks
- Implement memoization with TTL, LRU eviction, and argument key strategies

### Key Concepts

**Execution Context and Call Stack**
- Global Execution Context → Function Execution Context lifecycle: creation phase (hoisting) → execution phase
- `[[Environment]]` record: where variables live; outer environment reference creates the scope chain
- Call stack overflow: deep recursion vs. trampolining; tail call optimization (V8 does not optimize in practice)

**`this` Binding Rules (priority order)**
1. `new` binding — newly created object
2. Explicit binding — `call()`, `apply()`, `bind()`
3. Implicit binding — method call on object (`obj.fn()`)
4. Default binding — global or `undefined` (strict mode)
- Arrow functions: no own `this`; inherit from lexical enclosing context
- Common bugs: extracting a method loses implicit binding; class method passed as callback loses `this`

**Closures**
- A closure is a function plus the lexical environment in which it was defined
- Classic closure bug: `var i` in a loop captures the reference, not the value at each iteration
- Closure over mutable state: useful for encapsulation; dangerous when shared unexpectedly
- Stale closure: React `useEffect` capturing an old prop/state value — fix with refs or deps array

**Higher-Order Functions and Composition**
- `map`/`filter`/`reduce` as building blocks; chaining vs. transducers for large datasets
- Currying: transform `f(a,b,c)` → `f(a)(b)(c)` — enables partial application
- `compose(f, g, h)(x)` = `f(g(h(x)))` — right-to-left; `pipe` is left-to-right
- Point-free style: functions defined entirely through composition without explicit arguments

**Memoization**
- Cache function results by serialized argument key
- TTL-aware memoize: timestamp check on cache reads
- LRU-aware memoize: evict least-recently-used entries at capacity
- Pitfalls: mutable object arguments produce wrong cache keys; deeply-equal but reference-different input

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Closure correctness | "Fix the loop counter closure bug" |
| `this` binding | Implement `Function.prototype.bind` from scratch |
| Composition | Implement `pipe` and `compose`; build a middleware pipeline |
| Memoization | Implement `memoize(fn, { maxSize, ttlMs })` |
| Currying | Implement `curry(fn)` that handles variadic arity |

### Real-World Applications

- React hooks: stale closures are the #1 source of subtle bugs (`useEffect` deps)
- Express middleware pipeline is a composition pattern
- Redux reducers are pure functions; selectors use memoization (`reselect`)
- Rate limiter and debounce utilities are closures over state

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| `this` mastery | Instantly diagnoses binding bugs in callback-heavy code |
| Composition thinking | Builds complex behavior from small, pure, composed functions |
| Closure safety | Identifies retention hazards and stale reference bugs on sight |
| Meta-programming | Can implement `bind`, `call`, `memoize` from scratch accurately |

---

## Module 3 — Async JavaScript, Event Loop, Promises, and Concurrency {#module-3}

**Linked Exercises:** [phase-1-foundations/module-04-async-event-loop/](phase-1-foundations/module-04-async-event-loop/) · [phase-2-professional-coding/module-05-events-ui/](phase-2-professional-coding/module-05-events-ui/)

### Learning Objectives

After this module you will be able to:
- Precisely describe macro-task and microtask queue ordering for any async program
- Implement cancellable async operations using `AbortController` and `AbortSignal`
- Build a task queue with bounded concurrency and backpressure
- Implement retry with exponential backoff, jitter, and cancellation
- Explain `Promise` internals — states, resolution, chaining, and thenable assimilation

### Key Concepts

**Event Loop Architecture**
- Call stack → Web APIs (timers, fetch, I/O) → task queue → event loop tick
- Microtask queue (Promise callbacks, `queueMicrotask`, `MutationObserver`) drains **completely** before the next macro-task
- `setTimeout(fn, 0)` schedules a macro-task; `Promise.resolve().then(fn)` schedules a microtask
- Node.js addition: `process.nextTick` runs before Promise microtasks in the same phase; `setImmediate` runs after I/O callbacks

**Promises**
- Three states: pending → fulfilled | rejected (transitions are one-way)
- `.then(onFulfilled, onRejected)` always returns a new Promise — enables chaining
- Unhandled rejection: browser queues a `unhandledrejection` event; Node.js will crash in future versions
- `Promise.all` fails fast on first rejection; `Promise.allSettled` waits for all; `Promise.race` resolves/rejects with the first settlement; `Promise.any` resolves with first fulfillment

**`async/await`**
- `async` function always returns a Promise; `await` suspends the function and yields to the event loop
- `await` in a loop: sequential by default — use `Promise.all(arr.map(...))` for parallel execution
- `try/catch` around `await` catches both sync throws and async rejections
- Top-level `await` (ESM): useful for module initialization; blocks dependent imports

**Concurrency Patterns**
- Task queue with `maxConcurrency`: semaphore pattern — slot counter + waiting queue
- Cancellation with `AbortController`: pass `signal` to `fetch`; check `signal.aborted` in loops
- Timeout race: `Promise.race([operation(), sleep(ms).then(() => { throw new TimeoutError() })])`
- Retry with backoff: `delay = min(base * 2^attempt, maxDelay) + jitter`
- Event-driven backpressure: producer pauses when consumer queue length exceeds threshold

**Generators and Async Iterators**
- `function*` produces an iterator; each `yield` suspends execution and returns a value
- `async function*` produces async iterators; `for await...of` consumes them
- Use case: streaming large datasets without loading everything into memory

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Event loop prediction | "What is the output of this code? Trace the queues." |
| Promise implementation | Implement `Promise.all`, `Promise.race`, `Promise.allSettled` from scratch |
| Concurrency control | Implement `asyncPool(concurrency, tasks)` |
| Cancellation | Implement cancellable fetch with timeout and retry |
| Async iteration | Stream paginated API results using async generators |

### Real-World Applications

- API clients with retry, timeout, and circuit breaking
- File upload progress tracking and cancellation
- Real-time dashboards consuming server-sent events
- GraphQL subscription handlers with backpressure control
- Node.js HTTP server: per-request async context propagation

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| Queue ordering | Can trace exact output for multi-Promise programs with mixed timers |
| Concurrency design | Designs bounded-concurrency systems without race conditions |
| Cancellation hygiene | Knows when and how to abort in-flight operations cleanly |
| Error propagation | Handles all rejection paths; no swallowed errors or unhandled rejections |

---

## Module 4 — Data Structures and Algorithms in JavaScript {#module-4}

**Linked Exercises:** [phase-1-foundations/module-03-data-structures-algorithms/](phase-1-foundations/module-03-data-structures-algorithms/) · [problem-bank/](problem-bank/)

### Learning Objectives

After this module you will be able to:
- Select the correct data structure for a problem based on access patterns and complexity requirements
- Implement core algorithms from scratch (sorting, searching, graph traversal) without references
- Analyze time and space complexity including amortized analysis
- Express the interviewer-expected trade-off explanation (not just "it's O(n)")
- Apply algorithmic patterns (sliding window, two pointers, BFS/DFS, divide & conquer) to novel problems

### Key Concepts

**Core Data Structures and Their JavaScript Implementations**

| Structure | JS Native | Time (key ops) | When to Choose |
|-----------|-----------|----------------|----------------|
| Array | `Array` | O(1) index, O(n) insert/delete at head | Random access, ordered iteration |
| Hash Map | `Map` / `{}` | O(1) avg get/set | Key-value lookup, counting frequency |
| Hash Set | `Set` | O(1) has/add | Deduplication, membership test |
| Linked List | Manual | O(1) head insert, O(n) search | LRU cache (node detach/reattach), undo stacks |
| Stack | `Array` (push/pop) | O(1) | DFS, balanced delimiter matching |
| Queue | Manual deque | O(1) amortized | BFS, task scheduling |
| Priority Queue | Manual heap | O(log n) insert/extract | Dijkstra, task scheduler by priority |
| Binary Search Tree | Manual | O(log n) avg | Ordered range queries |
| Trie | Manual | O(m) per op | Autocomplete, prefix matching |
| Graph | Adjacency list | O(V+E) BFS/DFS | Social networks, routing, dependency resolution |

**Algorithmic Patterns**

- **Sliding Window:** fixed or variable window over a sequence — subarrays, substrings, stream aggregates
- **Two Pointers:** sorted array, palindrome check, partition, merging
- **Fast/Slow Pointer:** cycle detection in linked lists (Floyd's algorithm)
- **Binary Search on Answer:** "find the minimum `k` such that condition(k) is true" — not just sorted arrays
- **DFS Backtracking:** permutations, combinations, constraint satisfaction (N-Queens)
- **BFS / Dijkstra:** shortest path, level-order traversal, multi-source spreading
- **Dynamic Programming:** overlapping subproblems + optimal substructure; top-down (memoization) vs. bottom-up (tabulation)
- **Divide & Conquer:** merge sort, quicksort, closest pair of points

**Complexity Analysis**
- Amortized O(1): dynamic array doubling strategy
- Space complexity includes recursive call stack (implicit space)
- Best / average / worst distinction: quicksort O(n log n) avg vs. O(n²) worst
- When "good enough" beats "optimal": cache locality (arrays beat trees in practice for small n)

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Array / sliding window | Longest substring without repeating characters; max sum subarray of size k |
| Linked list | Reverse a linked list in groups; detect and remove cycle |
| Trees | Level-order traversal with level labels; serialize/deserialize binary tree |
| Graphs | Course prerequisites (topological sort); number of islands (multi-source BFS) |
| DP | Coin change; longest common subsequence; word break |
| Implementation | Implement LRU cache (O(1) get/put); design a task scheduler |

### Real-World Applications

- LRU/LFU caches: browser HTTP caches, CDN edge caches, database buffer pools
- Priority queues: task schedulers, Kubernetes pod scheduling, message broker priority lanes
- Tries: autocomplete in search bars, URL routing, IP prefix matching
- Graph algorithms: dependency resolution in npm, CI pipeline DAG execution
- Sliding window: rate limiters (fixed/sliding window counters), stream analytics

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| Pattern recognition | Identifies the correct algorithmic pattern within 2 minutes of reading a problem |
| Complexity literate | Explains amortized cost, worst-case vs. average, and space trade-offs correctly |
| Production context | Connects algorithm choices to real system behavior (cache hit rates, GC pressure) |
| Code quality | Clean, readable implementation with edge cases handled — not just pseudo-code |

---

## Module 5 — Object-Oriented and Functional Programming in JavaScript {#module-5}

**Linked Exercises:** [phase-1-foundations/module-01-core-runtime/](phase-1-foundations/module-01-core-runtime/) · [phase-5-principal-fullstack/module-13-typescript-patterns/](phase-5-principal-fullstack/module-13-typescript-patterns/)

### Learning Objectives

After this module you will be able to:
- Apply SOLID principles to JavaScript class design and explain violations in code review
- Implement common GoF design patterns and name the production contexts where they apply
- Explain the trade-offs between OOP and FP approaches for a given problem
- Build immutable data pipelines without sacrificing readability
- Use TypeScript's type system to enforce invariants rather than runtime checks

### Key Concepts

**SOLID in JavaScript**
- **S** — Single Responsibility: one reason to change; detect via "and" in class descriptions
- **O** — Open/Closed: extend through composition, not modification; plugin pattern
- **L** — Liskov Substitution: subtypes must be substitutable; fish extending bird breaks this
- **I** — Interface Segregation: narrow, focused interfaces rather than fat ones (JS: role-based mixins)
- **D** — Dependency Inversion: depend on abstractions; inject dependencies rather than constructing them

**Design Patterns (GoF in JavaScript)**

*Creational*
- Factory: `createUser(type)` returns different implementations — hides construction complexity
- Builder: fluent `QueryBuilder.select().where().limit().build()` — prevents telescoping constructors
- Singleton: module-level state (use with caution; hard to test; prefer DI container)

*Structural*
- Facade: `createPaymentClient(config)` wraps Stripe/PayPal complexity behind a uniform interface
- Decorator: wrap a function to add logging, retry, timing — compose rather than subclass
- Proxy: `new Proxy(target, handler)` — used for validation, lazy loading, reactive systems

*Behavioral*
- Observer / Event Emitter: decouple publishers from subscribers; used in every UI framework
- Strategy: pass an algorithm as a function parameter — sort comparators, validation strategies
- Command: encapsulate an operation as an object for undo/redo and queuing
- Chain of Responsibility: Express middleware — each handler decides whether to pass to `next`

**Functional Programming Principles**
- **Pure functions:** no side effects + deterministic output → trivially testable, safely parallelizable
- **Immutability:** `Object.freeze`, spread operator, Immer for structural sharing
- **Algebraic Data Types:** `Option<T>` / `Result<T,E>` — eliminate `null` and untyped exceptions
- **Composition over inheritance:** behavior via `pipe(fn1, fn2, fn3)` rather than deep class trees
- **Referential transparency:** expression can be replaced with its value without changing program behavior

**TypeScript Patterns for Principal Engineers**
- Discriminated unions + exhaustive narrowing with `never`
- Branded types: `type UserId = string & { __brand: 'UserId' }` — prevent mixing domain IDs
- Conditional types: `DeepReadonly<T>`, `Awaited<T>`, `Parameters<T>`
- Template literal types: `type EventName = `on${Capitalize<string>}``
- Variance: `Covariant<out T>` vs. `Contravariant<in T>` in function parameters

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| SOLID analysis | "What SOLID violations do you see in this class? How would you refactor it?" |
| Pattern implementation | Implement the Observer, Strategy, or Command pattern |
| FP pipeline | Transform a dataset using `map/filter/reduce` composition |
| Result monad | Implement `Result<T,E>` with `map`, `flatMap`, `mapError` |
| DI container | Implement a dependency injection container with singleton/transient lifetimes |

### Real-World Applications

- React component patterns: Render Props, HOC, Compound Components all derive from these patterns
- Redux is the Command + Observer patterns combined
- Zod/Yup schema validation are Strategy + Builder patterns
- Node.js streams use Chain of Responsibility
- TypeScript strict mode catches entire classes of production bugs at compile time

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| Pattern literacy | Identifies the pattern in existing code and names it correctly |
| SOLID fluency | Evaluates code against SOLID with specific, actionable refactoring suggestions |
| FP + OOP balance | Chooses the right paradigm for the problem; doesn't ideologically prefer one |
| Type-level design | Encodes business rules in the type system, not runtime assertions |

---

## Module 6 — DOM, Browser APIs, and Frontend Engineering {#module-6}

**Linked Exercises:** [phase-2-professional-coding/module-05-events-ui/](phase-2-professional-coding/module-05-events-ui/) · [phase-5-principal-fullstack/module-14-react-architecture/](phase-5-principal-fullstack/module-14-react-architecture/)

### Learning Objectives

After this module you will be able to:
- Explain how the browser's critical rendering path affects perceived performance
- Implement event delegation, debounce, and virtualization for high-frequency UI events
- Explain React's reconciliation algorithm and fiber architecture at the depth interviewers expect
- Identify and fix layout thrashing, forced synchronous layout, and long task violations
- Design accessible, SEO-friendly SPAs with correct SSR hydration strategies

### Key Concepts

**Critical Rendering Path**
- Parse HTML → build DOM; parse CSS → build CSSOM; combine → Render Tree → Layout → Paint → Composite
- JavaScript blocks DOM parsing unless `async` or `defer` (defer preserves execution order)
- `requestAnimationFrame`: schedules work before the next paint — correct slot for visual updates
- `requestIdleCallback`: schedules low-priority work during idle periods — analytics, prefetch

**Event System**
- Event propagation: capture (top-down) → target → bubble (bottom-up)
- Event delegation: single listener on parent handles children via `event.target` — O(1) memory vs. O(n)
- `addEventListener` options: `{ once, passive, capture, signal }` — `passive: true` on scroll prevents default-call latency
- Event loop and rendering: `setTimeout` callback runs after paint; `requestAnimationFrame` runs *before* paint

**React Architecture Internals**
- **Virtual DOM:** lightweight JS object tree representing desired UI state
- **Reconciliation:** diffing algorithm — same type → update props; different type → unmount + remount
- **Fiber:** unit of work; enables time-slicing (interruptible rendering) in concurrent mode
- **Render vs. Commit phase:** render is pure and interruptible; commit mutates the real DOM (not interruptible)
- **`useState` / `useReducer`:** stored in fiber's `memoizedState` linked list — hooks must be called in stable order
- **`useMemo` / `useCallback`:** dependency array comparison; referential equality for objects/functions
- **`useEffect` scheduling:** cleanup runs before next effect; fires after paint (async to rendering)

**Browser Storage and APIs**
- `localStorage` vs. `sessionStorage` vs. `IndexedDB` vs. Cookies: size, scope, async, security
- `IntersectionObserver`: lazy loading, infinite scroll — avoids scroll event + `getBoundingClientRect` polling
- `ResizeObserver`: layout recalculation triggers — more efficient than `window.resize` + forced layout
- `PerformanceObserver`: LCP, FID, CLS metrics — Core Web Vitals collection
- `Web Workers`: offload CPU-intensive work (parsing, crypto) off the main thread — no DOM access

**SSR and Hydration**
- SSR: server renders HTML with data → client receives a full page → React hydrates (attaches event listeners)
- Hydration mismatch: server HTML ≠ client render output → React warns and re-renders
- `window.__SSR_DATA__` injection: inline JSON for client-side state rehydration
- Streaming SSR (`renderToPipeableStream`): sends HTML in chunks; improves TTFB

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Event system | Implement event delegation for a dynamic list; implement `debounce` and `throttle` |
| Virtual DOM | Implement a minimal `createElement` and `diff` algorithm |
| Rendering performance | Fix layout thrashing in an animation loop; implement virtual list (windowing) |
| React hooks | Implement `usePrevious`, `useDebounce`, `useIntersectionObserver` |
| SSR | Design a hydration-safe cache; explain what causes hydration mismatch |

### Real-World Applications

- Virtualizing large tables (50k+ rows) using `IntersectionObserver` + `requestAnimationFrame`
- Preventing input lag by correctly debouncing search vs. throttling scroll
- Diagnosing Core Web Vitals regressions with `PerformanceObserver`
- Offloading image processing to Web Workers to keep the main thread free
- Building accessible keyboard navigation without breaking native browser behavior

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| CRP knowledge | Can walk through what the browser does from URL to first paint |
| React depth | Can explain fiber, reconciliation, and concurrent mode — not just hooks API |
| Performance diagnosis | Identifies layout thrashing, memory leaks, and long tasks without running the code |
| Accessibility | Knows ARIA attributes, focus management, and when native elements outperform custom ones |

---

## Module 7 — Node.js, APIs, and Backend Engineering {#module-7}

**Linked Exercises:** [phase-2-professional-coding/module-06-node-api/](phase-2-professional-coding/module-06-node-api/) · [phase-3-architecture-and-scale/module-11-microservices-events/](phase-3-architecture-and-scale/module-11-microservices-events/) · [phase-5-principal-fullstack/module-15-fullstack-patterns/](phase-5-principal-fullstack/module-15-fullstack-patterns/) · [phase-5-principal-fullstack/module-16-database-layer/](phase-5-principal-fullstack/module-16-database-layer/)

### Learning Objectives

After this module you will be able to:
- Explain Node.js's single-threaded event loop and identify blocking operations
- Design RESTful and GraphQL APIs with correct HTTP semantics, pagination, and versioning
- Implement middleware pipelines with authentication, rate limiting, and request tracing
- Apply the Repository, Unit of Work, and Query Builder patterns to the database layer
- Design idempotent APIs and explain why idempotency is critical for distributed systems

### Key Concepts

**Node.js Runtime**
- Single-threaded event loop with libuv handling I/O on a thread pool (default 4 threads)
- Blocking the event loop: `crypto.pbkdf2Sync`, `fs.readFileSync`, `JSON.parse` on a 50 MB payload
- `cluster` module and `worker_threads`: horizontal scaling vs. true parallelism
- `AsyncLocalStorage`: propagate request context (traceId, userId) without passing it as a parameter
- Stream API: `Readable`, `Writable`, `Transform` — process data in chunks to avoid full in-memory load

**REST API Design**
- Resource-oriented: nouns in URLs, verbs via HTTP method
- HTTP method semantics: GET (safe, idempotent), POST (not idempotent), PUT (idempotent), PATCH, DELETE
- Status codes: 200/201/204 for success; 400/401/403/404/409 for client errors; 500/502/503 for server errors
- Idempotency: `POST /orders` with idempotency key — same key returns same response without re-processing
- Pagination: cursor-based (stable, scalable) vs. offset-based (simple but broken with concurrent mutations)
- API versioning: URI versioning (`/v2/`), header versioning (`Accept: application/vnd.api+json;version=2`)

**GraphQL API Design**
- Schema-first: SDL defines types, queries, mutations, subscriptions
- Resolver execution: each field has a resolver; resolvers compose down the tree
- N+1 problem: naïve resolver calls DB once per parent item → DataLoader batches into one query
- Mutations as commands: `createOrder(input: OrderInput!)` — returns the created resource
- Subscriptions: WebSocket-based real-time delivery

**Database Layer Patterns**
- Repository pattern: abstract over persistence; `UserRepository.findById(id)` — no SQL in controllers
- Unit of Work: batch all DB writes into a single transaction; rollback on failure
- Query Builder: fluent API → parameterized SQL — prevents injection, improves readability
- Connection pooling: pre-created connections, FIFO wait queue, configurable min/max pool size
- Migration runner: version-ordered, idempotent (`applied_migrations` table), supports rollback

**Middleware and Cross-Cutting Concerns**
- Correlation IDs: generate at gateway, propagate via `X-Correlation-ID` header, log with every entry
- Rate limiting: token bucket per `userId` or IP — Redis `INCR`+`EXPIRE` for distributed state
- Request validation: schema-driven (Zod, Joi) at API boundary — never trust client input
- Authentication middleware: verify JWT → populate `req.user` → pass to handlers
- Authorization middleware: check RBAC permissions after authentication

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Event loop | "Why is this endpoint slow? Fix the blocking call." |
| REST design | Design a paginated orders API with cursor navigation and conflict detection |
| GraphQL | Implement a DataLoader for user → posts N+1 query |
| Middleware | Implement rate limiting middleware with sliding window |
| Database layer | Implement `QueryBuilder` with parameterized SQL output |

### Real-World Applications

- BFF (Backend for Frontend): one Node.js gateway aggregating 4 microservices for a mobile client
- GraphQL gateway with DataLoader: eliminates N+1 across 10 resolvers serving 1k RPS
- Event sourcing with outbox pattern: reliable event publishing from a Node.js service
- Worker threads for CPU: offload image resize and PDF generation off the event loop

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| I/O vs. CPU | Immediately identifies whether a bottleneck is I/O-bound or CPU-bound |
| API craft | Designs idempotent, versioned APIs with correct HTTP semantics without prompting |
| N+1 awareness | Restructures GraphQL resolvers with DataLoader automatically |
| Data layer hygiene | Keeps SQL out of controllers; uses parameterized queries everywhere |

---

## Module 8 — Performance Optimization and Reliability {#module-8}

**Linked Exercises:** [phase-3-architecture-and-scale/module-12-performance-reliability/](phase-3-architecture-and-scale/module-12-performance-reliability/) · [phase-5-principal-fullstack/module-18-observability/](phase-5-principal-fullstack/module-18-observability/) · [capstones/capstone-3-reliability-toolkit/](capstones/capstone-3-reliability-toolkit/)

### Learning Objectives

After this module you will be able to:
- Identify and fix the five most common production performance bottlenecks without running code
- Implement circuit breaker, bulkhead, retry, and timeout patterns from scratch
- Define SLOs and error budgets and explain how they govern deployment decisions
- Explain cache invalidation strategies and their consistency trade-offs
- Profile a Node.js application and interpret a flame graph

### Key Concepts

**Performance Measurement**
- Four Golden Signals: latency, traffic, errors, saturation
- Percentile metrics: p50/p95/p99 — mean hides tail latency; always optimize the tail
- Core Web Vitals: LCP (<2.5s), INP (<200ms), CLS (<0.1) — Google's ranking signals
- Node.js profiling: `--prof` + `node --prof-process`; V8 flame graph; `clinic.js` for production

**Frontend Performance**
- Bundle splitting: route-level code splitting with dynamic `import()` — reduces initial JS payload
- Tree shaking: eliminate dead code at build time (requires ES module syntax)
- Image optimization: WebP/AVIF, responsive images, lazy loading with `loading="lazy"`
- Service Worker: pre-cache critical assets; network-first vs. cache-first strategies
- Critical CSS inlining: eliminate render-blocking stylesheet requests for above-the-fold content

**Backend Performance**
- Database query optimization: EXPLAIN ANALYZE; index selectivity; avoid `SELECT *`; N+1 via eager loading
- Caching layers: in-process (`Map`), distributed (Redis), CDN — invalidation is the hard part
- Cache-aside pattern: read miss → fetch → cache; stale-while-revalidate for background refresh
- Connection pool sizing: `maxConnections = (available_cpu_cores * 2) + effective_spindle_count`

**Reliability Patterns**
- **Timeout:** upper bound on how long to wait — prevents cascade via resource exhaustion
- **Retry with backoff:** exponential delay with jitter — prevents thundering herd on recovery
- **Circuit Breaker:** CLOSED → OPEN → HALF_OPEN state machine — fast-fails during outages instead of queuing
- **Bulkhead:** semaphore on concurrency per downstream — isolates failure domains
- **Dead Letter Queue:** messages that fail all retries → DLQ for inspection and replay
- **Idempotency keys:** client-generated UUID per operation — safe to retry without duplicate side-effects

**SLO and Error Budget**
- SLI (indicator): the measured metric (p99 latency, error rate)
- SLO (objective): `p99 latency < 500ms for 99.9% of 30-day window`
- Error budget: `100% - 99.9% = 0.1%` of requests may fail — defines deployment risk envelope
- Burn rate: current failure rate / expected failure rate — burn rate > 1 = budget draining too fast

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Circuit breaker | Implement a circuit breaker with CLOSED/OPEN/HALF_OPEN transitions |
| Retry | Implement `withRetry(fn, { maxAttempts, baseDelayMs, jitter })` |
| Cache design | Design a cache invalidation strategy for product inventory with strong consistency |
| SLO reasoning | "Your error budget is 20% burned in 3 days. What do you do?" |
| Profiling | Interpret a flame graph and identify the hot function |

### Real-World Applications

- Netflix Hystrix (now Resilience4j): exactly the circuit breaker pattern at scale
- AWS SDK retry strategy: exponential backoff with jitter across all API calls
- Cloudflare CDN cache TTL design: balance staleness vs. origin load
- Kubernetes liveness vs. readiness probes: reliability signals for orchestration

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| Failure mode thinking | Asks "what happens when this external call times out?" before being prompted |
| SLO literacy | Can define an SLO, calculate its burn rate, and explain the deployment policy it implies |
| Cache reasoning | Explains all three invalidation strategies with their consistency trade-offs |
| Pattern composition | Stacks circuit breaker → retry → timeout → bulkhead in the correct order |

---

## Module 9 — Security and Secure Coding {#module-9}

**Linked Exercises:** [phase-2-professional-coding/module-08-security-defensive/](phase-2-professional-coding/module-08-security-defensive/) · [phase-5-principal-fullstack/module-17-auth-identity/](phase-5-principal-fullstack/module-17-auth-identity/) · [phase-4-interview-simulations/track-d-fullstack-leadership/code-review-round/](phase-4-interview-simulations/track-d-fullstack-leadership/code-review-round/)

### Learning Objectives

After this module you will be able to:
- Identify and explain the OWASP Top 10 vulnerabilities with concrete JavaScript examples
- Implement JWT authentication with refresh token rotation and theft detection
- Implement RBAC authorization and explain when ABAC is the better choice
- Explain the OAuth2 Authorization Code + PKCE flow at the implementation level
- Perform a security-focused code review and score it against the code review rubric

### Key Concepts

**OWASP Top 10 in JavaScript Context**

| # | Vulnerability | JavaScript Manifestation | Fix |
|---|----------|--------------------------|-----|
| A01 | Broken Access Control | Missing auth middleware; IDOR via predictable IDs | Middleware on every route; RBAC checks |
| A02 | Cryptographic Failures | Storing passwords in plaintext; MD5 hashing | `bcrypt`/`argon2`; TLS in transit |
| A03 | Injection | Template literal SQL: `` `SELECT * WHERE id = ${id}` `` | Parameterized queries always |
| A04 | Insecure Design | No rate limiting on /login; unlimited file upload | Rate limiter; file size validation |
| A05 | Security Misconfiguration | `X-Powered-By: Express` leaks stack; CORS `*` in production | Security headers; explicit CORS allowlist |
| A06 | Vulnerable Components | Outdated npm packages with known CVEs | `npm audit fix`; Dependabot |
| A07 | Auth Failures | Weak JWT secrets; no expiry; no refresh rotation | Strong secret; short expiry; rotation |
| A08 | Data Integrity Failures | No package-lock.json; no subresource integrity | Lock files; SRI hashes |
| A09 | Logging Failures | Logging passwords in error payloads; no structured logs | Structured logging with PII redaction |
| A10 | SSRF | `fetch(req.query.url)` without validation | Allowlist; block private IP ranges |

**Authentication — JWT**
- Structure: `base64url(header).base64url(payload).base64url(signature)`
- Signature: `HMAC-SHA256(header.payload, secret)` or `RS256` (asymmetric — public key can verify)
- `exp` (expiration), `iat` (issued at), `jti` (JWT ID — blacklistable)
- **Access token:** short-lived (5–15 min); **Refresh token:** long-lived (7–30 days), rotated on use
- Refresh token family: all tokens for a user share a family; reuse of a revoked token revokes the entire family (theft detection)
- `crypto.timingSafeEqual()`: prevents timing attacks when comparing signatures (never use `===`)

**Authorization — RBAC vs ABAC**
- RBAC: User → Roles → Permissions (e.g., `admin` has `user:delete`)
- ABAC: Policy evaluated against subject + resource + environment attributes — more fine-grained, more complex
- Principal-level insight: RBAC for most applications; ABAC when you need "user can only edit their own org's data"

**XSS and CSRF**
- Stored XSS: user-supplied HTML persisted and rendered; fix with `textContent` not `innerHTML`, or DOMPurify
- Reflected XSS: input echoed in response without escaping
- CSRF: exploits browser automatic cookie sending; fix with `SameSite=Strict` cookie flag + CSRF token for state-changing requests
- Content Security Policy (CSP): `Content-Security-Policy: default-src 'self'` — blocks inline scripts

**Secrets Management**
- Never commit secrets to source control (`.env` in `.gitignore`)
- Rotate secrets on any suspected compromise — design systems for zero-downtime rotation
- Use environment variable injection (Kubernetes Secrets, AWS SSM Parameter Store)
- Ephemeral credentials: AWS IAM instance roles vs. long-lived access keys

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Code review | Find all security vulnerabilities in this Node.js API (8+ issues) |
| JWT implementation | Implement `jwtSign`/`jwtVerify` using Node.js `crypto` built-ins only |
| Injection prevention | Fix SQL injection; fix command injection in `exec(userInput)` |
| Auth flow | Describe and implement refresh token rotation with theft detection |
| CORS / CSP | Configure CORS for a multi-origin SPA with credential cookies |

### Real-World Applications

- PCI DSS compliance: card data never in logs, encrypted at rest, TLS 1.2+ in transit
- GDPR: PII redaction in logs, right-to-erasure cascading deletes, data retention policies
- SSRF mitigations in cloud environments: metadata endpoint (`169.254.169.254`) reachable via SSRF
- Supply chain security: `npm audit`, Dependabot, `package-lock.json` integrity

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| OWASP fluency | Names the vulnerability, exploitation path, and exact fix without consulting notes |
| Auth depth | Implements JWT + refresh rotation with theft detection — no `jsonwebtoken` dependency |
| Code review bar | Finds SQL injection, missing auth, PII in logs, and N+1 in a 100-line code review |
| Security culture | Can write a security review checklist for a new API and justify each line item |

---

## Module 10 — Testing and Debugging {#module-10}

**Linked Exercises:** [phase-2-professional-coding/module-07-testing-quality/](phase-2-professional-coding/module-07-testing-quality/)

### Learning Objectives

After this module you will be able to:
- Write unit, integration, and contract tests that are fast, deterministic, and maintainable
- Explain the testing pyramid and know when to violate it deliberately
- Debug production issues using structured logs, distributed traces, and heap snapshots
- Use TDD for complex business logic — write the failing test before the implementation
- Design code for testability (dependency injection, pure functions, isolated side effects)

### Key Concepts

**Testing Pyramid**
- **Unit tests** (base, most): pure functions, isolated components — fast, deterministic, zero I/O
- **Integration tests** (middle): test a real DB query, a real HTTP call — slower, more confidence
- **E2E tests** (apex, fewest): Playwright/Cypress simulating real users — slowest, highest confidence for flows
- **Contract tests** (between services): Pact — verify that service A's API matches what service B expects

**Unit Testing Principles**
- AAA: Arrange (set up state) → Act (invoke) → Assert (verify outcome)
- One assertion per test (conceptually) — one reason to fail
- Tests as documentation: test names describe behavior, not implementation (`'returns 401 when token expired'`)
- Test isolation: each test is independent — no shared mutable state between tests
- Fast feedback: unit tests must run in milliseconds; if a test touches a DB, it is not a unit test

**Test Doubles**
- **Stub:** returns a fixed value — replaces external call with deterministic output
- **Mock:** verifies that a specific call was made with specific arguments
- **Fake:** a working implementation (e.g., in-memory DB instead of Postgres)
- **Spy:** wraps real implementation, records calls — useful for verifying side effects

**Testing Async Code (Node.js built-in `node:test`)**
- Return a Promise from the test for async assertions
- Use `assert.rejects()` for testing rejected Promises
- `before`/`after` for test setup/teardown; `beforeEach`/`afterEach` for per-test isolation
- Time control: `MockTimers` to accelerate `setTimeout`/`setInterval` in tests

**Debugging Techniques**
- Structured logging with correlation IDs: trace a request across 5 services with one `traceId`
- Distributed tracing (OpenTelemetry): `traceparent` header; spans capture latency per operation
- Chrome DevTools / Node.js inspector: breakpoints, watch expressions, async stack traces
- Heap snapshots: take two snapshots before/after a suspected leak; compare retainer trees
- `console.time`/`console.timeEnd` for quick micro-benchmarks; `perf_hooks.performance.now()` for precision

**Test-Driven Development**
- Red → Green → Refactor: write failing test → implement minimally → clean up
- TDD forces you to design the API before the implementation — produces more ergonomic interfaces
- Principal insight: TDD is most valuable for complex algorithmic logic and business rules; less valuable for I/O-heavy integration code

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Unit test design | Write tests for a `createCircuitBreaker` function |
| Async testing | Test a function that retries 3 times with backoff |
| Mocking | Mock `fetch` in a test to simulate network failure |
| Debugging | "Here is a heap snapshot with a leak. What is retaining the memory?" |
| TDD | "Write the tests first, then implement a rate limiter" |

### Real-World Applications

- CI/CD gate: unit tests must pass before merge; integration tests in every PR pipeline
- Contract testing between a React frontend and a Node.js API (Pact)
- Chaos engineering: deliberately inject failures to verify circuit breaker behavior
- Production debugging: structured logs + `traceId` → `grep traceId=abc123 logs.json` finds all related events

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| Test design | Writes tests that document behavior and survive implementation refactors |
| Coverage judgment | Knows which code paths need tests most and why; doesn't worship 100% coverage |
| Debugging rigor | Follows a structured hypothesis-driven process rather than random `console.log` spray |
| Test culture | Can propose a team testing strategy (pyramid, contract tests, mutation testing) |

---

## Module 11 — System Design for Full Stack Engineers {#module-11}

**Linked Exercises:** [phase-3-architecture-and-scale/](phase-3-architecture-and-scale/) · [phase-5-principal-fullstack/](phase-5-principal-fullstack/) · [capstones/](capstones/) · [problem-bank/starter/section-e-architecture.starter.md](problem-bank/starter/section-e-architecture.starter.md)

### Learning Objectives

After this module you will be able to:
- Conduct a full system design interview in 45 minutes using a repeatable framework
- Design scalable systems with explicit capacity estimation, component selection, and trade-off articulation
- Apply the CAP theorem and PACELC correctly to database selection decisions
- Design event-driven architectures with outbox pattern, saga orchestration, and compensation
- Explain the Strangler Fig and other migration patterns for evolving monoliths

### Key Concepts

**System Design Interview Framework (45-Minute Structure)**

| Phase | Time | What You Do |
|-------|------|-------------|
| Clarify requirements | 5 min | Functional reqs; non-functional reqs (scale, latency, consistency); constraints |
| Estimate scale | 5 min | DAU, RPS, storage growth, bandwidth — back-of-napkin with explicit assumptions |
| High-level design | 10 min | Component diagram: client → CDN → LB → API → DB/cache → queue |
| Deep dive | 15 min | Pick the hardest component; detail its design and handle failures |
| Trade-offs | 5 min | What are you giving up? What would you change given 10× more traffic? |
| Wrap-up | 5 min | Operational concerns: monitoring, deployment, runbook |

**Capacity Estimation Rules of Thumb**
- 1 server: ~1k-10k RPS (Node.js, light queries)
- 1 Postgres instance: ~10k QPS for reads, ~1k-3k for writes
- 99th percentile latency target for APIs: ≤100ms (internal), ≤500ms (user-facing)
- Storage: `DAU × avg_event_size × retention_days` — always separate hot vs. cold storage

**Distributed System Fundamentals**
- CAP theorem: Consistency, Availability, Partition Tolerance — pick 2 when a partition exists (and there always will be)
- PACELC: extends CAP — during normal operation (no partition), choose: lower Latency vs. stronger Consistency
- Eventual consistency: last-write-wins, vector clocks, CRDTs for conflict resolution
- Distributed locks: Redlock (Redis multi-node), but prefer idempotent design over locking

**Data Architecture**
- Read replicas: route reads to replicas; writes to primary — watch replication lag
- Horizontal sharding: shard key selection is the hardest decision; hotspot avoidance
- CQRS: Command (write) model separated from Query (read) model — enables different read optimization
- Event sourcing: persist events, not state; replay events to rebuild state
- Polyglot persistence: Postgres for transactional data, Redis for sessions, Elasticsearch for search, S3 for blobs

**Microservices and Event-Driven Architecture**
- Service decomposition: by business capability (domain-driven) — not by technical layer
- Saga orchestration vs. choreography: orchestrator (explicit controller) vs. choreography (services react to events)
- Outbox pattern: write event to DB atomically with business data; separate publisher reads and sends
- Event schema versioning: never remove/rename fields; add-only with optional fields + consumers handle gracefully
- API gateway: single entry point; cross-cutting concerns (auth, rate limit, routing)

**Migration Patterns**
- Strangler Fig: new functionality built as a new service; gradually migrate, strangle the monolith
- Branch by abstraction: introduce an interface over legacy code; swap implementations feature-branch by feature-branch
- Dual-write: write to both old and new systems during transition; validate consistency before cutover

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Classic design | Design Twitter feed, URL shortener, Uber dispatch, notification system |
| Full stack specific | Design a collaborative document editor; design a shopping cart with inventory consistency |
| Event-driven | Design a payment processing pipeline with exactly-once guarantees |
| Migration | Design a migration from a monolith order system to microservices |
| Capacity | Estimate storage and RPS for a chat application serving 10M DAU |

### Real-World Applications

- Netflix: CQRS for playback state; Chaos Monkey testing failure recovery
- Stripe: idempotency keys on every payment API mutation
- Slack: operation transforms for concurrent document editing
- Airbnb: Strangler Fig migration from Rails monolith to microservices
- GitHub: event sourcing for audit log; read replicas for pull request queries

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| Framework discipline | Follows a structured approach; doesn't jump to implementation immediately |
| Scale calibration | Estimates capacity correctly; doesn't over-engineer for 1k users or under-engineer for 10M |
| Failure mode coverage | Proactively identifies what breaks and how to detect + recover |
| Full stack ownership | Considers client caching, CDN, API, database, monitoring — not just the backend |

---

## Module 12 — Principal-Level Engineering Judgment and Leadership Interviews {#module-12}

**Linked Exercises:** [phase-4-interview-simulations/track-d-fullstack-leadership/](phase-4-interview-simulations/track-d-fullstack-leadership/) · [assets/behavioral-principal.md](assets/behavioral-principal.md) · [assets/principal-interview-guide.md](assets/principal-interview-guide.md)

### Learning Objectives

After this module you will be able to:
- Write a production-quality ADR (Architecture Decision Record) defending a technical choice
- Conduct a security-focused code review that identifies severity, impact, and actionable fixes
- Demonstrate technical influence: how you changed direction without authority
- Apply the STAR format at principal level — stories about team impact, not individual contribution
- Facilitate architectural conversations as the senior voice in the room

### Key Concepts

**Architecture Decision Records (ADRs)**
- Purpose: capture *why* a decision was made — not just what was decided
- Structure: Title → Status → Context → Decision → Rationale → Consequences → Trade-offs Accepted → Review Date
- Principal expectation: proactively write ADRs for any decision that affects more than one team or is hard to reverse
- Common pitfalls: ADRs that only document the winner without the alternatives; ADRs without a review date

**Code Review at Principal Level**

Principal-level code review is not about style — it is about correctness, security, performance, and maintainability:

1. **Security** (highest priority): injection, missing auth, PII in logs, path traversal
2. **Correctness**: async race conditions, unhandled rejections, off-by-one, incorrect status codes
3. **Performance**: N+1 queries, unbounded caches (memory leaks), blocking event loop operations
4. **Maintainability**: SRP violations, deep coupling, unclear error types, untestable design
5. **Observability**: swallowed errors (silent catch), missing correlation IDs, no structured logging

See [assets/code-review-rubric.md](assets/code-review-rubric.md) for the full 10-point scoring rubric.

**Technical Influence Without Authority**
- The principal problem: driving adoption across teams you do not manage
- Research before proposing: understand the team's constraints, tech debt, and delivery pressure
- Prototype to make the abstract concrete: a working benchmark beats a 10-page proposal
- Find internal champions: identify the senior IC most likely to advocate — win them over first
- Write the standard, don't mandate it: a shared RFC/ADR that others can comment on → psychological ownership
- Data-driven persuasion: "here is the p99 improvement in our staging environment"

**Engineering Culture Leadership**
- Raise the floor, not just the ceiling: invest in tooling (linting, CI templates, runbooks) that makes the average contributor more effective
- Blameless post-mortems: focus on system failures, not human errors — leads to actionable remediation
- Technical debt governance: segment debt into immediate risk / medium-term risk / accepted debt — different treatment for each
- Mentorship leverage: 1 principal engineer × 5 guided senior engineers = force multiplier

**Interviewing at Principal Level — What Is Different**

| Senior Interview | Principal Interview |
|-----------------|---------------------|
| Solve this coding problem | How would you build a production-grade version of this? |
| Walk me through your design | What alternatives did you consider and why did you reject them? |
| How do you test this? | How do you set the testing strategy for a team of 8? |
| Tell me about a technical challenge | Tell me about a time you changed the technical direction of an organization |
| What would you refactor here? | Write the ADR justifying this refactor and the migration plan |

**Behavioral Question Categories for Principal**
- Technical influence without authority
- Architecture decisions with long-term consequences
- Code review culture and quality bar
- Incident response leadership
- Mentorship and engineering growth
- Cross-team alignment and conflict resolution
- Build vs. buy decisions

See [assets/behavioral-principal.md](assets/behavioral-principal.md) for 10 must-have STAR stories and anti-patterns to avoid.

### Coding Interview Categories

| Category | Example Problems |
|----------|-----------------|
| Code review | Find 8+ critical issues in a Node.js API (SQL injection, N+1, PII in logs, etc.) |
| ADR writing | Write an ADR choosing between REST and GraphQL for a data-heavy dashboard |
| Architecture critique | Evaluate a proposed microservices design and identify the failure modes |
| Migration plan | Design a 3-phase migration from a monolith payments service to a distributed system |
| Technical standard | Write a one-page API design standard for a platform team |

### Real-World Applications

- RFC/ADR process at Stripe, Netflix, and Shopify: engineers expected to write ADRs for any greenfield system
- Code review as a learning tool: PRs at Google require two approvals — the principal's review shapes culture
- Engineering blogs: writing publicly about production decisions demonstrates principal-level thinking
- Incident command: principal engineers expected to lead war rooms, not just contribute

### Senior / Principal Interview Outcomes

| Outcome | What Interviewers Test |
|---------|----------------------|
| ADR quality | Writes a structured decision record that covers alternatives, trade-offs, and review date |
| Review depth | Code review identifies security, performance, and design issues — not just style |
| Story calibration | STAR stories demonstrate *team and organizational* impact, not individual heroics |
| Leadership posture | Demonstrates multiplier thinking: how do I make the team around me better? |

---

## Complete Preparation Checklist

### Foundation Readiness (Modules 1–5)
- [ ] Can explain TDZ, hoisting, and prototype chain from memory in under 90 seconds
- [ ] Can implement `bind`, `memoize`, and `curry` from scratch on a whiteboard
- [ ] Can trace event loop order for any async program with mixed Promises and timers
- [ ] Can implement LRU cache and binary search tree in under 30 minutes
- [ ] Can identify SOLID violations in a 50-line code sample

### Professional Coding Readiness (Modules 6–7)
- [ ] Can explain React fiber, reconciliation, and concurrent mode without notes
- [ ] Can implement `debounce`, `throttle`, and `eventDelegate` from scratch
- [ ] Can design an idempotent REST API with cursor pagination
- [ ] Can implement a parameterized SQL query builder that prevents injection
- [ ] Can implement JWT sign/verify using `crypto` built-ins only

### Architecture Readiness (Modules 8–10)
- [ ] Can implement circuit breaker, retry with jitter, and bulkhead from scratch
- [ ] Can define an SLO and calculate its error budget
- [ ] Can find all 8 issues in the [Track D code review starter](phase-4-interview-simulations/track-d-fullstack-leadership/code-review-round/starter/code-under-review.js)
- [ ] Can write tests that are deterministic, fast, and survive implementation refactors
- [ ] Can interpret a heap snapshot and identify the retaining path

### Principal Readiness (Modules 11–12)
- [ ] Can complete a system design for a notification platform, chat system, or order workflow in 45 minutes
- [ ] Can write a full ADR with alternatives, rationale, and consequences
- [ ] Can deliver 10 STAR behavioral stories at the organizational-impact level
- [ ] Have scored ≥ 7.5 on [Track D scorecard](phase-4-interview-simulations/track-d-fullstack-leadership/scorecard.md) across all three rounds
- [ ] Can explain the trade-offs between any two technology choices in 60 seconds

---

## Resources Quick Reference

| Resource | Purpose |
|----------|---------|
| [phase-1-foundations/](phase-1-foundations/) | Modules 1–4 starter + solution code |
| [phase-2-professional-coding/](phase-2-professional-coding/) | Modules 5–7 starter + solution code |
| [phase-3-architecture-and-scale/](phase-3-architecture-and-scale/) | Modules 8, 11 |
| [phase-4-interview-simulations/](phase-4-interview-simulations/) | Mock interview Tracks A/B/C/D |
| [phase-5-principal-fullstack/](phase-5-principal-fullstack/) | Modules 9, 12 — TypeScript, Auth, Observability |
| [problem-bank/](problem-bank/) | 56 coded problems across 7 sections |
| [capstones/](capstones/) | 3 production-scale build projects |
| [assets/interview-scorecard.md](assets/interview-scorecard.md) | Self-assessment rubric after each mock |
| [assets/principal-interview-guide.md](assets/principal-interview-guide.md) | Signal framework, domain deep-dives |
| [assets/code-review-rubric.md](assets/code-review-rubric.md) | 10-point code review scoring |
| [assets/behavioral-principal.md](assets/behavioral-principal.md) | STAR question bank (6 themes, 10 stories) |
| [study-plan-16-weeks.md](study-plan-16-weeks.md) | Week-by-week execution plan |
