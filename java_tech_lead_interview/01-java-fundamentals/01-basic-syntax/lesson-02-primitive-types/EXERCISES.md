# Exercises: Primitive Types and Wrapper Classes

**Estimated Duration:** 3-4 hours  
**Difficulty Progression:** Beginner → Advanced  
**Learning Focus:** Hands-on application of primitive types, performance optimization, and type safety

---

## Overview

These exercises build practical skills in primitive type usage, performance optimization, and type safety - essential competencies for Java tech leads. Each exercise includes multiple approaches, from basic implementation to enterprise-ready solutions.

**For Tech Lead Development:** Focus on code review perspectives, performance implications, and team guidance scenarios throughout these exercises.

---

## Exercise 1: Primitive Type Selection and Validation

### 1.1 User Profile System (Beginner - 45 minutes)

Create a `UserProfile` class that demonstrates appropriate primitive type selection for different data ranges.

**Requirements:**
- User ID (supports up to 10 billion users)
- Age (0-150 years)
- Status code (0-7, representing different account states)
- Account balance (supports fractional currency)
- Premium flag (yes/no)
- Preferred language (single character code)

**Starter Code:**
```java
public class UserProfile {
    // TODO: Declare fields with appropriate primitive types
    
    // TODO: Constructor with validation
    
    // TODO: Getters with proper return types
    
    // TODO: Method to safely update balance
    
    // TODO: Method to validate age is in realistic range
}
```

**Success Criteria:**
- ✅ Chooses most memory-efficient primitive type for each field
- ✅ Validates input ranges in constructor
- ✅ Handles edge cases (negative values, overflow)
- ✅ Includes comprehensive JavaDoc documentation

**Extension Challenges:**
- Add thread-safety considerations
- Implement builder pattern with validation
- Create performance comparison with wrapper-based version

---

### 1.2 Configuration Parser (Intermediate - 60 minutes)

Build a configuration parser that safely converts string values to appropriate primitive types with comprehensive error handling.

**Requirements:**
```java
public class ConfigurationParser {
    
    /**
     * Parse integer with range validation
     * @param value String to parse
     * @param min Minimum allowed value (inclusive)
     * @param max Maximum allowed value (inclusive)  
     * @param defaultValue Value to return if parsing fails
     * @return Parsed integer or default value
     */
    public static int parseIntWithRange(String value, int min, int max, int defaultValue) {
        // TODO: Implement with proper validation
    }
    
    /**
     * Parse double with NaN/Infinity handling
     */
    public static double parseDoubleWithValidation(String value, double defaultValue) {
        // TODO: Implement with edge case handling
    }
    
    /**
     * Parse boolean from various string formats
     * Should accept: "true", "false", "1", "0", "yes", "no", "on", "off"
     */
    public static boolean parseFlexibleBoolean(String value, boolean defaultValue) {
        // TODO: Implement flexible boolean parsing
    }
    
    // TODO: Add methods for byte, short, long, float, char parsing
}
```

**Test Cases to Handle:**
```java
// Edge cases your parser should handle:
parseIntWithRange("", 0, 100, 50);           // Empty string
parseIntWithRange("abc", 0, 100, 50);        // Invalid format  
parseIntWithRange("150", 0, 100, 50);        // Out of range
parseIntWithRange("75", 0, 100, 50);         // Valid value
parseDoubleWithValidation("NaN", 0.0);       // NaN input
parseDoubleWithValidation("Infinity", 0.0);  // Infinity input
parseFlexibleBoolean("YES", false);          // Case variations
```

**Success Criteria:**
- ✅ Handles all edge cases gracefully
- ✅ Provides informative error logging
- ✅ Uses appropriate primitive types for parameters
- ✅ Includes performance-conscious implementation

---

## Exercise 2: Performance Optimization and Autoboxing

### 2.1 Collection Performance Analysis (Intermediate - 75 minutes)

Create a comprehensive performance analysis comparing primitive arrays, wrapper collections, and primitive collections.

