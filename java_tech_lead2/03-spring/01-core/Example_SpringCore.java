/**
 * Spring Core - IoC Container and Dependency Injection Patterns
 * 
 * Note: This is a conceptual example showing Spring patterns.
 * In real projects, use Maven/Gradle with Spring Boot starter dependencies.
 * 
 * Key Points:
 * - IoC container manages object creation and dependencies  
 * - Multiple DI patterns: constructor, setter, field injection
 * - Bean scopes affect object lifecycle and sharing
 * - Configuration can be XML, annotation, or Java-based
 */

import java.util.*;
import java.lang.reflect.*;
import java.util.concurrent.ConcurrentHashMap;

// Simplified annotation definitions (normally from Spring)
@interface Component {
    String value() default "";
}

@interface Service {
    String value() default "";
}

@interface Repository {
    String value() default "";
}

@interface Autowired {
}

@interface Qualifier {
    String value();
}

@interface Scope {
    String value();
}

// Bean scope constants
interface BeanScope {
    String SINGLETON = "singleton";
    String PROTOTYPE = "prototype";
}

// Simplified ApplicationContext implementation
class SimpleApplicationContext {
    private final Map<String, Object> singletonBeans = new ConcurrentHashMap<>();
    private final Map<String, Class<?>> beanDefinitions = new ConcurrentHashMap<>();
    private final Map<String, String> beanScopes = new ConcurrentHashMap<>();
    
    public SimpleApplicationContext(String... basePackages) {
        scanAndRegisterBeans(basePackages);
        initializeBeans();
    }
    
    @SuppressWarnings("unchecked")
    public <T> T getBean(String name, Class<T> type) {
        if (BeanScope.SINGLETON.equals(beanScopes.get(name))) {
            return (T) singletonBeans.get(name);
        } else {
            return createBean(name, type);
        }
    }
    
    @SuppressWarnings("unchecked")
    public <T> T getBean(Class<T> type) {
        String beanName = findBeanNameByType(type);
        if (beanName != null) {
            return (T) getBean(beanName, type);
        }
        throw new RuntimeException("No bean found for type: " + type.getName());
    }
    
    private void scanAndRegisterBeans(String... basePackages) {
        // Simulate component scanning - register known classes
        registerBean("userRepository", UserRepository.class, BeanScope.SINGLETON);
        registerBean("emailService", EmailService.class, BeanScope.SINGLETON);
        registerBean("smsService", SmsService.class, BeanScope.SINGLETON);
        registerBean("userService", UserService.class, BeanScope.SINGLETON);
        registerBean("orderService", OrderService.class, BeanScope.PROTOTYPE);
        registerBean("auditService", AuditService.class, BeanScope.SINGLETON);
    }
    
    private void registerBean(String name, Class<?> beanClass, String scope) {
        beanDefinitions.put(name, beanClass);
        beanScopes.put(name, scope);
    }
    
    private void initializeBeans() {
        for (String beanName : beanDefinitions.keySet()) {
            if (BeanScope.SINGLETON.equals(beanScopes.get(beanName))) {
                Class<?> beanClass = beanDefinitions.get(beanName);
                Object bean = createBean(beanName, beanClass);
                singletonBeans.put(beanName, bean);
            }
        }
    }
    
    @SuppressWarnings("unchecked")
    private <T> T createBean(String name, Class<T> beanClass) {
        try {
            // Find appropriate constructor
            Constructor<?>[] constructors = beanClass.getConstructors();
            Constructor<?> targetConstructor = findAutowiredConstructor(constructors);
            
            if (targetConstructor != null) {
                // Constructor injection
                Object[] args = resolveConstructorArguments(targetConstructor);
                T instance = (T) targetConstructor.newInstance(args);
                performFieldInjection(instance);
                return instance;
            } else {
                // Default constructor + field/setter injection
                T instance = beanClass.getDeclaredConstructor().newInstance();
                performFieldInjection(instance);
                performSetterInjection(instance);
                return instance;
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create bean: " + name, e);
        }
    }
    
    private Constructor<?> findAutowiredConstructor(Constructor<?>[] constructors) {
        for (Constructor<?> constructor : constructors) {
            if (constructor.isAnnotationPresent(Autowired.class)) {
                return constructor;
            }
        }
        return constructors.length == 1 && constructors[0].getParameterCount() > 0 ? 
               constructors[0] : null;
    }
    
    private Object[] resolveConstructorArguments(Constructor<?> constructor) {
        Class<?>[] paramTypes = constructor.getParameterTypes();
        Object[] args = new Object[paramTypes.length];
        
        for (int i = 0; i < paramTypes.length; i++) {
            args[i] = getBean(paramTypes[i]);
        }
        return args;
    }
    
    private void performFieldInjection(Object instance) {
        Field[] fields = instance.getClass().getDeclaredFields();
        for (Field field : fields) {
            if (field.isAnnotationPresent(Autowired.class)) {
                field.setAccessible(true);
                try {
                    Object dependency = getBean(field.getType());
                    field.set(instance, dependency);
                } catch (Exception e) {
                    throw new RuntimeException("Field injection failed", e);
                }
            }
        }
    }
    
    private void performSetterInjection(Object instance) {
        Method[] methods = instance.getClass().getDeclaredMethods();
        for (Method method : methods) {
            if (method.isAnnotationPresent(Autowired.class) && 
                method.getName().startsWith("set") && 
                method.getParameterCount() == 1) {
                try {
                    Object dependency = getBean(method.getParameterTypes()[0]);
                    method.invoke(instance, dependency);
                } catch (Exception e) {
                    throw new RuntimeException("Setter injection failed", e);
                }
            }
        }
    }
    
    private String findBeanNameByType(Class<?> type) {
        for (Map.Entry<String, Class<?>> entry : beanDefinitions.entrySet()) {
            if (type.isAssignableFrom(entry.getValue())) {
                return entry.getKey();
            }
        }
        return null;
    }
    
    public void printBeanInfo() {
        System.out.println("=== Bean Registry ===");
        beanDefinitions.forEach((name, type) -> {
            String scope = beanScopes.get(name);
            boolean isSingleton = singletonBeans.containsKey(name);
            System.out.printf("Bean: %s, Type: %s, Scope: %s, Instantiated: %b%n",
                name, type.getSimpleName(), scope, isSingleton);
        });
    }
}

// Domain models
class User {
    private String id;
    private String name;
    private String email;
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    
    @Override
    public String toString() {
        return String.format("User{id='%s', name='%s', email='%s'}", id, name, email);
    }
}

class Order {
    private String orderId;
    private String userId;
    private double amount;
    
