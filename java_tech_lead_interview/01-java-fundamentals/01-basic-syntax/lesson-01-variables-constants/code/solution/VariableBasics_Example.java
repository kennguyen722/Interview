/**
 * Comprehensive example demonstrating variable and constant best practices
 * This example shows proper usage patterns for enterprise Java development
 * 
 * Key concepts demonstrated:
 * - Variable naming conventions
 * - Scope management
 * - Constant declarations
 * - Memory efficiency
 * - Thread safety considerations
 * 
 * @author Course Examples
 * @version 1.0
 */
public class VariableBasics_Example {
    
    // =============================================================================
    // CLASS-LEVEL CONSTANTS (Static Final)
    // =============================================================================
    
    /** Application name - immutable across all instances */
    public static final String APPLICATION_NAME = "Java Tech Lead Course";
    
    /** Maximum number of retries for operations */
    public static final int MAX_RETRIES = 3;
    
    /** Default timeout in milliseconds */
    public static final long DEFAULT_TIMEOUT_MS = 30_000L;
    
    /** Valid user roles using unmodifiable collection */
    public static final java.util.Set<String> VALID_ROLES = 
        java.util.Collections.unmodifiableSet(new java.util.HashSet<>(
            java.util.Arrays.asList("ADMIN", "USER", "GUEST")));
    
    // =============================================================================
    // CLASS VARIABLES (Static)
    // =============================================================================
    
    /** Counter for tracking total instances created */
    private static int instanceCount = 0;
    
    /** Shared configuration that can be updated at runtime */
    private static volatile boolean debugMode = false;
    
    // =============================================================================
    // INSTANCE CONSTANTS (Final)
    // =============================================================================
    
    /** Unique instance identifier - set once in constructor */
    private final int instanceId;
    
    /** Creation timestamp - immutable after object creation */
    private final java.time.LocalDateTime createdAt;
    
    // =============================================================================
    // INSTANCE VARIABLES
    // =============================================================================
    
    /** User name - mutable but validated */
    private String userName;
    
    /** User role - constrained to valid values */
    private String userRole;
    
    /** Login attempt counter - reset on successful login */
    private int loginAttempts;
    
    /** Last login time - updated on each successful login */
    private java.time.LocalDateTime lastLoginTime;
    
    // =============================================================================
    // CONSTRUCTORS
    // =============================================================================
    
    /**
     * Creates new instance with validated parameters
     * Demonstrates proper constructor variable handling
     * 
     * @param userName User name (cannot be null or empty)
     * @param userRole User role (must be in VALID_ROLES)
     * @throws IllegalArgumentException if parameters are invalid
     */
    public VariableBasics_Example(String userName, String userRole) {
        // Input validation using local variables for clarity
        final String cleanedUserName = validateAndCleanUserName(userName);
        final String validatedRole = validateUserRole(userRole);
        
        // Initialize instance constants (can only be set once)
        this.instanceId = ++instanceCount; // Atomic increment and assignment
        this.createdAt = java.time.LocalDateTime.now();
        
        // Initialize mutable instance variables
        this.userName = cleanedUserName;
        this.userRole = validatedRole;
        this.loginAttempts = 0;
        this.lastLoginTime = null; // Will be set on first login
        
        // Log creation if debug mode is enabled
        if (debugMode) {
            System.out.printf("Created instance %d for user: %s%n", 
                            instanceId, userName);
        }
    }
    
    // =============================================================================
    // PUBLIC METHODS (Demonstrating Local Variable Usage)
    // =============================================================================
    
