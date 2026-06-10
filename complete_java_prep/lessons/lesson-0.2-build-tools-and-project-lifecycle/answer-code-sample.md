# Answer Code Sample - Lesson 0.2: Build Tools and Project Lifecycle

## Java Answer (Complete Runnable)

~~~java
import java.util.Arrays;
import java.util.List;

/**
 * Lesson 0.2 â€“ Build Tools and Project Lifecycle
 *
 * WHAT THIS DEMONSTRATES:
 *   The standard Maven build lifecycle phases and how Gradle mirrors them.
 *   We simulate each phase as a named method to make the flow tangible.
 *
 * KEY TERMS:
 *   Maven lifecycle  â€“ ordered phases: validate â†’ compile â†’ test â†’
 *                      package â†’ verify â†’ install â†’ deploy.
 *   pom.xml          â€“ Maven Project Object Model, describes dependencies
 *                      and build configuration.
 *   artifact         â€“ the output of a build (e.g., a .jar file).
 *   dependency scope â€“ controls when a dependency is on the classpath
 *                      (compile, test, provided, runtime).
 */
public class AnswerApp {

    // Represent each Maven lifecycle phase as a string constant
    private static final List<String> MAVEN_PHASES = Arrays.asList(
        "validate",   // Verify the project is correct and info is available
        "compile",    // Compile source code into .class bytecode
        "test",       // Run unit tests using a test framework (JUnit)
        "package",    // Bundle compiled classes into a JAR or WAR
        "verify",     // Run integration checks on the packaged artifact
        "install",    // Install artifact into the local ~/.m2 repository
        "deploy"      // Copy the final artifact to a remote repository
    );

    public static void main(String[] args) {
        System.out.println("=== Lesson 0.2: Maven Build Lifecycle Simulation ===\n");

        // Walk through every phase, simulating what Maven does
        for (int i = 0; i < MAVEN_PHASES.size(); i++) {
            String phase = MAVEN_PHASES.get(i);
            executePhase(i + 1, phase);
        }

        System.out.println("\n--- Dependency Scope Reference ---");
        printDependencyScopes();

        System.out.println("\n--- Gradle equivalent commands ---");
        printGradleEquivalents();
    }

    /**
     * Simulates executing a lifecycle phase.
     * In a real Maven build, each phase delegates to one or more plugin goals.
     *
     * @param step   phase number (1-based)
     * @param phase  phase name
     */
    private static void executePhase(int step, String phase) {
        // Map phases to representative actions
        String action = switch (phase) {
            case "validate" -> "Checking pom.xml syntax and required properties";
            case "compile"  -> "Compiling src/main/java/**/*.java â†’ target/classes/";
            case "test"     -> "Running JUnit tests in src/test/java/";
            case "package"  -> "Creating target/myapp-1.0.0.jar";
            case "verify"   -> "Running integration tests against packaged JAR";
            case "install"  -> "Copying JAR to ~/.m2/repository/com/example/myapp/";
            case "deploy"   -> "Uploading JAR to Nexus/Artifactory repository";
            default         -> "Executing " + phase;
        };
        System.out.printf("[%d] %-10s  â†’  %s%n", step, phase.toUpperCase(), action);
    }

    /** Prints a table of Maven dependency scopes and when they apply. */
    private static void printDependencyScopes() {
        String[][] scopes = {
            {"compile",  "Default. Available everywhere: compile, test, runtime."},
            {"test",     "Only during compilation and execution of tests."},
            {"provided", "Compile and test; excluded from the packaged artifact."},
            {"runtime",  "Not needed at compile time but required at runtime."},
            {"import",   "BOM imports only; used in dependencyManagement."}
        };
        System.out.printf("%-10s  %s%n", "SCOPE", "DESCRIPTION");
        System.out.println("-".repeat(65));
        for (String[] row : scopes) {
            System.out.printf("%-10s  %s%n", row[0], row[1]);
        }
    }

    /** Shows common Gradle equivalents for Maven commands. */
    private static void printGradleEquivalents() {
        String[][] equiv = {
            {"mvn compile",           "gradle compileJava"},
            {"mvn test",              "gradle test"},
            {"mvn package",           "gradle jar"},
            {"mvn install",           "gradle publishToMavenLocal"},
            {"mvn dependency:tree",   "gradle dependencies"}
        };
        System.out.printf("%-35s  %s%n", "Maven", "Gradle");
        System.out.println("-".repeat(65));
        for (String[] row : equiv) {
            System.out.printf("%-35s  %s%n", row[0], row[1]);
        }
    }
}

~~~
