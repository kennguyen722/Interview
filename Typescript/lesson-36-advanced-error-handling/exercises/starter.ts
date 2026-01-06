/**
 * LESSON 36: Advanced Error Handling - EXERCISES
 */

// ============================================================================
// EXERCISE 1: Result Type with Full API
// ============================================================================

/*
Build a complete Result<T, E> type with methods:

1. ok(value): Result<T, E> - create success
2. err(error): Result<T, E> - create failure
3. map(fn: T => U): Result<U, E> - transform success
4. mapError(fn: E => F): Result<T, F> - transform error
5. flatMap(fn: T => Result<U, E>): Result<U, E> - chain operations
6. getOrElse(default: T): T - extract with fallback
7. getOrThrow(message?: string): T - throw if error
8. fold(onError, onSuccess): R - handle both cases

Example:
  ok(5).map(x => x * 2).flatMap(x => ok(x + 1)).getOrElse(0) // 11
  err("failed").map(x => x * 2).getOrElse(0) // 0
  
Hints:
- Use discriminated union for type safety
- Map doesn't run on error, just passes it through
- FlatMap only runs if previous was success
- Fold lets you extract value by handling both cases
*/

// TODO: Implement Result type class with all methods
// TODO: Add toString() for debugging
// TODO: Test chaining multiple operations

// ============================================================================
// EXERCISE 2: Railway-Oriented Validation Pipeline
// ============================================================================

/*
Build validation pipeline for user registration:

1. validateEmail: must contain @ and domain
2. validatePassword: 8+ chars, 1 uppercase, 1 number, 1 special
3. validateUsername: 3-20 chars, alphanumeric + underscore only
4. validateAge: 18+
5. Chain all validations with flatMap
6. Collect errors if ALL fail (not just first)
7. Return success with User object or all errors

Example Input:
  { email: "invalid", password: "weak", username: "ab", age: 15 }

Expected Output:
  {
    kind: "failure",
    errors: [
      "Invalid email format",
      "Password must contain uppercase, number, and special char",
      "Username must be 3-20 characters",
      "Must be 18 years old"
    ]
  }
  
Hints:
- Use flatMap to chain validations
- For error accumulation, validate all fields regardless
- Return array of ALL errors, not just first
- Use regex for format validation
*/

// TODO: Implement email validator
// TODO: Implement password validator
// TODO: Implement username validator
// TODO: Implement age validator
// TODO: Implement validateUserRegistration that combines all

// ============================================================================
// EXERCISE 3: Async Result Wrapper & Sequential Operations
// ============================================================================

/*
Task: Handle async operations safely with Result types

1. Implement toResult<T>(promise: Promise<T>): Promise<Result<T>>
2. Chain async operations: fetch user → fetch posts → fetch comments
3. Stop on first error (short-circuit)
4. Accumulate timing information
5. Handle timeouts

Example:
  const user = await toResult(fetchUser(1));
  if (!user.ok) return user; // early exit on error
  
  const posts = await toResult(fetchUserPosts(user.value.id));
  if (!posts.ok) return posts; // early exit on error
  
  const comments = await toResult(fetchPostComments(posts.value[0].id));
  return comments;
  
Hints:
- toResult wraps Promise to Result
- Use early returns for error short-circuit
- Track timing: start time → elapsed
- Add timeout: wrap promise in Promise.race([original, timeout(ms)])
- Log at each step for debugging
*/

// TODO: Implement toResult wrapper
// TODO: Implement withTimeout utility
// TODO: Implement sequential async pipeline

// ============================================================================
// EXERCISE 4: Retry with Exponential Backoff
// ============================================================================

/*
Task: Implement robust retry mechanism

1. retry<T>(fn, maxAttempts, baseDelay): Promise<Result<T>>
2. Exponential backoff: delay = baseDelay * 2^(attempt-1)
3. Add jitter to avoid thundering herd: delay *= (1 + random(0, 0.1))
4. Log each attempt with timing
5. Add before/after hooks for monitoring
6. Handle specific error types (retry only on transient errors)

Example:
  const result = await retry(
    () => fetchAPI(),
    { maxAttempts: 3, baseDelay: 100, jitter: true }
  );
  
Jitter Example: delay = 100ms, then 200ms ± 10%, then 400ms ± 10%
  
Hints:
- Track elapsed time per attempt
- Exponential formula: 2^n grows fast (100, 200, 400, 800...)
- Jitter: delay * (1 + Math.random() * jitterFactor)
- Log: attempt N, delay, error type
- Some errors shouldn't retry (404, 403 vs 500, 429)
*/

// TODO: Implement retry function
// TODO: Implement exponential backoff calculation
// TODO: Implement jitter
// TODO: Implement isTransientError check

// ============================================================================
// EXERCISE 5: Discriminated Error Union
// ============================================================================

/*
Task: Define and handle different error types safely

Create ApiError discriminated union:
  - NetworkError: statusCode, message, retryable
  - ValidationError: field, message, details
  - AuthError: message, reason ("expired" | "invalid" | "missing")
  - RateLimitError: retryAfter, message
  - NotFoundError: resource, id

1. Define union type with kind discriminator
2. Implement errorToMessage(error): string for display
3. Implement shouldRetry(error): boolean
4. Implement getRetryDelay(error): number
5. Test exhaustiveness with switch statement

Example:
  type ApiError = NetworkError | ValidationError | AuthError | ...
  
  const handleError = (error: ApiError) => {
    switch (error.kind) {
      case "network": return `HTTP ${error.statusCode}: ${error.message}`;
      case "validation": return `Field ${error.field}: ${error.message}`;
      // ... etc
    }
  }
  
Hints:
- Use kind field for discrimination
- Switch statement ensures exhaustiveness
- Different error types have different info
- Some errors are retryable, some aren't
- Retry delay depends on error type
*/

// TODO: Define ApiError union
// TODO: Implement errorToMessage
// TODO: Implement shouldRetry
// TODO: Implement getRetryDelay

// ============================================================================
// EXERCISE 6: Error Context Stack
// ============================================================================

/*
Task: Track error origin as it propagates up

Build ErrorStack that tracks:
1. Original error message and code
2. Context object at each layer
3. Stack of locations (function names)
4. Timestamp of each layer
5. Serialize to JSON for logging

Example:
  const err = createError("DB connection failed", "DB_ERROR")
    .addContext("database", "postgres")
    .addContext("attempt", 3);
  
  Final error object:
  {
    message: "DB connection failed",
    code: "DB_ERROR",
    stack: [
      { location: "connectDB", timestamp: ..., context: {...} },
      { location: "fetchUser", timestamp: ..., context: {...} }
    ],
    context: { database: "postgres", attempt: 3 }
  }
  
Hints:
- Each addContext returns new error (immutable)
- Stack array tracks call path
- Timestamp helps identify slow operations
- JSON serializable for remote logging
- Use Error.stack for function names (optional)
*/

// TODO: Implement ErrorStack class
// TODO: Implement addContext method
// TODO: Implement toJSON for serialization
// TODO: Implement pretty printing

// ============================================================================
// Test harness
// ============================================================================

function testExercises() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  LESSON 36: Advanced Error Handling - EXERCISES");
  console.log("═══════════════════════════════════════════════════════════\n");

  // TODO: Add test cases for exercises 1-6

  console.log("✓ All tests passed!");
}

// Uncomment to run tests
// testExercises();
