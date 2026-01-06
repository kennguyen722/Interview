/**
 * LESSON 36: Advanced Error Handling - EXAMPLES
 */

// ============================================================================
// EXAMPLE 1: Result Type Basics
// ============================================================================

function example1_resultType() {
  console.log("\n=== EXAMPLE 1: Result Type ===");

  type Result<T, E = Error> = 
    | { ok: true; value: T }
    | { ok: false; error: E };

  const ok = <T, E>(value: T): Result<T, E> => ({ ok: true, value });
  const err = <T, E>(error: E): Result<T, E> => ({ ok: false, error });

  function divide(a: number, b: number): Result<number, string> {
    return b === 0 ? err("Division by zero") : ok(a / b);
  }

  const result1 = divide(10, 2);
  const result2 = divide(10, 0);

  console.log("divide(10, 2):", result1);
  console.log("divide(10, 0):", result2);

  // Handle result
  if (result1.ok) {
    console.log("Success:", result1.value);
  } else {
    console.log("Error:", result1.error);
  }
}

// ============================================================================
// EXAMPLE 2: Railway-Oriented Programming
// ============================================================================

function example2_railwayOriented() {
  console.log("\n=== EXAMPLE 2: Railway-Oriented Programming ===");

  type Result<T, E> = 
    | { kind: "success"; value: T }
    | { kind: "failure"; error: E };

  const ok = <T, E>(value: T): Result<T, E> => ({ kind: "success", value });
  const err = <T, E>(error: E): Result<T, E> => ({ kind: "failure", error });

  const map = <T, U, E>(fn: (t: T) => U) => (r: Result<T, E>): Result<U, E> =>
    r.kind === "success" ? ok(fn(r.value)) : r;

  const flatMap = <T, U, E>(fn: (t: T) => Result<U, E>) => (r: Result<T, E>): Result<U, E> =>
    r.kind === "success" ? fn(r.value) : r;

  const getOrElse = <T, E>(def: T) => (r: Result<T, E>): T =>
    r.kind === "success" ? r.value : def;

  // Validation functions
  const validateEmail = (email: string): Result<string, string> =>
    email.includes("@") ? ok(email) : err("Invalid email");

  const validateAge = (age: number): Result<number, string> =>
    age >= 18 ? ok(age) : err("Too young");

  // Happy path (success):
  const pipeline1 = flatMap(
    email => flatMap(
      age => ok({ email, age }),
      validateAge(25)
    ),
    validateEmail("alice@example.com")
  );

  // Error path (failure):
  const pipeline2 = flatMap(
    email => flatMap(
      age => ok({ email, age }),
      validateAge(15)
    ),
    validateEmail("bob@example.com")
  );

  console.log("Valid user:", pipeline1);
  console.log("Invalid user (age):", pipeline2);
}

// ============================================================================
// EXAMPLE 3: Error Context Enrichment
// ============================================================================

function example3_errorContext() {
  console.log("\n=== EXAMPLE 3: Error Context ===");

  type ErrorInfo = {
    message: string;
    code: string;
    context: Record<string, unknown>;
  };

  type Result<T> = 
    | { ok: true; value: T }
    | { ok: false; error: ErrorInfo };

  const ok = <T>(value: T): Result<T> => ({ ok: true, value });
  const err = (message: string, code: string, context: Record<string, unknown>): Result<never> =>
    ({ ok: false, error: { message, code, context } });

  const withContext = <T>(location: string) => (result: Result<T>): Result<T> => {
    if (!result.ok) {
      result.error.context.location = location;
    }
    return result;
  };

  // Simulated API call
  const fetchUser = (id: number): Result<{ id: number; name: string }> => {
    if (id < 0) {
      return err("Invalid user ID", "VALIDATION_ERROR", { userId: id });
    }
    return ok({ id, name: "Alice" });
  };

  const result = withContext("loadUser")(fetchUser(-1));
  console.log("Error with context:", result);
}

// ============================================================================
// EXAMPLE 4: Async Error Handling
// ============================================================================

function example4_asyncErrors() {
  console.log("\n=== EXAMPLE 4: Async Error Handling ===");

  type Result<T, E = Error> = 
    | { ok: true; value: T }
    | { ok: false; error: E };

  const toResult = async <T>(promise: Promise<T>): Promise<Result<T, Error>> => {
    try {
      return { ok: true, value: await promise };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  };

  // Simulated async operations
  const fetchUser = (id: number): Promise<{ id: number; name: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id > 0) resolve({ id, name: "Alice" });
        else reject(new Error("Invalid user ID"));
      }, 100);
    });
  };

  const fetchPosts = (userId: number): Promise<string[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([`Post by ${userId}`]), 100);
    });
  };

  // Usage
  (async () => {
    const userRes = await toResult(fetchUser(1));
    if (!userRes.ok) {
      console.log("Failed to fetch user:", userRes.error);
      return;
    }

    const postsRes = await toResult(fetchPosts(userRes.value.id));
    if (!postsRes.ok) {
      console.log("Failed to fetch posts:", postsRes.error);
      return;
    }

    console.log("User data:", { user: userRes.value, posts: postsRes.value });
  })();
}

// ============================================================================
// EXAMPLE 5: Retry with Backoff
// ============================================================================

