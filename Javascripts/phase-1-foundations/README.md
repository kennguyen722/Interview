# Phase 1: Foundations (Novice -> Junior)

Goal: Build strong JavaScript fundamentals and coding habits used in interviews.

## Module 1: JavaScript Core Syntax and Runtime Basics

Focus:
- Variables, scope, hoisting, closures
- Primitive vs reference types
- Objects, arrays, destructuring, spread/rest
- Prototypes and inheritance model

Practice tasks:
- Implement `groupBy`, `deepClone`, `flattenArray`
- Explain closure use cases and pitfalls
- Build a minimal `EventEmitter` from scratch

Interview drill:
- "What is lexical scope and how do closures work in async loops?"

## Module 2: Functions, Patterns, and Clean Coding

Focus:
- Function declarations vs expressions vs arrow functions
- Higher-order functions (`map`, `reduce`, `filter`)
- Pure functions, immutability basics
- Guard clauses and readability patterns

Practice tasks:
- Implement custom `map`, `filter`, `reduce`
- Refactor imperative code into composable functions
- Add input validation and error handling

Interview drill:
- "When should you avoid functional style in production code?"

## Module 3: Data Structures and Algorithmic Thinking

Focus:
- Arrays, objects, maps, sets
- Stacks, queues, linked lists, hash tables (JS implementation)
- Sliding window, two pointers, prefix sum
- Big-O analysis and trade-off discussion

Practice tasks:
- LRU cache implementation
- Top-k frequent elements
- Debounced search optimization logic

Interview drill:
- "How would you justify a higher memory solution for better latency?"

## Module 4: Asynchronous JavaScript and Event Loop

Focus:
- Call stack, event loop, microtasks vs macrotasks
- Promises, async/await, error propagation
- Concurrency controls (`Promise.all`, `allSettled`, pooling)
- Cancellation with `AbortController`

Practice tasks:
- Build `retryWithBackoff`
- Build `promisePool` with concurrency limits
- Implement timeout wrapper for any async operation

Interview drill:
- "Why does `await` in loops sometimes hurt performance?"

## Exit Criteria

- Solve beginner/medium coding prompts in under 40 minutes.
- Explain event loop behavior using concrete execution order examples.
- Write code with edge-case handling and tests.

## Module Folders

- [module-01-core-runtime](module-01-core-runtime)
- [module-02-functions-clean-code](module-02-functions-clean-code)
- [module-03-data-structures-algorithms](module-03-data-structures-algorithms)
- [module-04-async-event-loop](module-04-async-event-loop)
