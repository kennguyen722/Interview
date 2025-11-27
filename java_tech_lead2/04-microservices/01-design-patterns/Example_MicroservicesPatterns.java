/**
 * Microservices Design Patterns - Service Decomposition and Communication
 * 
 * Key Points:
 * - Service decomposition based on business domains (DDD)
 * - Database per service pattern for data independence
 * - Event-driven architecture for loose coupling
 * - Circuit breaker pattern for fault tolerance
 * - API Gateway pattern for centralized concerns
 */

import java.util.*;
import java.util.concurrent.*;
import java.time.LocalDateTime;
import java.util.function.*;

// Domain Events for Event-Driven Architecture
abstract class DomainEvent {
    private final String eventId;
    private final LocalDateTime timestamp;
    private final String eventType;
    
    protected DomainEvent(String eventType) {
        this.eventId = UUID.randomUUID().toString();
        this.timestamp = LocalDateTime.now();
        this.eventType = eventType;
    }
    
    public String getEventId() { return eventId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getEventType() { return eventType; }
}

class UserRegisteredEvent extends DomainEvent {
    private final String userId;
    private final String email;
    private final String name;
    
    public UserRegisteredEvent(String userId, String email, String name) {
        super("USER_REGISTERED");
        this.userId = userId;
        this.email = email;
        this.name = name;
    }
    
    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getName() { return name; }
}

class OrderCreatedEvent extends DomainEvent {
    private final String orderId;
    private final String userId;
    private final double amount;
    
    public OrderCreatedEvent(String orderId, String userId, double amount) {
        super("ORDER_CREATED");
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
    }
    
    public String getOrderId() { return orderId; }
    public String getUserId() { return userId; }
    public double getAmount() { return amount; }
}

class PaymentProcessedEvent extends DomainEvent {
    private final String paymentId;
    private final String orderId;
    private final boolean successful;
    
    public PaymentProcessedEvent(String paymentId, String orderId, boolean successful) {
        super("PAYMENT_PROCESSED");
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.successful = successful;
    }
    
    public String getPaymentId() { return paymentId; }
    public String getOrderId() { return orderId; }
    public boolean isSuccessful() { return successful; }
}

// Event Bus for inter-service communication
interface EventBus {
    void publish(DomainEvent event);
    void subscribe(String eventType, Consumer<DomainEvent> handler);
}

class SimpleEventBus implements EventBus {
    private final Map<String, List<Consumer<DomainEvent>>> subscribers = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newFixedThreadPool(5);
    
    @Override
    public void publish(DomainEvent event) {
        System.out.printf("[EVENT BUS] Publishing: %s (ID: %s)%n", 
            event.getEventType(), event.getEventId());
        
        List<Consumer<DomainEvent>> handlers = subscribers.get(event.getEventType());
        if (handlers != null) {
            handlers.forEach(handler -> 
                executor.submit(() -> {
                    try {
                        handler.accept(event);
                    } catch (Exception e) {
                        System.err.println("Event handler failed: " + e.getMessage());
                    }
                })
            );
        }
    }
    
    @Override
    public void subscribe(String eventType, Consumer<DomainEvent> handler) {
        subscribers.computeIfAbsent(eventType, k -> new ArrayList<>()).add(handler);
        System.out.printf("[EVENT BUS] Subscribed to: %s%n", eventType);
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}

// Circuit Breaker Pattern Implementation
enum CircuitState {
    CLOSED, OPEN, HALF_OPEN
}

class CircuitBreaker {
    private final String name;
    private final int failureThreshold;
    private final long timeoutMillis;
    private final long retryTimeoutMillis;
    
    private CircuitState state = CircuitState.CLOSED;
    private int failureCount = 0;
    private long lastFailureTime = 0;
    
    public CircuitBreaker(String name, int failureThreshold, 
                         long timeoutMillis, long retryTimeoutMillis) {
        this.name = name;
        this.failureThreshold = failureThreshold;
        this.timeoutMillis = timeoutMillis;
        this.retryTimeoutMillis = retryTimeoutMillis;
    }
    
