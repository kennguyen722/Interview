/**
 * Exercise 1 Solution: Basic Variable Declaration and Naming Conventions
 * 
 * Demonstrates proper variable practices including:
 * - Descriptive naming using camelCase convention
 * - Appropriate use of constants with static final
 * - Class vs instance variable usage
 * - Input validation and error handling
 * 
 * @author Course Solution
 * @version 1.0
 */
public class Exercise01_StudentProfile {
    
    // Class constants - shared across all instances
    public static final double MAX_GRADE = 100.0;
    public static final double MIN_GRADE = 0.0;
    public static final double DEFAULT_GRADE = 0.0;
    
    // Class variable - tracks total students across all instances
    private static int totalStudents = 0;
    
    // Instance variables - unique to each student
    private final int studentId;        // Immutable after creation
    private final String fullName;     // Immutable after creation
    private double currentGrade;       // Mutable - can be updated
    private boolean isEnrolled;        // Mutable - enrollment status
    
    /**
     * Constructor with input validation and proper initialization
     * 
     * @param studentId Unique student identifier (must be positive)
     * @param fullName Student's full name (cannot be null or empty)
     * @throws IllegalArgumentException if parameters are invalid
     */
    public Exercise01_StudentProfile(int studentId, String fullName) {
        // Validate student ID
        if (studentId <= 0) {
            throw new IllegalArgumentException("Student ID must be positive: " + studentId);
        }
        
        // Validate and clean full name
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Full name cannot be null or empty");
        }
        
        // Initialize instance variables
        this.studentId = studentId;
        this.fullName = fullName.trim();
        this.currentGrade = DEFAULT_GRADE;
        this.isEnrolled = true; // Default to enrolled
        
        // Increment class variable
        totalStudents++;
    }
    
    // Getter methods following JavaBean conventions
    public int getStudentId() {
        return studentId;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public double getCurrentGrade() {
        return currentGrade;
    }
    
    public boolean isEnrolled() {
        return isEnrolled;
    }
    
    /**
     * Sets the current grade with validation
     * 
     * @param grade New grade value
     * @throws IllegalArgumentException if grade is out of valid range
     */
    public void setCurrentGrade(double grade) {
        if (grade < MIN_GRADE || grade > MAX_GRADE) {
            throw new IllegalArgumentException(
                String.format("Grade %.2f is out of range [%.1f, %.1f]", 
                            grade, MIN_GRADE, MAX_GRADE));
        }
        this.currentGrade = grade;
    }
    
    /**
     * Updates enrollment status
     * 
     * @param enrolled New enrollment status
     */
    public void setEnrolled(boolean enrolled) {
        this.isEnrolled = enrolled;
    }
    
    /**
     * Displays student profile in a formatted manner
     */
    public void displayProfile() {
        System.out.println("=== Student Profile ===");
        System.out.println("ID: " + studentId);
        System.out.println("Name: " + fullName);
        System.out.printf("Current Grade: %.1f%%\n", currentGrade);
        System.out.println("Status: " + (isEnrolled ? "Enrolled" : "Not Enrolled"));
        System.out.println("=======================");
    }
    
    /**
     * Returns the total number of students created
     * 
     * @return Total student count
     */
    public static int getTotalStudents() {
        return totalStudents;
    }
    
    /**
     * Resets the total student count (useful for testing)
     */
    public static void resetTotalStudents() {
        totalStudents = 0;
    }
    
    @Override
    public String toString() {
        return String.format("StudentProfile{id=%d, name='%s', grade=%.1f, enrolled=%s}",
                           studentId, fullName, currentGrade, isEnrolled);
    }
    
    // Demonstration and testing
    public static void main(String[] args) {
        System.out.println("=== Testing StudentProfile ===");
        
        try {
            // Test normal cases
            Exercise01_StudentProfile student1 = new Exercise01_StudentProfile(1001, "Alice Johnson");
            Exercise01_StudentProfile student2 = new Exercise01_StudentProfile(1002, "Bob Smith");
            
            // Set grades
            student1.setCurrentGrade(85.5);
            student2.setCurrentGrade(92.0);
            
            // Display profiles
            student1.displayProfile();
            student2.displayProfile();
            
            System.out.println("Total students created: " + getTotalStudents());
            
            // Test edge cases
            System.out.println("\n=== Testing Edge Cases ===");
            
            // Test invalid grade
            try {
                student1.setCurrentGrade(101.0); // Should fail
            } catch (IllegalArgumentException e) {
                System.out.println("Caught expected error: " + e.getMessage());
            }
            
            // Test invalid constructor parameters
            try {
                new Exercise01_StudentProfile(-1, "Invalid ID"); // Should fail
            } catch (IllegalArgumentException e) {
                System.out.println("Caught expected error: " + e.getMessage());
            }
            
            try {
                new Exercise01_StudentProfile(1003, ""); // Should fail
            } catch (IllegalArgumentException e) {
                System.out.println("Caught expected error: " + e.getMessage());
            }
            
            System.out.println("\n=== All Tests Completed ===");
            
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}