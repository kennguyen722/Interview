package com.interview.module1;

public record GradeRecord(String subject, int score) {

    public GradeRecord {
        if (subject == null || subject.isBlank()) {
            throw new IllegalArgumentException("subject is required");
        }
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("score must be between 0 and 100");
        }
    }
}
