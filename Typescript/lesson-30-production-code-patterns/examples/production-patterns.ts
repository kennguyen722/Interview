// ============================================================================
// PRODUCTION CODE PATTERNS - PRACTICAL EXAMPLES
// ============================================================================

/**
 * PATTERN 1: Result Type (Railway-Oriented Programming)
 */

type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

const ok = <T>(value: T): Result<T> => ({ success: true, value });
const err = <E>(error: E): Result<any, E> => ({ success: false, error });

// Example: Email validation
type ValidationError = { field: string; message: string };

function validateEmail(email: string): Result<string, ValidationError> {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return err({ field: "email", message: "Invalid email format" });
  }
  return ok(email);
}

function validateAge(age: number): Result<number, ValidationError> {
  if (age < 18 || age > 120) {
    return err({ field: "age", message: "Age must be between 18 and 120" });
  }
  return ok(age);
}

// Chaining results
function validateUser(email: string, age: number): Result<{ email: string; age: number }, ValidationError> {
  const emailResult = validateEmail(email);
  if (!emailResult.success) return emailResult;

  const ageResult = validateAge(age);
  if (!ageResult.success) return ageResult;

  return ok({ email: emailResult.value, age: ageResult.value });
}

console.log("RESULT TYPE:");
console.log("Valid:", validateUser("user@example.com", 25));
console.log("Invalid email:", validateUser("invalid", 25));
console.log("Invalid age:", validateUser("user@example.com", 150));

/**
 * PATTERN 2: Error Handling with Type Guards
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

class DatabaseError extends Error {
  constructor(public operation: string, message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

// Type guards
function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError;
}

// Error handler
function handleError(error: unknown): string {
  if (isApiError(error)) {
    return `API Error (${error.statusCode}): ${error.message}`;
  }
  if (isValidationError(error)) {
    return `Validation Error (${error.field}): ${error.message}`;
  }
  if (isDatabaseError(error)) {
    return `Database Error (${error.operation}): ${error.message}`;
  }
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return "Unknown error occurred";
}

console.log("\nERROR HANDLING:");
console.log(handleError(new ApiError(404, "NOT_FOUND", "User not found")));
console.log(handleError(new ValidationError("email", "Invalid email")));
console.log(handleError(new DatabaseError("INSERT", "Connection timeout")));

/**
 * PATTERN 3: Structured Logging
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: { name: string; message: string; stack?: string };
}

class Logger {
  private logs: LogEntry[] = [];

  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? { name: error.name, message: error.message, stack: error.stack } : undefined,
    };
  }

  info(message: string, context?: Record<string, unknown>) {
    const log = this.formatLog("INFO", message, context);
    this.logs.push(log);
    console.log(`[${log.timestamp}] ${log.level}: ${message}`, context);
  }

  error(message: string, error: Error, context?: Record<string, unknown>) {
    const log = this.formatLog("ERROR", message, context, error);
    this.logs.push(log);
    console.error(`[${log.timestamp}] ERROR: ${message}`, { error: error.message, ...context });
  }

  warn(message: string, context?: Record<string, unknown>) {
    const log = this.formatLog("WARN", message, context);
    this.logs.push(log);
    console.warn(`[${log.timestamp}] WARN: ${message}`, context);
  }

  getLogs() {
    return this.logs;
  }
}

const logger = new Logger();

console.log("\nSTRUCTURED LOGGING:");
logger.info("Application started", { version: "1.0.0" });
logger.warn("High memory usage detected", { memory: "85%" });
logger.error("Database connection failed", new Error("Connection timeout"), { retries: 3 });

/**
 * PATTERN 4: Configuration Management
 */

type Environment = "development" | "staging" | "production";

interface AppConfig {
  app: { env: Environment; port: number; name: string };
  database: { url: string; maxConnections: number };
  auth: { secret: string; expiresIn: string };
}

