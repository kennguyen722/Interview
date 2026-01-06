# Lesson 30: Production Code Patterns & Best Practices

## Objective
Learn patterns and practices used in production systems. Master error handling, logging, configuration, validation, and resilience patterns that make code production-ready.

## Topics Covered

### 1. Error Handling Patterns

#### Pattern 1: Result Type (Railway Oriented)
```typescript
// Define Result type
type Result<T, E = Error> = { success: true; value: T } | { success: false; error: E };

function ok<T>(value: T): Result<T> {
  return { success: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Usage
function parseUserInput(input: string): Result<User> {
  if (!input) {
    return err(new Error("Input required"));
  }

  try {
    const user = JSON.parse(input);
    return validateUser(user);
  } catch (e) {
    return err(new Error(`Invalid JSON: ${e}`));
  }
}

function validateUser(user: unknown): Result<User> {
  if (typeof user !== "object" || user === null) {
    return err(new Error("User must be an object"));
  }

  if (!("id" in user) || !("name" in user)) {
    return err(new Error("Missing required fields"));
  }

  return ok(user as User);
}

// Chain operations
const result = parseUserInput(input)
  .flatMap(validateUser)
  .flatMap(async (user) => {
    const saved = await saveUser(user);
    return saved ? ok(user) : err(new Error("Save failed"));
  });
```

#### Pattern 2: Try-Catch with Type Narrowing
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}

async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (isApiError(error)) {
      console.error(`API Error [${error.code}]: ${error.message}`);
      // Handle API error specifically
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      // Handle standard error
    } else {
      console.error("Unknown error:", error);
      // Handle unknown error
    }
    return null;
  }
}
```

### 2. Validation Patterns

```typescript
// Validator interface
interface Validator<T> {
  validate(value: unknown): Result<T>;
}

// Schema-based validation
class UserValidator implements Validator<User> {
  validate(value: unknown): Result<User> {
    if (typeof value !== "object" || value === null) {
      return err(new Error("User must be an object"));
    }

    const obj = value as Record<string, unknown>;

    // Validate id
    if (typeof obj.id !== "string" || !obj.id) {
      return err(new Error("id must be non-empty string"));
    }

    // Validate email
    if (typeof obj.email !== "string" || !this.isValidEmail(obj.email)) {
      return err(new Error("email must be valid email address"));
    }

    // Validate age
    if (typeof obj.age !== "number" || obj.age < 0 || obj.age > 150) {
      return err(new Error("age must be between 0 and 150"));
    }

    return ok({
      id: obj.id,
      email: obj.email,
      age: obj.age,
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// Usage
const validator = new UserValidator();
const result = validator.validate(userData);
if (result.success) {
  console.log("Valid user:", result.value);
} else {
  console.error("Validation error:", result.error.message);
}
```

### 3. Logging Patterns

```typescript
// Structured logging
interface LogContext {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  context?: Record<string, unknown>;
  error?: { message: string; stack?: string };
}

class Logger {
  private logs: LogContext[] = [];

  private log(level: LogContext["level"], message: string, context?: Record<string, unknown>) {
    const logEntry: LogContext = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    this.logs.push(logEntry);

    // In production, send to logging service
    if (level === "error" || level === "warn") {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    const logEntry: LogContext = {
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      context,
      error: error ? { message: error.message, stack: error.stack } : undefined,
    };

    this.logs.push(logEntry);
    console.error(JSON.stringify(logEntry));
  }
}

// Usage
const logger = new Logger();
logger.info("User created", { userId: "123", email: "user@example.com" });
logger.warn("Deprecated API used", { endpoint: "/old-api" });
logger.error("Database connection failed", dbError, { retries: 3 });
```

### 4. Configuration Patterns

```typescript
// Type-safe configuration
interface Config {
  app: {
    name: string;
    env: "development" | "staging" | "production";
    port: number;
  };
  database: {
    url: string;
    pool: { min: number; max: number };
  };
  auth: {
    secret: string;
    expiresIn: string;
  };
}

// Configuration loading with validation
function loadConfig(): Result<Config> {
  const env = process.env.NODE_ENV || "development";
  const dbUrl = process.env.DATABASE_URL;
  const authSecret = process.env.AUTH_SECRET;

  if (!dbUrl) {
    return err(new Error("DATABASE_URL environment variable is required"));
  }

  if (env === "production" && !authSecret) {
    return err(new Error("AUTH_SECRET required in production"));
  }

  return ok({
    app: {
      name: process.env.APP_NAME || "MyApp",
      env: env as any,
      port: parseInt(process.env.PORT || "3000", 10),
    },
    database: {
      url: dbUrl,
      pool: { min: 5, max: 20 },
    },
    auth: {
      secret: authSecret || "dev-secret",
      expiresIn: process.env.AUTH_EXPIRES || "24h",
    },
  });
}

// Usage
const configResult = loadConfig();
if (configResult.success) {
  const config = configResult.value;
  // Use config
} else {
  console.error("Configuration error:", configResult.error.message);
  process.exit(1);
}
```

### 5. Resilience Patterns

#### Circuit Breaker
```typescript
type CircuitState = "closed" | "open" | "half-open";

class CircuitBreaker<T> {
  private state: CircuitState = "closed";
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime?: Date;

  constructor(
    private readonly failureThreshold = 5,
    private readonly resetTimeout = 60000,
    private readonly fn: () => Promise<T>
  ) {}

  async execute(): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime!.getTime() > this.resetTimeout) {
        this.state = "half-open";
        this.successCount = 0;
      } else {
        throw new Error("Circuit breaker is open");
      }
    }

    try {
      const result = await this.fn();

      if (this.state === "half-open") {
        this.successCount++;
        if (this.successCount >= 2) {
          this.state = "closed";
          this.failureCount = 0;
        }
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = new Date();

      if (this.failureCount >= this.failureThreshold) {
        this.state = "open";
      }

      throw error;
    }
  }
}

// Usage
const breaker = new CircuitBreaker(
  5,
  60000,
  async () => {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
);

try {
  const data = await breaker.execute();
  console.log("Data:", data);
} catch (error) {
  console.error("Circuit breaker triggered:", error);
}
```

#### Retry with Exponential Backoff
```typescript
interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error | undefined;
  let delay = options.initialDelay;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === options.maxAttempts) {
        break;
      }

      console.log(
        `Attempt ${attempt} failed, retrying in ${delay}ms: ${lastError.message}`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * options.backoffMultiplier, options.maxDelay);
    }
  }