    public Order(String orderId, String userId, double amount) {
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
    }
    
    public String getOrderId() { return orderId; }
    public String getUserId() { return userId; }
    public double getAmount() { return amount; }
    
    @Override
    public String toString() {
        return String.format("Order{id='%s', userId='%s', amount=%.2f}", orderId, userId, amount);
    }
}

// Repository layer
@Repository
class UserRepository {
    private final Map<String, User> users = new ConcurrentHashMap<>();
    
    public UserRepository() {
        // Initialize with sample data
        users.put("1", new User("1", "Alice", "alice@email.com"));
        users.put("2", new User("2", "Bob", "bob@email.com"));
        users.put("3", new User("3", "Charlie", "charlie@email.com"));
        System.out.println("UserRepository initialized with sample data");
    }
    
    public User findById(String id) {
        return users.get(id);
    }
    
    public User save(User user) {
        users.put(user.getId(), user);
        return user;
    }
    
    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }
}

// Service interfaces for dependency injection patterns
interface NotificationService {
    void sendNotification(String recipient, String message);
}

@Service
class EmailService implements NotificationService {
    public EmailService() {
        System.out.println("EmailService initialized");
    }
    
    @Override
    public void sendNotification(String recipient, String message) {
        System.out.printf("[EMAIL] To: %s, Message: %s%n", recipient, message);
    }
}

@Service  
class SmsService implements NotificationService {
    public SmsService() {
        System.out.println("SmsService initialized");
    }
    
    @Override
    public void sendNotification(String recipient, String message) {
        System.out.printf("[SMS] To: %s, Message: %s%n", recipient, message);
    }
}

// Service layer demonstrating different injection patterns
@Service
class UserService {
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    // Constructor injection (recommended)
    @Autowired
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.notificationService = emailService;
        System.out.println("UserService initialized with constructor injection");
    }
    
    public User createUser(String id, String name, String email) {
        User user = new User(id, name, email);
        User savedUser = userRepository.save(user);
        
        notificationService.sendNotification(email, 
            "Welcome " + name + "! Your account has been created.");
        
        return savedUser;
    }
    
    public User getUserById(String id) {
        return userRepository.findById(id);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

// Service with field injection (not recommended but commonly seen)
@Service
@Scope(BeanScope.PROTOTYPE) // New instance for each request
class OrderService {
    @Autowired
    private UserRepository userRepository;
    
    private NotificationService notificationService;
    
    public OrderService() {
        System.out.println("OrderService initialized (prototype scope)");
    }
    
    // Setter injection
    @Autowired
    public void setNotificationService(EmailService notificationService) {
        this.notificationService = notificationService;
        System.out.println("NotificationService set via setter injection");
    }
    
    public Order createOrder(String orderId, String userId, double amount) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found: " + userId);
        }
        
        Order order = new Order(orderId, userId, amount);
        
        notificationService.sendNotification(user.getEmail(),
            String.format("Order %s created for $%.2f", orderId, amount));
        
        return order;
    }
}

// Service demonstrating circular dependency resolution
@Service
class AuditService {
    private UserService userService;
    
    public AuditService() {
        System.out.println("AuditService initialized");
    }
    
    // Circular dependency - normally resolved by Spring proxy
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
    
    public void auditUserOperation(String operation, String userId) {
        System.out.printf("[AUDIT] Operation: %s, User: %s%n", operation, userId);
    }
}

