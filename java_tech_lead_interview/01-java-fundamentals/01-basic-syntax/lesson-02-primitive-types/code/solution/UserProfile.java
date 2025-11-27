/**
 * UserProfile demonstrating appropriate primitive type selection
 * Memory-optimized for large-scale user systems
 */
public class UserProfile {
    
    // Optimal type selection based on data ranges
    private final long userId;           // Supports 10+ billion users
    private final byte age;              // 0-150 range fits in byte (-128 to 127)
    private final byte status;           // 0-7 range fits comfortably in byte
    private final double accountBalance; // High precision for currency
    private final boolean isPremium;     // Simple flag
    private final char preferredLanguage; // Single character ('E', 'S', 'F', etc.)
    
    /**
     * Constructor with comprehensive validation
     */
    public UserProfile(long userId, int age, int status, double accountBalance, 
                      boolean isPremium, char preferredLanguage) {
        
        // Validate userId
        if (userId <= 0) {
            throw new IllegalArgumentException("User ID must be positive, got: " + userId);
        }
        
        // Validate and cast age to byte
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("Age must be 0-150, got: " + age);
        }
        
        // Validate and cast status to byte  
        if (status < 0 || status > 7) {
            throw new IllegalArgumentException("Status must be 0-7, got: " + status);
        }
        
        // Validate account balance
        if (Double.isNaN(accountBalance) || Double.isInfinite(accountBalance)) {
            throw new IllegalArgumentException("Account balance must be a valid number");
        }
        
        // Validate language character
        if (!Character.isLetter(preferredLanguage)) {
            throw new IllegalArgumentException("Language must be a letter, got: " + 
                                             preferredLanguage);
        }
        
        // Safe assignments with casting
        this.userId = userId;
        this.age = (byte) age;
        this.status = (byte) status;
        this.accountBalance = accountBalance;
        this.isPremium = isPremium;
        this.preferredLanguage = Character.toUpperCase(preferredLanguage);
    }
    
    // Getters with appropriate return types
    public long getUserId() { return userId; }
    
    public int getAge() { 
        return Byte.toUnsignedInt(age); // Convert back to int for API compatibility
    }
    
    public int getStatus() { 
        return Byte.toUnsignedInt(status); 
    }
    
    public double getAccountBalance() { return accountBalance; }
    public boolean isPremium() { return isPremium; }
    public char getPreferredLanguage() { return preferredLanguage; }
    
    /**
     * Safe balance update with overflow protection
     */
    public UserProfile updateBalance(double deltaAmount) {
        try {
            // Check for potential overflow before operation
            double newBalance = accountBalance + deltaAmount;
            
            if (Double.isNaN(newBalance) || Double.isInfinite(newBalance)) {
                throw new ArithmeticException("Balance update would result in invalid value");
            }
            
            return new UserProfile(userId, getAge(), getStatus(), newBalance, 
                                 isPremium, preferredLanguage);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to update balance: " + e.getMessage(), e);
        }
    }
    
    /**
     * Validate age is in realistic range for business logic
     */
    public boolean hasRealisticAge() {
        int ageValue = getAge();
        return ageValue >= 13 && ageValue <= 120; // Realistic user age range
    }
    
    /**
     * Memory usage estimation
     */
    public static long getInstanceMemoryUsage() {
        // Object header: 16 bytes
        // long userId: 8 bytes
        // byte age: 1 byte  
        // byte status: 1 byte
        // double accountBalance: 8 bytes
        // boolean isPremium: 1 byte
        // char preferredLanguage: 2 bytes
        // Padding: ~3 bytes (alignment)
        return 40; // bytes per instance
    }
    
    @Override
    public String toString() {
        return String.format("UserProfile{id=%d, age=%d, status=%d, balance=%.2f, " +
                           "premium=%s, lang=%c}", 
                           userId, getAge(), getStatus(), accountBalance, 
                           isPremium, preferredLanguage);
    }
    
    public static void main(String[] args) {
        try {
            // Test valid user profile
            UserProfile user = new UserProfile(123456789L, 25, 1, 1500.75, true, 'E');
            System.out.println("Created user: " + user);
            
            // Test balance update
            UserProfile updatedUser = user.updateBalance(250.25);
            System.out.println("After balance update: " + updatedUser);
            
            // Test memory usage
            System.out.println("Estimated memory per instance: " + 
                             UserProfile.getInstanceMemoryUsage() + " bytes");
            
            // Test edge cases
            try {
                new UserProfile(-1L, 25, 1, 1500.75, true, 'E');
            } catch (IllegalArgumentException e) {
                System.out.println("Caught expected error: " + e.getMessage());
            }
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}