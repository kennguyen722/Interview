# Module 6: Microservices Architecture

## Table of Contents
1. [Microservices Fundamentals](#microservices-fundamentals)
2. [Service Communication](#service-communication)
3. [Service Discovery](#service-discovery)
4. [Resilience Patterns](#resilience-patterns)

---

## Microservices Fundamentals

### Question 1: What are the key principles of microservices architecture?

**Answer:**
Key principles:
1. **Single Responsibility**: Each service does one thing well
2. **Loose Coupling**: Services are independent
3. **High Cohesion**: Related functions grouped together
4. **API First**: Well-defined interfaces
5. **Decentralized Data**: Each service owns its data
6. **Infrastructure Automation**: CI/CD, containerization

**Detailed Code Example - Service Design:**

```java
// Example: E-commerce microservices

// 1. Order Service API
interface OrderService {
    Order createOrder(CreateOrderRequest request);
    Order getOrder(String orderId);
    List<Order> getOrdersByCustomer(String customerId);
    void cancelOrder(String orderId);
}

class Order {
    private String orderId;
    private String customerId;
    private List<OrderItem> items;
    private OrderStatus status;
    private double totalAmount;
    private java.time.LocalDateTime createdAt;
    
    // Constructors, getters, setters
    public Order(String orderId, String customerId) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.items = new java.util.ArrayList<>();
        this.status = OrderStatus.CREATED;
        this.createdAt = java.time.LocalDateTime.now();
    }
    
    public String getOrderId() { return orderId; }
    public String getCustomerId() { return customerId; }
    public List<OrderItem> getItems() { return items; }
    public OrderStatus getStatus() { return status; }
    public double getTotalAmount() { return totalAmount; }
    
    public void addItem(OrderItem item) {
        items.add(item);
        totalAmount += item.getPrice() * item.getQuantity();
    }
    
    public void setStatus(OrderStatus status) { this.status = status; }
}

class OrderItem {
    private String productId;
    private int quantity;
    private double price;
    
    public OrderItem(String productId, int quantity, double price) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }
    
    public String getProductId() { return productId; }
    public int getQuantity() { return quantity; }
    public double getPrice() { return price; }
}

enum OrderStatus {
    CREATED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
}

class CreateOrderRequest {
    private String customerId;
    private List<OrderItemRequest> items;
    
    public String getCustomerId() { return customerId; }
    public List<OrderItemRequest> getItems() { return items; }
}

class OrderItemRequest {
    private String productId;
    private int quantity;
    
    public String getProductId() { return productId; }
    public int getQuantity() { return quantity; }
}

// 2. Order Service Implementation
class OrderServiceImpl implements OrderService {
    private final java.util.Map<String, Order> orderRepository = new java.util.concurrent.ConcurrentHashMap<>();
    private final ProductServiceClient productClient;
    private final InventoryServiceClient inventoryClient;
    private final PaymentServiceClient paymentClient;
    
    public OrderServiceImpl(ProductServiceClient productClient, 
                           InventoryServiceClient inventoryClient,
                           PaymentServiceClient paymentClient) {
        this.productClient = productClient;
        this.inventoryClient = inventoryClient;
        this.paymentClient = paymentClient;
    }
    
    @Override
    public Order createOrder(CreateOrderRequest request) {
        String orderId = generateOrderId();
        Order order = new Order(orderId, request.getCustomerId());
        
        for (OrderItemRequest item : request.getItems()) {
            // Check inventory
            boolean available = inventoryClient.checkAvailability(
                item.getProductId(), item.getQuantity());
            
            if (!available) {
                throw new RuntimeException("Product not available: " + item.getProductId());
            }
            
            // Get product details
            Product product = productClient.getProduct(item.getProductId());
            order.addItem(new OrderItem(item.getProductId(), item.getQuantity(), product.getPrice()));
        }
        
        // Reserve inventory
        inventoryClient.reserve(orderId, request.getItems());
        
        orderRepository.put(orderId, order);
        return order;
    }
    
    @Override
    public Order getOrder(String orderId) {
        return orderRepository.get(orderId);
    }
    
    @Override
    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.values().stream()
            .filter(o -> o.getCustomerId().equals(customerId))
            .collect(java.util.stream.Collectors.toList());
    }
    
    @Override
    public void cancelOrder(String orderId) {
        Order order = orderRepository.get(orderId);
        if (order != null && order.getStatus() == OrderStatus.CREATED) {
            order.setStatus(OrderStatus.CANCELLED);
            inventoryClient.release(orderId);
        }
    }
    
    private String generateOrderId() {
        return "ORD-" + System.currentTimeMillis();
    }
}

// Service clients (would use HTTP/gRPC in real implementation)
interface ProductServiceClient {
    Product getProduct(String productId);
}

interface InventoryServiceClient {
    boolean checkAvailability(String productId, int quantity);
    void reserve(String orderId, List<OrderItemRequest> items);
    void release(String orderId);
}

interface PaymentServiceClient {
    PaymentResult processPayment(String orderId, double amount);
}

class Product {
    private String id;
    private String name;
    private double price;
    
    public Product(String id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public double getPrice() { return price; }
}

class PaymentResult {
    private boolean success;
    private String transactionId;
    
    public PaymentResult(boolean success, String transactionId) {
        this.success = success;
        this.transactionId = transactionId;
    }
    
    public boolean isSuccess() { return success; }
    public String getTransactionId() { return transactionId; }
}
```

---

## Service Communication

### Question 2: Compare synchronous vs asynchronous communication patterns.

**Answer:**

| Aspect | Synchronous | Asynchronous |
|--------|------------|--------------|
| Pattern | Request-Response | Event-Driven |
| Coupling | Tighter | Looser |
| Latency | Blocking | Non-blocking |
| Reliability | Direct failure | Message persistence |
| Use Case | Real-time queries | Background tasks |

**Detailed Code Example:**

```java
import java.util.*;
import java.util.concurrent.*;

public class ServiceCommunicationDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. Synchronous communication (REST-like)
        System.out.println("=== Synchronous Communication ===");
        SyncOrderService syncService = new SyncOrderService();
        String result = syncService.processOrder("ORDER-001");
        System.out.println("Result: " + result);
        
        // 2. Asynchronous communication (Event-driven)
        System.out.println("\n=== Asynchronous Communication ===");
        EventBus eventBus = new EventBus();
        
        // Register handlers
        eventBus.subscribe("OrderCreated", new InventoryHandler());
        eventBus.subscribe("OrderCreated", new NotificationHandler());
        eventBus.subscribe("InventoryReserved", new PaymentHandler());
        
        // Publish event
        eventBus.publish(new Event("OrderCreated", Map.of(
            "orderId", "ORDER-002",
            "customerId", "CUST-001",
            "amount", 100.0
        )));
        
        Thread.sleep(1000); // Wait for async processing
        
        // 3. Message Queue pattern
        System.out.println("\n=== Message Queue Pattern ===");
        MessageQueue<OrderMessage> queue = new MessageQueue<>();
        
        // Consumer
        new Thread(() -> {
            while (true) {
                try {
                    OrderMessage msg = queue.consume();
                    System.out.println("Processing: " + msg.orderId);
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    break;
                }
            }
        }).start();
        
        // Producer
        for (int i = 1; i <= 5; i++) {
            queue.produce(new OrderMessage("ORDER-" + i, "Process order"));
            System.out.println("Produced: ORDER-" + i);
        }
        
        Thread.sleep(3000);
    }
}

// Synchronous Service
class SyncOrderService {
    private final InventoryClient inventoryClient = new InventoryClient();
    private final PaymentClient paymentClient = new PaymentClient();
    
    public String processOrder(String orderId) {
        System.out.println("1. Checking inventory...");
        boolean available = inventoryClient.checkInventory(orderId);
        if (!available) return "Failed: Out of stock";
        
        System.out.println("2. Processing payment...");
        boolean paid = paymentClient.processPayment(orderId);
        if (!paid) return "Failed: Payment failed";
        
        System.out.println("3. Order complete!");
        return "Success: Order " + orderId + " processed";
    }
}

class InventoryClient {
    public boolean checkInventory(String orderId) {
        try { Thread.sleep(200); } catch (InterruptedException e) {}
        return true;
    }
}

class PaymentClient {
    public boolean processPayment(String orderId) {
        try { Thread.sleep(300); } catch (InterruptedException e) {}
        return true;
    }
}

// Event-Driven Pattern
class Event {
    private final String type;
    private final Map<String, Object> data;
    private final long timestamp;
    
    public Event(String type, Map<String, Object> data) {
        this.type = type;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }
    
    public String getType() { return type; }
    public Map<String, Object> getData() { return data; }
}

interface EventHandler {
    void handle(Event event);
}

class EventBus {
    private final Map<String, List<EventHandler>> handlers = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newFixedThreadPool(4);
    
    public void subscribe(String eventType, EventHandler handler) {
        handlers.computeIfAbsent(eventType, k -> new CopyOnWriteArrayList<>()).add(handler);
    }
    
    public void publish(Event event) {
        List<EventHandler> eventHandlers = handlers.get(event.getType());
        if (eventHandlers != null) {
            for (EventHandler handler : eventHandlers) {
                executor.submit(() -> handler.handle(event));
            }
        }
    }
}

class InventoryHandler implements EventHandler {
    @Override
    public void handle(Event event) {
        System.out.println("[InventoryHandler] Reserving inventory for: " + event.getData().get("orderId"));
    }
}

class NotificationHandler implements EventHandler {
    @Override
    public void handle(Event event) {
        System.out.println("[NotificationHandler] Sending notification for: " + event.getData().get("orderId"));
    }
}

class PaymentHandler implements EventHandler {
    @Override
    public void handle(Event event) {
        System.out.println("[PaymentHandler] Processing payment for: " + event.getData().get("orderId"));
    }
}

// Message Queue Pattern
class OrderMessage {
    String orderId;
    String action;
    
    public OrderMessage(String orderId, String action) {
        this.orderId = orderId;
        this.action = action;
    }
}

class MessageQueue<T> {
    private final BlockingQueue<T> queue = new LinkedBlockingQueue<>();
    
    public void produce(T message) {
        queue.offer(message);
    }
    
    public T consume() throws InterruptedException {
        return queue.take();
    }
}
```

---

## Service Discovery

### Question 3: How does service discovery work in microservices?

**Answer:**
Service discovery patterns:
1. **Client-side discovery**: Client queries registry
2. **Server-side discovery**: Load balancer queries registry
3. **DNS-based**: Use DNS for service lookup

**Detailed Code Example:**

```java
import java.util.*;
import java.util.concurrent.*;

public class ServiceDiscoveryDemo {
    
    public static void main(String[] args) throws Exception {
        // Service Registry
        ServiceRegistry registry = new ServiceRegistry();
        
        // Register services
        registry.register(new ServiceInstance("order-service", "192.168.1.10", 8080, true));
        registry.register(new ServiceInstance("order-service", "192.168.1.11", 8080, true));
        registry.register(new ServiceInstance("payment-service", "192.168.1.20", 8081, true));
        
        System.out.println("=== Registered Services ===");
        registry.getAllServices().forEach((name, instances) -> {
            System.out.println(name + ": " + instances.size() + " instances");
        });
        
        // Client-side discovery with load balancing
        System.out.println("\n=== Client-Side Discovery ===");
        DiscoveryClient client = new DiscoveryClient(registry);
        
        for (int i = 0; i < 5; i++) {
            ServiceInstance instance = client.getInstance("order-service");
            System.out.println("Request " + (i+1) + " -> " + instance);
        }
        
        // Health check
        System.out.println("\n=== Health Check ===");
        HealthChecker healthChecker = new HealthChecker(registry);
        healthChecker.startHealthChecks();
        
        // Simulate instance going unhealthy
        Thread.sleep(1000);
        ServiceInstance unhealthy = registry.getInstances("order-service").get(0);
        unhealthy.setHealthy(false);
        
        Thread.sleep(2000);
        healthChecker.stop();
        
        System.out.println("\nHealthy instances for order-service:");
        registry.getInstances("order-service").stream()
            .filter(ServiceInstance::isHealthy)
            .forEach(System.out::println);
    }
}

class ServiceInstance {
    private String serviceName;
    private String host;
    private int port;
    private boolean healthy;
    private long lastHeartbeat;
    
    public ServiceInstance(String serviceName, String host, int port, boolean healthy) {
        this.serviceName = serviceName;
        this.host = host;
        this.port = port;
        this.healthy = healthy;
        this.lastHeartbeat = System.currentTimeMillis();
    }
    
    public String getServiceName() { return serviceName; }
    public String getHost() { return host; }
    public int getPort() { return port; }
    public boolean isHealthy() { return healthy; }
    public void setHealthy(boolean healthy) { this.healthy = healthy; }
    public void updateHeartbeat() { this.lastHeartbeat = System.currentTimeMillis(); }
    public long getLastHeartbeat() { return lastHeartbeat; }
    
    @Override
    public String toString() {
        return serviceName + "@" + host + ":" + port + (healthy ? " (healthy)" : " (unhealthy)");
    }
}

class ServiceRegistry {
    private final Map<String, List<ServiceInstance>> services = new ConcurrentHashMap<>();
    
    public void register(ServiceInstance instance) {
        services.computeIfAbsent(instance.getServiceName(), k -> new CopyOnWriteArrayList<>())
            .add(instance);
    }
    
    public void deregister(ServiceInstance instance) {
        List<ServiceInstance> instances = services.get(instance.getServiceName());
        if (instances != null) {
            instances.remove(instance);
        }
    }
    
    public List<ServiceInstance> getInstances(String serviceName) {
        return services.getOrDefault(serviceName, Collections.emptyList());
    }
    
    public Map<String, List<ServiceInstance>> getAllServices() {
        return new HashMap<>(services);
    }
}

class DiscoveryClient {
    private final ServiceRegistry registry;
    private final Map<String, Integer> roundRobinCounters = new ConcurrentHashMap<>();
    
    public DiscoveryClient(ServiceRegistry registry) {
        this.registry = registry;
    }
    
    public ServiceInstance getInstance(String serviceName) {
        List<ServiceInstance> instances = registry.getInstances(serviceName).stream()
            .filter(ServiceInstance::isHealthy)
            .collect(java.util.stream.Collectors.toList());
        
        if (instances.isEmpty()) {
            throw new RuntimeException("No healthy instances for: " + serviceName);
        }
        
        // Round-robin load balancing
        int counter = roundRobinCounters.compute(serviceName, (k, v) -> (v == null) ? 0 : v + 1);
        return instances.get(counter % instances.size());
    }
}

class HealthChecker {
    private final ServiceRegistry registry;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private ScheduledFuture<?> task;
    
    public HealthChecker(ServiceRegistry registry) {
        this.registry = registry;
    }
    
    public void startHealthChecks() {
        task = scheduler.scheduleAtFixedRate(() -> {
            registry.getAllServices().values().stream()
                .flatMap(List::stream)
                .forEach(this::checkHealth);
        }, 0, 1, TimeUnit.SECONDS);
    }
    
    private void checkHealth(ServiceInstance instance) {
        // Simulate health check
        boolean isHealthy = instance.isHealthy();
        System.out.println("Health check: " + instance.getHost() + ":" + instance.getPort() + 
            " -> " + (isHealthy ? "UP" : "DOWN"));
    }
    
    public void stop() {
        if (task != null) task.cancel(true);
        scheduler.shutdown();
    }
}
```

---

## Resilience Patterns

### Question 4: Implement the Circuit Breaker and Retry patterns.

**Answer:**
Resilience patterns:
1. **Circuit Breaker**: Prevent cascading failures
2. **Retry**: Automatic retry with backoff
3. **Bulkhead**: Isolate failures
4. **Timeout**: Limit waiting time

**Detailed Code Example:**

```java
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;

public class ResiliencePatternDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. Circuit Breaker
        System.out.println("=== Circuit Breaker ===");
        CircuitBreaker cb = new CircuitBreaker(3, 5000, 2);
        
        Supplier<String> unreliableService = () -> {
            if (Math.random() < 0.7) throw new RuntimeException("Service error");
            return "Success";
        };
        
        for (int i = 0; i < 15; i++) {
            try {
                String result = cb.execute(unreliableService);
                System.out.println("Request " + (i+1) + ": " + result + " [" + cb.getState() + "]");
            } catch (Exception e) {
                System.out.println("Request " + (i+1) + ": " + e.getMessage() + " [" + cb.getState() + "]");
            }
            Thread.sleep(500);
        }
        
        // 2. Retry with Exponential Backoff
        System.out.println("\n=== Retry Pattern ===");
        RetryPolicy retry = new RetryPolicy(3, 100, 2.0);
        
        try {
            String result = retry.execute(() -> {
                if (Math.random() < 0.7) throw new RuntimeException("Temporary failure");
                return "Success after retries";
            });
            System.out.println("Result: " + result);
        } catch (Exception e) {
            System.out.println("Final failure: " + e.getMessage());
        }
        
        // 3. Bulkhead Pattern
        System.out.println("\n=== Bulkhead Pattern ===");
        Bulkhead bulkhead = new Bulkhead(3);
        
        for (int i = 0; i < 5; i++) {
            final int requestId = i + 1;
            new Thread(() -> {
                try {
                    bulkhead.execute(() -> {
                        System.out.println("Request " + requestId + " executing");
                        Thread.sleep(1000);
                        return "Done";
                    });
                    System.out.println("Request " + requestId + " completed");
                } catch (Exception e) {
                    System.out.println("Request " + requestId + " rejected: " + e.getMessage());
                }
            }).start();
        }
        
        Thread.sleep(3000);
        
        // 4. Timeout Pattern
        System.out.println("\n=== Timeout Pattern ===");
        TimeoutWrapper timeout = new TimeoutWrapper(500);
        
        try {
            String result = timeout.execute(() -> {
                Thread.sleep(1000); // Slow service
                return "Slow result";
            });
            System.out.println("Result: " + result);
        } catch (TimeoutException e) {
            System.out.println("Timeout: " + e.getMessage());
        }
    }
}

// Circuit Breaker Implementation
class CircuitBreaker {
    enum State { CLOSED, OPEN, HALF_OPEN }
    
    private State state = State.CLOSED;
    private int failureCount = 0;
    private int successCount = 0;
    private final int failureThreshold;
    private final long resetTimeout;
    private final int successThreshold;
    private long lastFailureTime = 0;
    
    public CircuitBreaker(int failureThreshold, long resetTimeout, int successThreshold) {
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
        this.successThreshold = successThreshold;
    }
    
    public synchronized <T> T execute(Supplier<T> supplier) throws Exception {
        if (state == State.OPEN) {
            if (System.currentTimeMillis() - lastFailureTime > resetTimeout) {
                state = State.HALF_OPEN;
                successCount = 0;
            } else {
                throw new RuntimeException("Circuit is OPEN");
            }
        }
        
        try {
            T result = supplier.get();
            onSuccess();
            return result;
        } catch (Exception e) {
            onFailure();
            throw e;
        }
    }
    
    private void onSuccess() {
        if (state == State.HALF_OPEN) {
            successCount++;
            if (successCount >= successThreshold) {
                state = State.CLOSED;
                failureCount = 0;
            }
        } else {
            failureCount = 0;
        }
    }
    
    private void onFailure() {
        failureCount++;
        lastFailureTime = System.currentTimeMillis();
        
        if (failureCount >= failureThreshold || state == State.HALF_OPEN) {
            state = State.OPEN;
        }
    }
    
    public State getState() { return state; }
}

// Retry Policy
class RetryPolicy {
    private final int maxAttempts;
    private final long initialDelay;
    private final double multiplier;
    
    public RetryPolicy(int maxAttempts, long initialDelay, double multiplier) {
        this.maxAttempts = maxAttempts;
        this.initialDelay = initialDelay;
        this.multiplier = multiplier;
    }
    
    public <T> T execute(Supplier<T> supplier) throws Exception {
        Exception lastException = null;
        long delay = initialDelay;
        
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                System.out.println("Attempt " + attempt + "...");
                return supplier.get();
            } catch (Exception e) {
                lastException = e;
                System.out.println("Attempt " + attempt + " failed: " + e.getMessage());
                
                if (attempt < maxAttempts) {
                    Thread.sleep(delay);
                    delay = (long) (delay * multiplier);
                }
            }
        }
        
        throw lastException;
    }
}

// Bulkhead Pattern
class Bulkhead {
    private final Semaphore semaphore;
    
    public Bulkhead(int maxConcurrent) {
        this.semaphore = new Semaphore(maxConcurrent);
    }
    
    public <T> T execute(Callable<T> callable) throws Exception {
        if (!semaphore.tryAcquire()) {
            throw new RuntimeException("Bulkhead full - request rejected");
        }
        
        try {
            return callable.call();
        } finally {
            semaphore.release();
        }
    }
}

// Timeout Wrapper
class TimeoutWrapper {
    private final long timeoutMs;
    private final ExecutorService executor = Executors.newCachedThreadPool();
    
    public TimeoutWrapper(long timeoutMs) {
        this.timeoutMs = timeoutMs;
    }
    
    public <T> T execute(Callable<T> callable) throws Exception {
        Future<T> future = executor.submit(callable);
        
        try {
            return future.get(timeoutMs, TimeUnit.MILLISECONDS);
        } catch (java.util.concurrent.TimeoutException e) {
            future.cancel(true);
            throw new TimeoutException("Operation timed out after " + timeoutMs + " ms");
        }
    }
}

class TimeoutException extends Exception {
    public TimeoutException(String message) {
        super(message);
    }
}
```

---

## Summary

Microservices architecture requires:

1. **Service Design**: Single responsibility, loose coupling
2. **Communication**: Sync for queries, async for events
3. **Service Discovery**: Registry, health checks
4. **Resilience**: Circuit breakers, retries, bulkheads

Continue to [Module 7: Code Quality](07-code-quality.md) →
