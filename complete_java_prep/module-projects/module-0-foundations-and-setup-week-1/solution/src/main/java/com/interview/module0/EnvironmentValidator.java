package com.interview.module0;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class EnvironmentValidator {

    private EnvironmentValidator() {
    }

    public static List<String> validateRequired(Map<String, String> values) {
        List<String> issues = new ArrayList<>();
        for (Map.Entry<String, String> entry : values.entrySet()) {
            String value = entry.getValue();
            if (value == null || value.isBlank()) {
                issues.add("Missing required value: " + entry.getKey());
            }
        }
        return issues;
    }
}
