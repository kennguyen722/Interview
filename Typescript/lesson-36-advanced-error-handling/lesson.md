# Lesson 36: Advanced Error Handling & Railway-Oriented Programming

## Goals
- Master advanced error handling patterns beyond try-catch
- Implement Railway-Oriented Programming for clean error flows
- Build error recovery and resilience patterns
- Handle async errors safely with Result types
- Create comprehensive error context and logging

## Core Concepts

### 1. From Exceptions to Result Types

**The Problem with Exceptions**:
- Control flow hidden in stack traces
- No type information about what can fail
- Easy to forget error cases
- Context loss in async code

```ts
// ❌ Throws exception
function divide(a: number, b: number): number {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

try {
  const result = divide(10, 0);
  console.log(result);
} catch (e) {
  // What type is e? Error or unknown?
  // Did we handle all error cases?
}
```

**Better: Result Type**:
```ts
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

const ok = <T, E>(value: T): Result<T, E> => ({ ok: true, value });
const err = <T, E>(error: E): Result<T, E> => ({ ok: false, error });

function divide(a: number, b: number): Result<number, string> {
  return b === 0 ? err("Division by zero") : ok(a / b);
}

const result = divide(10, 0);
if (result.ok) {
  console.log(result.value);
} else {
  console.log(`Error: ${result.error}`);
}
```

### 2. Railway-Oriented Programming

Model your program as "happy path" (right track) and "error path" (left track).

```ts
type Result<T, E> = Success<T> | Failure<E>;

type Success<T> = { kind: "success"; value: T };
type Failure<E> = { kind: "failure"; error: E };

// When on success track, operations run normally
// When on failure track, operations are skipped
const map = <T, U, E>(fn: (t: T) => U) => (r: Result<T, E>): Result<U, E> =>
  r.kind === "success" ? { kind: "success", value: fn(r.value) } : r;

// When on failure track, can run recovery
const mapError = <T, E, F>(fn: (e: E) => F) => (r: Result<T, E>): Result<T, F> =>
  r.kind === "failure" ? { kind: "failure", error: fn(r.error) } : { kind: "success", value: r.value };

// Chain operations: if one fails, skip rest
const flatMap = <T, U, E>(fn: (t: T) => Result<U, E>) => (r: Result<T, E>): Result<U, E> =>
  r.kind === "success" ? fn(r.value) : r;

// Usage
const validateEmail = (email: string): Result<string, string> =>
  email.includes("@") ? ok(email) : err("Invalid email");

const validateAge = (age: number): Result<number, string> =>
  age >= 18 ? ok(age) : err("Too young");

const pipeline = flatMap(
  email => flatMap(
    age => ok({ email, age }),
    validateAge(25)
  ),
  validateEmail("test@example.com")
);
```

### 3. Combining Multiple Operations

**Traverse**: Apply result-returning function to array, collect results.

```ts
type Result<T, E> = Success<T> | Failure<E>;

const traverse = <T, U, E>(fn: (t: T) => Result<U, E>) => (arr: T[]): Result<U[], E[]> => {
  const values: U[] = [];
  const errors: E[] = [];

  for (const item of arr) {
    const result = fn(item);
    if (result.kind === "success") {
      values.push(result.value);
    } else {
      errors.push(result.error);
    }
  }

  return errors.length > 0 ? { kind: "failure", error: errors } : { kind: "success", value: values };
};

// Validate multiple users, collect errors if any fail
const users = ["alice@example.com", "invalid", "bob@example.com"];
const validated = traverse(validateEmail)(users);
// { kind: "failure", error: ["Invalid"] } ← collects all errors
```

### 4. Async Error Handling

Safe async/await with Result types:

```ts
type Result<T, E> = Success<T> | Failure<E>;

// Wrap promises in Result
const toResult = async <T>(promise: Promise<T>): Promise<Result<T, Error>> => {
  try {
    return { kind: "success", value: await promise };
  } catch (e) {
    return { kind: "failure", error: e instanceof Error ? e : new Error(String(e)) };
  }
};

// Async operations in pipeline
async function loadUserData(userId: number) {
  const userRes = await toResult(fetchUser(userId));
  
  if (userRes.kind === "failure") {
    return { kind: "failure", error: userRes.error };
  }

  const postsRes = await toResult(fetchUserPosts(userRes.value.id));
  
  if (postsRes.kind === "failure") {
    return { kind: "failure", error: postsRes.error };
  }

  return {
    kind: "success",
    value: { user: userRes.value, posts: postsRes.value }
  };
}
```

### 5. Error Context and Enrichment

Add context as errors propagate up the stack:

