/**
 * Spring MVC and Web Development
 * 
 * Key Points:
 * - Model-View-Controller architecture pattern
 * - Request mapping and handler methods
 * - Data binding and validation
 * - REST API development
 * - Exception handling
 * - Interceptors and filters
 */

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.lang.reflect.Method;
import java.lang.annotation.*;
import java.util.function.*;
import java.io.*;

// Custom annotations for MVC framework
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface Controller {
    String value() default "";
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface RestController {
    String value() default "";
}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface RequestMapping {
    String value() default "";
    RequestMethod method() default RequestMethod.GET;
}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface GetMapping {
    String value() default "";
}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface PostMapping {
    String value() default "";
}

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@interface PathVariable {
    String value() default "";
}

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@interface RequestParam {
    String value() default "";
    boolean required() default true;
    String defaultValue() default "";
}

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@interface RequestBody {
}

enum RequestMethod {
    GET, POST, PUT, DELETE, PATCH
}

// HTTP Request and Response simulation
class HttpRequest {
    private final String method;
    private final String uri;
    private final Map<String, String> headers;
    private final Map<String, String> parameters;
    private final String body;
    
    public HttpRequest(String method, String uri, Map<String, String> headers, 
                      Map<String, String> parameters, String body) {
        this.method = method;
        this.uri = uri;
        this.headers = headers != null ? new HashMap<>(headers) : new HashMap<>();
        this.parameters = parameters != null ? new HashMap<>(parameters) : new HashMap<>();
        this.body = body;
    }
    
    public String getMethod() { return method; }
    public String getUri() { return uri; }
    public Map<String, String> getHeaders() { return headers; }
    public Map<String, String> getParameters() { return parameters; }
    public String getBody() { return body; }
    
    public String getParameter(String name) {
        return parameters.get(name);
    }
    
    public String getHeader(String name) {
        return headers.get(name);
    }
}

class HttpResponse {
    private int status = 200;
    private final Map<String, String> headers = new HashMap<>();
    private String body = "";
    private String contentType = "text/plain";
    
    public HttpResponse status(int status) {
        this.status = status;
        return this;
    }
    
    public HttpResponse header(String name, String value) {
        headers.put(name, value);
        return this;
    }
    
    public HttpResponse body(String body) {
        this.body = body;
        return this;
    }
    
    public HttpResponse json(Object object) {
        this.body = JsonUtils.toJson(object);
        this.contentType = "application/json";
        return this;
    }
    
    public int getStatus() { return status; }
    public Map<String, String> getHeaders() { return headers; }
    public String getBody() { return body; }
    public String getContentType() { return contentType; }
    
    @Override
    public String toString() {
        return String.format("HTTP %d %s\nContent-Type: %s\n\n%s", 
            status, getStatusText(), contentType, body);
    }
    
    private String getStatusText() {
        switch (status) {
            case 200: return "OK";
            case 201: return "Created";
            case 400: return "Bad Request";
            case 404: return "Not Found";
            case 500: return "Internal Server Error";
            default: return "Unknown";
        }
    }
}

// Simple JSON utilities
class JsonUtils {
    public static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String) return "\"" + obj + "\"";
        if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
        if (obj instanceof Collection) {
            Collection<?> collection = (Collection<?>) obj;
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;
            for (Object item : collection) {
                if (!first) sb.append(",");
                sb.append(toJson(item));
                first = false;
            }
            sb.append("]");
            return sb.toString();
        }
        
        // Simple object serialization (for demo purposes)
        return obj.toString();
    }
    
    @SuppressWarnings("unchecked")
    public static <T> T fromJson(String json, Class<T> clazz) {
        // Simplified JSON deserialization (for demo purposes)
        if (clazz == String.class) {
            return (T) json.replace("\"", "");
        }
        return null;
    }
}

// Model classes
class User {
    private String id;
    private String name;
    private String email;
    private int age;
    
    public User() {}
    
    public User(String id, String name, String email, int age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    
    @Override
    public String toString() {
        return String.format("{\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"age\":%d}", 
            id, name, email, age);
    }
}

class Product {
    private String id;
    private String name;
    private double price;
    private String category;
    