    public <T> T execute(Supplier<T> operation) throws Exception {
        if (state == CircuitState.OPEN) {
            if (System.currentTimeMillis() - lastFailureTime > retryTimeoutMillis) {
                state = CircuitState.HALF_OPEN;
                System.out.printf("[CIRCUIT BREAKER %s] Transitioning to HALF_OPEN%n", name);
            } else {
                throw new RuntimeException("Circuit breaker is OPEN");
            }
        }
        
        try {
            T result = operation.get();
            onSuccess();
            return result;
        } catch (Exception e) {
            onFailure();
            throw e;
        }
    }
    
    private void onSuccess() {
        failureCount = 0;
        if (state == CircuitState.HALF_OPEN) {
            state = CircuitState.CLOSED;
            System.out.printf("[CIRCUIT BREAKER %s] Transitioning to CLOSED%n", name);
        }
    }
    
    private void onFailure() {
        failureCount++;
        lastFailureTime = System.currentTimeMillis();
        
        if (failureCount >= failureThreshold) {
            state = CircuitState.OPEN;
            System.out.printf("[CIRCUIT BREAKER %s] Transitioning to OPEN (failures: %d)%n", 
                name, failureCount);
        }
    }
    
    public CircuitState getState() { return state; }
    public int getFailureCount() { return failureCount; }
}

// Service Discovery Pattern
interface ServiceRegistry {
    void register(String serviceName, String instanceId, String host, int port);
    void deregister(String serviceName, String instanceId);
    List<ServiceInstance> discover(String serviceName);
}

class ServiceInstance {
    private final String instanceId;
    private final String host;
    private final int port;
    private final LocalDateTime registrationTime;
    
    public ServiceInstance(String instanceId, String host, int port) {
        this.instanceId = instanceId;
        this.host = host;
        this.port = port;
        this.registrationTime = LocalDateTime.now();
    }
    
    public String getInstanceId() { return instanceId; }
    public String getHost() { return host; }
    public int getPort() { return port; }
    public LocalDateTime getRegistrationTime() { return registrationTime; }
    
    @Override
    public String toString() {
        return String.format("ServiceInstance{id='%s', host='%s', port=%d}", 
            instanceId, host, port);
    }
}

class SimpleServiceRegistry implements ServiceRegistry {
    private final Map<String, Map<String, ServiceInstance>> services = new ConcurrentHashMap<>();
    
    @Override
    public void register(String serviceName, String instanceId, String host, int port) {
        ServiceInstance instance = new ServiceInstance(instanceId, host, port);
        services.computeIfAbsent(serviceName, k -> new ConcurrentHashMap<>())
                .put(instanceId, instance);
        System.out.printf("[SERVICE REGISTRY] Registered: %s -> %s%n", serviceName, instance);
    }
    
    @Override
    public void deregister(String serviceName, String instanceId) {
        Map<String, ServiceInstance> instances = services.get(serviceName);
        if (instances != null) {
            ServiceInstance removed = instances.remove(instanceId);
            if (removed != null) {
                System.out.printf("[SERVICE REGISTRY] Deregistered: %s -> %s%n", 
                    serviceName, removed);
            }
        }
    }
    
    @Override
    public List<ServiceInstance> discover(String serviceName) {
        Map<String, ServiceInstance> instances = services.get(serviceName);
        return instances != null ? new ArrayList<>(instances.values()) : Collections.emptyList();
    }
    
    public void printRegistry() {
        System.out.println("=== Service Registry ===");
        services.forEach((service, instances) -> {
            System.out.printf("Service: %s (%d instances)%n", service, instances.size());
            instances.values().forEach(instance -> 
                System.out.printf("  - %s%n", instance));
        });
    }
}

// Microservice Base Class
abstract class Microservice {
    protected final String serviceName;
    protected final String instanceId;
    protected final EventBus eventBus;
    protected final ServiceRegistry serviceRegistry;
    