```ts
type ErrorContext = {
  message: string;
  code: string;
  context: Record<string, unknown>;
  stack?: string;
};

type Result<T> = Success<T> | Failure<ErrorContext>;

// Enrich errors with context
const mapErrorWithContext = (context: Record<string, unknown>) =>
  (error: ErrorContext): ErrorContext => ({
    ...error,
    context: { ...error.context, ...context }
  });

const withContext = <T>(label: string) => (r: Result<T>): Result<T> =>
  r.kind === "failure"
    ? { kind: "failure", error: mapErrorWithContext({ location: label })(r.error) }
    : r;

// Usage: errors accumulate context
const pipeline = flatMap(
  email => flatMap(
    age => ok({ email, age }),
    validateAge(25).then(r => withContext("validateAge")(r))
  ),
  validateEmail("test@example.com").then(r => withContext("validateEmail")(r))
);
```

### 6. Retry and Fallback Strategies

Handle transient failures gracefully:

```ts
// Retry with exponential backoff
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<Result<T, Error>> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const value = await fn();
      return { kind: "success", value };
    } catch (e) {
      if (attempt === maxAttempts) {
        return { kind: "failure", error: e instanceof Error ? e : new Error(String(e)) };
      }
      // Exponential backoff: 100ms, 200ms, 400ms
      await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt - 1)));
    }
  }
  return { kind: "failure", error: new Error("Retry exhausted") };
}

// Fallback: try primary, use secondary if fails
async function fallback<T>(
  primary: () => Promise<T>,
  secondary: () => Promise<T>
): Promise<T> {
  try {
    return await primary();
  } catch {
    return await secondary();
  }
}

// Circuit breaker: fail fast after repeated failures
class CircuitBreaker {
  private failures = 0;
  private threshold = 5;
  private timeout = 60000;
  private lastFailTime = 0;

  async execute<T>(fn: () => Promise<T>): Promise<Result<T, string>> {
    if (this.failures >= this.threshold && Date.now() - this.lastFailTime < this.timeout) {
      return { kind: "failure", error: "Circuit open: Too many failures" };
    }

    try {
      const value = await fn();
      this.failures = 0;
      return { kind: "success", value };
    } catch (e) {
      this.failures++;
      this.lastFailTime = Date.now();
      return { kind: "failure", error: String(e) };
    }
  }
}
```

### 7. Error Logging and Observability

Structured logging for debugging:

```ts
type LogLevel = "debug" | "info" | "warn" | "error";

type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: ErrorContext;
};

class Logger {
  private logs: LogEntry[] = [];

  log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    });
  }

  logError(message: string, error: ErrorContext, context?: Record<string, unknown>) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      error,
      context
    });
  }

  getLog(startLevel: LogLevel = "debug"): LogEntry[] {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    const minLevel = levels.indexOf(startLevel);
    return this.logs.filter(l => levels.indexOf(l.level) >= minLevel);
  }
}
```

### 8. Discriminated Union for Different Error Types

```ts
type ApiError =
  | { kind: "network"; statusCode: number; message: string }
  | { kind: "validation"; field: string; message: string }
  | { kind: "authentication"; message: string }
  | { kind: "notFound"; resource: string };

type Result<T> = 
  | { ok: true; value: T }
  | { ok: false; error: ApiError };

const handleError = (error: ApiError): string => {
  switch (error.kind) {
    case "network":
      return `Network error ${error.statusCode}: ${error.message}`;
    case "validation":
      return `Validation failed on ${error.field}: ${error.message}`;
    case "authentication":
      return `Auth error: ${error.message}`;
    case "notFound":
      return `${error.resource} not found`;
  }
};

// Type-safe error handling with exhaustiveness check
const handleApiResult = <T>(result: Result<T>): string => {
  if (result.ok) {
    return "Success!";
  }
  return handleError(result.error);
};
```

## Exercises

1. **Result Type Implementation**
   - Build generic Result<T, E> with map, flatMap, mapError
   - Implement getOrElse, getOrThrow
   - Add JSON serialization for error transport

2. **Railway-Oriented Pipeline**
   - Chain validations: email → age → username
   - Ensure single error short-circuits pipeline
   - Test with valid and invalid data

3. **Async Error Wrapper**
   - Implement toResult for Promise wrapping
   - Build sequential async validation
   - Handle cascade errors properly

4. **Retry Logic**
   - Implement exponential backoff retry
   - Add max attempts limit
   - Test with simulated failures

5. **Error Accumulation**
   - Collect ALL validation errors (not just first)
   - Return array of errors in Result
   - Format errors for user display

## Key Takeaways

1. **Result types** eliminate silent failures and hidden error paths
2. **Railway-Oriented** programming keeps happy path code clean and readable
3. **Type safety** ensures you handle all error cases at compile time
4. **Async errors** need special handling—use wrapper functions
5. **Error context** becomes valuable as systems scale
6. **Retry and fallback** strategies improve resilience
7. **Discriminated unions** for errors enable exhaustive handling
8. **Observable errors** with structured logging aid debugging
