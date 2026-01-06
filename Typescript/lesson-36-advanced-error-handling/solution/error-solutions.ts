/**
 * LESSON 36: Advanced Error Handling - SOLUTIONS
 */

// ============================================================================
// SOLUTION 1: Result Type with Full API
// ============================================================================

type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

class ResultClass<T, E = Error> {
  constructor(private result: Result<T, E>) {}

  static ok<T, E>(value: T): ResultClass<T, E> {
    return new ResultClass({ ok: true, value });
  }

  static err<T, E>(error: E): ResultClass<T, E> {
    return new ResultClass({ ok: false, error });
  }

  map<U>(fn: (value: T) => U): ResultClass<U, E> {
    return this.result.ok 
      ? ResultClass.ok(fn(this.result.value))
      : ResultClass.err(this.result.error);
  }

  mapError<F>(fn: (error: E) => F): ResultClass<T, F> {
    return this.result.ok
      ? ResultClass.ok(this.result.value)
      : ResultClass.err(fn(this.result.error));
  }

  flatMap<U>(fn: (value: T) => ResultClass<U, E>): ResultClass<U, E> {
    if (!this.result.ok) return ResultClass.err(this.result.error);
    return fn(this.result.value);
  }

  getOrElse(def: T): T {
    return this.result.ok ? this.result.value : def;
  }

  getOrThrow(message?: string): T {
    if (!this.result.ok) {
      throw new Error(message || String(this.result.error));
    }
    return this.result.value;
  }

  fold<R>(onError: (e: E) => R, onSuccess: (t: T) => R): R {
    return this.result.ok ? onSuccess(this.result.value) : onError(this.result.error);
  }

  toString(): string {
    return this.result.ok
      ? `Ok(${String(this.result.value)})`
      : `Err(${String(this.result.error)})`;
  }
}

// ============================================================================
// SOLUTION 2: Validation Pipeline
// ============================================================================

type ValidationError = { field: string; message: string };

interface ValidUser {
  email: string;
  password: string;
  username: string;
  age: number;
}

const validateEmail = (email: string): Result<string, ValidationError> =>
  email.includes("@") && email.includes(".")
    ? { ok: true, value: email }
    : { ok: false, error: { field: "email", message: "Invalid email format" } };

const validatePassword = (password: string): Result<string, ValidationError> => {
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const isLongEnough = password.length >= 8;

  return isLongEnough && hasUpper && hasNumber && hasSpecial
    ? { ok: true, value: password }
    : {
        ok: false,
        error: {
          field: "password",
          message: "Must be 8+ chars with uppercase, number, and special character"
        }
      };
};

const validateUsername = (username: string): Result<string, ValidationError> =>
  /^[a-zA-Z0-9_]{3,20}$/.test(username)
    ? { ok: true, value: username }
    : {
        ok: false,
        error: {
          field: "username",
          message: "Must be 3-20 alphanumeric characters or underscore"
        }
      };

const validateAge = (age: number): Result<number, ValidationError> =>
  age >= 18
    ? { ok: true, value: age }
    : {
        ok: false,
        error: { field: "age", message: "Must be 18 or older" }
      };

// Accumulate ALL errors, not just first
const validateUserRegistration = (data: {
  email: string;
  password: string;
  username: string;
  age: number;
}): Result<ValidUser, ValidationError[]> => {
  const errors: ValidationError[] = [];

  const emailRes = validateEmail(data.email);
  if (!emailRes.ok) errors.push(emailRes.error);

  const passwordRes = validatePassword(data.password);
  if (!passwordRes.ok) errors.push(passwordRes.error);

  const usernameRes = validateUsername(data.username);
  if (!usernameRes.ok) errors.push(usernameRes.error);

  const ageRes = validateAge(data.age);
  if (!ageRes.ok) errors.push(ageRes.error);

  return errors.length > 0
    ? { ok: false, error: errors }
    : {
        ok: true,
        value: {
          email: data.email,
          password: data.password,
          username: data.username,
          age: data.age
        }
      };
};

// ============================================================================
// SOLUTION 3: Async Result Wrapper
// ============================================================================

const toResult = async <T>(promise: Promise<T>): Promise<Result<T, Error>> => {
  try {
    return { ok: true, value: await promise };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
  }
};

const withTimeout = async <T>(
  promise: Promise<T>,
  ms: number
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    )
  ]);
};

// Sequential async pipeline with short-circuit on error
async function sequentialAsync<T1, T2, T3>(
  op1: () => Promise<T1>,
  op2: (r1: T1) => Promise<T2>,
  op3: (r2: T2) => Promise<T3>
): Promise<Result<T3, Error>> {
  const res1 = await toResult(op1());
  if (!res1.ok) return res1;

  const res2 = await toResult(op2(res1.value));
  if (!res2.ok) return res2;

  const res3 = await toResult(op3(res2.value));
  return res3;
}

// ============================================================================
// SOLUTION 4: Retry with Exponential Backoff
// ============================================================================

interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  jitter?: boolean;
}

