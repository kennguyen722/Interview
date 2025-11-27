import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Exercise01_StudentProfile
 * 
 * Tests cover:
 * - Constructor validation
 * - Getter/setter functionality
 * - Constant values
 * - Class variable behavior
 * - Edge cases and error handling
 * 
 * @author Course Tests
 * @version 1.0
 */
class Exercise01_StudentProfileTest {
    
    private Exercise01_StudentProfile student;
    
    @BeforeEach
    void setUp() {
        // Reset static counter before each test
        Exercise01_StudentProfile.resetTotalStudents();
        student = new Exercise01_StudentProfile(1001, "Test Student");
    }
    
    @Test
    @DisplayName("Constructor should initialize student with valid parameters")
    void testConstructorValidParameters() {
        assertEquals(1001, student.getStudentId());
        assertEquals("Test Student", student.getFullName());
        assertEquals(Exercise01_StudentProfile.DEFAULT_GRADE, student.getCurrentGrade());
        assertTrue(student.isEnrolled());
    }
    
    @Test
    @DisplayName("Constructor should increment total student count")
    void testConstructorIncrementsCount() {
        assertEquals(1, Exercise01_StudentProfile.getTotalStudents());
        
        new Exercise01_StudentProfile(1002, "Another Student");
        assertEquals(2, Exercise01_StudentProfile.getTotalStudents());
    }
    
    @Test
    @DisplayName("Constructor should trim whitespace from name")
    void testConstructorTrimsName() {
        Exercise01_StudentProfile studentWithSpaces = 
            new Exercise01_StudentProfile(1002, "  Spaced Name  ");
        assertEquals("Spaced Name", studentWithSpaces.getFullName());
    }
    
    @Test
    @DisplayName("Constructor should reject invalid student ID")
    void testConstructorInvalidId() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Exercise01_StudentProfile(0, "Valid Name");
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            new Exercise01_StudentProfile(-1, "Valid Name");
        });
    }
    
    @Test
    @DisplayName("Constructor should reject invalid name")
    void testConstructorInvalidName() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Exercise01_StudentProfile(1001, null);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            new Exercise01_StudentProfile(1001, "");
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            new Exercise01_StudentProfile(1001, "   ");
        });
    }
    
    @Test
    @DisplayName("Should set valid grades correctly")
    void testSetValidGrade() {
        student.setCurrentGrade(85.5);
        assertEquals(85.5, student.getCurrentGrade(), 0.001);
        
        student.setCurrentGrade(Exercise01_StudentProfile.MIN_GRADE);
        assertEquals(Exercise01_StudentProfile.MIN_GRADE, student.getCurrentGrade());
        
        student.setCurrentGrade(Exercise01_StudentProfile.MAX_GRADE);
        assertEquals(Exercise01_StudentProfile.MAX_GRADE, student.getCurrentGrade());
    }
    
    @Test
    @DisplayName("Should reject invalid grades")
    void testSetInvalidGrade() {
        assertThrows(IllegalArgumentException.class, () -> {
            student.setCurrentGrade(-1.0);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            student.setCurrentGrade(101.0);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            student.setCurrentGrade(Double.NaN);
        });
    }
    
    @Test
    @DisplayName("Should handle enrollment status correctly")
    void testEnrollmentStatus() {
        assertTrue(student.isEnrolled()); // Default is enrolled
        
        student.setEnrolled(false);
        assertFalse(student.isEnrolled());
        
        student.setEnrolled(true);
        assertTrue(student.isEnrolled());
    }
    
    @Test
    @DisplayName("Constants should have correct values")
    void testConstants() {
        assertEquals(100.0, Exercise01_StudentProfile.MAX_GRADE);
        assertEquals(0.0, Exercise01_StudentProfile.MIN_GRADE);
        assertEquals(0.0, Exercise01_StudentProfile.DEFAULT_GRADE);
    }
    
    @Test
    @DisplayName("Should handle multiple students correctly")
    void testMultipleStudents() {
        Exercise01_StudentProfile student2 = new Exercise01_StudentProfile(1002, "Student Two");
        Exercise01_StudentProfile student3 = new Exercise01_StudentProfile(1003, "Student Three");
        
        assertEquals(3, Exercise01_StudentProfile.getTotalStudents());
        
        // Verify each student maintains independent state
        student.setCurrentGrade(80.0);
        student2.setCurrentGrade(90.0);
        student3.setCurrentGrade(95.0);
        
        assertEquals(80.0, student.getCurrentGrade());
        assertEquals(90.0, student2.getCurrentGrade());
        assertEquals(95.0, student3.getCurrentGrade());
    }
    
    @Test
    @DisplayName("toString should provide meaningful representation")
    void testToString() {
        student.setCurrentGrade(87.5);
        String result = student.toString();
        
        assertTrue(result.contains("1001"));
        assertTrue(result.contains("Test Student"));
        assertTrue(result.contains("87.5"));
        assertTrue(result.contains("true")); // enrolled status
    }
    
    @Test
    @DisplayName("displayProfile should not throw exceptions")
    void testDisplayProfile() {
        // This test ensures displayProfile runs without errors
        // In a real scenario, you might capture System.out to verify output
        assertDoesNotThrow(() -> {
            student.displayProfile();
        });
    }
}