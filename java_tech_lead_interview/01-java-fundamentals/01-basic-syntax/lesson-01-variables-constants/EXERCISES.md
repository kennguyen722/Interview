# Exercises: Variables and Constants

**Instructions:**
- Complete all exercises in order
- Use the starter code provided in `code/starter/`
- Compare your solutions with `code/solution/`
- Run tests in `code/tests/` to verify correctness
- Focus on applying best practices learned in the lesson

---

## Exercise 1: Basic Variable Declaration (Beginner)

### Objective
Practice proper variable declaration, initialization, and naming conventions.

### Requirements
Create a `StudentProfile` class that manages student information with proper variable practices.

### Specifications
- **Instance variables:** studentId (int), fullName (String), currentGrade (double), isEnrolled (boolean)
- **Class variable:** totalStudents (static int) to track total number of students
- **Constants:** MAX_GRADE (100.0), MIN_GRADE (0.0), DEFAULT_GRADE (0.0)
- **Constructor:** Initialize all instance variables, increment totalStudents
- **Methods:** getters, setters with validation, displayProfile()

### Starter Code Location
`code/starter/Exercise01_StudentProfile.java`

### Key Learning Points
- Proper variable naming using camelCase
- Appropriate use of instance vs class variables
- Constant declaration with static final
- Constructor parameter vs instance variable distinction

### Time Estimate
**20 minutes**

---

## Exercise 2: Variable Scope and Lifetime (Intermediate)

### Objective
Understand variable scope, lifetime, and accessibility rules.

### Requirements
Implement a `BankAccount` class demonstrating different variable scopes and their appropriate usage.

### Specifications
- **Static variables:** bankName, totalAccounts, interestRate
- **Instance variables:** accountNumber, balance, accountHolder
- **Method-level demonstration:** Show local variable scope in transaction methods
- **Block-scope demonstration:** Use variables in if/for blocks appropriately
- **Error scenarios:** Commented examples of scope violations

### Implementation Details
```java
// Method should demonstrate:
public void processTransaction(double amount, String type) {
    // Local variables with proper scope
    // Block-scoped variables in conditionals
    // Interaction with instance and static variables
}

public static void generateReport() {
    // Demonstrate static context variable access
}
```

### Starter Code Location
`code/starter/Exercise02_BankAccount.java`

### Key Learning Points
- Local vs instance vs static variable accessibility
- Block scope in control structures
- Variable shadowing and how to avoid it
- Static context limitations

### Time Estimate
**30 minutes**

---

## Exercise 3: Enterprise Constants Pattern (Advanced)

### Objective
Implement enterprise-grade constant management patterns for a configuration system.

### Requirements
Design a comprehensive configuration system for a microservices application.

### Specifications

#### Part A: Configuration Classes
Create nested static classes for different configuration areas:
- `DatabaseConfig`: connection settings, timeouts, pool sizes
- `ApiConfig`: endpoints, retry policies, rate limits
- `SecurityConfig`: encryption settings, token expiration, security flags

#### Part B: Feature Flags Enum
Implement feature flags using enum pattern:
```java
public enum FeatureFlag {
    MAINTENANCE_MODE(false),
    DEBUG_LOGGING(false),
    NEW_PAYMENT_SYSTEM(true),
    ENHANCED_SECURITY(true);
    
    // Implementation details...
}
```

#### Part C: Environment-Specific Constants
Demonstrate how to handle different environments (DEV, TEST, PROD).

### Advanced Requirements
- **Type Safety:** Use enums for related constants
- **Immutability:** Ensure true immutability for collections
- **Validation:** Add utility methods for configuration validation
- **Documentation:** Comprehensive JavaDoc for all constants
- **Testing:** Unit tests for configuration access

### Starter Code Location
`code/starter/Exercise03_EnterpriseConfig.java`

### Key Learning Points
- Enterprise constant organization patterns
- Enum vs static final constants trade-offs
- Immutable collections for constant data
- Configuration validation and error handling
- Thread-safety considerations

### Time Estimate
**45 minutes**

---

## Exercise 4: Memory Optimization Challenge (Expert)

### Objective
Optimize variable usage for memory efficiency and performance.

### Requirements
Refactor a poorly written data processing class to demonstrate memory-efficient variable practices.

### Given Problematic Code
```java
public class DataProcessor {
    public List<String> processLargeDataset(List<String> input) {
        List<String> results = new ArrayList<>();
        
        for (String item : input) {
            String processed = "";
            String[] parts = item.split(",");
            
            for (String part : parts) {
                String cleaned = part.trim().toUpperCase();
                String formatted = "[" + cleaned + "]";
                processed = processed + formatted + ";";
            }
            
            results.add(processed);
        }
        
        return results;
    }
}
```

