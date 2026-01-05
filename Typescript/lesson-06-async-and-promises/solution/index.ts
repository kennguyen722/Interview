// Solution 1: withTimeout function
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Solution 2: Retry with exponential backoff
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number = 100
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      
      if (attempt < maxAttempts) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("All retry attempts failed");
}

// Solution 3: Fetch and validate with Result type
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

interface ValidationError {
  code: string;
  message: string;
}

async function fetchAndValidate<T>(
  fetchFn: () => Promise<T>,
  validateFn: (data: T) => boolean
): Promise<Result<T, ValidationError>> {
  try {
    const data = await fetchFn();

    if (!validateFn(data)) {
      return {
        ok: false,
        error: {
          code: "VALIDATION_FAILED",
          message: "Data validation failed",
        },
      };
    }

    return { ok: true, value: data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      ok: false,
      error: {
        code: "FETCH_FAILED",
        message,
      },
    };
  }
}

// Tests and examples
async function exampleUsage() {
  // Test withTimeout
  try {
    const result = await withTimeout(
      new Promise((resolve) => setTimeout(() => resolve("success"), 100)),
      50
    );
    console.log(result);
  } catch (err) {
    console.log("Timeout error:", (err as Error).message);
  }

  // Test retry
  let attempts = 0;
  try {
    await retry(
      async () => {
        attempts++;
        if (attempts < 3) throw new Error("Simulated failure");
        return "Success after retries";
      },
      5,
      50
    );
    console.log(`Succeeded after ${attempts} attempts`);
  } catch (err) {
    console.error("Retry failed:", err);
  }

  // Test fetchAndValidate
  const result = await fetchAndValidate(
    async () => ({ id: "123", value: 42 }),
    (data) => data.value > 0
  );

  if (result.ok) {
    console.log("Validation passed:", result.value);
  } else {
    console.log("Validation failed:", result.error);
  }
}

export { withTimeout, retry, fetchAndValidate, Result, ValidationError };
