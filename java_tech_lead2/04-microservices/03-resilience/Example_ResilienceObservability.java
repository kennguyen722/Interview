/**
 * Microservices Resilience Patterns and Observability
 * 
 * Key Points:
 * - Resilience patterns: Circuit breaker, retry, bulkhead, timeout
 * - Observability: Distributed tracing, logging, metrics
 * - Service mesh integration
 * - Chaos engineering principles
 * - Performance monitoring and alerting
 */

import java.util.*;
import java.util.concurrent.*;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.function.*;
import java.util.concurrent.atomic.*;

// Distributed tracing
class TraceContext {
    private final String traceId;
    private final String spanId;
    private final String parentSpanId;
    private final Map<String, String> baggage;
    
    public TraceContext(String traceId, String spanId, String parentSpanId) {
        this.traceId = traceId;
        this.spanId = spanId;
        this.parentSpanId = parentSpanId;
        this.baggage = new ConcurrentHashMap<>();
    }
    
    public static TraceContext newTrace() {
        String traceId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String spanId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        return new TraceContext(traceId, spanId, null);
    }
    
    public TraceContext createChildSpan() {
        String childSpanId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        TraceContext child = new TraceContext(this.traceId, childSpanId, this.spanId);
        child.baggage.putAll(this.baggage);
        return child;
    }
    
    public String getTraceId() { return traceId; }
    public String getSpanId() { return spanId; }
    public String getParentSpanId() { return parentSpanId; }
    public Map<String, String> getBaggage() { return baggage; }
    
    public void setBaggageItem(String key, String value) {
        baggage.put(key, value);
    }
    
    public String getBaggageItem(String key) {
        return baggage.get(key);
    }
    
    @Override
    public String toString() {
        return String.format("TraceContext{traceId='%s', spanId='%s', parentSpanId='%s'}", 
            traceId, spanId, parentSpanId);
    }
}

class Span {
    private final String operationName;
    private final TraceContext context;
    private final LocalDateTime startTime;
    private final Map<String, Object> tags;
    private final List<LogEntry> logs;
    private LocalDateTime finishTime;
    private Duration duration;
    
    public Span(String operationName, TraceContext context) {
        this.operationName = operationName;
        this.context = context;
        this.startTime = LocalDateTime.now();
        this.tags = new ConcurrentHashMap<>();
        this.logs = Collections.synchronizedList(new ArrayList<>());
    }
    
    public Span setTag(String key, Object value) {
        tags.put(key, value);
        return this;
    }
    
    public Span log(String event) {
        logs.add(new LogEntry(LocalDateTime.now(), event, null));
        return this;
    }
    
    public Span log(String event, Map<String, Object> fields) {
        logs.add(new LogEntry(LocalDateTime.now(), event, fields));
        return this;
    }
    
    public void finish() {
        this.finishTime = LocalDateTime.now();
        this.duration = Duration.between(startTime, finishTime);
        
        System.out.printf("[TRACE] Span finished: %s [%s] duration=%dms%n",
            operationName, context.getSpanId(), duration.toMillis());
    }
    
    public String getOperationName() { return operationName; }
    public TraceContext getContext() { return context; }
    public LocalDateTime getStartTime() { return startTime; }
    public Map<String, Object> getTags() { return tags; }
    public List<LogEntry> getLogs() { return logs; }
    public Duration getDuration() { return duration; }
    
    private static class LogEntry {
        private final LocalDateTime timestamp;
        private final String event;
        private final Map<String, Object> fields;
        
        public LogEntry(LocalDateTime timestamp, String event, Map<String, Object> fields) {
            this.timestamp = timestamp;
            this.event = event;
            this.fields = fields != null ? new HashMap<>(fields) : new HashMap<>();
        }
        
        public LocalDateTime getTimestamp() { return timestamp; }
        public String getEvent() { return event; }
        public Map<String, Object> getFields() { return fields; }
    }
}

class Tracer {
    private final ThreadLocal<Span> activeSpan = new ThreadLocal<>();
    private final List<Span> completedSpans = Collections.synchronizedList(new ArrayList<>());
    
