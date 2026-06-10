import java.util.Map;
import java.util.LinkedHashMap;

/**
 * Lesson 0.1 â€“ Developer Environment Setup
 *
 * WHAT THIS DEMONSTRATES:
 *   How to verify your Java installation, print JVM system properties,
 *   and confirm that the environment is correctly configured.
 *
 * KEY TERMS:
 *   JVM  â€“ Java Virtual Machine, the engine that runs compiled Java bytecode.
 *   JDK  â€“ Java Development Kit, includes javac (compiler) and java (runtime).
 *   System.getProperty() â€“ reads a named JVM property at runtime.
 */
public class AnswerApp {

    public static void main(String[] args) {
        System.out.println("=== Lesson 0.1: Developer Environment Verification ===\n");

        // Collect the most useful environment properties.
        // LinkedHashMap preserves insertion order so output is consistent.
        Map<String, String> env = new LinkedHashMap<>();
        env.put("Java version",   System.getProperty("java.version"));
        env.put("Java vendor",    System.getProperty("java.vendor"));
        env.put("JVM name",       System.getProperty("java.vm.name"));
        env.put("OS name",        System.getProperty("os.name"));
        env.put("OS architecture",System.getProperty("os.arch"));
        env.put("User name",      System.getProperty("user.name"));
        env.put("Working dir",    System.getProperty("user.dir"));

        // Print each property with consistent alignment
        int labelWidth = 18;
        env.forEach((key, value) ->
            System.out.printf("%-" + labelWidth + "s : %s%n", key, value)
        );

        System.out.println("\n--- Minimum requirements check ---");
        checkMinimumJavaVersion(System.getProperty("java.version"));

        System.out.println("\nStatus: ENVIRONMENT READY âœ“");
    }

    /**
     * Validates that the running JDK is at least version 17.
     * Java version strings look like "17.0.3", "21.0.1", etc.
     *
     * @param version the raw java.version property string
     */
    private static void checkMinimumJavaVersion(String version) {
        // Split on '.' to get the major version number
        int major = Integer.parseInt(version.split("\\.")[0]);

        if (major >= 17) {
            System.out.printf("Java %d detected â€“ meets minimum requirement (17+) âœ“%n", major);
        } else {
            System.out.printf(
                "WARNING: Java %d detected â€“ please upgrade to Java 17 or later âœ—%n", major);
        }
    }
}