const retry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<Result<T, Error>> => {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelay = options.baseDelay ?? 100;
  const jitter = options.jitter ?? false;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const value = await fn();
      return { ok: true, value };
    } catch (e) {
      if (attempt === maxAttempts) {
        return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
      }

      let delay = baseDelay * Math.pow(2, attempt - 1);
      if (jitter) {
        delay *= 1 + Math.random() * 0.1;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { ok: false, error: new Error("Retry exhausted") };
};

// ============================================================================
// SOLUTION 5: Discriminated Error Types
// ============================================================================

type ApiError =
  | { kind: "network"; statusCode: number; message: string }
  | { kind: "validation"; field: string; message: string }
  | { kind: "auth"; reason: "expired" | "invalid" | "missing"; message: string }
  | { kind: "rateLimit"; retryAfter: number; message: string }
  | { kind: "notFound"; resource: string; id: string | number };

const errorToMessage = (error: ApiError): string => {
  switch (error.kind) {
    case "network":
      return `HTTP ${error.statusCode}: ${error.message}`;
    case "validation":
      return `Validation error on ${error.field}: ${error.message}`;
    case "auth":
      return `Auth error (${error.reason}): ${error.message}`;
    case "rateLimit":
      return `Rate limited. Retry after ${error.retryAfter}ms: ${error.message}`;
    case "notFound":
      return `${error.resource} (${error.id}) not found`;
  }
};

const shouldRetry = (error: ApiError): boolean => {
  switch (error.kind) {
    case "network":
      return error.statusCode >= 500;
    case "rateLimit":
      return true;
    case "validation":
    case "auth":
    case "notFound":
      return false;
  }
};

const getRetryDelay = (error: ApiError): number => {
  switch (error.kind) {
    case "network":
      return 1000;
    case "rateLimit":
      return error.retryAfter;
    default:
      return 0;
  }
};

// ============================================================================
// SOLUTION 6: Error Context Stack
// ============================================================================

interface ErrorLayer {
  location: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

class ErrorStack {
  private stack: ErrorLayer[] = [];

  constructor(
    readonly message: string,
    readonly code: string,
    readonly context: Record<string, unknown> = {}
  ) {}

  addContext(key: string, value: unknown): ErrorStack {
    const newError = new ErrorStack(this.message, this.code, {
      ...this.context,
      [key]: value
    });
    newError.stack = [...this.stack];
    return newError;
  }

  addLayer(location: string, context?: Record<string, unknown>): ErrorStack {
    const newError = new ErrorStack(this.message, this.code, this.context);
    newError.stack = [
      ...this.stack,
      { location, timestamp: new Date(), context }
    ];
    return newError;
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack.map(layer => ({
        location: layer.location,
        timestamp: layer.timestamp.toISOString(),
        context: layer.context
      }))
    };
  }

  toString(): string {
    const paths = this.stack.map(l => l.location).join(" → ");
    return `${this.code}: ${this.message}${paths ? ` (${paths})` : ""}`;
  }
}

// ============================================================================
// TEST SUITE
// ============================================================================

function runSolutions() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║    LESSON 36: Advanced Error Handling - SOLUTIONS         ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  // Test 1: Result type
  console.log("✓ Solution 1: Result Type");
  const res1 = ResultClass.ok<number>(5).map(x => x * 2);
  const res2 = ResultClass.err<number, string>("failed").map(x => x * 2);
  console.log(`  ok(5).map(*2) = ${res1.toString()}`);
  console.log(`  err("failed").map(*2) = ${res2.toString()}`);

  // Test 2: Validation
  console.log("\n✓ Solution 2: Validation Pipeline");
  const valid = validateUserRegistration({
    email: "alice@example.com",
    password: "Secure123!",
    username: "alice_bob",
    age: 25
  });
  const invalid = validateUserRegistration({
    email: "invalid",
    password: "weak",
    username: "ab",
    age: 15
  });
  console.log(`  Valid user: ${valid.ok ? "✓" : "✗ " + (invalid as any).error.length + " errors"}`);
  console.log(`  Invalid user: ${!invalid.ok ? "✗ " + (invalid as any).error.map((e: any) => e.field).join(", ") : ""}`);

  // Test 3: Error types
  console.log("\n✓ Solution 5: Discriminated Error Types");
  const errors: ApiError[] = [
    { kind: "network", statusCode: 500, message: "Server error" },
    { kind: "validation", field: "email", message: "Invalid format" },
    { kind: "rateLimit", retryAfter: 60000, message: "Too many requests" }
  ];
  errors.forEach(err => {
    console.log(`  - ${errorToMessage(err)}`);
  });

  // Test 4: Error stack
  console.log("\n✓ Solution 6: Error Context Stack");
  const err = new ErrorStack("Connection failed", "DB_ERROR", { db: "postgres" })
    .addLayer("connectDB", { attempt: 1 })
    .addLayer("fetchUser", { userId: 123 });
  console.log(`  ${err.toString()}`);
  console.log(`  Stack length: ${(err as any).stack.length}`);

  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║              All solutions demonstrated! ✓               ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");
}

runSolutions();
