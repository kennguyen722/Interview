/**
 * Prompt 201: Exception Hierarchy and Custom Exceptions
 * 
 * Key Points:
 * - Exception hierarchy: Throwable -> Error/Exception -> RuntimeException
 * - Checked exceptions must be declared or handled
 * - Unchecked exceptions (RuntimeException) don't need declaration
 * - Custom exceptions should extend appropriate base classes
 * - Include meaningful messages and context in exceptions
 */

import java.io.*;
import java.util.*;

// Custom checked exceptions
class InvalidUserDataException extends Exception {
    private final String field;
    private final Object invalidValue;
    
    public InvalidUserDataException(String field, Object invalidValue) {
        super(String.format("Invalid data in field '%s': %s", field, invalidValue));
        this.field = field;
        this.invalidValue = invalidValue;
    }
    
    public InvalidUserDataException(String field, Object invalidValue, Throwable cause) {
        super(String.format("Invalid data in field '%s': %s", field, invalidValue), cause);
        this.field = field;
        this.invalidValue = invalidValue;
    }
    
    public String getField() { return field; }
    public Object getInvalidValue() { return invalidValue; }
}

class UserNotFoundException extends Exception {
    private final String userId;
    
    public UserNotFoundException(String userId) {
        super("User not found: " + userId);
        this.userId = userId;
    }
    
    public UserNotFoundException(String userId, Throwable cause) {
        super("User not found: " + userId, cause);
        this.userId = userId;
    }
    
    public String getUserId() { return userId; }
}

// Custom unchecked exceptions
class InvalidConfigurationException extends RuntimeException {
    private final String configKey;
    
    public InvalidConfigurationException(String configKey, String message) {
        super(String.format("Invalid configuration for key '%s': %s", configKey, message));
        this.configKey = configKey;
    }
    
    public InvalidConfigurationException(String configKey, String message, Throwable cause) {
        super(String.format("Invalid configuration for key '%s': %s", configKey, message), cause);
        this.configKey = configKey;
    }
    
    public String getConfigKey() { return configKey; }
}

class InsufficientFundsException extends RuntimeException {
    private final double availableAmount;
    private final double requestedAmount;
    
    public InsufficientFundsException(double availableAmount, double requestedAmount) {
        super(String.format("Insufficient funds: available=%.2f, requested=%.2f", 
            availableAmount, requestedAmount));
        this.availableAmount = availableAmount;
        this.requestedAmount = requestedAmount;
    }
    
    public double getAvailableAmount() { return availableAmount; }
    public double getRequestedAmount() { return requestedAmount; }
}

// Domain classes
class User {
    private String id;
    private String name;
    private String email;
    private int age;
    
    public User(String id, String name, String email, int age) throws InvalidUserDataException {
        validateId(id);
        validateName(name);
        validateEmail(email);
        validateAge(age);
        
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    private void validateId(String id) throws InvalidUserDataException {
        if (id == null || id.trim().isEmpty()) {
            throw new InvalidUserDataException("id", id);
        }
    }
    
    private void validateName(String name) throws InvalidUserDataException {
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidUserDataException("name", name);
        }
        if (name.length() < 2) {
            throw new InvalidUserDataException("name", "Name too short: " + name);
        }
    }
    
    private void validateEmail(String email) throws InvalidUserDataException {
        if (email == null || !email.contains("@") || !email.contains(".")) {
            throw new InvalidUserDataException("email", email);
        }
    }
    
    private void validateAge(int age) throws InvalidUserDataException {
        if (age < 0 || age > 150) {
            throw new InvalidUserDataException("age", age);
        }
    }
    
    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getAge() { return age; }
    
    @Override
    public String toString() {
        return String.format("User{id='%s', name='%s', email='%s', age=%d}", 
            id, name, email, age);
    }
}

class BankAccount {
    private String accountNumber;
    private double balance;
    
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(balance, amount);
        }
        balance -= amount;
    }
    
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive: " + amount);
        }
        balance += amount;
    }
    
    public double getBalance() { return balance; }
    public String getAccountNumber() { return accountNumber; }
    
    @Override
    public String toString() {
        return String.format("BankAccount{number='%s', balance=%.2f}", accountNumber, balance);
    }
}

// Service classes demonstrating exception handling
class UserService {
    private Map<String, User> users = new HashMap<>();
    
    public void createUser(String id, String name, String email, int age) 
            throws InvalidUserDataException {
        try {
            User user = new User(id, name, email, age);
            users.put(id, user);
            System.out.println("Created user: " + user);
        } catch (InvalidUserDataException e) {
            System.err.println("Failed to create user: " + e.getMessage());
            throw e; // Re-throw to caller
        }
    }
    