**Implementation Requirements:**
```java
public class CollectionPerformanceAnalyzer {
    
    private static final int[] SIZES = {1_000, 10_000, 100_000, 1_000_000};
    
    /**
     * Compare performance of different integer storage approaches
     */
    public void analyzeIntegerStorage() {
        for (int size : SIZES) {
            System.out.printf("\n=== Analysis for %,d elements ===%n", size);
            
            // TODO: Measure primitive array performance
            measurePrimitiveArray(size);
            
            // TODO: Measure ArrayList<Integer> performance  
            measureWrapperList(size);
            
            // TODO: Measure memory usage differences
            measureMemoryUsage(size);
        }
    }
    
    private long measurePrimitiveArray(int size) {
        // TODO: Implement timing for array creation and sum calculation
        // Return execution time in nanoseconds
    }
    
    private long measureWrapperList(int size) {
        // TODO: Implement timing for ArrayList<Integer> operations
        // Include both creation and iteration with autoboxing
    }
    
    private void measureMemoryUsage(int size) {
        // TODO: Estimate memory usage for different approaches
        // Use Runtime.getRuntime() for heap measurement
    }
    
    /**
     * Demonstrate autoboxing overhead in tight loops
     */
    public void demonstrateAutoboxingOverhead() {
        final int iterations = 10_000_000;
        
        // TODO: Pure primitive arithmetic
        long primitiveTime = timePrimitiveLoop(iterations);
        
        // TODO: Wrapper arithmetic with autoboxing
        long wrapperTime = timeWrapperLoop(iterations);
        
        System.out.printf("Primitive loop: %,d ns%n", primitiveTime);
        System.out.printf("Wrapper loop: %,d ns%n", wrapperTime);  
        System.out.printf("Wrapper is %.1fx slower%n", 
                         (double) wrapperTime / primitiveTime);
    }
}
```

**Expected Output Format:**
```
=== Analysis for 1,000,000 elements ===
Primitive int[]: Creation 2,345,678 ns, Sum 1,234,567 ns
ArrayList<Integer>: Creation 15,678,901 ns, Sum 8,901,234 ns
Memory: int[] ~4MB, ArrayList<Integer> ~20MB
Autoboxing overhead: 6.7x slower than primitives
```

**Success Criteria:**
- ✅ Accurate timing measurements using `System.nanoTime()`
- ✅ Memory usage estimation with heap analysis
- ✅ Clear performance comparison metrics  
- ✅ Practical recommendations for different use cases

---

### 2.2 High-Performance Data Processor (Advanced - 90 minutes)

Build a financial data processor that handles millions of price updates with optimal performance.

**Requirements:**
```java
/**
 * High-performance financial data processor
 * Processes price updates for trading systems
 */
public class FinancialDataProcessor {
    
    // TODO: Choose appropriate data structures for performance
    
    /**
     * Process price update using optimal primitive types
     * Price in cents to avoid floating-point precision issues
     */
    public void updatePrice(long instrumentId, long priceInCents, int volume) {
        // TODO: Implement with primitive operations only
    }
    
    /**
     * Calculate volume-weighted average price (VWAP) efficiently
     * Must process 1M+ updates per second
     */
    public long calculateVWAP(long instrumentId) {
        // TODO: Implement using primitive arithmetic
        // Return price in cents (long)
    }
    
    /**
     * Find top N instruments by trading volume
     * Must be highly optimized for frequent calls
     */
    public long[] getTopInstrumentsByVolume(int n) {
        // TODO: Implement efficient sorting/selection
        // Return array of instrument IDs
    }
    
    /**
     * Performance benchmark method
     */
    public void benchmarkThroughput() {
        // TODO: Measure updates per second capacity
        // Generate realistic trading data for testing
    }
}
```

**Performance Requirements:**
- Handle 1,000,000 price updates per second
- Memory usage under 100MB for 10,000 instruments
- VWAP calculation under 1 microsecond
- No garbage collection pressure from frequent operations

**Success Criteria:**
- ✅ Uses only primitive types for hot path operations
- ✅ Achieves required performance benchmarks
- ✅ Minimal object allocation during processing
- ✅ Includes comprehensive performance testing

---

## Exercise 3: Type Safety and Overflow Handling

### 3.1 Safe Arithmetic Library (Intermediate - 60 minutes)

Create a comprehensive library for safe arithmetic operations with overflow detection.

