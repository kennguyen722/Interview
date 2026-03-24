# Module 16: Database & Data Layer Engineering

## Why This Matters for Principal Interviews

Data modeling and query efficiency distinguish senior from principal engineers. You'll be asked to:
- Identify N+1 queries and fix them
- Design schema migrations with zero downtime
- Explain trade-offs between different consistency models
- Implement repository and unit-of-work patterns

## Topics

### 1. Repository Pattern
Isolates domain objects from the database. The domain layer works with `UserRepository.findById(id)` and never writes raw SQL. Benefits:
- Easy to test (swap real DB with in-memory repo)
- Single place to manage query logic per aggregate

### 2. Unit of Work
Tracks all entity changes during a request (new, dirty, deleted). On `commit()`, it writes all changes in a single transaction.
- Prevents partial writes
- Coordinates across multiple repositories

### 3. Query Builder
A fluent interface for constructing SQL queries programmatically.
```js
db.from('users').where('role', '=', 'admin').orderBy('created_at', 'desc').limit(10).build()
// → "SELECT * FROM users WHERE role = ? ORDER BY created_at DESC LIMIT 10"
```

### 4. Connection Pool Manager
Databases accept limited connections. A connection pool:
- Maintains N idle connections ready to use
- Lends connections with a timeout
- Returns connections to the pool on release

### 5. Migration Runner
Applies schema migrations in order, tracking applied migrations in a `schema_migrations` table.
- Migrations are idempotent (running twice has no effect)
- Supports up/down for rollback

### 6. Eager Loading (N+1 Prevention)
Instead of querying each user's orders in a loop, batch-load all orders for a user list in one query and map results back.

## Interview Drill Questions

- "How does the repository pattern help with testability?"
- "Explain the unit of work pattern and when you'd use it over direct DB calls."
- "How do you perform a zero-downtime database migration?"
- "What is an N+1 query? How does eager loading fix it?"
- "When would you use a read replica vs write primary in a web application?"
- "Explain optimistic vs pessimistic locking and when you'd choose each."

## Assignment

Implement each concept in `starter/index.js`. Run with:
```powershell
node phase-5-principal-fullstack/module-16-database-layer/solution/index.js
```
