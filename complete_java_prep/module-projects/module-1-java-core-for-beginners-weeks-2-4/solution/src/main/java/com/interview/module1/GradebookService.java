package com.interview.module1;

import java.util.Comparator;
import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class GradebookService {

    public double calculateAverage(Student student) {
        return student.getGrades().stream()
                .mapToInt(GradeRecord::score)
                .average()
                .orElse(0.0);
    }

    public String determineLetterGrade(double average) {
        if (average >= 90) return "A";
        if (average >= 80) return "B";
        if (average >= 70) return "C";
        if (average >= 60) return "D";
        return "F";
    }

    public Map<String, DoubleSummaryStatistics> summarizeBySubject(List<Student> students) {
        return students.stream()
                .flatMap(student -> student.getGrades().stream())
                .collect(Collectors.groupingBy(GradeRecord::subject,
                        Collectors.summarizingDouble(GradeRecord::score)));
    }

    public List<Student> rankByAverage(List<Student> students) {
        return students.stream()
                .sorted(Comparator.comparingDouble(this::calculateAverage).reversed())
                .toList();
    }
}