**Implementation:**
```java
public class SafeArithmetic {
    
    /**
     * Safe addition with overflow detection
     */
    public static int safeAdd(int a, int b) {
        // TODO: Implement using Math.addExact with custom error handling
    }
    
    /**
     * Safe multiplication with overflow detection  
     */
    public static long safeMultiply(long a, long b) {
        // TODO: Implement with clear overflow messaging
    }
    
    /**
     * Safe casting from long to int with validation
     */
    public static int safeLongToInt(long value) {
        // TODO: Check bounds before casting
    }
    
    /**
     * Safe division with zero-check and precision handling
     */
    public static double safeDivide(long numerator, long denominator) {
        // TODO: Handle division by zero and precision loss
    }
    
    /**
     * Calculate factorial with overflow protection
     * Should detect when result would exceed long capacity
     */
    public static long safeFactorial(int n) {
        // TODO: Implement iterative version with overflow detection
    }
    
    /**
     * Power calculation with overflow detection
     */
    public static long safePower(int base, int exponent) {
        // TODO: Efficient implementation with overflow checks
    }
}
```

**Test Cases:**
```java
@Test
public void testOverflowDetection() {
    // These should throw ArithmeticException
    assertThrows(ArithmeticException.class, () -> 
        SafeArithmetic.safeAdd(Integer.MAX_VALUE, 1));
    
    assertThrows(ArithmeticException.class, () -> 
        SafeArithmetic.safeMultiply(Long.MAX_VALUE, 2));
        
    assertThrows(ArithmeticException.class, () ->
        SafeArithmetic.safeLongToInt(3_000_000_000L));
        
    // These should work normally  
    assertEquals(2000, SafeArithmetic.safeAdd(1000, 1000));
    assertEquals(120, SafeArithmetic.safeFactorial(5));
}
```

**Success Criteria:**
- ✅ Detects all overflow conditions accurately
- ✅ Provides meaningful error messages
- ✅ Maintains performance for normal operations
- ✅ Comprehensive unit test coverage

---

### 3.2 Precision-Critical Calculator (Advanced - 75 minutes)

Build a calculator for financial applications requiring exact precision.

**Requirements:**
```java
/**
 * Precision-critical financial calculator
 * Uses fixed-point arithmetic with long for exact precision
 */
public class FinancialCalculator {
    
    private static final int DECIMAL_PLACES = 4; // 4 decimal places precision
    private static final long SCALE_FACTOR = 10000; // 10^4
    
    /**
     * Convert dollar amount to internal fixed-point representation
     * Example: 123.45 → 1234500 (in ten-thousandths)
     */
    public static long toFixedPoint(double dollarAmount) {
        // TODO: Implement conversion with rounding
    }
    
    /**
     * Convert fixed-point back to dollar amount
     */
    public static double toDollars(long fixedPointAmount) {
        // TODO: Implement conversion maintaining precision
    }
    
    /**
     * Add two monetary amounts with exact precision
     */
    public static long addAmounts(long amount1, long amount2) {
        // TODO: Implement with overflow protection
    }
    
    /**
     * Calculate compound interest with exact precision
     * principal: starting amount in fixed-point
     * annualRate: annual interest rate (e.g., 0.05 for 5%)
     * years: number of years
     * compoundingPeriods: times per year (12 for monthly, 4 for quarterly)
     */
    public static long calculateCompoundInterest(long principal, double annualRate, 
                                               int years, int compoundingPeriods) {
        // TODO: Implement using fixed-point arithmetic
    }
    
    /**
     * Calculate loan payment using exact precision
     */
    public static long calculateLoanPayment(long principal, double monthlyRate, 
                                          int numberOfPayments) {
        // TODO: Implement amortization formula with fixed-point
    }
    
    /**
     * Format fixed-point amount as currency string
     */
    public static String formatCurrency(long fixedPointAmount) {
        // TODO: Format as $X,XXX.XXXX
    }
}
```

**Validation Tests:**
```java
@Test  
public void testFinancialPrecision() {
    // Test that 0.1 + 0.2 = 0.3 exactly in our system
    long pointOne = FinancialCalculator.toFixedPoint(0.1);
    long pointTwo = FinancialCalculator.toFixedPoint(0.2);
    long sum = FinancialCalculator.addAmounts(pointOne, pointTwo);
    assertEquals(0.3, FinancialCalculator.toDollars(sum), 0.0001);
    
    // Test compound interest calculation
    long principal = FinancialCalculator.toFixedPoint(1000.00);
    long result = FinancialCalculator.calculateCompoundInterest(
        principal, 0.05, 10, 12); // 5% annually, 10 years, monthly compounding
    
    // Should equal approximately $1,643.62
    double finalAmount = FinancialCalculator.toDollars(result);
    assertTrue(Math.abs(finalAmount - 1643.62) < 0.01);
}
```

