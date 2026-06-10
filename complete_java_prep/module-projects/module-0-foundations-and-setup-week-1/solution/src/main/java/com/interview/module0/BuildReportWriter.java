package com.interview.module0;

import java.util.List;

public final class BuildReportWriter {

    private BuildReportWriter() {
    }

    public static String render(BuildProfile profile, List<String> issues) {
        StringBuilder builder = new StringBuilder();
        builder.append("Project: ").append(profile.projectName()).append(System.lineSeparator());
        builder.append("Java: ").append(profile.javaVersion()).append(System.lineSeparator());
        builder.append("Environment: ").append(profile.environment()).append(System.lineSeparator());
        builder.append("Tests Enabled: ").append(profile.testsEnabled()).append(System.lineSeparator());
        if (issues.isEmpty()) {
            builder.append("Validation: PASS");
        } else {
            builder.append("Validation: FAIL").append(System.lineSeparator());
            issues.forEach(issue -> builder.append("- ").append(issue).append(System.lineSeparator()));
        }
        return builder.toString().trim();
    }
}