function example5_retryBackoff() {
  console.log("\n=== EXAMPLE 5: Retry with Exponential Backoff ===");

  type Result<T, E = Error> = 
    | { ok: true; value: T }
    | { ok: false; error: E };

  const retry = async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 100
  ): Promise<Result<T, Error>> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const value = await fn();
        console.log(`  ✓ Success on attempt ${attempt}`);
        return { ok: true, value };
      } catch (e) {
        console.log(`  ✗ Attempt ${attempt} failed`);
        if (attempt === maxAttempts) {
          return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
        }
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`  Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return { ok: false, error: new Error("All retries exhausted") };
  };

  // Simulated flaky API
  let callCount = 0;
  const flakyAPI = async (): Promise<string> => {
    callCount++;
    if (callCount < 3) throw new Error("API temporarily unavailable");
    return "Success!";
  };

  (async () => {
    console.log("Attempting flaky operation with 3 retries:");
    const result = await retry(flakyAPI, 3, 50);
    if (result.ok) {
      console.log("Final result:", result.value);
    } else {
      console.log("Failed:", result.error.message);
    }
  })();
}

// ============================================================================
// EXAMPLE 6: Error Accumulation
// ============================================================================

function example6_errorAccumulation() {
  console.log("\n=== EXAMPLE 6: Error Accumulation ===");

  type Result<T, E> = 
    | { ok: true; value: T }
    | { ok: false; errors: E[] };

  const validateEmail = (email: string): string | null =>
    email.includes("@") ? null : "Invalid email";

  const validatePassword = (password: string): string | null =>
    password.length >= 8 ? null : "Password too short";

  const validateAge = (age: number): string | null =>
    age >= 18 ? null : "Must be 18+";

  const validate = (data: {
    email: string;
    password: string;
    age: number;
  }): Result<typeof data, string> => {
    const errors: string[] = [];

    const emailErr = validateEmail(data.email);
    const passwordErr = validatePassword(data.password);
    const ageErr = validateAge(data.age);

    if (emailErr) errors.push(emailErr);
    if (passwordErr) errors.push(passwordErr);
    if (ageErr) errors.push(ageErr);

    return errors.length > 0
      ? { ok: false, errors }
      : { ok: true, value: data };
  };

  const valid = validate({ email: "alice@example.com", password: "password123", age: 25 });
  const invalid = validate({ email: "invalid", password: "weak", age: 15 });

  console.log("Valid:", valid);
  console.log("Invalid:", invalid);
}

// ============================================================================
// EXAMPLE 7: Discriminated Error Types
// ============================================================================

function example7_discriminatedErrors() {
  console.log("\n=== EXAMPLE 7: Discriminated Error Types ===");

  type ApiError =
    | { kind: "network"; statusCode: number; message: string }
    | { kind: "validation"; field: string; message: string }
    | { kind: "auth"; message: string }
    | { kind: "notFound"; resource: string };

  type Result<T> = 
    | { ok: true; value: T }
    | { ok: false; error: ApiError };

  const handleError = (error: ApiError): string => {
    switch (error.kind) {
      case "network":
        return `HTTP ${error.statusCode}: ${error.message}`;
      case "validation":
        return `Validation: ${error.field} - ${error.message}`;
      case "auth":
        return `Authentication: ${error.message}`;
      case "notFound":
        return `${error.resource} not found`;
    }
  };

  const errors: ApiError[] = [
    { kind: "network", statusCode: 500, message: "Internal Server Error" },
    { kind: "validation", field: "email", message: "Invalid format" },
    { kind: "auth", message: "Unauthorized" },
    { kind: "notFound", resource: "User" }
  ];

  console.log("Error messages:");
  errors.forEach(err => console.log("  -", handleError(err)));
}

// ============================================================================
// EXAMPLE 8: Circuit Breaker Pattern
// ============================================================================

function example8_circuitBreaker() {
  console.log("\n=== EXAMPLE 8: Circuit Breaker ===");

  class CircuitBreaker {
    private failures = 0;
    private state: "closed" | "open" | "half-open" = "closed";
    private lastFailTime = 0;

    constructor(
      private threshold: number = 5,
      private timeout: number = 1000
    ) {}

    async execute<T>(fn: () => Promise<T>): Promise<T> {
      // Circuit open: reject immediately
      if (
        this.state === "open" &&
        Date.now() - this.lastFailTime < this.timeout
      ) {
        throw new Error("Circuit breaker open");
      }

      // Try half-open or closed
      try {
        this.state = "half-open";
        const result = await fn();
        this.failures = 0;
        this.state = "closed";
        return result;
      } catch (e) {
        this.failures++;
        this.lastFailTime = Date.now();

        if (this.failures >= this.threshold) {
          this.state = "open";
          console.log(`Circuit breaker opened after ${this.failures} failures`);
        }

        throw e;
      }
    }
  }

  const breaker = new CircuitBreaker(3, 500);

  let attempts = 0;
  const unreliableAPI = async (): Promise<string> => {
    attempts++;
    if (attempts <= 3) throw new Error("Temporary failure");
    return "Success!";
  };

  (async () => {
    console.log("Testing circuit breaker:");
    for (let i = 0; i < 5; i++) {
      try {
        const result = await breaker.execute(unreliableAPI);
        console.log(`  Attempt ${i + 1}: ✓ ${result}`);
      } catch (e) {
        console.log(`  Attempt ${i + 1}: ✗ ${(e as Error).message}`);
      }
      await new Promise(r => setTimeout(r, 200));
    }
  })();
}

// ============================================================================
// MAIN: Run all examples
// ============================================================================

function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   LESSON 36: Advanced Error Handling                       ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  example1_resultType();
  example2_railwayOriented();
  example3_errorContext();
  example4_asyncErrors();
  example5_retryBackoff();
  example6_errorAccumulation();
  example7_discriminatedErrors();
  // example8_circuitBreaker(); // Commented: requires async handling

  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║              All examples completed successfully!           ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
}

main();