**Success Criteria:**
- ✅ Maintains exact precision for all calculations
- ✅ Handles edge cases (very small/large amounts)
- ✅ Performance suitable for real-time trading systems
- ✅ Clear currency formatting and error handling

---

## Exercise 4: Advanced Type Usage and Optimization

### 4.1 Bit Manipulation for Flags (Advanced - 60 minutes)

Create a permission system using bit manipulation with primitive types.

**Requirements:**
```java
/**
 * Enterprise permission system using bit flags
 * Supports up to 64 different permissions using a single long
 */
public class PermissionManager {
    
    // Define permission constants as powers of 2
    public static final long READ_PERMISSION = 1L << 0;      // 1
    public static final long WRITE_PERMISSION = 1L << 1;     // 2  
    public static final long DELETE_PERMISSION = 1L << 2;    // 4
    public static final long ADMIN_PERMISSION = 1L << 3;     // 8
    
    // TODO: Add more permissions (up to 64 total)
    
    /**
     * Grant a permission to existing permissions
     */
    public static long grantPermission(long currentPermissions, long permissionToGrant) {
        // TODO: Use bitwise OR
    }
    
    /**
     * Revoke a permission from existing permissions
     */
    public static long revokePermission(long currentPermissions, long permissionToRevoke) {
        // TODO: Use bitwise AND with NOT
    }
    
    /**
     * Check if user has specific permission
     */
    public static boolean hasPermission(long userPermissions, long requiredPermission) {
        // TODO: Use bitwise AND
    }
    
    /**
     * Check if user has ALL specified permissions
     */
    public static boolean hasAllPermissions(long userPermissions, long... requiredPermissions) {
        // TODO: Combine multiple permissions and check
    }
    
    /**
     * Get human-readable list of permissions
     */
    public static String[] getPermissionNames(long permissions) {
        // TODO: Return array of permission names based on bits set
    }
    
    /**
     * Count number of permissions granted
     */
    public static int countPermissions(long permissions) {
        // TODO: Count set bits efficiently
    }
}
```

**Test Scenarios:**
```java
@Test
public void testPermissionOperations() {
    long userPerms = 0L; // No permissions initially
    
    // Grant read and write
    userPerms = PermissionManager.grantPermission(userPerms, READ_PERMISSION);
    userPerms = PermissionManager.grantPermission(userPerms, WRITE_PERMISSION);
    
    assertTrue(PermissionManager.hasPermission(userPerms, READ_PERMISSION));
    assertTrue(PermissionManager.hasPermission(userPerms, WRITE_PERMISSION));
    assertFalse(PermissionManager.hasPermission(userPerms, DELETE_PERMISSION));
    
    assertEquals(2, PermissionManager.countPermissions(userPerms));
    
    // Revoke write permission
    userPerms = PermissionManager.revokePermission(userPerms, WRITE_PERMISSION);
    assertFalse(PermissionManager.hasPermission(userPerms, WRITE_PERMISSION));
    assertEquals(1, PermissionManager.countPermissions(userPerms));
}
```

**Success Criteria:**
- ✅ Efficient bit manipulation operations
- ✅ Support for all 64 possible permissions
- ✅ Clear permission naming and documentation
- ✅ Performance-optimized bit counting

---

### 4.2 Memory-Efficient Data Structure (Expert - 120 minutes)

Design a memory-efficient storage system for time-series data using primitive types.

