# Lesson 16: Performance Optimization & Production Best Practices

## Objective
Master performance optimization techniques, bundle analysis, runtime optimization, and production-grade TypeScript patterns for building high-performance applications.

## Topics Covered

### 1. Compiler Optimization
- `tsconfig.json` settings for optimal performance
- Incremental compilation and build caching
- Project references for monorepos
- `skipLibCheck` and `skipDefaultLibCheck` tradeoffs

### 2. Bundle Size Optimization
- Tree shaking and dead code elimination
- Code splitting strategies
- Dynamic imports for lazy loading
- Analyzing bundle composition

### 3. Runtime Performance
- Memoization patterns with type safety
- Lazy evaluation and computed properties
- Object pooling and reuse strategies
- Avoiding unnecessary type guards

### 4. Type-Level Performance
- Avoiding deeply recursive types
- Using template literal types efficiently
- Distributive conditional types optimization
- Type narrowing for better runtime checks

### 5. Memory Management
- WeakMap and WeakSet for cache invalidation
- Avoiding memory leaks in event listeners
- Proper cleanup in React hooks
- Reference management in long-running processes

### 6. Production Patterns
- Error boundaries and fallback strategies
- Structured logging with type safety
- Health checks and readiness probes
- Graceful shutdown handling

## Learning Outcomes
- Configure TypeScript for optimal build performance
- Implement code splitting and lazy loading
- Use memoization and caching effectively
- Identify and fix performance bottlenecks
- Apply production-grade patterns for reliability

## Key Concepts

### Build Performance
```typescript
// tsconfig.json for fast builds
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    "skipLibCheck": true,
    "isolatedModules": true
  }
}
```

### Code Splitting
```typescript
// Dynamic imports for lazy loading
const HeavyComponent = lazy(() => import("./HeavyComponent"));

// Route-based code splitting
const routes = [
  { path: "/", component: () => import("./Home") },
  { path: "/dashboard", component: () => import("./Dashboard") },
];
```

### Memoization Patterns
```typescript
// Type-safe memoization
function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  const cache = new Map<string, Result>();
  return (...args: Args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key)!;
  };
}
```

## Hands-On Examples

### Example 1: Bundle Analysis
```bash
# Using webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# In webpack.config.js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
plugins: [new BundleAnalyzerPlugin()];
```

### Example 2: Lazy Loading Pattern
```typescript
class LazyValue<T> {
  private value?: T;
  constructor(private factory: () => T) {}

  get(): T {
    if (this.value === undefined) {
      this.value = this.factory();
    }
    return this.value;
  }
}
```

### Example 3: Object Pool
```typescript
class ObjectPool<T> {
  private available: T[] = [];
  
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
    return this.available.pop() || this.factory();
  }

  release(obj: T): void {
    this.reset(obj);
    this.available.push(obj);
  }
}
```

## Practice Challenges

1. **Optimize Build**: Configure a TypeScript project with project references for a monorepo
2. **Bundle Analysis**: Identify large dependencies and implement code splitting
3. **Memoization**: Create a memoized Fibonacci function with type safety
4. **Lazy Loading**: Implement route-based code splitting with React Router
5. **Memory Management**: Build a cache with automatic expiration using WeakMap
6. **Production Logging**: Create a typed logger with different log levels and structured output
7. **Health Check**: Implement readiness and liveness endpoints for Kubernetes

## Performance Checklist

### Build Time
- [ ] Enable `incremental` compilation
- [ ] Use `skipLibCheck` for faster type checking
- [ ] Configure `paths` for module resolution
- [ ] Use `isolatedModules` for parallel builds
- [ ] Enable project references for monorepos

### Bundle Size
- [ ] Analyze bundle composition with webpack-bundle-analyzer
- [ ] Implement code splitting for routes
- [ ] Use dynamic imports for heavy dependencies
- [ ] Enable tree shaking in production builds
- [ ] Remove unused dependencies

### Runtime Performance
- [ ] Memoize expensive computations
- [ ] Use lazy evaluation for computed properties
- [ ] Implement object pooling for frequently created objects
- [ ] Avoid unnecessary re-renders in React
- [ ] Use `useMemo` and `useCallback` appropriately

### Memory Management
- [ ] Use WeakMap/WeakSet for cache that can be garbage collected
- [ ] Remove event listeners in cleanup functions
- [ ] Clear intervals and timeouts
- [ ] Avoid circular references
- [ ] Monitor memory usage with Chrome DevTools

## Production Patterns

### Structured Logging
```typescript
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

class Logger {
  log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    };
    console.log(JSON.stringify(entry));
  }
}
```

### Graceful Shutdown
```typescript
class Application {
  private isShuttingDown = false;

  async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log("Shutting down gracefully...");
    
    // Stop accepting new requests
    // Finish processing existing requests
    // Close database connections
    // Clean up resources
    
    process.exit(0);
  }
}

process.on("SIGTERM", () => app.shutdown());
process.on("SIGINT", () => app.shutdown());
```

## Tools and Resources
- [TypeScript Performance](https://github.com/microsoft/TypeScript/wiki/Performance)
- [webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [React Profiler](https://react.dev/reference/react/Profiler)

## Next Steps
Complete the exercises in `exercises/starter.ts` to practice performance optimization techniques and production patterns. These skills are essential for building scalable, production-ready applications.
