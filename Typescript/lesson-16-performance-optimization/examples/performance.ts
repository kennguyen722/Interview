// Example 1: Type-Safe Memoization
function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  keyFn: (...args: Args) => string = (...args) => JSON.stringify(args)
): (...args: Args) => Result {
  const cache = new Map<string, Result>();

  return (...args: Args): Result => {
    const key = keyFn(...args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key)!;
  };
}

// Test memoization
const expensiveCalculation = (n: number): number => {
  console.log(`Computing for ${n}`);
  return n * n;
};

const memoized = memoize(expensiveCalculation);
console.log(memoized(5)); // Computing for 5 -> 25
console.log(memoized(5)); // (cached) -> 25

// Example 2: Lazy Value Pattern
class LazyValue<T> {
  private value?: T;
  private computed = false;

  constructor(private factory: () => T) {}

  get(): T {
    if (!this.computed) {
      this.value = this.factory();
      this.computed = true;
    }
    return this.value!;
  }

  reset(): void {
    this.computed = false;
    this.value = undefined;
  }
}

// Test lazy value
const lazyConfig = new LazyValue(() => {
  console.log("Loading configuration...");
  return { apiUrl: "https://api.example.com", timeout: 5000 };
});

// Config not loaded yet
console.log("App started");
// Config loaded on first access
console.log(lazyConfig.get());
// Cached value returned
console.log(lazyConfig.get());

// Example 3: Object Pool Pattern
class ObjectPool<T> {
  private available: T[] = [];
  private inUse = new Set<T>();

  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    initialSize: number
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory());
    }
  }

  acquire(): T {
    let obj = this.available.pop();
    if (!obj) {
      obj = this.factory();
    }
    this.inUse.add(obj);
    return obj;
  }

  release(obj: T): void {
    if (!this.inUse.has(obj)) {
      throw new Error("Object not acquired from this pool");
    }
    this.inUse.delete(obj);
    this.reset(obj);
    this.available.push(obj);
  }

  get poolSize(): number {
    return this.available.length + this.inUse.size;
  }

  get availableCount(): number {
    return this.available.length;
  }
}

// Test object pool
interface Connection {
  id: number;
  isOpen: boolean;
}

let connectionId = 0;
const connectionPool = new ObjectPool<Connection>(
  () => ({ id: connectionId++, isOpen: true }),
  (conn) => {
    conn.isOpen = true;
  },
  3
);

const conn1 = connectionPool.acquire();
const conn2 = connectionPool.acquire();
console.log(`Pool size: ${connectionPool.poolSize}, Available: ${connectionPool.availableCount}`);

connectionPool.release(conn1);
console.log(`Pool size: ${connectionPool.poolSize}, Available: ${connectionPool.availableCount}`);

// Example 4: Cache with Expiration
class ExpiringCache<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>();

  constructor(private defaultTTL: number = 60000) {} // 60 seconds

  set(key: K, value: V, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Test expiring cache
const cache = new ExpiringCache<string, number>(1000); // 1 second TTL
cache.set("key1", 42);
console.log(cache.get("key1")); // 42

// Example 5: Debounce and Throttle
function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  limit: number
): (...args: Args) => void {
  let inThrottle = false;

  return (...args: Args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Test debounce
const debouncedLog = debounce((msg: string) => console.log(msg), 1000);
debouncedLog("First"); // Cancelled
debouncedLog("Second"); // Cancelled
debouncedLog("Third"); // This will execute after 1s

// Test throttle
const throttledLog = throttle((msg: string) => console.log(msg), 1000);
throttledLog("A"); // Executes immediately
throttledLog("B"); // Ignored
throttledLog("C"); // Ignored

// Example 6: Structured Logger
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  constructor(private minLevel: LogLevel = "info") {}

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    };

    const output = JSON.stringify(entry, (_, value) => {
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack,
        };
      }
      return value;
    });

    console.log(output);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log("error", message, context, error);
  }
}

// Test logger
const logger = new Logger("info");
logger.debug("This won't show"); // Below min level
logger.info("Application started", { version: "1.0.0" });
logger.error("Something went wrong", new Error("Test error"));

// Example 7: Request Deduplication
class RequestDeduplicator<T> {
  private pending = new Map<string, Promise<T>>();

  async deduplicate(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.pending.has(key)) {
      return this.pending.get(key)!;
    }

    const promise = fn().finally(() => {
      this.pending.delete(key);
    });

    this.pending.set(key, promise);
    return promise;
  }
}

// Test deduplication
const deduplicator = new RequestDeduplicator<any>();

async function fetchUser(id: string): Promise<any> {
  console.log(`Fetching user ${id}...`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { id, name: "John" };
}

// Multiple calls with same key will share the same promise
deduplicator.deduplicate("user-1", () => fetchUser("1"));
deduplicator.deduplicate("user-1", () => fetchUser("1")); // Deduped
deduplicator.deduplicate("user-1", () => fetchUser("1")); // Deduped

// Example 8: Graceful Shutdown Handler
class Application {
  private isShuttingDown = false;
  private activeRequests = 0;

  incrementRequests(): void {
    if (this.isShuttingDown) {
      throw new Error("Server is shutting down");
    }
    this.activeRequests++;
  }

  decrementRequests(): void {
    this.activeRequests--;
  }

  async shutdown(timeout: number = 30000): Promise<void> {
    if (this.isShuttingDown) return;

    console.log("Initiating graceful shutdown...");
    this.isShuttingDown = true;

    const startTime = Date.now();
    
    while (this.activeRequests > 0 && Date.now() - startTime < timeout) {
      console.log(`Waiting for ${this.activeRequests} active requests...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (this.activeRequests > 0) {
      console.warn(`Forcing shutdown with ${this.activeRequests} active requests`);
    } else {
      console.log("All requests completed. Shutting down.");
    }

    process.exit(0);
  }
}

// Example 9: Health Check
interface HealthStatus {
  status: "healthy" | "unhealthy" | "degraded";
  checks: Record<string, { status: "pass" | "fail"; message?: string }>;
  timestamp: Date;
}

class HealthChecker {
  private checks = new Map<string, () => Promise<{ status: "pass" | "fail"; message?: string }>>();

  register(name: string, check: () => Promise<{ status: "pass" | "fail"; message?: string }>): void {
    this.checks.set(name, check);
  }

  async check(): Promise<HealthStatus> {
    const checks: Record<string, { status: "pass" | "fail"; message?: string }> = {};
    
    for (const [name, check] of this.checks.entries()) {
      try {
        checks[name] = await check();
      } catch (error) {
        checks[name] = {
          status: "fail",
          message: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    const allPassed = Object.values(checks).every((c) => c.status === "pass");
    const someFailed = Object.values(checks).some((c) => c.status === "fail");

    return {
      status: allPassed ? "healthy" : someFailed ? "unhealthy" : "degraded",
      checks,
      timestamp: new Date(),
    };
  }
}

// Test health checker
const healthChecker = new HealthChecker();
healthChecker.register("database", async () => ({ status: "pass" }));
healthChecker.register("redis", async () => ({ status: "pass" }));

export {
  memoize,
  LazyValue,
  ObjectPool,
  ExpiringCache,
  debounce,
  throttle,
  Logger,
  RequestDeduplicator,
  Application,
  HealthChecker,
};