    public User getUser(String id) throws UserNotFoundException {
        User user = users.get(id);
        if (user == null) {
            throw new UserNotFoundException(id);
        }
        return user;
    }
    
    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }
}

class ConfigurationManager {
    private Map<String, String> config = new HashMap<>();
    
    public ConfigurationManager() {
        // Initialize with some default configuration
        config.put("database.url", "jdbc:postgresql://localhost:5432/mydb");
        config.put("server.port", "8080");
        config.put("max.connections", "100");
    }
    
    public String getStringProperty(String key) throws InvalidConfigurationException {
        String value = config.get(key);
        if (value == null) {
            throw new InvalidConfigurationException(key, "Property not found");
        }
        return value;
    }
    
    public int getIntProperty(String key) throws InvalidConfigurationException {
        String value = getStringProperty(key);
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            throw new InvalidConfigurationException(key, "Not a valid integer: " + value, e);
        }
    }
    
    public void setProperty(String key, String value) {
        if (key == null || key.trim().isEmpty()) {
            throw new IllegalArgumentException("Configuration key cannot be null or empty");
        }
        config.put(key, value);
    }
}

public class Example_Prompt201_ExceptionHierarchy {
    public static void main(String[] args) {
        System.out.println("=== Exception Hierarchy and Custom Exceptions ===\n");
        
        // 1. EXCEPTION HIERARCHY OVERVIEW
        System.out.println("1. Exception Hierarchy Overview:");
        exceptionHierarchyDemo();
        
        // 2. CHECKED EXCEPTIONS
        System.out.println("\n2. Checked Exceptions:");
        checkedExceptionsDemo();
        
        // 3. UNCHECKED EXCEPTIONS
        System.out.println("\n3. Unchecked Exceptions:");
        uncheckedExceptionsDemo();
        
        // 4. CUSTOM EXCEPTION DESIGN
        System.out.println("\n4. Custom Exception Design:");
        customExceptionDesign();
        
        // 5. EXCEPTION HANDLING STRATEGIES
        System.out.println("\n5. Exception Handling Strategies:");
        exceptionHandlingStrategies();
        
        // 6. BEST PRACTICES
        System.out.println("\n6. Best Practices:");
        bestPractices();
    }
    
    private static void exceptionHierarchyDemo() {
        System.out.println("Java Exception Hierarchy:");
        System.out.println("Throwable");
        System.out.println("├── Error (unchecked)");
        System.out.println("│   ├── OutOfMemoryError");
        System.out.println("│   ├── StackOverflowError");
        System.out.println("│   └── VirtualMachineError");
        System.out.println("└── Exception");
        System.out.println("    ├── Checked Exceptions");
        System.out.println("    │   ├── IOException");
        System.out.println("    │   ├── SQLException");
        System.out.println("    │   └── ClassNotFoundException");
        System.out.println("    └── RuntimeException (unchecked)");
        System.out.println("        ├── NullPointerException");
        System.out.println("        ├── IllegalArgumentException");
        System.out.println("        └── IndexOutOfBoundsException");
        
        // Demonstrate different exception types
        try {
            demonstrateExceptionTypes();
        } catch (Exception e) {
            System.out.println("Caught exception in demo: " + e.getClass().getSimpleName());
        }
    }
    
    private static void checkedExceptionsDemo() {
        UserService userService = new UserService();
        
        System.out.println("--- Creating valid users ---");
        try {
            userService.createUser("1", "Alice", "alice@email.com", 30);
            userService.createUser("2", "Bob", "bob@email.com", 25);
            System.out.println("Successfully created users");
        } catch (InvalidUserDataException e) {
            System.err.println("User creation failed: " + e.getMessage());
            System.err.println("Failed field: " + e.getField());
            System.err.println("Invalid value: " + e.getInvalidValue());
        }
        
        System.out.println("\n--- Creating invalid users ---");
        try {
            userService.createUser("3", "", "invalid-email", -5);
        } catch (InvalidUserDataException e) {
            System.err.println("Expected failure: " + e.getMessage());
            System.err.println("Failed field: " + e.getField());
        }
        
        System.out.println("\n--- Looking up users ---");
        try {
            User user = userService.getUser("1");
            System.out.println("Found user: " + user);
        } catch (UserNotFoundException e) {
            System.err.println("User lookup failed: " + e.getMessage());
        }
        
        try {
            User user = userService.getUser("999");
            System.out.println("Found user: " + user);
        } catch (UserNotFoundException e) {
            System.err.println("Expected failure: " + e.getMessage());
            System.err.println("User ID: " + e.getUserId());
        }
    }
    
