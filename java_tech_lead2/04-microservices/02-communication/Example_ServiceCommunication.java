/**
 * Microservices Communication Patterns
 * 
 * Key Points:
 * - Synchronous communication: REST APIs, gRPC
 * - Asynchronous communication: Message queues, event streaming
 * - Service mesh for traffic management
 * - API versioning and backward compatibility
 * - Resilience patterns: retry, timeout, bulkhead
 */

import java.util.*;
import java.util.concurrent.*;
import java.time.LocalDateTime;
import java.net.http.*;
import java.io.*;
import java.util.function.*;

// HTTP Client Wrapper with Resilience Patterns
class ResilientHttpClient {
    private final HttpClient httpClient;
    private final int maxRetries;
    private final long timeoutMillis;
    
    public ResilientHttpClient(int maxRetries, long timeoutMillis) {
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(java.time.Duration.ofMillis(timeoutMillis))
            .build();
        this.maxRetries = maxRetries;
        this.timeoutMillis = timeoutMillis;
    }
    
    public CompletableFuture<String> get(String url) {
        return executeWithRetry(() -> {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(java.net.URI.create(url))
                .timeout(java.time.Duration.ofMillis(timeoutMillis))
                .build();
            
            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body);
        });
    }
    
    public CompletableFuture<String> post(String url, String body) {
        return executeWithRetry(() -> {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(java.net.URI.create(url))
                .timeout(java.time.Duration.ofMillis(timeoutMillis))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
            
            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body);
        });
    }
    
    private CompletableFuture<String> executeWithRetry(Supplier<CompletableFuture<String>> operation) {
        CompletableFuture<String> future = new CompletableFuture<>();
        executeWithRetry(operation, future, 0);
        return future;
    }
    
    private void executeWithRetry(Supplier<CompletableFuture<String>> operation, 
                                 CompletableFuture<String> result, int attempt) {
        operation.get()
            .whenComplete((response, throwable) -> {
                if (throwable == null) {
                    result.complete(response);
                } else {
                    if (attempt < maxRetries) {
                        System.out.printf("Request failed (attempt %d/%d): %s. Retrying...%n", 
                            attempt + 1, maxRetries + 1, throwable.getMessage());
                        
                        // Exponential backoff
                        long delay = (long) Math.pow(2, attempt) * 1000;
                        CompletableFuture.delayedExecutor(delay, TimeUnit.MILLISECONDS)
                            .execute(() -> executeWithRetry(operation, result, attempt + 1));
                    } else {
                        result.completeExceptionally(throwable);
                    }
                }
            });
    }
}

// Message Queue Interface for Asynchronous Communication
interface MessageQueue {
    void publish(String topic, Message message);
    void subscribe(String topic, MessageHandler handler);
    void createTopic(String topic);
}

class Message {
    private final String id;
    private final String content;
    private final Map<String, String> headers;
    private final LocalDateTime timestamp;
    
    public Message(String content) {
        this(content, new HashMap<>());
    }
    
    public Message(String content, Map<String, String> headers) {
        this.id = UUID.randomUUID().toString();
        this.content = content;
        this.headers = new HashMap<>(headers);
        this.timestamp = LocalDateTime.now();
    }
    
    public String getId() { return id; }
    public String getContent() { return content; }
    public Map<String, String> getHeaders() { return headers; }
    public LocalDateTime getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return String.format("Message{id='%s', content='%s'}", id, content);
    }
}

@FunctionalInterface
interface MessageHandler {
    void handle(Message message);
}

class InMemoryMessageQueue implements MessageQueue {
    private final Map<String, List<MessageHandler>> subscribers = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newFixedThreadPool(10);
    
    @Override
    public void createTopic(String topic) {
        subscribers.putIfAbsent(topic, Collections.synchronizedList(new ArrayList<>()));
        System.out.printf("[MESSAGE QUEUE] Topic created: %s%n", topic);
    }
    
    @Override
    public void publish(String topic, Message message) {
        System.out.printf("[MESSAGE QUEUE] Publishing to %s: %s%n", topic, message);
        
        List<MessageHandler> handlers = subscribers.get(topic);
        if (handlers != null) {
            handlers.forEach(handler -> 
                executor.submit(() -> {
                    try {
                        handler.handle(message);
                    } catch (Exception e) {
                        System.err.printf("Message handler failed: %s%n", e.getMessage());
                    }
                })
            );
        }
    }
    
