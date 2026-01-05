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
