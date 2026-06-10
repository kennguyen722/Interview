package com.interview.module1;

import java.util.List;

public class GradebookApp {

    public static void main(String[] args) {
        Student alice = new Student("S-1", "Alice");
        alice.addGrade(new GradeRecord("Java", 92));
        alice.addGrade(new GradeRecord("Testing", 88));

        Student bob = new Student("S-2", "Bob");
        bob.addGrade(new GradeRecord("Java", 76));
        bob.addGrade(new GradeRecord("Testing", 83));

        GradebookService service = new GradebookService();
        for (Student student : service.rankByAverage(List.of(alice, bob))) {
            double average = service.calculateAverage(student);
            System.out.printf("%s average=%.2f grade=%s%n",
                    student.getName(), average, service.determineLetterGrade(average));
        }
    }
}
