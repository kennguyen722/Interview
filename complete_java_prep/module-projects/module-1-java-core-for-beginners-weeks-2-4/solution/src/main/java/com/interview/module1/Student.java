package com.interview.module1;

import java.util.ArrayList;
import java.util.List;

public class Student {

    private final String id;
    private final String name;
    private final List<GradeRecord> grades = new ArrayList<>();

    public Student(String id, String name) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("id is required");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void addGrade(GradeRecord grade) {
        grades.add(grade);
    }

    public List<GradeRecord> getGrades() {
        return List.copyOf(grades);
    }
}