    public Microservice(String serviceName, EventBus eventBus, ServiceRegistry serviceRegistry) {
        this.serviceName = serviceName;
        this.instanceId = UUID.randomUUID().toString();
        this.eventBus = eventBus;
        this.serviceRegistry = serviceRegistry;
    }
    
    public void start(String host, int port) {
        serviceRegistry.register(serviceName, instanceId, host, port);
        subscribeToEvents();
        System.out.printf("[%s] Service started on %s:%d%n", serviceName, host, port);
    }
    
    public void stop() {
        serviceRegistry.deregister(serviceName, instanceId);
        System.out.printf("[%s] Service stopped%n", serviceName);
    }
    
    protected abstract void subscribeToEvents();
}

// User Service - Domain: User Management
class UserService extends Microservice {
    private final Map<String, User> users = new ConcurrentHashMap<>();
    
    public UserService(EventBus eventBus, ServiceRegistry serviceRegistry) {
        super("user-service", eventBus, serviceRegistry);
    }
    
    @Override
    protected void subscribeToEvents() {
        // User service might subscribe to other domain events if needed
    }
    
    public String registerUser(String name, String email) {
        String userId = "USR-" + UUID.randomUUID().toString().substring(0, 8);
        User user = new User(userId, name, email);
        users.put(userId, user);
        
        // Publish domain event
        eventBus.publish(new UserRegisteredEvent(userId, email, name));
        
        System.out.printf("[USER SERVICE] Registered user: %s%n", user);
        return userId;
    }
    
    public User getUser(String userId) {
        return users.get(userId);
    }
    
    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }
    
    private static class User {
        private final String id;
        private final String name;
        private final String email;
        
        public User(String id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }
        
        public String getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        
        @Override
        public String toString() {
            return String.format("User{id='%s', name='%s', email='%s'}", id, name, email);
        }
    }
}

// Order Service - Domain: Order Management
class OrderService extends Microservice {
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final CircuitBreaker paymentServiceBreaker;
    
    public OrderService(EventBus eventBus, ServiceRegistry serviceRegistry) {
        super("order-service", eventBus, serviceRegistry);
        this.paymentServiceBreaker = new CircuitBreaker("payment-service", 3, 5000, 30000);
    }
    
    @Override
    protected void subscribeToEvents() {
        eventBus.subscribe("USER_REGISTERED", event -> {
            if (event instanceof UserRegisteredEvent userEvent) {
                System.out.printf("[ORDER SERVICE] User registered: %s, ready to take orders%n", 
                    userEvent.getUserId());
            }
        });
        
        eventBus.subscribe("PAYMENT_PROCESSED", event -> {
            if (event instanceof PaymentProcessedEvent paymentEvent) {
                handlePaymentResult(paymentEvent);
            }
        });
    }
    
    public String createOrder(String userId, double amount) {
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8);
        Order order = new Order(orderId, userId, amount, OrderStatus.PENDING);
        orders.put(orderId, order);
        
        // Publish domain event
        eventBus.publish(new OrderCreatedEvent(orderId, userId, amount));
        
        System.out.printf("[ORDER SERVICE] Created order: %s%n", order);
        return orderId;
    }
    
    private void handlePaymentResult(PaymentProcessedEvent event) {
        Order order = orders.get(event.getOrderId());
        if (order != null) {
            OrderStatus newStatus = event.isSuccessful() ? 
                OrderStatus.CONFIRMED : OrderStatus.CANCELLED;
            orders.put(order.getId(), order.withStatus(newStatus));
            
            System.out.printf("[ORDER SERVICE] Order %s %s%n", 
                order.getId(), newStatus);
        }
    }
    
    public Order getOrder(String orderId) {
        return orders.get(orderId);
    }
    
    private enum OrderStatus {
        PENDING, CONFIRMED, CANCELLED
    }
    
    private static class Order {
        private final String id;
        private final String userId;
        private final double amount;
        private final OrderStatus status;
        