    /**
     * Simulates user login with proper variable scope management
     * Demonstrates local variable usage and error handling
     * 
     * @param password Password to validate
     * @return true if login successful, false otherwise
     */
    public boolean login(String password) {
        // Method-level constants for configuration
        final int maxAllowedAttempts = 5;
        final long loginTimeoutMs = 1000L;
        
        // Local variables for processing
        boolean loginSuccessful = false;
        final java.time.LocalDateTime attemptTime = java.time.LocalDateTime.now();
        
        try {
            // Simulate password validation (local processing variables)
            final boolean isPasswordValid = validatePassword(password);
            final boolean isAccountLocked = loginAttempts >= maxAllowedAttempts;
            
            if (isAccountLocked) {
                System.out.println("Account locked due to too many failed attempts");
                return false;
            }
            
            if (isPasswordValid) {
                // Successful login - update instance state
                loginSuccessful = true;
                this.loginAttempts = 0; // Reset counter
                this.lastLoginTime = attemptTime;
                
                System.out.printf("Login successful for user: %s at %s%n", 
                                userName, attemptTime);
            } else {
                // Failed login - increment counter
                this.loginAttempts++;
                
                // Local variable for remaining attempts calculation
                final int remainingAttempts = maxAllowedAttempts - this.loginAttempts;
                
                System.out.printf("Login failed. Remaining attempts: %d%n", 
                                remainingAttempts);
            }
            
        } catch (Exception e) {
            // Error handling with local variables
            final String errorMessage = "Login process failed: " + e.getMessage();
            System.err.println(errorMessage);
            
            // Log error details if debug mode
            if (debugMode) {
                e.printStackTrace();
            }
        }
        
        return loginSuccessful;
    }
    
    /**
     * Demonstrates block scope and loop variables
     * Processes a list of operations with proper variable management
     * 
     * @param operations List of operations to process
     * @return Number of successful operations
     */
    public int processOperations(java.util.List<String> operations) {
        // Method variables
        int successCount = 0;
        final java.time.LocalDateTime startTime = java.time.LocalDateTime.now();
        
        // Input validation
        if (operations == null || operations.isEmpty()) {
            System.out.println("No operations to process");
            return 0;
        }
        
        // Processing loop with block-scoped variables
        for (int i = 0; i < operations.size(); i++) {
            final String operation = operations.get(i); // Loop variable
            
            // Block-scoped processing
            if (operation != null && !operation.trim().isEmpty()) {
                // Nested block with limited scope
                {
                    final String processedOperation = operation.trim().toUpperCase();
                    final boolean operationResult = processOperation(processedOperation);
                    
                    if (operationResult) {
                        successCount++;
                        
                        // Debug information with block-scoped variable
                        if (debugMode) {
                            final String successMessage = 
                                String.format("Operation %d successful: %s", 
                                            i + 1, processedOperation);
                            System.out.println(successMessage);
                        }
                    }
                } // processedOperation and operationResult go out of scope here
            }
        } // Loop variables go out of scope here
        
        // Calculate and display results
        final java.time.LocalDateTime endTime = java.time.LocalDateTime.now();
        final java.time.Duration processingTime = 
            java.time.Duration.between(startTime, endTime);
        
        System.out.printf("Processed %d operations in %d ms. Success: %d%n",
                        operations.size(), processingTime.toMillis(), successCount);
        
        return successCount;
    }
    
    // =============================================================================
    // STATIC METHODS (Class-level operations)
    // =============================================================================
    
    /**
     * Static method demonstrating class variable access
     * Shows what variables are accessible from static context
     * 
     * @return Current instance count
     */
    public static int getTotalInstanceCount() {
        // Static methods can access:
        // - Static variables (class variables)
        // - Static final variables (class constants)
        // - Local variables
        // - Method parameters
        
        // Cannot directly access:
        // - Instance variables (would need object reference)
        // - Instance constants (would need object reference)
        
        final java.time.LocalDateTime queryTime = java.time.LocalDateTime.now();
        
        if (debugMode) { // Can access static variable
            System.out.printf("Instance count queried at %s: %d%n", 
                            queryTime, instanceCount);
        }
        
        return instanceCount; // Can access static variable
    }
    
    /**
     * Utility method for enabling/disabling debug mode
     * Demonstrates static variable modification
     * 
     * @param enabled New debug mode state
     */
    public static void setDebugMode(boolean enabled) {
        final boolean previousState = debugMode;
        debugMode = enabled;
        
        // Log state change
        System.out.printf("Debug mode changed from %s to %s%n", 
                        previousState, enabled);
    }
    
    // =============================================================================
    // PRIVATE HELPER METHODS
    // =============================================================================
    