    @Override
    public void subscribe(String topic, MessageHandler handler) {
        subscribers.computeIfAbsent(topic, k -> Collections.synchronizedList(new ArrayList<>()))
                  .add(handler);
        System.out.printf("[MESSAGE QUEUE] Subscribed to topic: %s%n", topic);
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}

// API Gateway Pattern
class ApiGateway {
    private final Map<String, ServiceEndpoint> serviceRegistry = new ConcurrentHashMap<>();
    private final ResilientHttpClient httpClient;
    private final RateLimiter rateLimiter;
    
    public ApiGateway() {
        this.httpClient = new ResilientHttpClient(3, 5000);
        this.rateLimiter = new RateLimiter(100); // 100 requests per second
    }
    
    public void registerService(String serviceName, String baseUrl) {
        serviceRegistry.put(serviceName, new ServiceEndpoint(serviceName, baseUrl));
        System.out.printf("[API GATEWAY] Registered service: %s -> %s%n", serviceName, baseUrl);
    }
    
    public CompletableFuture<String> routeRequest(String path, String method, String body) {
        // Rate limiting
        if (!rateLimiter.tryAcquire()) {
            return CompletableFuture.failedFuture(
                new RuntimeException("Rate limit exceeded"));
        }
        
        // Extract service from path
        String[] parts = path.split("/", 3);
        if (parts.length < 2) {
            return CompletableFuture.failedFuture(
                new IllegalArgumentException("Invalid path: " + path));
        }
        
        String serviceName = parts[1];
        String servicePath = parts.length > 2 ? "/" + parts[2] : "/";
        
        ServiceEndpoint endpoint = serviceRegistry.get(serviceName);
        if (endpoint == null) {
            return CompletableFuture.failedFuture(
                new RuntimeException("Service not found: " + serviceName));
        }
        
        String url = endpoint.getBaseUrl() + servicePath;
        System.out.printf("[API GATEWAY] Routing %s %s -> %s%n", method, path, url);
        
        // Route request to appropriate service
        switch (method.toUpperCase()) {
            case "GET":
                return httpClient.get(url);
            case "POST":
                return httpClient.post(url, body != null ? body : "");
            default:
                return CompletableFuture.failedFuture(
                    new UnsupportedOperationException("Method not supported: " + method));
        }
    }
    
    private static class ServiceEndpoint {
        private final String name;
        private final String baseUrl;
        
        public ServiceEndpoint(String name, String baseUrl) {
            this.name = name;
            this.baseUrl = baseUrl;
        }
        
        public String getName() { return name; }
        public String getBaseUrl() { return baseUrl; }
    }
}

// Rate Limiter using Token Bucket Algorithm
class RateLimiter {
    private final int capacity;
    private final double refillRate;
    private double tokens;
    private long lastRefill;
    
    public RateLimiter(int requestsPerSecond) {
        this.capacity = requestsPerSecond;
        this.refillRate = requestsPerSecond;
        this.tokens = requestsPerSecond;
        this.lastRefill = System.currentTimeMillis();
    }
    
    public synchronized boolean tryAcquire() {
        refill();
        if (tokens >= 1) {
            tokens--;
            return true;
        }
        return false;
    }
    
    private void refill() {
        long now = System.currentTimeMillis();
        double tokensToAdd = (now - lastRefill) / 1000.0 * refillRate;
        tokens = Math.min(capacity, tokens + tokensToAdd);
        lastRefill = now;
    }
}

// Service Mesh Simulation
class ServiceMesh {
    private final Map<String, ServiceProxy> proxies = new ConcurrentHashMap<>();
    private final LoadBalancer loadBalancer = new RoundRobinLoadBalancer();
    private final MetricsCollector metricsCollector = new MetricsCollector();
    
    public void registerService(String serviceName, List<String> instances) {
        ServiceProxy proxy = new ServiceProxy(serviceName, instances, loadBalancer, metricsCollector);
        proxies.put(serviceName, proxy);
        System.out.printf("[SERVICE MESH] Registered service: %s with %d instances%n", 
            serviceName, instances.size());
    }
    
    public CompletableFuture<String> callService(String serviceName, String endpoint) {
        ServiceProxy proxy = proxies.get(serviceName);
        if (proxy == null) {
            return CompletableFuture.failedFuture(
                new RuntimeException("Service not registered: " + serviceName));
        }
        
        return proxy.call(endpoint);
    }
    