        public Order(String id, String userId, double amount, OrderStatus status) {
            this.id = id;
            this.userId = userId;
            this.amount = amount;
            this.status = status;
        }
        
        public Order withStatus(OrderStatus newStatus) {
            return new Order(id, userId, amount, newStatus);
        }
        
        public String getId() { return id; }
        public String getUserId() { return userId; }
        public double getAmount() { return amount; }
        public OrderStatus getStatus() { return status; }
        
        @Override
        public String toString() {
            return String.format("Order{id='%s', userId='%s', amount=%.2f, status=%s}", 
                id, userId, amount, status);
        }
    }
}

// Payment Service - Domain: Payment Processing
class PaymentService extends Microservice {
    private final Random random = new Random();
    
    public PaymentService(EventBus eventBus, ServiceRegistry serviceRegistry) {
        super("payment-service", eventBus, serviceRegistry);
    }
    
    @Override
    protected void subscribeToEvents() {
        eventBus.subscribe("ORDER_CREATED", event -> {
            if (event instanceof OrderCreatedEvent orderEvent) {
                processPayment(orderEvent);
            }
        });
    }
    
    private void processPayment(OrderCreatedEvent orderEvent) {
        // Simulate payment processing with random success/failure
        CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(1000 + random.nextInt(2000)); // Simulate processing time
                
                // 80% success rate
                boolean successful = random.nextDouble() < 0.8;
                
                String paymentId = "PAY-" + UUID.randomUUID().toString().substring(0, 8);
                
                System.out.printf("[PAYMENT SERVICE] Processing payment for order %s: %s%n",
                    orderEvent.getOrderId(), successful ? "SUCCESS" : "FAILED");
                
                // Publish payment result
                eventBus.publish(new PaymentProcessedEvent(
                    paymentId, orderEvent.getOrderId(), successful));
                
                return successful;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return false;
            }
        });
    }
}

// Notification Service - Cross-cutting concern
class NotificationService extends Microservice {
    public NotificationService(EventBus eventBus, ServiceRegistry serviceRegistry) {
        super("notification-service", eventBus, serviceRegistry);
    }
    
    @Override
    protected void subscribeToEvents() {
        eventBus.subscribe("USER_REGISTERED", this::handleUserRegistered);
        eventBus.subscribe("ORDER_CREATED", this::handleOrderCreated);
        eventBus.subscribe("PAYMENT_PROCESSED", this::handlePaymentProcessed);
    }
    
    private void handleUserRegistered(DomainEvent event) {
        if (event instanceof UserRegisteredEvent userEvent) {
            System.out.printf("[NOTIFICATION] Welcome email sent to %s%n", 
                userEvent.getEmail());
        }
    }
    
    private void handleOrderCreated(DomainEvent event) {
        if (event instanceof OrderCreatedEvent orderEvent) {
            System.out.printf("[NOTIFICATION] Order confirmation sent for %s%n", 
                orderEvent.getOrderId());
        }
    }
    
    private void handlePaymentProcessed(DomainEvent event) {
        if (event instanceof PaymentProcessedEvent paymentEvent) {
            String message = paymentEvent.isSuccessful() ? 
                "Payment successful" : "Payment failed";
            System.out.printf("[NOTIFICATION] %s for order %s%n", 
                message, paymentEvent.getOrderId());
        }
    }
}

public class Example_MicroservicesPatterns {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Microservices Design Patterns ===\n");
        
        // 1. INFRASTRUCTURE SETUP
        System.out.println("1. Setting up Infrastructure:");
        EventBus eventBus = new SimpleEventBus();
        ServiceRegistry serviceRegistry = new SimpleServiceRegistry();
        
        // 2. SERVICE INITIALIZATION
        System.out.println("\n2. Initializing Services:");
        UserService userService = new UserService(eventBus, serviceRegistry);
        OrderService orderService = new OrderService(eventBus, serviceRegistry);
        PaymentService paymentService = new PaymentService(eventBus, serviceRegistry);
        NotificationService notificationService = new NotificationService(eventBus, serviceRegistry);
        