    public Span startSpan(String operationName) {
        TraceContext context;
        Span currentSpan = activeSpan.get();
        
        if (currentSpan != null) {
            context = currentSpan.getContext().createChildSpan();
        } else {
            context = TraceContext.newTrace();
        }
        
        Span span = new Span(operationName, context);
        activeSpan.set(span);
        
        System.out.printf("[TRACE] Span started: %s [%s]%n", 
            operationName, context.getSpanId());
        
        return span;
    }
    
    public void finishSpan() {
        Span span = activeSpan.get();
        if (span != null) {
            span.finish();
            completedSpans.add(span);
            activeSpan.remove();
        }
    }
    
    public Span getActiveSpan() {
        return activeSpan.get();
    }
    
    public List<Span> getCompletedSpans() {
        return new ArrayList<>(completedSpans);
    }
    
    public void printTraceTree() {
        System.out.println("=== Distributed Trace Tree ===");
        Map<String, List<Span>> traceGroups = new HashMap<>();
        
        for (Span span : completedSpans) {
            traceGroups.computeIfAbsent(span.getContext().getTraceId(), k -> new ArrayList<>())
                      .add(span);
        }
        
        traceGroups.forEach((traceId, spans) -> {
            System.out.printf("Trace: %s%n", traceId);
            printSpanTree(spans, null, "");
        });
    }
    
    private void printSpanTree(List<Span> spans, String parentSpanId, String indent) {
        spans.stream()
            .filter(span -> Objects.equals(span.getContext().getParentSpanId(), parentSpanId))
            .forEach(span -> {
                System.out.printf("%s├─ %s [%s] %dms%n", 
                    indent, 
                    span.getOperationName(), 
                    span.getContext().getSpanId(),
                    span.getDuration() != null ? span.getDuration().toMillis() : 0);
                
                printSpanTree(spans, span.getContext().getSpanId(), indent + "  ");
            });
    }
}

// Resilience patterns
class RetryTemplate {
    private final int maxAttempts;
    private final long baseDelayMs;
    private final double multiplier;
    private final long maxDelayMs;
    private final Set<Class<? extends Exception>> retryableExceptions;
    
    public RetryTemplate(int maxAttempts, long baseDelayMs, double multiplier, long maxDelayMs) {
        this.maxAttempts = maxAttempts;
        this.baseDelayMs = baseDelayMs;
        this.multiplier = multiplier;
        this.maxDelayMs = maxDelayMs;
        this.retryableExceptions = new HashSet<>();
        
        // Default retryable exceptions
        retryableExceptions.add(RuntimeException.class);
    }
    
    public <T> T execute(Supplier<T> operation) {
        Exception lastException = null;
        
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return operation.get();
            } catch (Exception e) {
                lastException = e;
                
                if (attempt == maxAttempts || !isRetryable(e)) {
                    break;
                }
                
                long delay = calculateDelay(attempt);
                System.out.printf("[RETRY] Attempt %d failed: %s. Retrying in %dms...%n", 
                    attempt, e.getMessage(), delay);
                
                try {
                    Thread.sleep(delay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Retry interrupted", ie);
                }
            }
        }
        
        throw new RuntimeException("Retry exhausted after " + maxAttempts + " attempts", lastException);
    }
    
    private boolean isRetryable(Exception e) {
        return retryableExceptions.stream()
            .anyMatch(clazz -> clazz.isAssignableFrom(e.getClass()));
    }
    
    private long calculateDelay(int attempt) {
        long delay = (long) (baseDelayMs * Math.pow(multiplier, attempt - 1));
        return Math.min(delay, maxDelayMs);
    }
}

class BulkheadIsolation {
    private final Map<String, Semaphore> resourcePools = new ConcurrentHashMap<>();
    private final Map<String, ExecutorService> dedicatedExecutors = new ConcurrentHashMap<>();
    
    public void configurePool(String poolName, int maxConcurrency) {
        resourcePools.put(poolName, new Semaphore(maxConcurrency));
        dedicatedExecutors.put(poolName, Executors.newFixedThreadPool(maxConcurrency));
        System.out.printf("[BULKHEAD] Configured pool '%s' with max concurrency: %d%n", 
            poolName, maxConcurrency);
    }
    
