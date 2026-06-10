package com.interview.module0;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EnvironmentValidatorTest {

    @Test
    void shouldReportMissingValues() {
        List<String> issues = EnvironmentValidator.validateRequired(Map.of(
                "APP_ENV", "",
                "JAVA_HOME", ""
        ));

        assertEquals(2, issues.size());
    }
}
