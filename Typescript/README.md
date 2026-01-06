# TypeScript Mastery Track

A complete path from zero to production-ready TypeScript, written for engineers preparing for interviews and real-world delivery. Each lesson includes detailed explanations, working code examples, exercises with solutions, and real-world patterns.

## Course Structure

Each lesson folder contains:
- **lesson.md**: Theory, concepts, and explanations
- **examples/**: Working code demonstrating key concepts
- **exercises/**: Practice problems to solve (starter files)
- **solution/**: Complete solutions with explanations

## Lesson Map

### 01. Setup and Tooling
- Install TypeScript, ts-node, configure tsconfig.json
- Understand strict mode and compiler options
- **Examples**: basic TS features, strict mode benefits
- **Exercise**: Set up a project, toggle strict mode, verify compilation

### 02. Language Basics
- Type annotations, inference, primitives, and literals
- Unions, intersections, control-flow narrowing
- Functions, arrays, tuples, optional properties
- **Examples**: Type narrowing, discriminated unions, function typing
- **Exercise**: Build formatUser, API response handler, tuple-based error returns

### 03. Objects and Classes
- Interfaces, structural typing, readonly properties
- Index signatures, classes, visibility modifiers, getters/setters
- **Examples**: Classes with interfaces, parameter properties, private fields
- **Exercise**: ServiceConfig interface, Queue generic class, Repository pattern

### 04. Advanced Types
- Generics, constraints, mapped types, indexed access
- Conditional types, type inference, utility types (Partial, Pick, Record, etc.)
- **Examples**: Generic constraints, mapped types, conditional logic
- **Exercise**: deepFreeze function, Values utility, Brand type for nominal typing

### 05. Modules and Build
- ES modules, CommonJS, export patterns
- Path aliases (baseUrl, paths in tsconfig)
- Build tools: ts-node, esbuild, Vite, tsup
- **Examples**: Module exports, path aliasing, build configuration
- **Exercise**: Configure path aliases, build library with tsup, switch ESM/CJS

### 06. Async and Promises
- Promise typing, async/await, Result pattern for error handling
- Concurrency: Promise.all, allSettled, race, any
- Cancellation with AbortController
- **Examples**: Async functions, Result type, error narrowing, retry logic
- **Exercise**: withTimeout, retry with backoff, fetchAndValidate

### 07. Testing and Quality
- Vitest / Jest setup for TypeScript
- Type-level tests with expectTypeOf
- Runtime validation with zod
- ESLint, Prettier integration
- **Examples**: Unit tests, type assertions, schema validation
- **Exercise**: Test sum function, verify type inference, validate API responses

### 08. Node and Express APIs
- Request/Response typing, middleware, error handlers
- Separation of concerns: domain vs transport
- Declaration merging for custom request properties
- **Examples**: Typed routes, middleware stacks, error handling
- **Exercise**: Health endpoint, GET /users/:id, error handler middleware

### 09. Frontend with React
- Props, state, hooks typing (useState, useContext)
- Generic components (Select<T>, etc.)
- Discriminated unions for UI states
- Context and custom hooks
- **Examples**: Typed components, hooks, context patterns
- **Exercise**: Select component, LoadState union rendering, useUser hook

### 10. Patterns and Architecture
- Domain modeling with rich types
- Result/Either pattern, exhaustive matching with assertNever
- State machines with discriminated unions
- Dependency injection, immutability
- **Examples**: Domain types, state reducers, injectable dependencies
- **Exercise**: assertNever implementation, Cache interface, Order state machine

### 11. Migration and Interview Prep
- Gradual JS-to-TS migration (allowJs, checkJs)
- Pitfalls: any, wide types, error handling, ESM/CJS mixing
- Branded types, refactoring patterns
- 7 key interview questions with full answers
- **Examples**: Migration workflow, type safety improvements
- **Exercise**: Migrate JS module, replace any types, answer interview questions

---

## Advanced Lessons (12-16)

### 12. Advanced Generics & Type Manipulation
- Variance (covariance, contravariance, invariance)
- Higher-kinded types and builder patterns
- Recursive types: DeepReadonly, PathOf
- Variadic tuple types and template literals
- Advanced infer patterns for type extraction
- **Examples**: TypeSafeBuilder, Curry function, pipe utilities, QueryBuilder
- **Exercise**: Compose functions, DeepFlatten, TemplateLiteralParser, TypeSafeEventEmitter

### 13. Design Patterns in TypeScript
- Creational: Factory, Builder, Singleton with type safety
- Structural: Adapter, Decorator, Proxy patterns
- Behavioral: Strategy, Observer, Command with undo/redo
- Functional: Maybe/Either monads for error handling
- **Examples**: ShapeFactory, DatabaseConnection singleton, Coffee decorator chain, TypedEventBus, CommandInvoker
- **Exercise**: Plugin system, Memento pattern, Chain of Responsibility, Either monad

### 14. Type-Level Programming
- Type-level arithmetic (increment/decrement using tuple length)
- String manipulation at type level (path parsing, case conversion)
- Recursive type construction and deep traversal
- Parser combinators with type inference
- Advanced infer patterns and pattern matching
- Type-safe state machines with compile-time validation
- **Examples**: Inc/Dec types, Split paths, Get/Set by path, ExtractRouteParams, TrafficLight state machine, DeepPartial
- **Exercise**: Range type, DeepReadonly, Join type, PathOf, TypedEventEmitter, Curry type, FizzBuzz, Pipe type

### 15. Domain-Driven Design & Hexagonal Architecture
- DDD building blocks: Value Objects, Entities, Aggregates
- Branded types for value objects with validation
- Domain events and event-driven architecture
- Ports & Adapters (Hexagonal Architecture)
- Repository pattern and dependency injection
- Anti-corruption layers for legacy integration
- **Examples**: E-commerce domain (Order aggregate, Money value object, Payment entity), Event bus, Use cases
- **Exercise**: User management context, Inventory with SKU, Payment processing, Notification adapters, Event handlers

### 16. Performance Optimization & Production Patterns
- Compiler optimization (incremental builds, project references)
- Bundle size optimization (tree shaking, code splitting)
- Runtime performance (memoization, lazy evaluation, object pooling)
- Memory management (WeakMap, cache expiration, cleanup)
- Production patterns (structured logging, health checks, graceful shutdown)
- Rate limiting, circuit breakers, request deduplication
- **Examples**: Memoize function, LRU cache, ExpiringCache, ObjectPool, Logger, HealthChecker, Application shutdown
- **Exercise**: LRU cache, Fibonacci memoization, Rate limiter, Batch processor, Circuit breaker, Performance monitor, Retry with backoff, Event stream processor

---

## Expert Lessons (17-21)

### 17. TypeScript Compiler Internals & AST Manipulation
- TypeScript Compiler API and program structure
- Abstract Syntax Tree (AST) traversal and manipulation
- Custom transformers and code generation
- Static analysis tools and linters
- Type checker API usage
- Building developer tools (code generators, analyzers, documentation tools)
- **Examples**: AST explorer, function counter, import extractor, complexity calculator, performance profiler injector
- **Exercise**: Class property extractor, decorator analyzer, dependency graph, React props extractor, type guard generator, barrel file generator

### 18. Advanced Testing Patterns & Strategies
- Property-based testing with fast-check
- Contract testing for microservices (Pact)
- Snapshot testing best practices
- Test doubles: Mocks, Stubs, Spies, Fakes
- Mutation testing with Stryker
- Integration testing strategies
- Time and async testing patterns
- **Examples**: Property tests for arrays/strings, contract test patterns, snapshot normalization, test double implementations, debounce testing
- **Exercise**: Sort algorithm property tests, API gateway contracts, component snapshots, type-safe mocks, mutation coverage improvement

### 19. Security & Type Safety
- Input validation and sanitization with branded types
- SQL injection prevention through parameterized queries
- XSS (Cross-Site Scripting) prevention
- Type-safe authentication (JWT, sessions)
- Role-based access control (RBAC) with types
- Cryptography and secret management
- API security: rate limiting, CORS, request validation
- OWASP Top 10 coverage with TypeScript patterns
- **Examples**: Validated input types, SQL-safe query builders, XSS-safe rendering, JWT auth, RBAC systems, secret managers
- **Exercise**: Form validation, SQL query builder, safe HTML templating, auth system, permission management, rate limiter, CORS middleware

### 20. Distributed Systems & Microservices Patterns
- Event Sourcing: event store, aggregate reconstruction, snapshotting
- CQRS (Command Query Responsibility Segregation)
- Saga Pattern: orchestration vs choreography, compensating transactions
- Message queues: RabbitMQ/Kafka integration, type-safe contracts
- Service mesh: circuit breakers, retries, bulkheads
- Distributed tracing and observability
- Eventual consistency and conflict resolution
- **Examples**: Event sourcing implementation, CQRS architecture, saga state machine, message queue integration, resilience patterns
- **Exercise**: Order saga workflow, event store design, command/query handlers, distributed transaction coordinator, circuit breaker with metrics

### 21. Real-Time Applications & WebSocket Patterns
- Type-safe WebSocket client/server communication
- Server-Sent Events (SSE) for one-way push
- Real-time data synchronization (Operational Transformation, CRDTs)
- WebRTC for peer-to-peer connections
- Pub/Sub patterns with Redis/Socket.IO
- Connection lifecycle management and reconnection strategies
- Scaling real-time systems (sticky sessions, state sync)
- **Examples**: Type-safe WebSocket protocol, connection manager, SSE streams, collaborative editing, presence detection
- **Exercise**: Chat application, real-time dashboard, collaborative document editor, video call signaling, presence system, horizontal scaling

---

## OOP & Design Patterns Mastery (22-26)

### 22. Advanced OOP & SOLID Principles
- Single Responsibility Principle (SRP): One reason to change
- Open/Closed Principle (OCP): Open for extension, closed for modification
- Liskov Substitution Principle (LSP): Substitutability without breaking correctness
- Interface Segregation Principle (ISP): Many specific interfaces over one general
- Dependency Inversion Principle (DIP): Depend on abstractions, not concretions
- Composition over Inheritance patterns
- Abstract classes vs interfaces in TypeScript
- Template Method pattern for algorithm skeletons
- Design by Contract principles
- **Examples**: SRP refactoring, OCP with plugin architecture, LSP with bird hierarchy, ISP with segregated interfaces, DIP with dependency injection, Composition patterns, Template Method implementation
- **Exercise**: User/Repository/EmailService separation, Shape hierarchy extension, Bird substitutability, Worker interfaces, OrderService with abstractions, Vehicle composition, DataProcessor template, Rich domain model, Stack with contracts, Strategy with DIP

### 23. Creational Design Patterns - Deep Dive
- Factory Method: Define interface for creating objects
- Abstract Factory: Create families of related objects
- Builder: Construct complex objects step by step with fluent interface
- Prototype: Clone objects without coupling to concrete classes
- Singleton: Ensure class has only one instance with global access point
- Type-safe factories with generics
- Fluent builders with method chaining
- Deep cloning strategies
- Thread-safe singletons (async-safe in TypeScript)
- **Examples**: Document factory (PDF, Word, Text), UI factory (Windows, Mac), HTTP request builder, User prototype registry, Configuration singleton
- **Exercise**: Logger factory, Cross-platform UI library, SQL query builder, Game character cloning, Application configuration, Plugin system, Data serializer factory, Theme system, Form builder, Template manager

### 24. Structural Design Patterns - Deep Dive
- Adapter: Convert incompatible interfaces
- Bridge: Decouple abstraction from implementation
- Composite: Compose objects into tree structures
- Decorator: Attach additional responsibilities dynamically
- Facade: Provide unified interface to complex subsystem
- Flyweight: Share common state to support large numbers of objects
- Proxy: Control access with surrogates (Virtual, Protection, Caching proxies)
- **Examples**: Payment gateway adapter, Notification bridge (Email/SMS/Push), File system composite, Coffee decorator chain, Video converter facade, Tree flyweight for games, Image proxy (lazy loading, caching, access control)
- **Exercise**: Multiple payment gateways, Multi-platform rendering, Organization hierarchy, Text formatting pipeline, E-commerce checkout facade, Particle system, Image gallery with proxies, UI framework, Notification system, Cloud storage manager

### 25. Behavioral Design Patterns - Deep Dive
- Strategy: Encapsulate interchangeable algorithms
- Observer: One-to-many dependency for state changes
- Command: Encapsulate requests as objects with undo/redo
- Chain of Responsibility: Pass requests along handler chain
- State: Alter behavior when internal state changes
- Template Method: Define algorithm skeleton with varying steps
- Memento: Capture and restore object state
- Iterator: Access elements sequentially without exposing representation
- Mediator: Centralize complex communications
- Visitor: Add operations without modifying classes
- Interpreter: Evaluate language grammar
- **Examples**: Payment strategy, Weather station observer, Light command with undo, Authentication chain, Vending machine state, Data parser template, Book iterator
- **Exercise**: Sorting algorithms, Stock market monitoring, Text editor with undo/redo, Request processing pipeline, Vending machine, Chat room mediator, Game save system, Playlist iterators, Data import pipeline, AST visitor, Event sourcing system, Game AI with states

### 26. Architectural Patterns & Clean Architecture
- Layered Architecture (N-Tier): Presentation, Application, Domain, Infrastructure
- Clean Architecture (Uncle Bob): Entities, Use Cases, Interface Adapters, Frameworks
- Hexagonal Architecture (Ports & Adapters): Domain core with pluggable adapters
- CQRS (Command Query Responsibility Segregation): Separate read and write models
- Event-Driven Architecture: Loosely coupled event producers and consumers
- Microservices Patterns: API Gateway, Service Discovery, Circuit Breaker, Saga
- Module Pattern: Self-contained units with explicit dependencies
- Onion Architecture: Dependency direction toward domain core
- Event Sourcing with snapshots and projections
- Anti-patterns to avoid (Big Ball of Mud, Lasagna Architecture, Anemic Domain Model)
- **Examples**: Clean architecture with Order domain, Hexagonal user service, CQRS product system, Layered banking app, Modular application bootstrapping
- **Exercise**: Blog platform with Clean Architecture, E-commerce with Hexagonal, Task management with CQRS, Order processing with events, Banking with layers, Microservices with patterns, Modular monolith CMS, Social media with CQRS, Trading platform with event sourcing, Healthcare with Onion, Multi-architecture system, Monolith-to-microservices migration

---

## Interview & Production Mastery (27-32)

### 27. Code Review Best Practices & Guidelines
- The purpose of code reviews: knowledge transfer, quality gates, architecture validation
- What to look for: correctness, type safety, error handling, performance, complexity, testing, security
- How to give effective feedback: specific, explanatory, actionable, acknowledging good work
- Code review checklist: architecture, type safety, errors, performance, testing, security, documentation
- Anti-patterns: the nitpicker, perfectionist, gatekeeper, ghost reviewer
- Receiving feedback: listening, clarifying, implementing, explaining, thanking
- **Key Skills**: Constructive feedback, pattern recognition, mentoring mindset, pragmatism

### 28. Interview Strategies & Problem-Solving Patterns
- Interview framework: clarify (2-3 min), approach (2-3 min), code (10-15 min), test (5 min)
- Common patterns: Two Pointers, Sliding Window, Binary Search, DFS/BFS, Dynamic Programming, Backtracking
- What interviewers look for: Technical skills (50%), Communication (30%), Attitude (20%)
- Common mistakes: coding without thinking, not testing edge cases, giving up when stuck
- Communication template: opening, approach discussion, during coding, before finishing
- Problem difficulty levels: Easy (5-10 min), Medium (15-20 min), Hard (30-45 min)
- **Key Skills**: Pattern recognition, clear communication, edge case thinking, handling uncertainty

### 29. Algorithm Optimization & Complexity Analysis
- Big O analysis: O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ), O(n!)
- Space complexity analysis: heap vs stack, recursive call stacks
- Optimization strategies: hash maps for lookups, sorting for order, memoization, two pointers
- Space-time tradeoffs: when to optimize for time vs space
- Complexity reduction checklist: data structures, preprocessing, DP, scope reduction, parallelization
- Interview template: analyze current solution, identify bottleneck, suggest approach, explain tradeoffs
- **Key Skills**: Complexity analysis, pattern optimization, tradeoff analysis, explanation clarity

### 30. Production Code Patterns & Best Practices
- Error handling: Result type (railway oriented), try-catch with type narrowing
- Validation: schema-based validators, type guards
- Logging: structured logging with context, levels, timestamps
- Configuration: type-safe config loading, validation, environment management
- Resilience patterns: circuit breaker, retry with exponential backoff
- Dependency injection: decoupling with interfaces, testability
- **Key Skills**: Error handling design, validation strategies, logging architecture, dependency management

### 31. Performance Analysis & Profiling
- Measurement tools: Performance API, memory profiling, query logging
- Identifying bottlenecks: N+1 queries, unnecessary data transfer, inefficient algorithms
- Caching strategies: LRU cache, memoization with expiration, cache invalidation
- Bundle size analysis: identifying large imports, tree shaking opportunities
- Database optimization: query logging, slow query detection, index analysis
- Common issues: object creation in loops, regex compilation, unnecessary allocations
- Production monitoring: APM integration, slow operation alerts
- **Key Skills**: Performance measurement, bottleneck identification, caching design, monitoring setup

### 32. Testing Strategies for Interviews & Production
- Testing pyramid: Unit (80%), Integration (15%), E2E (5%)
- Unit testing: Arrange-Act-Assert, edge cases, error handling, async code
- Test doubles: stubs, mocks, spies, fakes
- Coverage guidelines: >80% target, what to test vs what not to test
- Interview testing: function testing, integration testing, edge case completeness
- TDD: Red-Green-Refactor cycle
- Testing checklist: before, during, after writing tests
- **Key Skills**: Test design, coverage analysis, mock usage, TDD application

---

## How to Use This Course

1. **For fresh learners**: Start with lesson-01 and progress sequentially.
2. **For existing TypeScript users**: Review specific lessons or jump to advanced topics.
3. **For interview prep**: Complete lesson-11 exercises and study the answer explanations.

### Practice Loop
- Read **lesson.md** to understand concepts
- Study **examples/** code
- Complete **exercises/starter.ts** on your own
- Compare your solution with **solution/**
- Run `npx tsc --noEmit` to verify compilation

### Environment Setup
```bash
# Initial setup (once per system)
npm install -g typescript ts-node

# Per project
npm init -y
npm install -D typescript ts-node @types/node
npx tsc --init  # Creates tsconfig.json
```

Then for each lesson:
```bash
cd lesson-NN-name
npm run build    # tsc --noEmit
npm test         # if applicable
```

## Prerequisites
- Comfortable with modern JavaScript (ES2015+)
- Basic CLI and Git familiarity
- Node.js LTS (>=18) installed

## Recommended References
- Official handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- TSConfig reference: https://www.typescriptlang.org/tsconfig
- Utility types: https://www.typescriptlang.org/docs/handbook/utility-types.html
- Discriminated unions: https://basarat.gitbook.io/typescript/type-system/discriminated-unions