public class Example_SpringCore {
    public static void main(String[] args) {
        System.out.println("=== Spring Core - IoC Container and Dependency Injection ===\n");
        
        // 1. APPLICATION CONTEXT INITIALIZATION
        System.out.println("1. Initializing Application Context:");
        SimpleApplicationContext context = new SimpleApplicationContext("com.example");
        
        // 2. BEAN INFORMATION
        System.out.println("\n2. Bean Registry Information:");
        context.printBeanInfo();
        
        // 3. DEPENDENCY INJECTION PATTERNS
        System.out.println("\n3. Dependency Injection Patterns:");
        demonstrateDependencyInjection(context);
        
        // 4. BEAN SCOPES
        System.out.println("\n4. Bean Scopes:");
        demonstrateBeanScopes(context);
        
        // 5. SERVICE LAYER INTERACTIONS
        System.out.println("\n5. Service Layer Interactions:");
        demonstrateServiceLayer(context);
        
        // 6. LIFECYCLE AND CLEANUP
        System.out.println("\n6. Lifecycle and Cleanup:");
        demonstrateLifecycle(context);
    }
    
    private static void demonstrateDependencyInjection(SimpleApplicationContext context) {
        System.out.println("--- Constructor Injection (UserService) ---");
        UserService userService = context.getBean(UserService.class);
        System.out.println("Retrieved UserService: " + userService.getClass().getSimpleName());
        
        System.out.println("\n--- Field + Setter Injection (OrderService) ---");
        OrderService orderService = context.getBean("orderService", OrderService.class);
        System.out.println("Retrieved OrderService: " + orderService.getClass().getSimpleName());
        
        System.out.println("\n--- Repository Injection ---");
        UserRepository userRepository = context.getBean(UserRepository.class);
        System.out.println("Retrieved UserRepository: " + userRepository.getClass().getSimpleName());
        System.out.println("Users in repository: " + userRepository.findAll().size());
    }
    
    private static void demonstrateBeanScopes(SimpleApplicationContext context) {
        System.out.println("--- Singleton Scope (UserService) ---");
        UserService userService1 = context.getBean(UserService.class);
        UserService userService2 = context.getBean(UserService.class);
        System.out.println("Same instance: " + (userService1 == userService2));
        System.out.println("UserService1 hash: " + System.identityHashCode(userService1));
        System.out.println("UserService2 hash: " + System.identityHashCode(userService2));
        
        System.out.println("\n--- Prototype Scope (OrderService) ---");
        OrderService orderService1 = context.getBean("orderService", OrderService.class);
        OrderService orderService2 = context.getBean("orderService", OrderService.class);
        System.out.println("Different instances: " + (orderService1 != orderService2));
        System.out.println("OrderService1 hash: " + System.identityHashCode(orderService1));
        System.out.println("OrderService2 hash: " + System.identityHashCode(orderService2));
    }
    
    private static void demonstrateServiceLayer(SimpleApplicationContext context) {
        System.out.println("--- User Management Operations ---");
        UserService userService = context.getBean(UserService.class);
        
        // Create new user
        User newUser = userService.createUser("4", "Diana", "diana@email.com");
        System.out.println("Created user: " + newUser);
        
        // Retrieve user
        User retrievedUser = userService.getUserById("1");
        System.out.println("Retrieved user: " + retrievedUser);
        
        // List all users
        List<User> allUsers = userService.getAllUsers();
        System.out.println("Total users: " + allUsers.size());
        
        System.out.println("\n--- Order Processing ---");
        OrderService orderService = context.getBean("orderService", OrderService.class);
        
        try {
            Order order = orderService.createOrder("ORD001", "1", 99.99);
            System.out.println("Created order: " + order);
        } catch (Exception e) {
            System.err.println("Order creation failed: " + e.getMessage());
        }
        
        // Try with non-existent user
        try {
            orderService.createOrder("ORD002", "999", 149.99);
        } catch (Exception e) {
            System.err.println("Expected failure: " + e.getMessage());
        }
    }
    
    private static void demonstrateLifecycle(SimpleApplicationContext context) {
        System.out.println("--- Bean Lifecycle Information ---");
        
        // Show initialization order
        System.out.println("Beans are initialized in dependency order:");
        System.out.println("1. Repository layer (no dependencies)");
        System.out.println("2. Service layer (depends on repository)");
        System.out.println("3. Cross-cutting concerns (AOP, security)");
        
        // Demonstrate notification services
        System.out.println("\n--- Notification Services ---");
        EmailService emailService = context.getBean(EmailService.class);
        SmsService smsService = context.getBean(SmsService.class);
        
        emailService.sendNotification("test@email.com", "Test email notification");
        smsService.sendNotification("123-456-7890", "Test SMS notification");
        
        // Audit service
        AuditService auditService = context.getBean(AuditService.class);
        auditService.auditUserOperation("CREATE_USER", "4");
        
        System.out.println("\n--- Context Information ---");
        System.out.println("Application context manages " + 
            "bean creation, dependency injection, and lifecycle");
        System.out.println("In real Spring applications:");
        System.out.println("- @ComponentScan finds beans automatically");
        System.out.println("- @Autowired performs dependency injection");  
        System.out.println("- @Configuration classes define beans");
        System.out.println("- ApplicationContext provides advanced features");
    }
}