    public void printMetrics() {
        System.out.println("=== Service Mesh Metrics ===");
        metricsCollector.printMetrics();
    }
}

class ServiceProxy {
    private final String serviceName;
    private final List<String> instances;
    private final LoadBalancer loadBalancer;
    private final MetricsCollector metricsCollector;
    private final ResilientHttpClient httpClient;
    
    public ServiceProxy(String serviceName, List<String> instances, 
                       LoadBalancer loadBalancer, MetricsCollector metricsCollector) {
        this.serviceName = serviceName;
        this.instances = new ArrayList<>(instances);
        this.loadBalancer = loadBalancer;
        this.metricsCollector = metricsCollector;
        this.httpClient = new ResilientHttpClient(3, 5000);
    }
    
    public CompletableFuture<String> call(String endpoint) {
        String instance = loadBalancer.selectInstance(instances);
        String url = instance + endpoint;
        
        long startTime = System.currentTimeMillis();
        
        return httpClient.get(url)
            .whenComplete((result, throwable) -> {
                long duration = System.currentTimeMillis() - startTime;
                
                if (throwable == null) {
                    metricsCollector.recordSuccess(serviceName, duration);
                    System.out.printf("[SERVICE MESH] %s -> %s: SUCCESS (%dms)%n", 
                        serviceName, instance, duration);
                } else {
                    metricsCollector.recordFailure(serviceName, duration);
                    System.out.printf("[SERVICE MESH] %s -> %s: FAILURE (%dms)%n", 
                        serviceName, instance, duration);
                }
            });
    }
}

interface LoadBalancer {
    String selectInstance(List<String> instances);
}

class RoundRobinLoadBalancer implements LoadBalancer {
    private final Map<List<String>, Integer> counters = new ConcurrentHashMap<>();
    
    @Override
    public String selectInstance(List<String> instances) {
        if (instances.isEmpty()) {
            throw new RuntimeException("No instances available");
        }
        
        int index = counters.compute(instances, (k, v) -> (v == null ? 0 : v + 1) % instances.size());
        return instances.get(index);
    }
}

class MetricsCollector {
    private final Map<String, ServiceMetrics> metrics = new ConcurrentHashMap<>();
    
    public void recordSuccess(String serviceName, long duration) {
        metrics.computeIfAbsent(serviceName, ServiceMetrics::new).recordSuccess(duration);
    }
    
    public void recordFailure(String serviceName, long duration) {
        metrics.computeIfAbsent(serviceName, ServiceMetrics::new).recordFailure(duration);
    }
    
    public void printMetrics() {
        metrics.forEach((service, metric) -> {
            System.out.printf("Service: %s%n", service);
            System.out.printf("  Total Requests: %d%n", metric.getTotalRequests());
            System.out.printf("  Success Rate: %.2f%%%n", metric.getSuccessRate() * 100);
            System.out.printf("  Avg Duration: %.2fms%n", metric.getAverageDuration());
            System.out.printf("  Error Count: %d%n", metric.getErrorCount());
        });
    }
    
    private static class ServiceMetrics {
        private final String serviceName;
        private long totalRequests = 0;
        private long successfulRequests = 0;
        private long totalDuration = 0;
        private long errorCount = 0;
        
        public ServiceMetrics(String serviceName) {
            this.serviceName = serviceName;
        }
        
        public synchronized void recordSuccess(long duration) {
            totalRequests++;
            successfulRequests++;
            totalDuration += duration;
        }
        
        public synchronized void recordFailure(long duration) {
            totalRequests++;
            totalDuration += duration;
            errorCount++;
        }
        
        public synchronized double getSuccessRate() {
            return totalRequests > 0 ? (double) successfulRequests / totalRequests : 0;
        }
        
        public synchronized double getAverageDuration() {
            return totalRequests > 0 ? (double) totalDuration / totalRequests : 0;
        }
        
        public synchronized long getTotalRequests() { return totalRequests; }
        public synchronized long getErrorCount() { return errorCount; }
    }
}

// Saga Pattern for Distributed Transactions
abstract class SagaStep {
    protected final String stepName;
    
    protected SagaStep(String stepName) {
        this.stepName = stepName;
    }
    
    public abstract CompletableFuture<Void> execute();
    public abstract CompletableFuture<Void> compensate();
    
    public String getStepName() { return stepName; }
}

class SagaOrchestrator {
    private final List<SagaStep> steps = new ArrayList<>();
    private final List<SagaStep> executedSteps = new ArrayList<>();
    
