# Module 15: Full Stack Integration Patterns

## Why This Matters for Principal Interviews

Full stack engineers own the entire request lifecycle. Principal-level interviews test whether you can design systems end-to-end: from how a React component fetches data, through the API layer, to how the server talks to the database, and how errors are surfaced back to the user.

## Topics

### 1. Backend for Frontend (BFF) Pattern
A BFF is a server layer tailored to a specific frontend (e.g., mobile app gets its own BFF, web app gets its own). It:
- Aggregates multiple microservices into one response
- Transforms/simplifies data for the UI
- Handles auth context and session logic specific to the client

### 2. GraphQL Resolver Execution
GraphQL executes queries by resolving each field independently. Understanding this:
- Each field resolver receives `(parent, args, context, info)`
- The root resolver kicks off field-by-field resolution
- N+1 queries occur when a list resolver calls a child resolver per item

### 3. DataLoader: N+1 Query Elimination
DataLoader batches multiple `.load(id)` calls in one tick into a single batch query.
- Key patterns: batching + per-request caching
- Critical for GraphQL but useful in any layered resolver architecture

### 4. API Versioning Strategies
- **URL path versioning**: `/v1/orders`, `/v2/orders`
- **Header versioning**: `Accept: application/vnd.api+json; version=2`
- **Additive approach**: Never break existing fields; only add new ones with deprecation notices

### 5. Server-Side Rendering (SSR) & Hydration
SSR sends pre-rendered HTML to the browser for faster First Contentful Paint.
- Server produces HTML + a JSON blob (`window.__INITIAL_DATA__`) of the data used
- Browser hydrates: React attaches event listeners without re-running fetches
- Hydration mismatches occur when server and client HTML differ

### 6. Feature Flags Middleware
Enables safe progressive rollout of new features by controlling which users see which code paths.

## Interview Drill Questions

- "When would you introduce a BFF layer instead of having the frontend call microservices directly?"
- "Explain the N+1 problem in GraphQL and how DataLoader solves it."
- "What are the tradeoffs between URL versioning and header versioning?"
- "How does React hydration work and what causes hydration mismatches?"
- "How would you safely roll out a database schema change to a running service?"
- "Design an API gateway that handles auth, rate limiting, and request transformation."

## Assignment

Implement each pattern in `starter/index.js`. Run with:
```powershell
node phase-5-principal-fullstack/module-15-fullstack-patterns/solution/index.js
```
