// ============================================================================
// LESSON 30: PRODUCTION CODE PATTERNS - SOLUTION
// ============================================================================

/**
 * SOLUTION 1: Result Type Implementation
 */

type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

const ok = <T>(value: T): Result<T> => ({ success: true, value });
const err = <E>(error: E): Result<any, E> => ({ success: false, error });

// Utility functions
function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (!result.success) return result;
  return ok(fn(result.value));
}

function flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  if (!result.success) return result;
  return fn(result.value);
}

function fold<T, E, U>(result: Result<T, E>, onSuccess: (t: T) => U, onError: (e: E) => U): U {
  if (result.success) return onSuccess(result.value);
  return onError(result.error);
}

// Test
const parseNumber = (s: string): Result<number, string> => {
  const n = parseInt(s);
  return isNaN(n) ? err("Not a number") : ok(n);
};

console.log(map(parseNumber("42"), (n) => n * 2)); // { success: true, value: 84 }
console.log(map(parseNumber("abc"), (n) => n * 2)); // { success: false, error: "..." }

/**
 * SOLUTION 2: Error Handling with Type Guards
 */

class ApiError extends Error {
  constructor(public statusCode: number, public code: string, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
const isValidationError = (e: unknown): e is ValidationError => e instanceof ValidationError;

function handleError(error: unknown): string {
  if (isApiError(error)) {
    return `API Error (${error.statusCode} - ${error.code}): ${error.message}`;
  }
  if (isValidationError(error)) {
    return `Validation Error in ${error.field}: ${error.message}`;
  }
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return "Unknown error";
}

console.log(handleError(new ApiError(404, "NOT_FOUND", "User not found")));
console.log(handleError(new ValidationError("email", "Invalid email format")));

/**
 * SOLUTION 3: Schema Validation
 */

interface ValidationError {
  field: string;
  message: string;
}

interface UserInput {
  id: string;
  email: string;
  age: number;
  preferences?: { theme: string; notifications: boolean };
}

class UserValidator {
  validate(data: any): Result<UserInput, ValidationError[]> {
    const errors: ValidationError[] = [];

    // Validate id
    if (!data.id || typeof data.id !== "string") {
      errors.push({ field: "id", message: "ID is required and must be a string" });
    }

    // Validate email
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push({ field: "email", message: "Invalid email format" });
    }

    // Validate age
    if (typeof data.age !== "number" || data.age < 18 || data.age > 120) {
      errors.push({ field: "age", message: "Age must be between 18 and 120" });
    }

    // Validate nested preferences
    if (data.preferences) {
      if (typeof data.preferences.theme !== "string") {
        errors.push({ field: "preferences.theme", message: "Theme must be a string" });
      }
      if (typeof data.preferences.notifications !== "boolean") {
        errors.push({
          field: "preferences.notifications",
          message: "Notifications must be a boolean",
        });
      }
    }

    if (errors.length > 0) {
      return err(errors);
    }

    return ok({
      id: data.id,
      email: data.email,
      age: data.age,
      preferences: data.preferences,
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

const validator = new UserValidator();
console.log(
  validator.validate({ id: "1", email: "user@example.com", age: 25 })
); // Success

/**
 * SOLUTION 4: Structured Logging
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

class StructuredLogger {
  private logs: LogEntry[] = [];

  info(message: string, context?: Record<string, unknown>) {
    this.addLog("INFO", message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.addLog("WARN", message, context);
  }

  error(message: string, error: Error, context?: Record<string, unknown>) {
    this.addLog("ERROR", `${message}: ${error.message}`, { ...context, error: error.stack });
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.addLog("DEBUG", message, context);
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
    this.logs.push(entry);
    console.log(JSON.stringify(entry));
  }

  getLogs(level?: LogLevel) {
    return level ? this.logs.filter((l) => l.level === level) : this.logs;
  }
}

const logger = new StructuredLogger();
logger.info("User registered", { userId: "123", email: "user@example.com" });
logger.error("Database error", new Error("Connection timeout"), { retries: 3 });

/**
 * SOLUTION 5: Configuration Management
 */

type Environment = "development" | "staging" | "production";

interface Config {
  app: { env: Environment; port: number };
  database: { url: string; maxConnections: number };
  auth: { secret: string; expiresIn: string };
}

function loadConfig(env: Environment): Result<Config> {
  // Validate environment
  const validEnvs: Environment[] = ["development", "staging", "production"];
  if (!validEnvs.includes(env)) {
    return err(new Error(`Unknown environment: ${env}`));
  }

  // Load from environment variables
  const dbUrl = process.env.DATABASE_URL;
  const authSecret = process.env.AUTH_SECRET;

  // Validate required vars for production
  if (env === "production") {
    if (!dbUrl || !authSecret) {
      return err(new Error("Missing required environment variables"));
    }
  }

  const config: Config = {
    app: {
      env,
      port: parseInt(process.env.PORT || (env === "production" ? "8080" : "3000")),
    },
    database: {
      url: dbUrl || "postgres://localhost/myapp",
      maxConnections: env === "production" ? 100 : 10,
    },
    auth: {
      secret: authSecret || "dev-secret",
      expiresIn: env === "production" ? "1h" : "24h",
    },
  };

  return ok(config);
}

console.log("Config:", loadConfig("development"));

/**
 * SOLUTION 6: Circuit Breaker
 */

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

class CircuitBreaker<T> {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private operation: () => Promise<T>,
    private failureThreshold = 5,
    private resetTimeout = 60000
  ) {}

  async execute(): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = "HALF_OPEN";
        console.log("🟡 Circuit breaker: HALF_OPEN (testing)");
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await this.operation();

      if (this.state === "HALF_OPEN") {
        this.state = "CLOSED";
        this.failureCount = 0;
        console.log("🟢 Circuit breaker: CLOSED");
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
        console.log("🔴 Circuit breaker: OPEN");
      }

      throw error;
    }
  }
}

/**
 * SOLUTION 7: Retry with Exponential Backoff
 */

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  initialDelay = 100
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt} failed: ${(error as Error).message}`);

      if (attempt < maxAttempts) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * SOLUTION 8: Dependency Injection
 */

interface IDatabase {
  query(sql: string): Promise<unknown>;
}

interface IEmailService {
  send(to: string, subject: string): Promise<void>;
}

class MockDatabase implements IDatabase {
  async query(sql: string): Promise<unknown> {
    return { success: true };
  }
}

class MockEmailService implements IEmailService {
  async send(to: string, subject: string): Promise<void> {
    console.log(`📧 Email to ${to}: ${subject}`);
  }
}

class UserService {
  constructor(private db: IDatabase, private email: IEmailService) {}

  async registerUser(email: string, name: string): Promise<void> {
    await this.db.query("INSERT INTO users (email, name) VALUES (?, ?)");
    await this.email.send(email, "Welcome!");
  }
}

// Usage with mocks for testing
const db = new MockDatabase();
const email = new MockEmailService();
const userService = new UserService(db, email);

console.log("Production Code Patterns Solutions Complete");