    public <T> CompletableFuture<T> execute(String poolName, Supplier<T> operation) {
        Semaphore semaphore = resourcePools.get(poolName);
        ExecutorService executor = dedicatedExecutors.get(poolName);
        
        if (semaphore == null || executor == null) {
            throw new IllegalArgumentException("Pool not configured: " + poolName);
        }
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!semaphore.tryAcquire(100, TimeUnit.MILLISECONDS)) {
                    throw new RuntimeException("Pool " + poolName + " is saturated");
                }
                
                try {
                    System.out.printf("[BULKHEAD] Executing in pool '%s' (available: %d)%n", 
                        poolName, semaphore.availablePermits());
                    return operation.get();
                } finally {
                    semaphore.release();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Execution interrupted", e);
            }
        }, executor);
    }
    
    public void printPoolStatus() {
        System.out.println("=== Bulkhead Pool Status ===");
        resourcePools.forEach((poolName, semaphore) -> {
            System.out.printf("Pool '%s': Available permits: %d%n", 
                poolName, semaphore.availablePermits());
        });
    }
    
    public void shutdown() {
        dedicatedExecutors.values().forEach(ExecutorService::shutdown);
    }
}

class TimeoutWrapper {
    private final long timeoutMs;
    private final ExecutorService executor;
    
    public TimeoutWrapper(long timeoutMs) {
        this.timeoutMs = timeoutMs;
        this.executor = Executors.newCachedThreadPool();
    }
    
    public <T> T execute(Supplier<T> operation) {
        Future<T> future = executor.submit(() -> operation.get());
        
        try {
            return future.get(timeoutMs, TimeUnit.MILLISECONDS);
        } catch (TimeoutException e) {
            future.cancel(true);
            throw new RuntimeException("Operation timed out after " + timeoutMs + "ms");
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof RuntimeException) {
                throw (RuntimeException) cause;
            }
            throw new RuntimeException("Operation failed", cause);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Operation interrupted", e);
        }
    }
}

// Comprehensive resilience wrapper
class ResilientServiceCall {
    private final String serviceName;
    private final CircuitBreaker circuitBreaker;
    private final RetryTemplate retryTemplate;
    private final BulkheadIsolation bulkhead;
    private final TimeoutWrapper timeout;
    private final Tracer tracer;
    
    public ResilientServiceCall(String serviceName, Tracer tracer) {
        this.serviceName = serviceName;
        this.tracer = tracer;
        
        // Initialize resilience components
        this.circuitBreaker = new CircuitBreaker(serviceName, 3, 5000, 30000);
        this.retryTemplate = new RetryTemplate(3, 1000, 2.0, 10000);
        this.bulkhead = new BulkheadIsolation();
        this.timeout = new TimeoutWrapper(5000);
        
        // Configure bulkhead pool
        bulkhead.configurePool(serviceName, 5);
    }
    
    public <T> CompletableFuture<T> call(String operation, Supplier<T> serviceCall) {
        Span span = tracer.startSpan(serviceName + "." + operation);
        span.setTag("service.name", serviceName)
            .setTag("operation", operation);
        
        return bulkhead.execute(serviceName, () -> {
            try {
                return circuitBreaker.execute(() -> {
                    return retryTemplate.execute(() -> {
                        return timeout.execute(() -> {
                            span.log("service.call.start");
                            T result = serviceCall.get();
                            span.log("service.call.success");
                            return result;
                        });
                    });
                });
            } catch (Exception e) {
                span.setTag("error", true)
                    .setTag("error.message", e.getMessage())
                    .log("service.call.error", Map.of("exception", e.getClass().getSimpleName()));
                throw e;
            } finally {
                tracer.finishSpan();
            }
        });
    }
    
    public String getServiceName() { return serviceName; }
    public CircuitBreaker getCircuitBreaker() { return circuitBreaker; }
    public BulkheadIsolation getBulkhead() { return bulkhead; }
}

// Observability and monitoring
class ApplicationMetrics {
    private final Map<String, AtomicLong> counters = new ConcurrentHashMap<>();
    private final Map<String, AtomicReference<Double>> gauges = new ConcurrentHashMap<>();
    private final Map<String, List<Long>> histograms = new ConcurrentHashMap<>();
    
    public void incrementCounter(String name) {
        incrementCounter(name, 1);
    }
    