**Requirements:**
```java
/**
 * Memory-efficient time-series data storage
 * Optimized for high-frequency trading data storage
 */
public class TimeSeriesStorage {
    
    /**
     * Store price and volume data efficiently
     * Timestamp: milliseconds since epoch (long)
     * Price: in cents to avoid floating-point (long)  
     * Volume: number of shares (int)
     */
    
    // TODO: Choose optimal data structures (consider arrays vs collections)
    
    /**
     * Add new data point
     * Must be optimized for high-frequency insertion (100k+ per second)
     */
    public void addDataPoint(long timestamp, long priceInCents, int volume) {
        // TODO: Implement efficient insertion
    }
    
    /**
     * Get price at specific time (or closest before)
     */
    public long getPriceAtTime(long timestamp) {
        // TODO: Implement efficient time-based lookup
    }
    
    /**
     * Calculate average price in time range
     */
    public double getAveragePrice(long startTime, long endTime) {
        // TODO: Implement efficient range query
    }
    
    /**
     * Get total volume in time range
     */
    public long getTotalVolume(long startTime, long endTime) {
        // TODO: Implement efficient volume aggregation
    }
    
    /**
     * Memory usage analysis
     */
    public long getEstimatedMemoryUsage() {
        // TODO: Calculate memory footprint
    }
    
    /**
     * Performance benchmark
     */
    public void benchmarkPerformance(int numOperations) {
        // TODO: Measure insertion and query performance
    }
    
    /**
     * Compress older data to save memory
     * Keep full resolution for recent data, lower resolution for old data
     */
    public void compressOldData(long cutoffTime, int compressionRatio) {
        // TODO: Implement data compression strategy
    }
}
```

**Performance Targets:**
- 100,000+ insertions per second
- Sub-microsecond queries for recent data  
- Memory usage under 10 bytes per data point on average
- Support for 1+ billion data points

**Success Criteria:**
- ✅ Meets all performance targets
- ✅ Efficient memory usage with compression
- ✅ Supports real-time and historical queries
- ✅ Includes comprehensive benchmarking

---

## Bonus Challenge: Primitive Type Mastery

### Real-World Integration Project (Expert - 180+ minutes)

Combine all concepts into a complete high-performance system.

**Project:** Build a **High-Frequency Trading Risk Calculator**

**System Requirements:**
1. **Portfolio Manager** - Track positions using optimal primitive types
2. **Risk Calculator** - Real-time risk metrics with fixed-point precision  
3. **Performance Monitor** - Zero-garbage collection for critical paths
4. **Configuration System** - Type-safe configuration parsing
5. **Audit System** - Bit-flag based permission and logging

**Integration Points:**
- All numeric calculations use appropriate primitive types
- No autoboxing in performance-critical code paths
- Safe arithmetic with overflow detection
- Memory usage under 50MB for 10,000 instruments  
- Sub-millisecond risk calculations

**Deliverables:**
1. Complete working system with all components
2. Comprehensive performance benchmarks
3. Memory usage analysis and optimization report
4. Code review checklist for primitive type usage
5. Documentation for team training on primitive optimization

---

## Evaluation Criteria

### Code Quality (40%)
- ✅ Appropriate primitive type selection for data ranges
- ✅ Safe arithmetic with overflow handling
- ✅ Performance-conscious implementation choices
- ✅ Clear documentation and naming conventions

### Performance (30%)
- ✅ Meets specified performance benchmarks
- ✅ Minimal autoboxing in critical code paths
- ✅ Efficient memory usage patterns
- ✅ Comprehensive performance testing

### Technical Depth (20%)
- ✅ Understanding of memory layout implications
- ✅ Proper handling of precision and overflow
- ✅ Advanced techniques (bit manipulation, fixed-point)
- ✅ Enterprise-ready error handling

### Leadership Perspective (10%)
- ✅ Code review readiness and team guidance
- ✅ Architectural decision justification
- ✅ Performance trade-off analysis
- ✅ Knowledge transfer and documentation

---

## Solution Guidelines

**Available Resources:**
- Complete solution code in `code/solution/`
- Performance benchmarking tools in `code/tools/`
- Unit test examples in `code/tests/`
- Code review checklist in `REVIEW-CHECKLIST.md`

**Getting Help:**
- Review [LESSON.md](LESSON.md) for theoretical foundations
- Check [QUIZ.md](QUIZ.md) for concept reinforcement  
- Use GitHub Copilot: `#suggest primitive type optimization`
- Reference Java documentation for Math.*Exact methods

**Next Steps After Completion:**
- Proceed to [Data Types and Literals](../lesson-03-data-types-literals/)
- Apply learnings in [Collections Framework](../../03-collections-framework/)
- Advanced applications in [Performance Optimization](../../02-advanced-java/07-performance-optimization/)

---

*© Java Tech Lead Interview Course - Licensed under MIT*