    public Product() {}
    
    public Product(String id, String name, double price, String category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    @Override
    public String toString() {
        return String.format("{\"id\":\"%s\",\"name\":\"%s\",\"price\":%.2f,\"category\":\"%s\"}", 
            id, name, price, category);
    }
}

// Service layer
@Component
class UserService {
    private final Map<String, User> users = new ConcurrentHashMap<>();
    
    public UserService() {
        // Initialize with sample data
        createUser(new User("1", "Alice Johnson", "alice@email.com", 28));
        createUser(new User("2", "Bob Smith", "bob@email.com", 34));
        createUser(new User("3", "Carol Davis", "carol@email.com", 25));
    }
    
    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }
    
    public User findById(String id) {
        return users.get(id);
    }
    
    public User createUser(User user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID().toString());
        }
        users.put(user.getId(), user);
        return user;
    }
    
    public User updateUser(String id, User user) {
        if (users.containsKey(id)) {
            user.setId(id);
            users.put(id, user);
            return user;
        }
        return null;
    }
    
    public boolean deleteUser(String id) {
        return users.remove(id) != null;
    }
    
    public List<User> findByNameContaining(String name) {
        return users.values().stream()
            .filter(user -> user.getName().toLowerCase().contains(name.toLowerCase()))
            .collect(java.util.stream.Collectors.toList());
    }
}

@Component
class ProductService {
    private final Map<String, Product> products = new ConcurrentHashMap<>();
    
    public ProductService() {
        // Initialize with sample data
        createProduct(new Product("1", "Laptop", 999.99, "Electronics"));
        createProduct(new Product("2", "Book", 19.99, "Education"));
        createProduct(new Product("3", "Coffee Mug", 12.99, "Kitchen"));
    }
    
    public List<Product> findAll() {
        return new ArrayList<>(products.values());
    }
    
    public Product findById(String id) {
        return products.get(id);
    }
    
    public Product createProduct(Product product) {
        if (product.getId() == null) {
            product.setId(UUID.randomUUID().toString());
        }
        products.put(product.getId(), product);
        return product;
    }
    
    public List<Product> findByCategory(String category) {
        return products.values().stream()
            .filter(product -> product.getCategory().equalsIgnoreCase(category))
            .collect(java.util.stream.Collectors.toList());
    }
    
    public List<Product> findByPriceRange(double minPrice, double maxPrice) {
        return products.values().stream()
            .filter(product -> product.getPrice() >= minPrice && product.getPrice() <= maxPrice)
            .collect(java.util.stream.Collectors.toList());
    }
}

// Exception handling
class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}

