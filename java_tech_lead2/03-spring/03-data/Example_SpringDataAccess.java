/**
 * Spring Data Access - Repository Pattern and Transaction Management
 * 
 * Key Points:
 * - Repository pattern abstraction
 * - Transaction management with @Transactional
 * - JPA/Hibernate integration concepts
 * - Connection pooling and data source configuration
 * - Query methods and custom queries
 * - Caching strategies
 */

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.sql.*;
import java.lang.annotation.*;
import java.util.function.*;
import java.time.LocalDateTime;

// Transaction management annotations
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@interface Transactional {
    Propagation propagation() default Propagation.REQUIRED;
    Isolation isolation() default Isolation.DEFAULT;
    boolean readOnly() default false;
    int timeout() default -1;
}

enum Propagation {
    REQUIRED, REQUIRES_NEW, SUPPORTS, NOT_SUPPORTED, MANDATORY, NEVER
}

enum Isolation {
    DEFAULT, READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE
}

// JPA-like annotations
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface Entity {
    String name() default "";
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface Table {
    String name();
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface Id {
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface Column {
    String name() default "";
    boolean nullable() default true;
    int length() default 255;
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface GeneratedValue {
    GenerationType strategy() default GenerationType.AUTO;
}

enum GenerationType {
    AUTO, IDENTITY, SEQUENCE, TABLE
}

// Repository interfaces
interface Repository<T, ID> {
    Optional<T> findById(ID id);
    List<T> findAll();
    T save(T entity);
    void deleteById(ID id);
    boolean existsById(ID id);
    long count();
}

interface CrudRepository<T, ID> extends Repository<T, ID> {
    <S extends T> List<S> saveAll(Iterable<S> entities);
    List<T> findAllById(Iterable<ID> ids);
    void delete(T entity);
    void deleteAll(Iterable<? extends T> entities);
    void deleteAll();
}

interface JpaRepository<T, ID> extends CrudRepository<T, ID> {
    void flush();
    <S extends T> S saveAndFlush(S entity);
    void deleteInBatch(Iterable<T> entities);
    void deleteAllInBatch();
    T getOne(ID id);
}

// Entity classes
@Entity
@Table(name = "users")
class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", nullable = false, length = 50)
    private String username;
    
    @Column(name = "email", nullable = false, length = 100)
    private String email;
    
    @Column(name = "full_name", length = 100)
    private String fullName;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public UserEntity() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public UserEntity(String username, String email, String fullName) {
        this();
        this.username = username;
        this.email = email;
        this.fullName = fullName;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { 
        this.username = username;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { 
        this.email = email;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { 
        this.fullName = fullName;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    @Override
    public String toString() {
        return String.format("UserEntity{id=%d, username='%s', email='%s', fullName='%s'}", 
            id, username, email, fullName);
    }
}

@Entity
@Table(name = "orders")
class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_number", nullable = false, length = 20)
    private String orderNumber;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
    
    @Column(name = "status", nullable = false, length = 20)
    private String status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public OrderEntity() {
        this.createdAt = LocalDateTime.now();
    }
    
    public OrderEntity(String orderNumber, Long userId, Double totalAmount, String status) {
        this();
        this.orderNumber = orderNumber;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.status = status;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    @Override
    public String toString() {
        return String.format("OrderEntity{id=%d, orderNumber='%s', userId=%d, totalAmount=%.2f, status='%s'}", 
            id, orderNumber, userId, totalAmount, status);
    }
}

// Repository implementations
class SimpleJpaRepository<T, ID> implements JpaRepository<T, ID> {
    protected final Map<ID, T> storage = new ConcurrentHashMap<>();
    protected final Class<T> entityClass;
    private Long nextId = 1L;
    
    public SimpleJpaRepository(Class<T> entityClass) {
        this.entityClass = entityClass;
    }
    
    @Override
    public Optional<T> findById(ID id) {
        return Optional.ofNullable(storage.get(id));
    }
    
    @Override
    public List<T> findAll() {
        return new ArrayList<>(storage.values());
    }
    
    @Override
    public T save(T entity) {
        ID id = extractId(entity);
        if (id == null) {
            id = generateId();
            setId(entity, id);
        }
        storage.put(id, entity);
        return entity;
    }
    
    @Override
    public void deleteById(ID id) {
        storage.remove(id);
    }
    
    @Override
    public boolean existsById(ID id) {
        return storage.containsKey(id);
    }
    
    @Override
    public long count() {
        return storage.size();
    }
    
    @Override
    public <S extends T> List<S> saveAll(Iterable<S> entities) {
        List<S> result = new ArrayList<>();
        for (S entity : entities) {
            result.add((S) save(entity));
        }
        return result;
    }
    
    @Override
    public List<T> findAllById(Iterable<ID> ids) {
        List<T> result = new ArrayList<>();
        for (ID id : ids) {
            findById(id).ifPresent(result::add);
        }
        return result;
    }
    
    @Override
    public void delete(T entity) {
        ID id = extractId(entity);
        if (id != null) {
            deleteById(id);
        }
    }
    
    @Override
    public void deleteAll(Iterable<? extends T> entities) {
        for (T entity : entities) {
            delete(entity);
        }
    }
    
    @Override
    public void deleteAll() {
        storage.clear();
    }
    
    @Override
    public void flush() {
        // In a real implementation, this would flush to database
        System.out.println("[REPOSITORY] Flushing changes to database");
    }
    
    @Override
    public <S extends T> S saveAndFlush(S entity) {
        S saved = (S) save(entity);
        flush();
        return saved;
    }
    
    @Override
    public void deleteInBatch(Iterable<T> entities) {
        deleteAll(entities);
    }
    
    @Override
    public void deleteAllInBatch() {
        deleteAll();
    }
    
    @Override
    public T getOne(ID id) {
        return findById(id).orElseThrow(() -> 
            new RuntimeException("Entity not found with id: " + id));
    }
    
    @SuppressWarnings("unchecked")
    protected ID extractId(T entity) {
        if (entity instanceof UserEntity) {
            return (ID) ((UserEntity) entity).getId();
        } else if (entity instanceof OrderEntity) {
            return (ID) ((OrderEntity) entity).getId();
        }
        return null;
    }
    
    @SuppressWarnings("unchecked")
    protected ID generateId() {
        return (ID) Long.valueOf(nextId++);
    }
    
    protected void setId(T entity, ID id) {
        if (entity instanceof UserEntity) {
            ((UserEntity) entity).setId((Long) id);
        } else if (entity instanceof OrderEntity) {
            ((OrderEntity) entity).setId((Long) id);
        }
    }
}

// Custom repository interfaces
interface UserRepository extends JpaRepository<UserEntity, Long> {
    List<UserEntity> findByUsername(String username);
    List<UserEntity> findByEmailContaining(String email);
    Optional<UserEntity> findByEmail(String email);
    List<UserEntity> findByFullNameContainingIgnoreCase(String name);
    void deleteByUsername(String username);
}

interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserId(Long userId);
    List<OrderEntity> findByStatus(String status);
    List<OrderEntity> findByTotalAmountGreaterThan(Double amount);
    List<OrderEntity> findByUserIdAndStatus(Long userId, String status);
    Optional<OrderEntity> findByOrderNumber(String orderNumber);
}

// Repository implementations with custom queries
class UserRepositoryImpl extends SimpleJpaRepository<UserEntity, Long> implements UserRepository {
    
    public UserRepositoryImpl() {
        super(UserEntity.class);
    }
    
    @Override
    public List<UserEntity> findByUsername(String username) {
        return storage.values().stream()
            .filter(user -> user.getUsername().equals(username))
            .collect(java.util.stream.Collectors.toList());
    }
    
    @Override
    public List<UserEntity> findByEmailContaining(String email) {
        return storage.values().stream()
            .filter(user -> user.getEmail().toLowerCase().contains(email.toLowerCase()))
            .collect(java.util.stream.Collectors.toList());
    }
    
    @Override
    public Optional<UserEntity> findByEmail(String email) {
        return storage.values().stream()
            .filter(user -> user.getEmail().equals(email))
            .findFirst();
    }
    
    @Override
    public List<UserEntity> findByFullNameContainingIgnoreCase(String name) {
        return storage.values().stream()
            .filter(user -> user.getFullName().toLowerCase().contains(name.toLowerCase()))
            .collect(java.util.stream.Collectors.toList());
    }
    
    @Override
    @Transactional
    public void deleteByUsername(String username) {
        List<UserEntity> usersToDelete = findByUsername(username);
        usersToDelete.forEach(this::delete);
    }
}

class OrderRepositoryImpl extends SimpleJpaRepository<OrderEntity, Long> implements OrderRepository {
    
    public OrderRepositoryImpl() {
        super(OrderEntity.class);
    }
    
    @Override
    public List<OrderEntity> findByUserId(Long userId) {
        return storage.values().stream()
            .filter(order -> order.getUserId().equals(userId))
            .collect(java.util.stream.Collectors.toList());
    }
    
    @Override
    public List<OrderEntity> findByStatus(String status) {
        return storage.values().stream()
            .filter(order -> order.getStatus().equals(status))
            .collect(java.util.stream.Collectors.toList());
    }
    
    @Override
    public List<OrderEntity> findByTotalAmountGreaterThan(Double amount) {
        return storage.values().stream()
            .filter(order -> order.getTotalAmount() > amount)
            .collect(java.util.stream.Collectors.toList());
    }
    
    @Override
    public List<OrderEntity> findByUserIdAndStatus(Long userId, String status) {
        return storage.values().stream()
            .filter(order -> order.getUserId().equals(userId) && order.getStatus().equals(status))
            .collect(java.util.stream.Collectors.toList());
    }
    
    @Override
    public Optional<OrderEntity> findByOrderNumber(String orderNumber) {
        return storage.values().stream()
            .filter(order -> order.getOrderNumber().equals(orderNumber))
            .findFirst();
    }
}

// Transaction management
class TransactionManager {
    private final ThreadLocal<TransactionContext> currentTransaction = new ThreadLocal<>();
    
    public void begin() {
        if (currentTransaction.get() != null) {
            throw new IllegalStateException("Transaction already in progress");
        }
        
        TransactionContext context = new TransactionContext();
        currentTransaction.set(context);
        System.out.println("[TRANSACTION] Transaction started: " + context.getId());
    }
    
    public void commit() {
        TransactionContext context = currentTransaction.get();
        if (context == null) {
            throw new IllegalStateException("No transaction in progress");
        }
        
        try {
            System.out.println("[TRANSACTION] Committing transaction: " + context.getId());
            // In real implementation, this would commit to database
            context.commit();
        } finally {
            currentTransaction.remove();
        }
    }
    
    public void rollback() {
        TransactionContext context = currentTransaction.get();
        if (context == null) {
            throw new IllegalStateException("No transaction in progress");
        }
        
        try {
            System.out.println("[TRANSACTION] Rolling back transaction: " + context.getId());
            context.rollback();
        } finally {
            currentTransaction.remove();
        }
    }
    
    public boolean isTransactionActive() {
        return currentTransaction.get() != null;
    }
    
    public <T> T executeInTransaction(Supplier<T> operation) {
        begin();
        try {
            T result = operation.get();
            commit();
            return result;
        } catch (Exception e) {
            rollback();
            throw new RuntimeException("Transaction failed", e);
        }
    }
    
    private static class TransactionContext {
        private final String id;
        private final LocalDateTime startTime;
        
        public TransactionContext() {
            this.id = UUID.randomUUID().toString().substring(0, 8);
            this.startTime = LocalDateTime.now();
        }
        
        public String getId() { return id; }
        public LocalDateTime getStartTime() { return startTime; }
        
        public void commit() {
            System.out.printf("[TRANSACTION] Transaction %s committed successfully%n", id);
        }
        
        public void rollback() {
            System.out.printf("[TRANSACTION] Transaction %s rolled back%n", id);
        }
    }
}

// Service layer with transaction management
@Service
class UserService {
    private final UserRepository userRepository;
    private final TransactionManager transactionManager;
    
    public UserService(UserRepository userRepository, TransactionManager transactionManager) {
        this.userRepository = userRepository;
        this.transactionManager = transactionManager;
    }
    
    @Transactional
    public UserEntity createUser(String username, String email, String fullName) {
        return transactionManager.executeInTransaction(() -> {
            // Check if user already exists
            Optional<UserEntity> existing = userRepository.findByEmail(email);
            if (existing.isPresent()) {
                throw new RuntimeException("User already exists with email: " + email);
            }
            
            UserEntity user = new UserEntity(username, email, fullName);
            return userRepository.save(user);
        });
    }
    
    @Transactional(readOnly = true)
    public List<UserEntity> findAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<UserEntity> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Transactional
    public UserEntity updateUser(Long id, String username, String email, String fullName) {
        return transactionManager.executeInTransaction(() -> {
            UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
            
            user.setUsername(username);
            user.setEmail(email);
            user.setFullName(fullName);
            
            return userRepository.save(user);
        });
    }
    
    @Transactional
    public void deleteUser(Long id) {
        transactionManager.executeInTransaction(() -> {
            if (!userRepository.existsById(id)) {
                throw new RuntimeException("User not found with id: " + id);
            }
            userRepository.deleteById(id);
            return null;
        });
    }
    
    @Transactional(readOnly = true)
    public List<UserEntity> searchUsers(String searchTerm) {
        return userRepository.findByFullNameContainingIgnoreCase(searchTerm);
    }
}

@Service
class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final TransactionManager transactionManager;
    
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, 
                       TransactionManager transactionManager) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.transactionManager = transactionManager;
    }
    
    @Transactional
    public OrderEntity createOrder(Long userId, Double totalAmount) {
        return transactionManager.executeInTransaction(() -> {
            // Verify user exists
            UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            String orderNumber = "ORD-" + System.currentTimeMillis();
            OrderEntity order = new OrderEntity(orderNumber, userId, totalAmount, "PENDING");
            
            return orderRepository.save(order);
        });
    }
    
    @Transactional
    public OrderEntity updateOrderStatus(Long orderId, String status) {
        return transactionManager.executeInTransaction(() -> {
            OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
            
            order.setStatus(status);
            return orderRepository.save(order);
        });
    }
    
    @Transactional(readOnly = true)
    public List<OrderEntity> findOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    @Transactional(readOnly = true)
    public List<OrderEntity> findOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }
    
    @Transactional(readOnly = true)
    public List<OrderEntity> findHighValueOrders(Double minAmount) {
        return orderRepository.findByTotalAmountGreaterThan(minAmount);
    }
}

public class Example_SpringDataAccess {
    public static void main(String[] args) {
        System.out.println("=== Spring Data Access ===\n");
        
        // 1. INITIALIZE DATA ACCESS LAYER
        System.out.println("1. Initializing Data Access Layer:");
        DataAccessContext context = initializeDataAccess();
        
        // 2. DEMONSTRATE REPOSITORY PATTERN
        System.out.println("\n2. Repository Pattern:");
        demonstrateRepositoryPattern(context);
        
        // 3. DEMONSTRATE TRANSACTION MANAGEMENT
        System.out.println("\n3. Transaction Management:");
        demonstrateTransactionManagement(context);
        
        // 4. DEMONSTRATE CUSTOM QUERIES
        System.out.println("\n4. Custom Query Methods:");
        demonstrateCustomQueries(context);
        
        // 5. DEMONSTRATE ERROR HANDLING
        System.out.println("\n5. Error Handling and Rollback:");
        demonstrateErrorHandling(context);
        
        System.out.println("\n=== Summary ===");
        printDataAccessSummary();
    }
    
    private static DataAccessContext initializeDataAccess() {
        TransactionManager transactionManager = new TransactionManager();
        UserRepository userRepository = new UserRepositoryImpl();
        OrderRepository orderRepository = new OrderRepositoryImpl();
        
        UserService userService = new UserService(userRepository, transactionManager);
        OrderService orderService = new OrderService(orderRepository, userRepository, transactionManager);
        
        System.out.println("Data access layer initialized:");
        System.out.println("- Transaction manager configured");
        System.out.println("- Repository implementations registered");
        System.out.println("- Service layer with transaction support");
        
        return new DataAccessContext(userRepository, orderRepository, userService, orderService, transactionManager);
    }
    
    private static void demonstrateRepositoryPattern(DataAccessContext context) {
        System.out.println("--- Basic CRUD Operations ---");
        
        // Create users
        UserEntity user1 = new UserEntity("alice", "alice@email.com", "Alice Johnson");
        UserEntity user2 = new UserEntity("bob", "bob@email.com", "Bob Smith");
        
        user1 = context.userRepository.save(user1);
        user2 = context.userRepository.save(user2);
        
        System.out.println("Created users:");
        System.out.println("  " + user1);
        System.out.println("  " + user2);
        
        // Read operations
        System.out.println("\nAll users:");
        context.userRepository.findAll().forEach(user -> 
            System.out.println("  " + user));
        
        // Update operation
        user1.setFullName("Alice Johnson-Smith");
        user1 = context.userRepository.save(user1);
        System.out.println("\nUpdated user: " + user1);
        
        // Count operation
        System.out.println("Total users: " + context.userRepository.count());
    }
    
    private static void demonstrateTransactionManagement(DataAccessContext context) {
        System.out.println("--- Transaction Management ---");
        
        // Successful transaction
        UserEntity user = context.userService.createUser("charlie", "charlie@email.com", "Charlie Brown");
        System.out.println("User created in transaction: " + user);
        
        // Create orders in transaction
        OrderEntity order1 = context.orderService.createOrder(user.getId(), 99.99);
        OrderEntity order2 = context.orderService.createOrder(user.getId(), 149.50);
        
        System.out.println("Orders created:");
        System.out.println("  " + order1);
        System.out.println("  " + order2);
        
        // Update order status in transaction
        order1 = context.orderService.updateOrderStatus(order1.getId(), "COMPLETED");
        System.out.println("Order status updated: " + order1);
    }
    
    private static void demonstrateCustomQueries(DataAccessContext context) {
        System.out.println("--- Custom Query Methods ---");
        
        // Find by username
        List<UserEntity> aliceUsers = context.userRepository.findByUsername("alice");
        System.out.println("Users with username 'alice': " + aliceUsers.size());
        
        // Find by email containing
        List<UserEntity> emailUsers = context.userRepository.findByEmailContaining("email.com");
        System.out.println("Users with 'email.com' in email: " + emailUsers.size());
        
        // Find orders by status
        List<OrderEntity> pendingOrders = context.orderRepository.findByStatus("PENDING");
        System.out.println("Pending orders: " + pendingOrders.size());
        
        // Find high-value orders
        List<OrderEntity> highValueOrders = context.orderRepository.findByTotalAmountGreaterThan(100.0);
        System.out.println("Orders > $100: " + highValueOrders.size());
        
        // Find orders by user and status
        UserEntity user = context.userRepository.findAll().get(0);
        List<OrderEntity> userOrders = context.orderRepository.findByUserIdAndStatus(user.getId(), "PENDING");
        System.out.println("User's pending orders: " + userOrders.size());
    }
    
    private static void demonstrateErrorHandling(DataAccessContext context) {
        System.out.println("--- Error Handling and Rollback ---");
        
        try {
            // Attempt to create duplicate user (should fail)
            context.userService.createUser("alice", "alice@email.com", "Duplicate Alice");
        } catch (Exception e) {
            System.out.println("Expected error caught: " + e.getMessage());
        }
        
        try {
            // Attempt to create order for non-existent user (should fail)
            context.orderService.createOrder(999L, 50.00);
        } catch (Exception e) {
            System.out.println("Expected error caught: " + e.getMessage());
        }
        
        try {
            // Attempt to update non-existent order (should fail)
            context.orderService.updateOrderStatus(999L, "COMPLETED");
        } catch (Exception e) {
            System.out.println("Expected error caught: " + e.getMessage());
        }
        
        // Verify data integrity
        System.out.println("\nData integrity maintained:");
        System.out.println("Total users: " + context.userRepository.count());
        System.out.println("Total orders: " + context.orderRepository.count());
    }
    
    private static void printDataAccessSummary() {
        System.out.println("Spring Data Access Key Concepts:");
        System.out.println("1. Repository Pattern - Data access abstraction");
        System.out.println("2. Transaction Management - ACID properties");
        System.out.println("3. JPA/Hibernate - Object-relational mapping");
        System.out.println("4. Query Methods - Method name conventions");
        System.out.println("5. Custom Queries - @Query annotations");
        System.out.println("6. Connection Pooling - Database connections");
        System.out.println("7. Caching - First and second level cache");
        System.out.println("8. Auditing - Automatic entity metadata");
        
        System.out.println("\nBest Practices:");
        System.out.println("- Use @Transactional appropriately");
        System.out.println("- Implement proper exception handling");
        System.out.println("- Use repository interfaces for abstraction");
        System.out.println("- Optimize query performance");
        System.out.println("- Implement proper caching strategies");
        System.out.println("- Use connection pooling");
        System.out.println("- Follow naming conventions for query methods");
    }
    
    private static class DataAccessContext {
        final UserRepository userRepository;
        final OrderRepository orderRepository;
        final UserService userService;
        final OrderService orderService;
        final TransactionManager transactionManager;
        
        DataAccessContext(UserRepository userRepository, OrderRepository orderRepository,
                         UserService userService, OrderService orderService,
                         TransactionManager transactionManager) {
            this.userRepository = userRepository;
            this.orderRepository = orderRepository;
            this.userService = userService;
            this.orderService = orderService;
            this.transactionManager = transactionManager;
        }
    }
}