    public void addStep(SagaStep step) {
        steps.add(step);
    }
    
    public CompletableFuture<Boolean> execute() {
        System.out.println("[SAGA] Starting saga execution");
        
        return executeSteps()
            .handle((result, throwable) -> {
                if (throwable != null) {
                    System.out.printf("[SAGA] Execution failed: %s%n", throwable.getMessage());
                    compensate();
                    return false;
                } else {
                    System.out.println("[SAGA] Execution completed successfully");
                    return true;
                }
            });
    }
    
    private CompletableFuture<Void> executeSteps() {
        CompletableFuture<Void> future = CompletableFuture.completedFuture(null);
        
        for (SagaStep step : steps) {
            future = future.thenCompose(v -> {
                System.out.printf("[SAGA] Executing step: %s%n", step.getStepName());
                return step.execute().thenRun(() -> executedSteps.add(step));
            });
        }
        
        return future;
    }
    
    private void compensate() {
        System.out.println("[SAGA] Starting compensation");
        
        // Compensate in reverse order
        Collections.reverse(executedSteps);
        
        for (SagaStep step : executedSteps) {
            try {
                System.out.printf("[SAGA] Compensating step: %s%n", step.getStepName());
                step.compensate().get();
            } catch (Exception e) {
                System.err.printf("[SAGA] Compensation failed for %s: %s%n", 
                    step.getStepName(), e.getMessage());
            }
        }
        
        System.out.println("[SAGA] Compensation completed");
    }
}

public class Example_ServiceCommunication {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Microservices Communication Patterns ===\n");
        
        // 1. MESSAGE QUEUE COMMUNICATION
        System.out.println("1. Asynchronous Communication with Message Queue:");
        demonstrateMessageQueue();
        
        Thread.sleep(2000);
        
        // 2. API GATEWAY PATTERN
        System.out.println("\n2. API Gateway Pattern:");
        demonstrateApiGateway();
        
        Thread.sleep(2000);
        
        // 3. SERVICE MESH
        System.out.println("\n3. Service Mesh Pattern:");
        demonstrateServiceMesh();
        
        Thread.sleep(2000);
        
        // 4. SAGA PATTERN
        System.out.println("\n4. Saga Pattern for Distributed Transactions:");
        demonstrateSagaPattern();
        
        Thread.sleep(2000);
        
        System.out.println("\n=== Summary ===");
        printCommunicationPatternsSummary();
    }
    
    private static void demonstrateMessageQueue() {
        MessageQueue messageQueue = new InMemoryMessageQueue();
        
        // Create topics
        messageQueue.createTopic("order.events");
        messageQueue.createTopic("payment.events");
        messageQueue.createTopic("notification.events");
        
        // Subscribe to events
        messageQueue.subscribe("order.events", message -> 
            System.out.printf("[ORDER HANDLER] Processing: %s%n", message.getContent()));
        
        messageQueue.subscribe("payment.events", message -> 
            System.out.printf("[PAYMENT HANDLER] Processing: %s%n", message.getContent()));
        
        messageQueue.subscribe("notification.events", message -> 
            System.out.printf("[NOTIFICATION HANDLER] Processing: %s%n", message.getContent()));
        
        // Publish messages
        messageQueue.publish("order.events", new Message("Order created: ORD-123"));
        messageQueue.publish("payment.events", new Message("Payment processed: PAY-456"));
        messageQueue.publish("notification.events", new Message("Send confirmation email"));
        
        if (messageQueue instanceof InMemoryMessageQueue) {
            ((InMemoryMessageQueue) messageQueue).shutdown();
        }
    }
    
    private static void demonstrateApiGateway() {
        ApiGateway gateway = new ApiGateway();
        
        // Register services
        gateway.registerService("user-service", "http://localhost:8081");
        gateway.registerService("order-service", "http://localhost:8082");
        gateway.registerService("payment-service", "http://localhost:8083");
        
        // Simulate routing requests (these would fail in real execution due to no actual services)
        System.out.println("Simulating API Gateway routing:");
        
        gateway.routeRequest("/user-service/users", "GET", null)
            .whenComplete((result, throwable) -> {
                if (throwable != null) {
                    System.out.printf("[API GATEWAY] GET /user-service/users failed: %s%n", 
                        throwable.getMessage());
                } else {
                    System.out.printf("[API GATEWAY] GET /user-service/users succeeded%n");
                }
            });
        
        gateway.routeRequest("/order-service/orders", "POST", "{\"userId\":\"123\",\"amount\":99.99}")
            .whenComplete((result, throwable) -> {
                if (throwable != null) {
                    System.out.printf("[API GATEWAY] POST /order-service/orders failed: %s%n", 
                        throwable.getMessage());
                } else {
                    System.out.printf("[API GATEWAY] POST /order-service/orders succeeded%n");
                }
            });
    }
    