  throw lastError || new Error("All retry attempts failed");
}

// Usage
const data = await retryWithBackoff(
  async () => {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  { maxAttempts: 3, initialDelay: 100, maxDelay: 5000, backoffMultiplier: 2 }
);
```

### 6. Dependency Injection Pattern

```typescript
// Define interfaces
interface IDatabase {
  query<T>(sql: string, params: any[]): Promise<T[]>;
}

interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

// Implementations
class PostgresDatabase implements IDatabase {
  async query<T>(sql: string, params: any[]): Promise<T[]> {
    // PostgreSQL implementation
    return [];
  }
}

class SmtpEmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // SMTP implementation
  }
}

// Service using dependencies
class UserService {
  constructor(
    private readonly db: IDatabase,
    private readonly email: IEmailService
  ) {}

  async registerUser(userData: any): Promise<void> {
    // Use injected dependencies
    await this.db.query("INSERT INTO users ...", [userData]);
    await this.email.send(
      userData.email,
      "Welcome",
      "Welcome to our platform!"
    );
  }
}

// Composition root
const db = new PostgresDatabase();
const email = new SmtpEmailService();
const userService = new UserService(db, email);

// In tests, swap with mocks
class MockDatabase implements IDatabase {
  async query<T>(): Promise<T[]> {
    return [];
  }
}

const mockUserService = new UserService(new MockDatabase(), new SmtpEmailService());
```

## Learning Outcomes
- Implement error handling correctly
- Validate data consistently
- Structure logging for production
- Manage configuration safely
- Build resilient systems
- Use dependency injection

## Resources
- [The Twelve-Factor App](https://12factor.net/)
- [OWASP Secure Coding Practices](https://cheatsheetseries.owasp.org/)
- [Error Handling in Node.js](https://nodejs.org/en/docs/guides/nodejs-error-handling/)