        // Start services
        userService.start("localhost", 8081);
        orderService.start("localhost", 8082);
        paymentService.start("localhost", 8083);
        notificationService.start("localhost", 8084);
        
        Thread.sleep(1000); // Allow services to initialize
        
        // 3. SERVICE REGISTRY DEMONSTRATION
        System.out.println("\n3. Service Registry:");
        serviceRegistry.printRegistry();
        
        // 4. EVENT-DRIVEN ARCHITECTURE
        System.out.println("\n4. Event-Driven Architecture Demo:");
        demonstrateEventDrivenArchitecture(userService, orderService);
        
        Thread.sleep(3000); // Allow async processing
        
        // 5. CIRCUIT BREAKER PATTERN
        System.out.println("\n5. Circuit Breaker Pattern:");
        demonstrateCircuitBreaker();
        
        // 6. SERVICE DISCOVERY
        System.out.println("\n6. Service Discovery:");
        demonstrateServiceDiscovery(serviceRegistry);
        
        // 7. CLEANUP
        System.out.println("\n7. Shutting down services:");
        userService.stop();
        orderService.stop();
        paymentService.stop();
        notificationService.stop();
        
        if (eventBus instanceof SimpleEventBus) {
            ((SimpleEventBus) eventBus).shutdown();
        }
    }
    
    private static void demonstrateEventDrivenArchitecture(UserService userService, OrderService orderService) {
        System.out.println("--- Creating user and orders ---");
        
        // Register users
        String userId1 = userService.registerUser("Alice Johnson", "alice@email.com");
        String userId2 = userService.registerUser("Bob Smith", "bob@email.com");
        
        // Create orders (will trigger payment processing)
        String orderId1 = orderService.createOrder(userId1, 99.99);
        String orderId2 = orderService.createOrder(userId2, 149.50);
        String orderId3 = orderService.createOrder(userId1, 75.25);
        
        System.out.println("Orders created, payment processing will happen asynchronously");
    }
    
    private static void demonstrateCircuitBreaker() {
        System.out.println("--- Circuit Breaker Simulation ---");
        
        CircuitBreaker breaker = new CircuitBreaker("external-api", 3, 1000, 5000);
        
        // Simulate service calls with failures
        for (int i = 1; i <= 8; i++) {
            try {
                String result = breaker.execute(() -> {
                    // Simulate failure for first 4 calls
                    if (i <= 4) {
                        throw new RuntimeException("Service unavailable");
                    }
                    return "Success";
                });
                System.out.printf("Call %d: %s (State: %s)%n", i, result, breaker.getState());
            } catch (Exception e) {
                System.out.printf("Call %d: FAILED - %s (State: %s, Failures: %d)%n", 
                    i, e.getMessage(), breaker.getState(), breaker.getFailureCount());
            }
            
            // Simulate time passing
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
    
    private static void demonstrateServiceDiscovery(ServiceRegistry serviceRegistry) {
        System.out.println("--- Service Discovery ---");
        
        // Discover user service instances
        List<ServiceInstance> userInstances = serviceRegistry.discover("user-service");
        System.out.println("User service instances: " + userInstances);
        
        // Discover order service instances
        List<ServiceInstance> orderInstances = serviceRegistry.discover("order-service");
        System.out.println("Order service instances: " + orderInstances);
        
        // Register additional instances to show load balancing
        serviceRegistry.register("user-service", "user-2", "localhost", 8085);
        serviceRegistry.register("user-service", "user-3", "localhost", 8086);
        
        System.out.println("\nAfter scaling user service:");
        userInstances = serviceRegistry.discover("user-service");
        System.out.println("User service instances: " + userInstances.size());
        userInstances.forEach(instance -> System.out.println("  - " + instance));
        
        System.out.println("\nKey Benefits:");
        System.out.println("- Dynamic service registration and discovery");
        System.out.println("- Load balancing across multiple instances");
        System.out.println("- Automatic failover when instances go down");
        System.out.println("- Service health monitoring and circuit breaking");
    }
}