    private static void demonstrateServiceMesh() {
        ServiceMesh serviceMesh = new ServiceMesh();
        
        // Register services with multiple instances
        serviceMesh.registerService("user-service", Arrays.asList(
            "http://user-service-1:8081",
            "http://user-service-2:8081",
            "http://user-service-3:8081"
        ));
        
        serviceMesh.registerService("order-service", Arrays.asList(
            "http://order-service-1:8082",
            "http://order-service-2:8082"
        ));
        
        // Simulate service calls with load balancing
        System.out.println("Simulating service mesh calls with load balancing:");
        
        for (int i = 0; i < 5; i++) {
            serviceMesh.callService("user-service", "/health")
                .whenComplete((result, throwable) -> {
                    // Results will be logged by the service proxy
                });
            
            serviceMesh.callService("order-service", "/health")
                .whenComplete((result, throwable) -> {
                    // Results will be logged by the service proxy
                });
        }
    }
    
    private static void demonstrateSagaPattern() {
        SagaOrchestrator saga = new SagaOrchestrator();
        
        // Add saga steps
        saga.addStep(new SagaStep("Reserve Inventory") {
            @Override
            public CompletableFuture<Void> execute() {
                return CompletableFuture.runAsync(() -> {
                    System.out.println("  -> Reserving inventory items");
                    // Simulate work
                    try { Thread.sleep(500); } catch (InterruptedException e) { }
                });
            }
            
            @Override
            public CompletableFuture<Void> compensate() {
                return CompletableFuture.runAsync(() -> {
                    System.out.println("  -> Releasing reserved inventory");
                });
            }
        });
        
        saga.addStep(new SagaStep("Process Payment") {
            @Override
            public CompletableFuture<Void> execute() {
                return CompletableFuture.runAsync(() -> {
                    System.out.println("  -> Processing payment");
                    // Simulate work
                    try { Thread.sleep(500); } catch (InterruptedException e) { }
                });
            }
            
            @Override
            public CompletableFuture<Void> compensate() {
                return CompletableFuture.runAsync(() -> {
                    System.out.println("  -> Refunding payment");
                });
            }
        });
        
        saga.addStep(new SagaStep("Create Shipment") {
            @Override
            public CompletableFuture<Void> execute() {
                return CompletableFuture.runAsync(() -> {
                    System.out.println("  -> Creating shipment");
                    // Simulate failure
                    throw new RuntimeException("Shipment service unavailable");
                });
            }
            
            @Override
            public CompletableFuture<Void> compensate() {
                return CompletableFuture.runAsync(() -> {
                    System.out.println("  -> Canceling shipment");
                });
            }
        });
        
        // Execute saga
        saga.execute().join();
    }
    
    private static void printCommunicationPatternsSummary() {
        System.out.println("Communication Patterns Summary:");
        System.out.println("1. Synchronous Communication:");
        System.out.println("   - REST APIs with HTTP clients");
        System.out.println("   - gRPC for high-performance communication");
        System.out.println("   - GraphQL for flexible data fetching");
        
        System.out.println("\n2. Asynchronous Communication:");
        System.out.println("   - Message queues (RabbitMQ, Apache Kafka)");
        System.out.println("   - Event streaming and event sourcing");
        System.out.println("   - Pub/Sub messaging patterns");
        
        System.out.println("\n3. Infrastructure Patterns:");
        System.out.println("   - API Gateway for centralized routing");
        System.out.println("   - Service Mesh for traffic management");
        System.out.println("   - Load balancing and service discovery");
        
        System.out.println("\n4. Resilience Patterns:");
        System.out.println("   - Circuit breaker for fault tolerance");
        System.out.println("   - Retry with exponential backoff");
        System.out.println("   - Bulkhead for resource isolation");
        System.out.println("   - Timeout and rate limiting");
        
        System.out.println("\n5. Transaction Patterns:");
        System.out.println("   - Saga pattern for distributed transactions");
        System.out.println("   - Event sourcing for audit trails");
        System.out.println("   - CQRS for read/write separation");
    }
}