package com.interview.module1;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GradebookServiceTest {

    @Test
    void shouldCalculateAverageAndLetterGrade() {
        Student student = new Student("S-10", "Test Student");
        student.addGrade(new GradeRecord("Java", 90));
        student.addGrade(new GradeRecord("Java", 80));

        GradebookService service = new GradebookService();

        assertEquals(85.0, service.calculateAverage(student));
        assertEquals("B", service.determineLetterGrade(85.0));
    }
}