    private static void uncheckedExceptionsDemo() {
        BankAccount account = new BankAccount("123-456-789", 1000.0);
        System.out.println("Initial account: " + account);
        
        System.out.println("\n--- Valid operations ---");
        try {
            account.deposit(500.0);
            System.out.println("After deposit: " + account);
            
            account.withdraw(200.0);
            System.out.println("After withdrawal: " + account);
        } catch (RuntimeException e) {
            System.err.println("Unexpected error: " + e.getMessage());
        }
        
        System.out.println("\n--- Invalid operations ---");
        try {
            account.deposit(-100.0); // IllegalArgumentException
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid deposit: " + e.getMessage());
        }
        
        try {
            account.withdraw(2000.0); // InsufficientFundsException
        } catch (InsufficientFundsException e) {
            System.err.println("Withdrawal failed: " + e.getMessage());
            System.err.printf("Available: %.2f, Requested: %.2f%n", 
                e.getAvailableAmount(), e.getRequestedAmount());
        }
        
        // Configuration exceptions
        ConfigurationManager config = new ConfigurationManager();
        System.out.println("\n--- Configuration access ---");
        try {
            int port = config.getIntProperty("server.port");
            System.out.println("Server port: " + port);
        } catch (InvalidConfigurationException e) {
            System.err.println("Config error: " + e.getMessage());
            System.err.println("Config key: " + e.getConfigKey());
        }
        
        try {
            config.setProperty("invalid.number", "not-a-number");
            int value = config.getIntProperty("invalid.number");
        } catch (InvalidConfigurationException e) {
            System.err.println("Expected config error: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Root cause: " + e.getCause().getClass().getSimpleName());
            }
        }
    }
    
    private static void customExceptionDesign() {
        System.out.println("Custom Exception Design Principles:");
        System.out.println("1. Extend appropriate base class (Exception vs RuntimeException)");
        System.out.println("2. Include meaningful error messages");
        System.out.println("3. Provide context-specific fields");
        System.out.println("4. Support exception chaining with causes");
        System.out.println("5. Follow naming conventions (XxxException)");
        
        // Demonstrate exception chaining
        try {
            performOperationWithChaining();
        } catch (InvalidUserDataException e) {
            System.err.println("\nCaught chained exception: " + e.getMessage());
            System.err.println("Root cause: " + getRootCause(e).getClass().getSimpleName());
            printExceptionChain(e);
        }
    }
    
    private static void exceptionHandlingStrategies() {
        System.out.println("Exception Handling Strategies:");
        
        // 1. Catch and handle
        System.out.println("\n1. Catch and Handle:");
        try {
            riskyOperation(0.1);
        } catch (Exception e) {
            System.out.println("Handled exception gracefully: " + e.getMessage());
            // Provide fallback behavior
            System.out.println("Using default behavior instead");
        }
        
        // 2. Catch, log, and re-throw
        System.out.println("\n2. Catch, Log, and Re-throw:");
        try {
            catchLogAndRethrow();
        } catch (RuntimeException e) {
            System.out.println("Final handler: " + e.getMessage());
        }
        
        // 3. Exception translation
        System.out.println("\n3. Exception Translation:");
        try {
            performDatabaseOperation();
        } catch (UserNotFoundException e) {
            System.out.println("Translated exception: " + e.getMessage());
        }
        
        // 4. Multiple catch blocks
        System.out.println("\n4. Multiple Catch Blocks:");
        handleMultipleExceptions();
    }
    
    private static void bestPractices() {
        System.out.println("Exception Handling Best Practices:");
        
        System.out.println("\n1. Be specific with exception types");
        System.out.println("2. Include context in exception messages");
        System.out.println("3. Don't ignore exceptions (avoid empty catch blocks)");
        System.out.println("4. Use exception chaining to preserve stack traces");
        System.out.println("5. Fail fast - validate early and throw immediately");
        System.out.println("6. Document exceptions in method signatures and JavaDoc");
        System.out.println("7. Use unchecked exceptions for programming errors");
        System.out.println("8. Use checked exceptions for recoverable conditions");
        
        // Demonstrate good vs bad practices
        System.out.println("\n--- Good Practice Examples ---");
        goodPracticeExamples();
        
        System.out.println("\n--- Common Anti-patterns to Avoid ---");
        System.out.println("❌ catch (Exception e) {} // Empty catch block");
        System.out.println("❌ catch (Exception e) { e.printStackTrace(); } // Just printing");
        System.out.println("❌ throw new Exception(\"Error\"); // Generic message");
        System.out.println("❌ Catching exceptions too broadly");
        System.out.println("✅ Specific exception types with meaningful messages");
        System.out.println("✅ Proper exception chaining and context");
        System.out.println("✅ Appropriate logging and recovery strategies");
    }
    
    // Helper methods
    private static void demonstrateExceptionTypes() throws IOException {
        // This method demonstrates different types of exceptions
        // but is designed not to actually throw them in our demo
        
        System.out.println("Demonstrating exception types (safely):");
        System.out.println("- Checked: IOException, SQLException, ClassNotFoundException");
        System.out.println("- Unchecked: NullPointerException, IllegalArgumentException");
        System.out.println("- Errors: OutOfMemoryError, StackOverflowError");
    }
    
    private static void performOperationWithChaining() throws InvalidUserDataException {
        try {
            // Simulate a nested operation that fails
            throw new NumberFormatException("Invalid number format");
        } catch (NumberFormatException e) {
            throw new InvalidUserDataException("age", "invalid", e);
        }
    }
    
    private static Throwable getRootCause(Throwable throwable) {
        while (throwable.getCause() != null) {
            throwable = throwable.getCause();
        }
        return throwable;
    }
    
    private static void printExceptionChain(Throwable throwable) {
        System.out.println("Exception chain:");
        int level = 0;
        while (throwable != null) {
            String indent = "  ".repeat(level);
            System.out.printf("%s%d. %s: %s%n", 
                indent, level + 1, throwable.getClass().getSimpleName(), throwable.getMessage());
            throwable = throwable.getCause();
            level++;
        }
    }
    
    private static void riskyOperation(double probability) {
        if (Math.random() < probability) {
            throw new RuntimeException("Random failure occurred");
        }
        System.out.println("Operation completed successfully");
    }
    
    private static void catchLogAndRethrow() {
        try {
            throw new IllegalStateException("Something went wrong");
        } catch (IllegalStateException e) {
            System.err.println("Logging error: " + e.getMessage());
            // In real code, use proper logging framework
            throw new RuntimeException("Operation failed", e);
        }
    }
    
    private static void performDatabaseOperation() throws UserNotFoundException {
        try {
            // Simulate database exception
            throw new SQLException("Connection timeout", "08001", 0);
        } catch (SQLException e) {
            // Translate database exception to domain exception
            throw new UserNotFoundException("user123", e);
        }
    }
    
    private static void handleMultipleExceptions() {
        try {
            int choice = (int) (Math.random() * 3);
            switch (choice) {
                case 0:
                    throw new IllegalArgumentException("Invalid argument");
                case 1:
                    throw new IllegalStateException("Invalid state");
                case 2:
                    throw new UnsupportedOperationException("Not supported");
                default:
                    System.out.println("No exception");
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Handled argument exception: " + e.getMessage());
        } catch (IllegalStateException e) {
            System.out.println("Handled state exception: " + e.getMessage());
        } catch (RuntimeException e) {
            System.out.println("Handled other runtime exception: " + e.getMessage());
        }
    }
    
    private static void goodPracticeExamples() {
        // Good: Specific validation with meaningful messages
        try {
            validateInput(null);
        } catch (IllegalArgumentException e) {
            System.out.println("✅ Specific validation: " + e.getMessage());
        }
        
        // Good: Resource cleanup with proper exception handling
        try {
            processFileWithProperCleanup("nonexistent.txt");
        } catch (IOException e) {
            System.out.println("✅ Proper file handling: " + e.getMessage());
        }
        
        // Good: Exception with context
        try {
            processUserData("", "invalid-email");
        } catch (InvalidUserDataException e) {
            System.out.printf("✅ Contextual exception - Field: %s, Value: %s%n", 
                e.getField(), e.getInvalidValue());
        }
    }
    
    private static void validateInput(String input) {
        if (input == null) {
            throw new IllegalArgumentException("Input parameter 'input' cannot be null");
        }
        if (input.trim().isEmpty()) {
            throw new IllegalArgumentException("Input parameter 'input' cannot be empty");
        }
    }
    
    private static void processFileWithProperCleanup(String filename) throws IOException {
        FileInputStream fis = null;
        try {
            fis = new FileInputStream(filename);
            // Process file
        } catch (FileNotFoundException e) {
            throw new IOException("File not found: " + filename, e);
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) {
                    System.err.println("Warning: Failed to close file: " + e.getMessage());
                }
            }
        }
    }
    
    private static void processUserData(String name, String email) throws InvalidUserDataException {
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidUserDataException("name", name);
        }
        if (email == null || !email.contains("@")) {
            throw new InvalidUserDataException("email", email);
        }
    }
    
    // Simulate SQLException (not available in this minimal example)
    static class SQLException extends Exception {
        private String sqlState;
        private int errorCode;
        
        public SQLException(String message, String sqlState, int errorCode) {
            super(message);
            this.sqlState = sqlState;
            this.errorCode = errorCode;
        }
        
        public String getSQLState() { return sqlState; }
        public int getErrorCode() { return errorCode; }
    }
}