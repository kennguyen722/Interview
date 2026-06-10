package com.interview.module0;

import java.util.Objects;

public record BuildProfile(
        String javaVersion,
        String projectName,
        String environment,
        boolean testsEnabled
) {
    public BuildProfile {
        Objects.requireNonNull(javaVersion, "javaVersion is required");
        Objects.requireNonNull(projectName, "projectName is required");
        Objects.requireNonNull(environment, "environment is required");
    }
}