    /**
     * Validates and cleans user name input
     * 
     * @param userName Raw user name input
     * @return Cleaned and validated user name
     * @throws IllegalArgumentException if user name is invalid
     */
    private String validateAndCleanUserName(String userName) {
        if (userName == null) {
            throw new IllegalArgumentException("User name cannot be null");
        }
        
        final String trimmedName = userName.trim();
        if (trimmedName.isEmpty()) {
            throw new IllegalArgumentException("User name cannot be empty");
        }
        
        final int minLength = 2;
        final int maxLength = 50;
        
        if (trimmedName.length() < minLength || trimmedName.length() > maxLength) {
            throw new IllegalArgumentException(
                String.format("User name length must be between %d and %d characters", 
                            minLength, maxLength));
        }
        
        return trimmedName;
    }
    
    /**
     * Validates user role against allowed values
     * 
     * @param userRole Role to validate
     * @return Validated role
     * @throws IllegalArgumentException if role is invalid
     */
    private String validateUserRole(String userRole) {
        if (userRole == null || userRole.trim().isEmpty()) {
            throw new IllegalArgumentException("User role cannot be null or empty");
        }
        
        final String normalizedRole = userRole.trim().toUpperCase();
        
        if (!VALID_ROLES.contains(normalizedRole)) {
            throw new IllegalArgumentException(
                "Invalid user role: " + userRole + 
                ". Valid roles: " + VALID_ROLES);
        }
        
        return normalizedRole;
    }
    
    /**
     * Simple password validation (for demonstration)
     * 
     * @param password Password to validate
     * @return true if password is valid
     */
    private boolean validatePassword(String password) {
        // Simple validation - in real applications, use proper security
        return password != null && password.length() >= 8;
    }
    
    /**
     * Simulates processing of an operation
     * 
     * @param operation Operation to process
     * @return true if successful
     */
    private boolean processOperation(String operation) {
        // Simulate processing time
        try {
            Thread.sleep(10); // 10ms delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
        
        // Simple success criteria (for demonstration)
        return operation.length() > 0 && !operation.contains("FAIL");
    }
    
    // =============================================================================
    // GETTERS AND SETTERS
    // =============================================================================
    
    public int getInstanceId() {
        return instanceId; // Final variable - cannot be changed
    }
    
    public java.time.LocalDateTime getCreatedAt() {
        return createdAt; // Final variable - cannot be changed
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = validateAndCleanUserName(userName);
    }
    
    public String getUserRole() {
        return userRole;
    }
    
    public void setUserRole(String userRole) {
        this.userRole = validateUserRole(userRole);
    }
    
    public int getLoginAttempts() {
        return loginAttempts;
    }
    
    public java.time.LocalDateTime getLastLoginTime() {
        return lastLoginTime;
    }
    
    // =============================================================================
    // MAIN METHOD FOR DEMONSTRATION
    // =============================================================================
    
    /**
     * Demonstrates all variable concepts in action
     */
    public static void main(String[] args) {
        System.out.println("=== Variable Basics Demonstration ===");
        
        // Enable debug mode to see additional output
        setDebugMode(true);
        
        try {
            // Create instances
            VariableBasics_Example user1 = new VariableBasics_Example("alice", "ADMIN");
            VariableBasics_Example user2 = new VariableBasics_Example("bob", "USER");
            
            System.out.println("\nTotal instances: " + getTotalInstanceCount());
            
            // Demonstrate login functionality
            System.out.println("\n=== Login Tests ===");
            user1.login("password123"); // Valid password
            user1.login("wrong");       // Invalid password
            
            // Demonstrate operation processing
            System.out.println("\n=== Operation Processing ===");
            java.util.List<String> operations = java.util.Arrays.asList(
                "PROCESS_DATA", "VALIDATE_INPUT", "FAIL_OPERATION", "COMPLETE_TASK"
            );
            
            int successCount = user1.processOperations(operations);
            System.out.println("Successful operations: " + successCount);
            
            // Demonstrate variable access and scope
            System.out.println("\n=== Variable Information ===");
            System.out.println("Application: " + APPLICATION_NAME);
            System.out.println("Max retries: " + MAX_RETRIES);
            System.out.println("Valid roles: " + VALID_ROLES);
            
            System.out.printf("User1 - ID: %d, Name: %s, Role: %s%n",
                            user1.getInstanceId(), user1.getUserName(), user1.getUserRole());
            
        } catch (Exception e) {
            System.err.println("Error in demonstration: " + e.getMessage());
            if (debugMode) {
                e.printStackTrace();
            }
        } finally {
            setDebugMode(false);
        }
        
        System.out.println("\n=== Demonstration Complete ===");
    }
}