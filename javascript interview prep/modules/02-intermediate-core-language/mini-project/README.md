# Mini-Project: Policy and Plugin Runtime

## Scenario
You are building a modular internal policy engine for an enterprise admin portal. Product teams can register plugins that enrich user policy context, but platform engineering must keep runtime behavior safe and predictable.

## Goals
- Practice generators and iterators for pipeline execution.
- Use Symbols to attach private metadata.
- Use WeakMap/WeakSet for lifecycle-safe caches/visited tracking.
- Use property descriptors to lock critical config values.
- Use optional chaining and nullish coalescing in projection code.
- Explain CommonJS vs ESM choice in a short note.

## Tasks
1. Implement plugin runtime with ordered execution.
2. Implement descriptor-locked config object.
3. Implement weak memoized evaluator for object keys.
4. Implement safe user projection accessor.
5. Implement short module-system comparison helper.

## Files
- starter/index.js
- solution/index.js
- tests/mini-project-02.test.js