function loadConfig(env: Environment): Result<AppConfig> {
  const configs: Record<Environment, AppConfig> = {
    development: {
      app: { env: "development", port: 3000, name: "MyApp Dev" },
      database: { url: "postgres://localhost/myapp", maxConnections: 5 },
      auth: { secret: "dev-secret", expiresIn: "24h" },
    },
    staging: {
      app: { env: "staging", port: 8080, name: "MyApp Staging" },
      database: { url: "postgres://staging-db/myapp", maxConnections: 20 },
      auth: { secret: process.env.AUTH_SECRET || "error", expiresIn: "12h" },
    },
    production: {
      app: { env: "production", port: 443, name: "MyApp" },
      database: { url: process.env.DATABASE_URL || "", maxConnections: 100 },
      auth: { secret: process.env.AUTH_SECRET || "", expiresIn: "1h" },
    },
  };

  const config = configs[env];
  if (!config) {
    return err(new Error(`Unknown environment: ${env}`));
  }

  // Validate required environment variables
  if (env === "production") {
    if (!process.env.DATABASE_URL || !process.env.AUTH_SECRET) {
      return err(new Error("Missing required environment variables"));
    }
  }

  return ok(config);
}

console.log("\nCONFIGURATION MANAGEMENT:");
const config = loadConfig("development");
if (config.success) {
  console.log("Config loaded:", config.value.app);
}

/**
 * PATTERN 5: Circuit Breaker (Resilience)
 */

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

class CircuitBreaker<T> {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;

  constructor(
    private operation: () => Promise<T>,
    private failureThreshold = 5,
    private resetTimeout = 60000 // 60 seconds
  ) {}

  async execute(): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = "HALF_OPEN";
        console.log("Circuit breaker entering HALF_OPEN state");
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await this.operation();

      if (this.state === "HALF_OPEN") {
        this.state = "CLOSED";
        this.failureCount = 0;
        this.successCount = 0;
        console.log("Circuit breaker recovered to CLOSED state");
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
        console.log("Circuit breaker opened due to failures");
      }

      throw error;
    }
  }

  getState() {
    return this.state;
  }
}

// Example: API call with circuit breaker
let requestCount = 0;

const breaker = new CircuitBreaker(
  async () => {
    requestCount++;
    if (requestCount <= 3) {
      throw new Error("Service unavailable");
    }
    return "Success";
  },
  3,
  5000
);

console.log("\nCIRCUIT BREAKER:");
(async () => {
  for (let i = 0; i < 5; i++) {
    try {
      const result = await breaker.execute();
      console.log(`Request ${i + 1}: ${result}`);
    } catch (error: any) {
      console.log(`Request ${i + 1}: ${error.message}`);
    }
  }
})();

/**
 * PATTERN 6: Retry with Exponential Backoff
 */

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options = {
    maxAttempts: 3,
    initialDelay: 100,
    maxDelay: 10000,
    backoffMultiplier: 2,
  }
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt} failed: ${(error as Error).message}`);

      if (attempt < options.maxAttempts) {
        const delay = Math.min(
          options.initialDelay * Math.pow(options.backoffMultiplier, attempt - 1),
          options.maxDelay
        );
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

console.log("\nRETRY WITH EXPONENTIAL BACKOFF:");
let attempts = 0;

retryWithBackoff(
  async () => {
    attempts++;
    console.log(`Executing attempt ${attempts}`);
    if (attempts < 3) throw new Error("Not ready yet");
    return "Success!";
  },
  { maxAttempts: 5, initialDelay: 100 }
)
  .then((result) => console.log("Final result:", result))
  .catch((error) => console.error("All retries failed:", error.message));

/**
 * PATTERN 7: Dependency Injection
 */

interface IDatabase {
  query(sql: string): Promise<unknown>;
}

interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

class MockDatabase implements IDatabase {
  async query(sql: string): Promise<unknown> {
    return { id: 1, name: "John" };
  }
}

class MockEmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`Email sent to ${to}: ${subject}`);
  }
}

class UserService {
  constructor(private db: IDatabase, private email: IEmailService) {}

  async registerUser(email: string, name: string): Promise<void> {
    await this.db.query("INSERT INTO users (email, name) VALUES (?, ?)");
    await this.email.send(email, "Welcome", `Welcome ${name}!`);
  }
}

console.log("\nDEPENDENCY INJECTION:");
const db = new MockDatabase();
const emailService = new MockEmailService();
const userService = new UserService(db, emailService);

userService.registerUser("user@example.com", "John Doe").then(() => {
  console.log("User registration complete");
});
