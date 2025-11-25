# Module 7: Code Quality and Best Practices

## Table of Contents
1. [Testing Strategies](#testing-strategies)
2. [Code Review](#code-review)
3. [Clean Code Principles](#clean-code-principles)
4. [SOLID Principles](#solid-principles)

---

## Testing Strategies

### Question 1: What are the different testing levels and when to use each?

**Answer:**
Testing pyramid:
1. **Unit Tests**: Fast, isolated, test single units
2. **Integration Tests**: Test component interactions
3. **End-to-End Tests**: Test complete workflows
4. **Performance Tests**: Test under load

**Detailed Code Example:**

```java
import java.util.*;

// === Unit Testing Example ===

// Class under test
class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public int divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return a / b;
    }
    
    public double average(List<Integer> numbers) {
        if (numbers == null || numbers.isEmpty()) {
            throw new IllegalArgumentException("List cannot be null or empty");
        }
        return numbers.stream().mapToInt(Integer::intValue).average().orElse(0);
    }
}

// Unit Tests (JUnit 5 style - pseudocode)
class CalculatorTest {
    private Calculator calculator = new Calculator();
    
    // @Test
    void testAdd_positiveNumbers() {
        int result = calculator.add(2, 3);
        assert result == 5 : "Expected 5 but got " + result;
        System.out.println("✓ testAdd_positiveNumbers passed");
    }
    
    // @Test
    void testAdd_negativeNumbers() {
        int result = calculator.add(-2, -3);
        assert result == -5 : "Expected -5 but got " + result;
        System.out.println("✓ testAdd_negativeNumbers passed");
    }
    
    // @Test
    void testDivide_normalCase() {
        int result = calculator.divide(10, 2);
        assert result == 5 : "Expected 5 but got " + result;
        System.out.println("✓ testDivide_normalCase passed");
    }
    
    // @Test - expects exception
    void testDivide_byZero() {
        try {
            calculator.divide(10, 0);
            assert false : "Expected ArithmeticException";
        } catch (ArithmeticException e) {
            System.out.println("✓ testDivide_byZero passed");
        }
    }
    
    // @Test - parameterized test style
    void testAverage() {
        double result = calculator.average(Arrays.asList(1, 2, 3, 4, 5));
        assert result == 3.0 : "Expected 3.0 but got " + result;
        System.out.println("✓ testAverage passed");
    }
    
    void runAllTests() {
        testAdd_positiveNumbers();
        testAdd_negativeNumbers();
        testDivide_normalCase();
        testDivide_byZero();
        testAverage();
    }
}

// === Integration Testing Example ===

class OrderService {
    private final PaymentGateway paymentGateway;
    private final InventoryService inventoryService;
    private final NotificationService notificationService;
    
    public OrderService(PaymentGateway paymentGateway, 
                       InventoryService inventoryService,
                       NotificationService notificationService) {
        this.paymentGateway = paymentGateway;
        this.inventoryService = inventoryService;
        this.notificationService = notificationService;
    }
    
    public OrderResult processOrder(Order order) {
        // Check inventory
        if (!inventoryService.isAvailable(order.getProductId(), order.getQuantity())) {
            return new OrderResult(false, "Out of stock");
        }
        
        // Process payment
        PaymentResult paymentResult = paymentGateway.charge(order.getCustomerId(), order.getAmount());
        if (!paymentResult.isSuccess()) {
            return new OrderResult(false, "Payment failed");
        }
        
        // Reserve inventory
        inventoryService.reserve(order.getProductId(), order.getQuantity());
        
        // Send notification
        notificationService.sendOrderConfirmation(order.getCustomerId(), order.getOrderId());
        
        return new OrderResult(true, "Order processed successfully");
    }
}

// Interfaces for mocking
interface PaymentGateway {
    PaymentResult charge(String customerId, double amount);
}

interface InventoryService {
    boolean isAvailable(String productId, int quantity);
    void reserve(String productId, int quantity);
}

interface NotificationService {
    void sendOrderConfirmation(String customerId, String orderId);
}

class Order {
    private String orderId;
    private String customerId;
    private String productId;
    private int quantity;
    private double amount;
    
    public Order(String orderId, String customerId, String productId, int quantity, double amount) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.productId = productId;
        this.quantity = quantity;
        this.amount = amount;
    }
    
    public String getOrderId() { return orderId; }
    public String getCustomerId() { return customerId; }
    public String getProductId() { return productId; }
    public int getQuantity() { return quantity; }
    public double getAmount() { return amount; }
}

class OrderResult {
    private boolean success;
    private String message;
    
    public OrderResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}

class PaymentResult {
    private boolean success;
    private String transactionId;
    
    public PaymentResult(boolean success, String transactionId) {
        this.success = success;
        this.transactionId = transactionId;
    }
    
    public boolean isSuccess() { return success; }
}

// Integration Test with Mocks
class OrderServiceIntegrationTest {
    
    void testProcessOrder_success() {
        // Arrange - Create mocks
        PaymentGateway mockPayment = new PaymentGateway() {
            public PaymentResult charge(String customerId, double amount) {
                return new PaymentResult(true, "TXN-123");
            }
        };
        
        InventoryService mockInventory = new InventoryService() {
            public boolean isAvailable(String productId, int quantity) { return true; }
            public void reserve(String productId, int quantity) {}
        };
        
        NotificationService mockNotification = new NotificationService() {
            public void sendOrderConfirmation(String customerId, String orderId) {}
        };
        
        OrderService service = new OrderService(mockPayment, mockInventory, mockNotification);
        Order order = new Order("ORD-001", "CUST-001", "PROD-001", 2, 100.0);
        
        // Act
        OrderResult result = service.processOrder(order);
        
        // Assert
        assert result.isSuccess() : "Expected success";
        System.out.println("✓ testProcessOrder_success passed");
    }
    
    void testProcessOrder_outOfStock() {
        PaymentGateway mockPayment = (customerId, amount) -> new PaymentResult(true, "TXN-123");
        
        InventoryService mockInventory = new InventoryService() {
            public boolean isAvailable(String productId, int quantity) { return false; }
            public void reserve(String productId, int quantity) {}
        };
        
        NotificationService mockNotification = (customerId, orderId) -> {};
        
        OrderService service = new OrderService(mockPayment, mockInventory, mockNotification);
        Order order = new Order("ORD-002", "CUST-001", "PROD-001", 2, 100.0);
        
        OrderResult result = service.processOrder(order);
        
        assert !result.isSuccess() : "Expected failure";
        assert result.getMessage().contains("Out of stock") : "Expected out of stock message";
        System.out.println("✓ testProcessOrder_outOfStock passed");
    }
    
    void runAllTests() {
        testProcessOrder_success();
        testProcessOrder_outOfStock();
    }
}

public class TestingDemo {
    public static void main(String[] args) {
        System.out.println("=== Unit Tests ===");
        new CalculatorTest().runAllTests();
        
        System.out.println("\n=== Integration Tests ===");
        new OrderServiceIntegrationTest().runAllTests();
    }
}
```

---

## Code Review

### Question 2: What should you look for in a code review?

**Answer:**
Code review checklist:
1. **Functionality**: Does it work correctly?
2. **Design**: Is it well-structured?
3. **Readability**: Is it easy to understand?
4. **Performance**: Are there performance issues?
5. **Security**: Are there vulnerabilities?
6. **Testing**: Is it properly tested?

**Detailed Code Example - Before and After Review:**

```java
// === BEFORE CODE REVIEW ===
// Issues: Poor naming, no error handling, magic numbers, no validation

class OrderProcessor {
    public void process(String s, int n, double d) {
        // Check if valid
        if (s != null && n > 0) {
            // Calculate
            double t = d * n;
            if (t > 100) {
                t = t * 0.9; // Apply discount
            }
            // Save
            System.out.println("Order: " + s + ", Total: " + t);
        }
    }
}

// === AFTER CODE REVIEW ===
// Improvements: Clear naming, proper validation, constants, error handling

class ImprovedOrderProcessor {
    
    private static final double DISCOUNT_THRESHOLD = 100.0;
    private static final double DISCOUNT_RATE = 0.10;
    private static final double MINIMUM_QUANTITY = 1;
    
    private final OrderRepository orderRepository;
    private final PricingService pricingService;
    
    public ImprovedOrderProcessor(OrderRepository orderRepository, PricingService pricingService) {
        this.orderRepository = Objects.requireNonNull(orderRepository, "OrderRepository cannot be null");
        this.pricingService = Objects.requireNonNull(pricingService, "PricingService cannot be null");
    }
    
    public ProcessedOrder processOrder(String orderId, int quantity, double unitPrice) {
        validateInputs(orderId, quantity, unitPrice);
        
        double subtotal = calculateSubtotal(quantity, unitPrice);
        double discount = calculateDiscount(subtotal);
        double total = subtotal - discount;
        
        ProcessedOrder processedOrder = new ProcessedOrder(orderId, quantity, unitPrice, discount, total);
        orderRepository.save(processedOrder);
        
        return processedOrder;
    }
    
    private void validateInputs(String orderId, int quantity, double unitPrice) {
        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("Order ID cannot be null or blank");
        }
        if (quantity < MINIMUM_QUANTITY) {
            throw new IllegalArgumentException("Quantity must be at least " + MINIMUM_QUANTITY);
        }
        if (unitPrice < 0) {
            throw new IllegalArgumentException("Unit price cannot be negative");
        }
    }
    
    private double calculateSubtotal(int quantity, double unitPrice) {
        return unitPrice * quantity;
    }
    
    private double calculateDiscount(double subtotal) {
        if (subtotal > DISCOUNT_THRESHOLD) {
            return subtotal * DISCOUNT_RATE;
        }
        return 0.0;
    }
}

// Supporting classes
interface OrderRepository {
    void save(ProcessedOrder order);
}

interface PricingService {
    double getPrice(String productId);
}

class ProcessedOrder {
    private final String orderId;
    private final int quantity;
    private final double unitPrice;
    private final double discount;
    private final double total;
    
    public ProcessedOrder(String orderId, int quantity, double unitPrice, double discount, double total) {
        this.orderId = orderId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.discount = discount;
        this.total = total;
    }
    
    // Getters
    public String getOrderId() { return orderId; }
    public int getQuantity() { return quantity; }
    public double getUnitPrice() { return unitPrice; }
    public double getDiscount() { return discount; }
    public double getTotal() { return total; }
}
```

---

## Clean Code Principles

### Question 3: What are the key clean code principles?

**Answer:**
Key principles:
1. **Meaningful Names**: Clear, pronounceable names
2. **Small Functions**: Do one thing well
3. **No Side Effects**: Predictable behavior
4. **DRY**: Don't Repeat Yourself
5. **Comments**: Code should be self-documenting

**Detailed Code Example:**

```java
import java.util.*;
import java.time.*;

// === Clean Code Examples ===

public class CleanCodeDemo {
    
    public static void main(String[] args) {
        // Example usage
        UserService userService = new UserService(new InMemoryUserRepository());
        
        User user = userService.createUser("John", "Doe", "john@example.com");
        System.out.println("Created user: " + user.getFullName());
        
        userService.updateEmail(user.getId(), "john.doe@example.com");
        System.out.println("Updated email: " + userService.findById(user.getId()).get().getEmail());
    }
}

// 1. Meaningful Names
class User {
    private final String id;
    private final String firstName;
    private final String lastName;
    private String email;
    private final LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;
    
    public User(String id, String firstName, String lastName, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdAt = LocalDateTime.now();
        this.lastModifiedAt = this.createdAt;
    }
    
    // Meaningful method name
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public boolean hasValidEmail() {
        return email != null && email.contains("@");
    }
    
    // Getters
    public String getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    
    void setEmail(String email) { 
        this.email = email;
        this.lastModifiedAt = LocalDateTime.now();
    }
}

// 2. Small Functions - Each does one thing
class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User createUser(String firstName, String lastName, String email) {
        validateUserInput(firstName, lastName, email);
        
        String userId = generateUserId();
        User user = new User(userId, firstName, lastName, email);
        
        userRepository.save(user);
        
        return user;
    }
    
    public void updateEmail(String userId, String newEmail) {
        validateEmail(newEmail);
        
        User user = findUserOrThrow(userId);
        user.setEmail(newEmail);
        
        userRepository.save(user);
    }
    
    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }
    
    // Private helper methods
    private void validateUserInput(String firstName, String lastName, String email) {
        validateName(firstName, "First name");
        validateName(lastName, "Last name");
        validateEmail(email);
    }
    
    private void validateName(String name, String fieldName) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(fieldName + " cannot be blank");
        }
    }
    
    private void validateEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }
    
    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
    }
    
    private String generateUserId() {
        return "USER-" + System.currentTimeMillis();
    }
}

// Repository interface
interface UserRepository {
    void save(User user);
    Optional<User> findById(String id);
    List<User> findAll();
}

// In-memory implementation
class InMemoryUserRepository implements UserRepository {
    private final Map<String, User> users = new HashMap<>();
    
    @Override
    public void save(User user) {
        users.put(user.getId(), user);
    }
    
    @Override
    public Optional<User> findById(String id) {
        return Optional.ofNullable(users.get(id));
    }
    
    @Override
    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }
}

// Custom exception
class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
```

---

## SOLID Principles

### Question 4: Explain SOLID principles with examples.

**Answer:**
1. **S**ingle Responsibility
2. **O**pen/Closed
3. **L**iskov Substitution
4. **I**nterface Segregation
5. **D**ependency Inversion

**Detailed Code Example:**

```java
import java.util.*;

public class SOLIDDemo {
    
    public static void main(String[] args) {
        // Demonstrate SOLID principles
        System.out.println("=== SOLID Principles Demo ===");
        
        // Dependency Inversion - inject dependencies
        NotificationSender emailSender = new EmailSender();
        NotificationSender smsSender = new SmsSender();
        
        NotificationService service = new NotificationService(List.of(emailSender, smsSender));
        service.notifyUser("user@example.com", "Hello!");
    }
}

// === Single Responsibility Principle ===
// Each class has one reason to change

// Bad: One class doing multiple things
class BadUserManager {
    public void createUser(String name) { /* create user */ }
    public void sendEmail(String email) { /* send email */ }
    public void generateReport() { /* generate report */ }
}

// Good: Separate classes for each responsibility
class UserCreator {
    public User create(String name, String email) {
        return new User(UUID.randomUUID().toString(), name, name, email);
    }
}

class EmailService {
    public void send(String to, String message) {
        System.out.println("Sending email to " + to);
    }
}

class ReportGenerator {
    public String generate(List<User> users) {
        return "Report with " + users.size() + " users";
    }
}

// === Open/Closed Principle ===
// Open for extension, closed for modification

// Bad: Need to modify class for new shapes
class BadAreaCalculator {
    public double calculate(Object shape) {
        if (shape instanceof Circle) {
            Circle c = (Circle) shape;
            return Math.PI * c.radius * c.radius;
        } else if (shape instanceof Rectangle) {
            Rectangle r = (Rectangle) shape;
            return r.width * r.height;
        }
        return 0;
    }
}

// Good: Add new shapes without modifying existing code
interface Shape {
    double area();
}

class Circle implements Shape {
    double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

class Rectangle implements Shape {
    double width;
    double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double area() {
        return width * height;
    }
}

// New shape - no modification needed
class Triangle implements Shape {
    double base;
    double height;
    
    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }
    
    @Override
    public double area() {
        return 0.5 * base * height;
    }
}

class AreaCalculator {
    public double calculate(Shape shape) {
        return shape.area();
    }
}

// === Liskov Substitution Principle ===
// Subtypes must be substitutable for base types

// Bad: Square violates LSP for Rectangle
class BadRectangle {
    protected int width;
    protected int height;
    
    public void setWidth(int width) { this.width = width; }
    public void setHeight(int height) { this.height = height; }
    public int getArea() { return width * height; }
}

class BadSquare extends BadRectangle {
    @Override
    public void setWidth(int width) {
        this.width = width;
        this.height = width; // Violates LSP
    }
    
    @Override
    public void setHeight(int height) {
        this.height = height;
        this.width = height; // Violates LSP
    }
}

// Good: Separate abstractions
interface Quadrilateral {
    int getArea();
}

class GoodRectangle implements Quadrilateral {
    private final int width;
    private final int height;
    
    public GoodRectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public int getArea() {
        return width * height;
    }
}

class Square implements Quadrilateral {
    private final int side;
    
    public Square(int side) {
        this.side = side;
    }
    
    @Override
    public int getArea() {
        return side * side;
    }
}

// === Interface Segregation Principle ===
// Clients should not depend on interfaces they don't use

// Bad: Fat interface
interface BadWorker {
    void work();
    void eat();
    void sleep();
}

// Good: Segregated interfaces
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class HumanWorker implements Workable, Eatable, Sleepable {
    @Override
    public void work() { System.out.println("Working"); }
    @Override
    public void eat() { System.out.println("Eating"); }
    @Override
    public void sleep() { System.out.println("Sleeping"); }
}

class RobotWorker implements Workable {
    @Override
    public void work() { System.out.println("Robot working"); }
    // Robot doesn't need eat() or sleep()
}

// === Dependency Inversion Principle ===
// High-level modules should not depend on low-level modules

// Bad: High-level depends on low-level
class BadNotificationService {
    private final GmailSender gmailSender = new GmailSender(); // Direct dependency
    
    public void notify(String message) {
        gmailSender.send(message);
    }
}

class GmailSender {
    public void send(String message) {
        System.out.println("Gmail: " + message);
    }
}

// Good: Both depend on abstraction
interface NotificationSender {
    void send(String to, String message);
}

class EmailSender implements NotificationSender {
    @Override
    public void send(String to, String message) {
        System.out.println("Email to " + to + ": " + message);
    }
}

class SmsSender implements NotificationSender {
    @Override
    public void send(String to, String message) {
        System.out.println("SMS to " + to + ": " + message);
    }
}

class NotificationService {
    private final List<NotificationSender> senders;
    
    // Dependency injected
    public NotificationService(List<NotificationSender> senders) {
        this.senders = senders;
    }
    
    public void notifyUser(String to, String message) {
        for (NotificationSender sender : senders) {
            sender.send(to, message);
        }
    }
}
```

---

## Summary

Code quality requires:

1. **Testing**: Unit, integration, and E2E tests
2. **Code Reviews**: Systematic quality checks
3. **Clean Code**: Readable, maintainable code
4. **SOLID**: Design principles for flexibility

Continue to [Module 8: Leadership](08-leadership.md) →
