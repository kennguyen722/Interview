package com.interview.module0;

import java.util.List;
import java.util.Map;

public class FoundationApp {

    public static void main(String[] args) {
        BuildProfile profile = new BuildProfile(
                Runtime.version().feature() + "",
                "module0-foundations-setup",
                System.getenv().getOrDefault("APP_ENV", "local"),
                true
        );

        List<String> issues = EnvironmentValidator.validateRequired(Map.of(
                "JAVA_HOME", System.getenv("JAVA_HOME"),
                "APP_ENV", profile.environment()
        ));

        String report = BuildReportWriter.render(profile, issues);
        System.out.println(report);
    }
}