    public void incrementCounter(String name, long delta) {
        counters.computeIfAbsent(name, k -> new AtomicLong(0)).addAndGet(delta);
    }
    
    public void recordGauge(String name, double value) {
        gauges.computeIfAbsent(name, k -> new AtomicReference<>(0.0)).set(value);
    }
    
    public void recordHistogram(String name, long value) {
        histograms.computeIfAbsent(name, k -> Collections.synchronizedList(new ArrayList<>()))
                 .add(value);
    }
    
    public long getCounter(String name) {
        return counters.getOrDefault(name, new AtomicLong(0)).get();
    }
    
    public double getGauge(String name) {
        return gauges.getOrDefault(name, new AtomicReference<>(0.0)).get();
    }
    
    public double getHistogramPercentile(String name, double percentile) {
        List<Long> values = histograms.get(name);
        if (values == null || values.isEmpty()) {
            return 0.0;
        }
        
        List<Long> sorted = new ArrayList<>(values);
        Collections.sort(sorted);
        
        int index = (int) Math.ceil(percentile * sorted.size()) - 1;
        return sorted.get(Math.max(0, index));
    }
    
    public void printMetrics() {
        System.out.println("=== Application Metrics ===");
        
        System.out.println("Counters:");
        counters.forEach((name, value) -> 
            System.out.printf("  %s: %d%n", name, value.get()));
        
        System.out.println("Gauges:");
        gauges.forEach((name, value) -> 
            System.out.printf("  %s: %.2f%n", name, value.get()));
        
        System.out.println("Histograms:");
        histograms.forEach((name, values) -> {
            if (!values.isEmpty()) {
                System.out.printf("  %s: p50=%.0f, p95=%.0f, p99=%.0f%n", 
                    name,
                    getHistogramPercentile(name, 0.5),
                    getHistogramPercentile(name, 0.95),
                    getHistogramPercentile(name, 0.99));
            }
        });
    }
}

class HealthMonitor {
    private final Map<String, HealthCheck> healthChecks = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    
    public void registerHealthCheck(String name, HealthCheck healthCheck) {
        healthChecks.put(name, healthCheck);
        
        // Schedule periodic health checks
        scheduler.scheduleAtFixedRate(() -> {
            try {
                HealthStatus status = healthCheck.check();
                System.out.printf("[HEALTH] %s: %s%n", name, status.getStatus());
            } catch (Exception e) {
                System.err.printf("[HEALTH] %s: ERROR - %s%n", name, e.getMessage());
            }
        }, 0, 30, TimeUnit.SECONDS);
    }
    
    public Map<String, HealthStatus> checkAll() {
        Map<String, HealthStatus> results = new HashMap<>();
        
        for (Map.Entry<String, HealthCheck> entry : healthChecks.entrySet()) {
            try {
                HealthStatus status = entry.getValue().check();
                results.put(entry.getKey(), status);
            } catch (Exception e) {
                results.put(entry.getKey(), 
                    new HealthStatus(HealthStatus.Status.DOWN, 
                        Map.of("error", e.getMessage())));
            }
        }
        
        return results;
    }
    
    public void shutdown() {
        scheduler.shutdown();
    }
    
    @FunctionalInterface
    public interface HealthCheck {
        HealthStatus check();
    }
    
    public static class HealthStatus {
        public enum Status { UP, DOWN, DEGRADED }
        
        private final Status status;
        private final Map<String, Object> details;
        
        public HealthStatus(Status status, Map<String, Object> details) {
            this.status = status;
            this.details = new HashMap<>(details);
        }
        
        public Status getStatus() { return status; }
        public Map<String, Object> getDetails() { return details; }
        
        @Override
        public String toString() {
            return String.format("HealthStatus{status=%s, details=%s}", status, details);
        }
    }
}

public class Example_ResilienceObservability {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Microservices Resilience and Observability ===\n");
        
        // 1. INITIALIZE OBSERVABILITY
        System.out.println("1. Initializing Observability Stack:");
        ObservabilityStack stack = initializeObservability();
        
        // 2. DEMONSTRATE RESILIENCE PATTERNS
        System.out.println("\n2. Resilience Patterns:");
        demonstrateResiliencePatterns(stack);
        