// Controllers
@RestController
class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/users")
    public HttpResponse getAllUsers(@RequestParam(value = "name", required = false) String name) {
        try {
            List<User> users;
            if (name != null && !name.isEmpty()) {
                users = userService.findByNameContaining(name);
            } else {
                users = userService.findAll();
            }
            return new HttpResponse().json(users);
        } catch (Exception e) {
            return new HttpResponse().status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/users/{id}")
    public HttpResponse getUserById(@PathVariable String id) {
        try {
            User user = userService.findById(id);
            if (user == null) {
                return new HttpResponse().status(404).body("User not found with id: " + id);
            }
            return new HttpResponse().json(user);
        } catch (Exception e) {
            return new HttpResponse().status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/users")
    public HttpResponse createUser(@RequestBody User user) {
        try {
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                return new HttpResponse().status(400).body("User name is required");
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return new HttpResponse().status(400).body("User email is required");
            }
            
            User createdUser = userService.createUser(user);
            return new HttpResponse().status(201).json(createdUser);
        } catch (Exception e) {
            return new HttpResponse().status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}

@RestController
class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping("/products")
    public HttpResponse getAllProducts(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "minPrice", required = false, defaultValue = "0") String minPriceStr,
            @RequestParam(value = "maxPrice", required = false, defaultValue = "999999") String maxPriceStr) {
        
        try {
            double minPrice = Double.parseDouble(minPriceStr);
            double maxPrice = Double.parseDouble(maxPriceStr);
            
            List<Product> products;
            if (category != null && !category.isEmpty()) {
                products = productService.findByCategory(category);
            } else {
                products = productService.findByPriceRange(minPrice, maxPrice);
            }
            
            return new HttpResponse().json(products);
        } catch (NumberFormatException e) {
            return new HttpResponse().status(400).body("Invalid price format");
        } catch (Exception e) {
            return new HttpResponse().status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/products/{id}")
    public HttpResponse getProductById(@PathVariable String id) {
        try {
            Product product = productService.findById(id);
            if (product == null) {
                return new HttpResponse().status(404).body("Product not found with id: " + id);
            }
            return new HttpResponse().json(product);
        } catch (Exception e) {
            return new HttpResponse().status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/products")
    public HttpResponse createProduct(@RequestBody Product product) {
        try {
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return new HttpResponse().status(400).body("Product name is required");
            }
            if (product.getPrice() <= 0) {
                return new HttpResponse().status(400).body("Product price must be greater than 0");
            }
            
            Product createdProduct = productService.createProduct(product);
            return new HttpResponse().status(201).json(createdProduct);
        } catch (Exception e) {
            return new HttpResponse().status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}

// Simplified MVC Framework
class HandlerMapping {
    private final Map<String, HandlerMethod> mappings = new HashMap<>();
    
    public void register(String pattern, Object controller, Method method) {
        mappings.put(pattern, new HandlerMethod(controller, method));
    }
    
    public HandlerMethod getHandler(String uri) {
        // Simple exact match (in real Spring, this would be more sophisticated)
        return mappings.get(uri);
    }
    
    public void printMappings() {
        System.out.println("=== Request Mappings ===");
        mappings.forEach((pattern, handler) -> {
            System.out.printf("  %-30s -> %s.%s()%n", 
                pattern, 
                handler.getController().getClass().getSimpleName(),
                handler.getMethod().getName());
        });
    }
    
    private static class HandlerMethod {
        private final Object controller;
        private final Method method;
        
        public HandlerMethod(Object controller, Method method) {
            this.controller = controller;
            this.method = method;
        }
        
        public Object getController() { return controller; }
        public Method getMethod() { return method; }
    }
}

class DispatcherServlet {
    private final HandlerMapping handlerMapping = new HandlerMapping();
    private final Map<Class<?>, Object> controllers = new HashMap<>();
    
    public void registerController(Object controller) {
        Class<?> controllerClass = controller.getClass();
        controllers.put(controllerClass, controller);
        
        // Process controller methods
        Method[] methods = controllerClass.getDeclaredMethods();
        for (Method method : methods) {
            String mapping = extractMapping(method);
            if (mapping != null) {
                handlerMapping.register(mapping, controller, method);
                System.out.printf("[DISPATCHER] Mapped %s -> %s.%s()%n", 
                    mapping, controllerClass.getSimpleName(), method.getName());
            }
        }
    }
    
    private String extractMapping(Method method) {
        GetMapping getMapping = method.getAnnotation(GetMapping.class);
        if (getMapping != null) {
            return getMapping.value();
        }
        
        PostMapping postMapping = method.getAnnotation(PostMapping.class);
        if (postMapping != null) {
            return postMapping.value();
        }
        
        RequestMapping requestMapping = method.getAnnotation(RequestMapping.class);
        if (requestMapping != null) {
            return requestMapping.value();
        }
        
        return null;
    }
    
    public HttpResponse handleRequest(HttpRequest request) {
        System.out.printf("\n[DISPATCHER] %s %s%n", request.getMethod(), request.getUri());
        
        HandlerMapping.HandlerMethod handler = handlerMapping.getHandler(request.getUri());
        if (handler == null) {
            return new HttpResponse().status(404).body("No mapping found for " + request.getUri());
        }
        
        try {
            // Simplified parameter resolution and method invocation
            Object result = invokeHandlerMethod(handler, request);
            
            if (result instanceof HttpResponse) {
                return (HttpResponse) result;
            } else {
                return new HttpResponse().json(result);
            }
        } catch (Exception e) {
            System.err.printf("[DISPATCHER] Error handling request: %s%n", e.getMessage());
            return new HttpResponse().status(500).body("Internal Server Error");
        }
    }
    
    private Object invokeHandlerMethod(HandlerMapping.HandlerMethod handler, HttpRequest request) 
            throws Exception {
        Method method = handler.getMethod();
        Object controller = handler.getController();
        
        // Simplified parameter resolution
        Class<?>[] paramTypes = method.getParameterTypes();
        Object[] args = new Object[paramTypes.length];
        
        for (int i = 0; i < paramTypes.length; i++) {
            if (paramTypes[i] == String.class) {
                // Handle path variables and request parameters
                args[i] = extractPathVariable(request.getUri(), method, i);
                if (args[i] == null) {
                    args[i] = extractRequestParam(request, method, i);
                }
            } else if (paramTypes[i] == User.class) {
                args[i] = parseRequestBody(request.getBody(), User.class);
            } else if (paramTypes[i] == Product.class) {
                args[i] = parseRequestBody(request.getBody(), Product.class);
            }
        }
        
        return method.invoke(controller, args);
    }
    
    private String extractPathVariable(String uri, Method method, int paramIndex) {
        // Simplified path variable extraction
        if (uri.contains("/users/") && !uri.endsWith("/users")) {
            return uri.substring(uri.lastIndexOf("/") + 1);
        }
        if (uri.contains("/products/") && !uri.endsWith("/products")) {
            return uri.substring(uri.lastIndexOf("/") + 1);
        }
        return null;
    }
    
    private String extractRequestParam(HttpRequest request, Method method, int paramIndex) {
        // Simplified request parameter extraction
        return request.getParameter("name");
    }
    
    private <T> T parseRequestBody(String body, Class<T> clazz) {
        // Simplified JSON parsing
        if (clazz == User.class && body != null) {
            // This is a very simplified parser for demo purposes
            User user = new User();
            user.setName("John Doe");
            user.setEmail("john@email.com");
            user.setAge(30);
            return clazz.cast(user);
        } else if (clazz == Product.class && body != null) {
            Product product = new Product();
            product.setName("New Product");
            product.setPrice(99.99);
            product.setCategory("General");
            return clazz.cast(product);
        }
        return null;
    }
    
    public void printMappings() {
        handlerMapping.printMappings();
    }
}

public class Example_SpringMVC {
    public static void main(String[] args) {
        System.out.println("=== Spring MVC Framework ===\n");
        
        // 1. INITIALIZE SPRING CONTEXT
        System.out.println("1. Initializing Spring MVC Context:");
        SimpleApplicationContext context = initializeSpringContext();
        
        // 2. SETUP MVC FRAMEWORK
        System.out.println("\n2. Setting up MVC Framework:");
        DispatcherServlet dispatcher = setupMvcFramework(context);
        
        // 3. DEMONSTRATE REQUEST HANDLING
        System.out.println("\n3. Handling HTTP Requests:");
        demonstrateRequestHandling(dispatcher);
        
        // 4. DEMONSTRATE REST API
        System.out.println("\n4. REST API Demonstration:");
        demonstrateRestApi(dispatcher);
        
        System.out.println("\n=== Summary ===");
        printMvcSummary();
    }
    
    private static SimpleApplicationContext initializeSpringContext() {
        SimpleApplicationContext context = new SimpleApplicationContext();
        
        // Register services
        context.registerBean("userService", new UserService());
        context.registerBean("productService", new ProductService());
        
        System.out.println("Spring context initialized with services");
        return context;
    }
    
    private static DispatcherServlet setupMvcFramework(SimpleApplicationContext context) {
        DispatcherServlet dispatcher = new DispatcherServlet();
        
        // Create and register controllers
        UserController userController = new UserController();
        ProductController productController = new ProductController();
        
        // Inject dependencies (simplified)
        injectDependencies(userController, context);
        injectDependencies(productController, context);
        
        // Register controllers
        dispatcher.registerController(userController);
        dispatcher.registerController(productController);
        
        System.out.println("\nRequest mappings:");
        dispatcher.printMappings();
        
        return dispatcher;
    }
    
    private static void injectDependencies(Object controller, SimpleApplicationContext context) {
        // Simplified dependency injection
        if (controller instanceof UserController) {
            UserController userController = (UserController) controller;
            userController.userService = (UserService) context.getBean("userService");
        } else if (controller instanceof ProductController) {
            ProductController productController = (ProductController) controller;
            productController.productService = (ProductService) context.getBean("productService");
        }
    }
    
    private static void demonstrateRequestHandling(DispatcherServlet dispatcher) {
        // GET /users
        HttpRequest getAllUsersRequest = new HttpRequest("GET", "/users", null, null, null);
        HttpResponse response1 = dispatcher.handleRequest(getAllUsersRequest);
        System.out.printf("Response: %s%n", response1);
        
        // GET /users/1
        HttpRequest getUserRequest = new HttpRequest("GET", "/users/1", null, null, null);
        HttpResponse response2 = dispatcher.handleRequest(getUserRequest);
        System.out.printf("Response: %s%n", response2);
        
        // GET /users?name=alice
        Map<String, String> params = new HashMap<>();
        params.put("name", "alice");
        HttpRequest searchUsersRequest = new HttpRequest("GET", "/users", null, params, null);
        HttpResponse response3 = dispatcher.handleRequest(searchUsersRequest);
        System.out.printf("Response: %s%n", response3);
    }
    
    private static void demonstrateRestApi(DispatcherServlet dispatcher) {
        // GET /products
        HttpRequest getAllProductsRequest = new HttpRequest("GET", "/products", null, null, null);
        HttpResponse response1 = dispatcher.handleRequest(getAllProductsRequest);
        System.out.printf("Response: %s%n", response1);
        
        // GET /products?category=Electronics
        Map<String, String> params = new HashMap<>();
        params.put("category", "Electronics");
        HttpRequest getProductsByCategoryRequest = new HttpRequest("GET", "/products", null, params, null);
        HttpResponse response2 = dispatcher.handleRequest(getProductsByCategoryRequest);
        System.out.printf("Response: %s%n", response2);
        
        // POST /users
        String userJson = "{\"name\":\"New User\",\"email\":\"newuser@email.com\",\"age\":25}";
        HttpRequest createUserRequest = new HttpRequest("POST", "/users", null, null, userJson);
        HttpResponse response3 = dispatcher.handleRequest(createUserRequest);
        System.out.printf("Response: %s%n", response3);
        
        // POST /products
        String productJson = "{\"name\":\"New Product\",\"price\":49.99,\"category\":\"Electronics\"}";
        HttpRequest createProductRequest = new HttpRequest("POST", "/products", null, null, productJson);
        HttpResponse response4 = dispatcher.handleRequest(createProductRequest);
        System.out.printf("Response: %s%n", response4);
    }
    
    private static void printMvcSummary() {
        System.out.println("Spring MVC Key Concepts:");
        System.out.println("1. DispatcherServlet - Front controller pattern");
        System.out.println("2. Controllers - Handle HTTP requests");
        System.out.println("3. Request Mapping - Map URLs to handler methods");
        System.out.println("4. Model Binding - Automatic parameter binding");
        System.out.println("5. View Resolution - Render responses");
        System.out.println("6. Exception Handling - Centralized error handling");
        System.out.println("7. Interceptors - Cross-cutting concerns");
        System.out.println("8. Validation - Input validation framework");
        
        System.out.println("\nBest Practices:");
        System.out.println("- Use @RestController for REST APIs");
        System.out.println("- Implement proper exception handling");
        System.out.println("- Validate input parameters");
        System.out.println("- Use ResponseEntity for detailed responses");
        System.out.println("- Implement HATEOAS for RESTful services");
        System.out.println("- Use proper HTTP status codes");
    }
}