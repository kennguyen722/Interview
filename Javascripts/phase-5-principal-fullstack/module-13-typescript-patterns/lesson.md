# Module 13: TypeScript & Advanced Type Patterns

## Why This Matters for Principal Interviews

TypeScript is now the default language for full-stack JavaScript. Principal engineers are expected to:
- Design type-safe APIs that catch contract violations at compile time
- Use advanced generic patterns to eliminate runtime errors
- Explain type system tradeoffs and compiler behavior
- Implement structural vs nominal typing strategies
- Design type-safe dependency injection, event systems, and state machines

## Topics

### 1. The Result Monad (`Result<T, E>`)
A typed alternative to throwing exceptions. Forces callers to handle errors explicitly.
- `Ok<T>` — success path with value
- `Err<E>` — failure path with typed error
- Chainable: `.map()`, `.flatMap()`, `.mapError()`, `.unwrapOr()`

### 2. Discriminated Unions & State Machines
Use a `type` tag field to model mutually exclusive states.
- Order FSM: `pending → confirmed → shipped → delivered`
- Protection against invalid state transitions
- Exhaustive pattern matching via `switch (state.type)`

### 3. Branded / Nominal Types
Prevent passing a `UserId` where an `OrderId` is expected by adding a brand.
- `type Email = string & { __brand: 'Email' }`
- Runtime validators as zero-cost type guards

### 4. Generic Typed Event Emitter
A type-safe event bus where `.on('user:login', handler)` infers the payload type via an event map.

### 5. Builder Pattern with Validation
Fluent builder that accumulates fields and validates on `.build()`, returning `Result<User, Error>`.

### 6. Generic Memoize with TTL
Wraps any function with a typed cache. Parameterized by a key function and TTL.

### 7. Type-Safe Dependency Injection Container
Resolves services by token (Symbol), enforces registration before resolution, supports singleton and transient lifetimes.

## Interview Drill Questions

- "What's the difference between structural and nominal typing in TypeScript?"
- "When would you choose `unknown` vs `any` vs `never`?"
- "How do you make a type that extracts all keys whose values are functions?"
- "Explain `infer` in conditional types with a practical example."
- "How would you implement a type-safe Redux reducer without any `any`?"
- "What's a discriminated union and when would you use one over a class hierarchy?"

## Assignment

Implement each pattern in `starter/index.js`. Run with:
```powershell
node phase-5-principal-fullstack/module-13-typescript-patterns/solution/index.js
```