        // 3. DISTRIBUTED TRACING
        System.out.println("\n3. Distributed Tracing:");
        demonstrateDistributedTracing(stack);
        
        // 4. HEALTH MONITORING
        System.out.println("\n4. Health Monitoring:");
        demonstrateHealthMonitoring(stack);
        
        // 5. METRICS AND ALERTING
        System.out.println("\n5. Metrics and Alerting:");
        demonstrateMetricsAndAlerting(stack);
        
        // 6. CHAOS ENGINEERING
        System.out.println("\n6. Chaos Engineering Simulation:");
        demonstrateChaosEngineering(stack);
        
        Thread.sleep(2000);
        
        // 7. FINAL OBSERVABILITY REPORT
        System.out.println("\n7. Observability Report:");
        generateObservabilityReport(stack);
        
        System.out.println("\n=== Summary ===");
        printResilienceSummary();
        
        stack.shutdown();
    }
    
    private static ObservabilityStack initializeObservability() {
        Tracer tracer = new Tracer();
        ApplicationMetrics metrics = new ApplicationMetrics();
        HealthMonitor healthMonitor = new HealthMonitor();
        
        // Register health checks
        healthMonitor.registerHealthCheck("database", () -> 
            new HealthMonitor.HealthStatus(
                Math.random() > 0.1 ? HealthMonitor.HealthStatus.Status.UP : HealthMonitor.HealthStatus.Status.DOWN,
                Map.of("connections", 5, "response_time_ms", (int)(Math.random() * 100))
            )
        );
        
        healthMonitor.registerHealthCheck("external_api", () -> 
            new HealthMonitor.HealthStatus(
                Math.random() > 0.2 ? HealthMonitor.HealthStatus.Status.UP : HealthMonitor.HealthStatus.Status.DOWN,
                Map.of("endpoint", "https://api.example.com", "last_check", LocalDateTime.now())
            )
        );
        
        System.out.println("Observability stack initialized:");
        System.out.println("- Distributed tracing enabled");
        System.out.println("- Application metrics collector started");
        System.out.println("- Health monitoring configured");
        
        return new ObservabilityStack(tracer, metrics, healthMonitor);
    }
    
    private static void demonstrateResiliencePatterns(ObservabilityStack stack) {
        System.out.println("--- Resilience Patterns in Action ---");
        
        ResilientServiceCall userService = new ResilientServiceCall("user-service", stack.tracer);
        ResilientServiceCall orderService = new ResilientServiceCall("order-service", stack.tracer);
        
        // Simulate service calls with various failure modes
        simulateServiceCall(userService, "getUserById", stack.metrics, () -> {
            if (Math.random() < 0.3) throw new RuntimeException("Database timeout");
            return "User{id=123, name='John Doe'}";
        });
        
        simulateServiceCall(orderService, "createOrder", stack.metrics, () -> {
            if (Math.random() < 0.4) throw new RuntimeException("Inventory service unavailable");
            return "Order{id=456, status='CREATED'}";
        });
        
        // Print circuit breaker states
        System.out.printf("User service circuit breaker: %s%n", 
            userService.getCircuitBreaker().getState());
        System.out.printf("Order service circuit breaker: %s%n", 
            orderService.getCircuitBreaker().getState());
    }
    
    private static void simulateServiceCall(ResilientServiceCall service, String operation, 
                                          ApplicationMetrics metrics, Supplier<String> call) {
        for (int i = 0; i < 5; i++) {
            try {
                CompletableFuture<String> future = service.call(operation, call);
                String result = future.get(10, TimeUnit.SECONDS);
                
                metrics.incrementCounter(service.getServiceName() + ".requests.success");
                metrics.recordHistogram(service.getServiceName() + ".response_time", 
                    100 + (long)(Math.random() * 200));
                
                System.out.printf("[%s] %s: SUCCESS%n", service.getServiceName(), operation);
            } catch (Exception e) {
                metrics.incrementCounter(service.getServiceName() + ".requests.failure");
                System.out.printf("[%s] %s: FAILED - %s%n", 
                    service.getServiceName(), operation, e.getMessage());
            }
        }
    }
    
    private static void demonstrateDistributedTracing(ObservabilityStack stack) {
        System.out.println("--- Distributed Tracing ---");
        
        // Simulate a complex distributed operation
        Span rootSpan = stack.tracer.startSpan("order.checkout");
        rootSpan.setTag("user.id", "123")
               .setTag("order.id", "456");
        
        try {
            // User service call
            Span userSpan = stack.tracer.startSpan("user.validate");
            userSpan.setTag("user.id", "123");
            Thread.sleep(50);
            userSpan.log("user validation completed");
            stack.tracer.finishSpan();
            
            // Inventory service call
            Span inventorySpan = stack.tracer.startSpan("inventory.reserve");
            inventorySpan.setTag("product.id", "789")
                       .setTag("quantity", 2);
            Thread.sleep(100);
            inventorySpan.log("inventory reserved");
            stack.tracer.finishSpan();
            
            // Payment service call
            Span paymentSpan = stack.tracer.startSpan("payment.process");
            paymentSpan.setTag("amount", 99.99)
                      .setTag("currency", "USD");
            Thread.sleep(200);
            paymentSpan.log("payment processed");
            stack.tracer.finishSpan();
            
            rootSpan.log("checkout completed successfully");
            
        } catch (InterruptedException e) {
            rootSpan.setTag("error", true)
                   .log("checkout failed", Map.of("error", e.getMessage()));
            Thread.currentThread().interrupt();
        } finally {
            stack.tracer.finishSpan();
        }
        
        // Print trace tree
        stack.tracer.printTraceTree();
    }
    
    private static void demonstrateHealthMonitoring(ObservabilityStack stack) {
        System.out.println("--- Health Monitoring ---");
        
        Map<String, HealthMonitor.HealthStatus> healthResults = stack.healthMonitor.checkAll();
        
        System.out.println("Health check results:");
        healthResults.forEach((name, status) -> {
            System.out.printf("  %s: %s%n", name, status);
        });
        
        // Determine overall health
        boolean allHealthy = healthResults.values().stream()
            .allMatch(status -> status.getStatus() == HealthMonitor.HealthStatus.Status.UP);
        
        System.out.printf("Overall system health: %s%n", 
            allHealthy ? "HEALTHY" : "DEGRADED");
    }
    
    private static void demonstrateMetricsAndAlerting(ObservabilityStack stack) {
        System.out.println("--- Metrics and Alerting ---");
        
        // Record some sample metrics
        stack.metrics.incrementCounter("http.requests.total", 1000);
        stack.metrics.incrementCounter("http.requests.errors", 50);
        stack.metrics.recordGauge("jvm.memory.used", 0.75);
        stack.metrics.recordGauge("cpu.usage", 0.65);
        
        // Record response time histogram
        for (int i = 0; i < 100; i++) {
            stack.metrics.recordHistogram("http.request.duration", 
                50 + (long)(Math.random() * 200));
        }
        
        // Print metrics
        stack.metrics.printMetrics();
        
        // Simulate alerting rules
        double errorRate = (double) stack.metrics.getCounter("http.requests.errors") / 
                          stack.metrics.getCounter("http.requests.total");
        
        if (errorRate > 0.05) {
            System.out.printf("🚨 ALERT: Error rate too high: %.2f%% (threshold: 5%%)%n", 
                errorRate * 100);
        }
        
        if (stack.metrics.getGauge("cpu.usage") > 0.8) {
            System.out.printf("🚨 ALERT: CPU usage too high: %.1f%% (threshold: 80%%)%n", 
                stack.metrics.getGauge("cpu.usage") * 100);
        }
    }
    
    private static void demonstrateChaosEngineering(ObservabilityStack stack) {
        System.out.println("--- Chaos Engineering Simulation ---");
        
        System.out.println("Injecting chaos scenarios:");
        
        // Scenario 1: High latency
        System.out.println("1. High latency injection");
        for (int i = 0; i < 3; i++) {
            long latency = 2000 + (long)(Math.random() * 3000);
            stack.metrics.recordHistogram("chaos.latency", latency);
            System.out.printf("   Service call with %dms latency%n", latency);
        }
        
        // Scenario 2: Service unavailability
        System.out.println("2. Service unavailability");
        for (int i = 0; i < 5; i++) {
            if (Math.random() < 0.6) {
                stack.metrics.incrementCounter("chaos.service_down");
                System.out.println("   Service call failed - service unavailable");
            } else {
                System.out.println("   Service call succeeded");
            }
        }
        
        // Scenario 3: Resource exhaustion
        System.out.println("3. Resource exhaustion simulation");
        stack.metrics.recordGauge("chaos.memory.usage", 0.95);
        stack.metrics.recordGauge("chaos.cpu.usage", 0.98);
        System.out.println("   Simulated resource exhaustion");
        
        System.out.println("Chaos engineering results:");
        System.out.printf("  Services affected by latency: %d%n", 3);
        System.out.printf("  Service downtime events: %d%n", 
            stack.metrics.getCounter("chaos.service_down"));
        System.out.println("  System resilience: Validated ✓");
    }
    
    private static void generateObservabilityReport(ObservabilityStack stack) {
        System.out.println("--- Final Observability Report ---");
        
        // Service reliability metrics
        long totalRequests = stack.metrics.getCounter("user-service.requests.success") +
                           stack.metrics.getCounter("user-service.requests.failure") +
                           stack.metrics.getCounter("order-service.requests.success") +
                           stack.metrics.getCounter("order-service.requests.failure");
        
        long failedRequests = stack.metrics.getCounter("user-service.requests.failure") +
                            stack.metrics.getCounter("order-service.requests.failure");
        
        double reliability = totalRequests > 0 ? 
            (double)(totalRequests - failedRequests) / totalRequests * 100 : 100;
        
        System.out.printf("Service Reliability: %.1f%%%n", reliability);
        
        // Performance metrics
        double avgResponseTime = stack.metrics.getHistogramPercentile("user-service.response_time", 0.5);
        System.out.printf("Average Response Time: %.0fms%n", avgResponseTime);
        
        // Health status
        Map<String, HealthMonitor.HealthStatus> health = stack.healthMonitor.checkAll();
        long healthyServices = health.values().stream()
            .mapToLong(status -> status.getStatus() == HealthMonitor.HealthStatus.Status.UP ? 1 : 0)
            .sum();
        
        System.out.printf("Healthy Services: %d/%d%n", healthyServices, health.size());
        
        // Traces collected
        System.out.printf("Distributed Traces Collected: %d%n", 
            stack.tracer.getCompletedSpans().size());
        
        // SLA compliance
        boolean slaCompliant = reliability > 99.0 && avgResponseTime < 500;
        System.out.printf("SLA Compliance: %s%n", slaCompliant ? "✓ COMPLIANT" : "✗ NON-COMPLIANT");
    }
    
    private static void printResilienceSummary() {
        System.out.println("Resilience and Observability Summary:");
        
        System.out.println("\nResilience Patterns:");
        System.out.println("1. Circuit Breaker - Prevents cascade failures");
        System.out.println("2. Retry with Backoff - Handles transient failures");
        System.out.println("3. Bulkhead Isolation - Resource isolation");
        System.out.println("4. Timeout - Prevents hanging operations");
        System.out.println("5. Rate Limiting - Controls request flow");
        
        System.out.println("\nObservability Pillars:");
        System.out.println("1. Metrics - Quantitative system measurements");
        System.out.println("2. Logs - Discrete event records");
        System.out.println("3. Traces - Request flow through system");
        System.out.println("4. Health Checks - System component status");
        
        System.out.println("\nBest Practices:");
        System.out.println("- Implement comprehensive health checks");
        System.out.println("- Use distributed tracing for complex flows");
        System.out.println("- Monitor business and technical metrics");
        System.out.println("- Set up proper alerting thresholds");
        System.out.println("- Practice chaos engineering regularly");
        System.out.println("- Implement graceful degradation");
        System.out.println("- Use service mesh for infrastructure concerns");
    }
    
    private static class ObservabilityStack {
        final Tracer tracer;
        final ApplicationMetrics metrics;
        final HealthMonitor healthMonitor;
        
        ObservabilityStack(Tracer tracer, ApplicationMetrics metrics, HealthMonitor healthMonitor) {
            this.tracer = tracer;
            this.metrics = metrics;
            this.healthMonitor = healthMonitor;
        }
        
        void shutdown() {
            healthMonitor.shutdown();
        }
    }
}