### Optimization Tasks
1. **Identify performance issues** with current variable usage
2. **Implement StringBuilder reuse** for string concatenation
3. **Optimize object creation** in loops
4. **Add capacity hints** for collections
5. **Use final variables** where appropriate
6. **Implement object pooling** if beneficial

### Performance Requirements
- Handle 100,000+ input items efficiently
- Minimize garbage collection pressure
- Reduce object allocation in hot paths
- Maintain thread safety if needed

### Deliverables
1. **Optimized implementation** with performance improvements
2. **Before/after analysis** documenting improvements
3. **Benchmark tests** showing performance gains
4. **Memory usage analysis** with profiling data

### Starter Code Location
`code/starter/Exercise04_MemoryOptimization.java`

### Key Learning Points
- String concatenation performance implications
- Object reuse patterns for performance
- Collection capacity planning
- Memory profiling and optimization techniques
- Trade-offs between readability and performance

### Time Estimate
**60 minutes**

---

## Exercise 5: Real-World Integration (Practical Application)

### Objective
Apply variable and constant best practices in a realistic enterprise scenario.

### Scenario
You're building a user authentication service for a large enterprise application. The service needs to handle user credentials, session management, and security configurations.

### Requirements

#### Core Functionality
- **User credential validation**
- **Session token generation and validation**
- **Rate limiting and security monitoring**
- **Configuration management for security policies**

#### Technical Requirements
- **Thread-safe implementation** for concurrent access
- **Configurable security parameters** (timeouts, retry limits, etc.)
- **Comprehensive logging** with appropriate variable scope
- **Error handling** with meaningful error codes
- **Performance monitoring** with metrics collection

#### Variable Usage Requirements
- **Security constants** (encryption keys, timeout values, retry limits)
- **Session variables** (user state, token expiration, permissions)
- **Monitoring variables** (counters, timestamps, performance metrics)
- **Configuration variables** (environment-specific settings)

### Implementation Structure
```java
public class AuthenticationService {
    // Security constants
    
    // Performance monitoring variables
    
    // Instance variables for service state
    
    public AuthResult authenticateUser(String username, String password) {
        // Local variables for authentication process
        // Proper scope management
        // Error handling with appropriate variable usage
    }
    
    public boolean validateSession(String token) {
        // Session validation logic
        // Performance tracking variables
        // Security audit logging
    }
}
```

### Deliverables
1. **Complete implementation** following all best practices
2. **Security configuration class** with proper constant management
3. **Unit tests** covering all variable usage scenarios
4. **Performance benchmarks** demonstrating efficiency
5. **Code documentation** explaining design decisions

### Starter Code Location
`code/starter/Exercise05_AuthenticationService.java`

### Key Learning Points
- Enterprise-grade variable organization
- Security-conscious constant management
- Performance-optimized variable usage
- Thread-safety with proper variable scope
- Real-world application of theoretical concepts

### Time Estimate
**75 minutes**

---

## Bonus Challenge: Code Review Exercise

### Objective
Practice identifying and fixing variable-related issues in team code reviews.

### Instructions
Review the provided code samples and identify issues related to:
- Variable naming conventions
- Inappropriate scope usage
- Missing constants or magic numbers
- Performance issues with variable usage
- Thread safety concerns
- Memory efficiency problems

### Code Samples
Multiple code samples are provided in `code/starter/BonusChallenge_CodeReview/` representing common issues found in enterprise codebases.

### Deliverables
1. **Issue identification report** with severity ratings
2. **Corrected code samples** with explanations
3. **Best practices checklist** for future code reviews
4. **Team training recommendations** based on common issues found

### Time Estimate
**30 minutes**

---

## Exercise Completion Checklist

### For Each Exercise:
- [ ] Read requirements carefully
- [ ] Start with provided starter code
- [ ] Implement solution following best practices
- [ ] Run provided unit tests
- [ ] Compare with reference solution
- [ ] Document any alternative approaches considered
- [ ] Reflect on lessons learned

### Overall Completion:
- [ ] All 5 main exercises completed
- [ ] Bonus challenge attempted
- [ ] Code tested and verified
- [ ] Performance analysis completed (where applicable)
- [ ] Best practices checklist reviewed
- [ ] Ready to move to next lesson

### Self-Assessment Questions:
1. Can you explain the difference between local, instance, and class variables?
2. When would you use `final` vs `static final` for constants?
3. How do you ensure thread safety with shared variables?
4. What are the performance implications of different variable usage patterns?
5. How would you organize constants in a large enterprise application?

### Next Steps:
- Review solutions and understand alternative approaches
- Practice explaining concepts to a colleague
- Apply learned patterns in your current project
- Move on to [Primitive Types](../lesson-02-primitive-types/README.md)

---

**Need Help?**
- Check the reference solutions in `code/solution/`
- Review the lesson material in [LESSON.md](LESSON.md)
- Run unit tests to verify your implementation
- Ask questions in the course discussion forum