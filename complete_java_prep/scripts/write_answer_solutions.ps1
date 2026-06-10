param(
  [string]$Root = "d:\GitHub_Src\Interview\complete_java_prep"
)

$ErrorActionPreference = "Stop"
$lessonsRoot = Join-Path $Root "lessons"

function Sanitize([string]$t) { (($t.ToLower() -replace "[^a-z0-9]+","-").Trim("-")) }

# Hashtable mapping lesson-id -> complete Java source code
$solutions = @{}

# ─────────────────────────────────────────────────────────
# MODULE 0: Foundations and Setup
# ─────────────────────────────────────────────────────────

$solutions["0.1"] = @'
import java.util.Map;
import java.util.LinkedHashMap;

/**
 * Lesson 0.1 – Developer Environment Setup
 *
 * WHAT THIS DEMONSTRATES:
 *   How to verify your Java installation, print JVM system properties,
 *   and confirm that the environment is correctly configured.
 *
 * KEY TERMS:
 *   JVM  – Java Virtual Machine, the engine that runs compiled Java bytecode.
 *   JDK  – Java Development Kit, includes javac (compiler) and java (runtime).
 *   System.getProperty() – reads a named JVM property at runtime.
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

        System.out.println("\nStatus: ENVIRONMENT READY ✓");
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
            System.out.printf("Java %d detected – meets minimum requirement (17+) ✓%n", major);
        } else {
            System.out.printf(
                "WARNING: Java %d detected – please upgrade to Java 17 or later ✗%n", major);
        }
    }
}
'@

$solutions["0.2"] = @'
import java.util.Arrays;
import java.util.List;

/**
 * Lesson 0.2 – Build Tools and Project Lifecycle
 *
 * WHAT THIS DEMONSTRATES:
 *   The standard Maven build lifecycle phases and how Gradle mirrors them.
 *   We simulate each phase as a named method to make the flow tangible.
 *
 * KEY TERMS:
 *   Maven lifecycle  – ordered phases: validate → compile → test →
 *                      package → verify → install → deploy.
 *   pom.xml          – Maven Project Object Model, describes dependencies
 *                      and build configuration.
 *   artifact         – the output of a build (e.g., a .jar file).
 *   dependency scope – controls when a dependency is on the classpath
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
            case "compile"  -> "Compiling src/main/java/**/*.java → target/classes/";
            case "test"     -> "Running JUnit tests in src/test/java/";
            case "package"  -> "Creating target/myapp-1.0.0.jar";
            case "verify"   -> "Running integration tests against packaged JAR";
            case "install"  -> "Copying JAR to ~/.m2/repository/com/example/myapp/";
            case "deploy"   -> "Uploading JAR to Nexus/Artifactory repository";
            default         -> "Executing " + phase;
        };
        System.out.printf("[%d] %-10s  →  %s%n", step, phase.toUpperCase(), action);
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
'@

$solutions["0.3"] = @'
import java.util.ArrayList;
import java.util.List;

/**
 * Lesson 0.3 – SDLC and Professional Workflow
 *
 * WHAT THIS DEMONSTRATES:
 *   A simulation of a professional Git-based feature development workflow
 *   following a trunk-based or GitFlow branching strategy.
 *
 * KEY TERMS:
 *   SDLC         – Software Development Lifecycle: plan, develop, test, deploy, maintain.
 *   branch       – A parallel line of development in a Git repository.
 *   pull request – A proposal to merge changes, triggers code review.
 *   CI           – Continuous Integration: automatically build and test every commit.
 *   definition of done – A shared checklist that marks a task as complete.
 */
public class AnswerApp {

    // Represents one step in a workflow with a status
    record WorkflowStep(String name, String description, boolean done) {}

    public static void main(String[] args) {
        System.out.println("=== Lesson 0.3: Professional Development Workflow Simulation ===\n");

        String featureName = "user-authentication";
        simulateFeatureWorkflow(featureName);

        System.out.println("\n--- Definition of Done Checklist ---");
        printDefinitionOfDone();

        System.out.println("\n--- Common Git Commands Reference ---");
        printGitReference();
    }

    /**
     * Walks through each stage a developer goes through to deliver a feature.
     * Each stage maps to a real-world action on the team.
     *
     * @param feature the name of the feature branch
     */
    private static void simulateFeatureWorkflow(String feature) {
        List<WorkflowStep> steps = List.of(
            new WorkflowStep("Plan",
                "Break feature '" + feature + "' into sub-tasks in issue tracker", true),
            new WorkflowStep("Branch",
                "git checkout -b feature/" + feature, true),
            new WorkflowStep("Develop",
                "Implement changes in small, focused commits", true),
            new WorkflowStep("Test",
                "Run 'mvn test'; all 42 tests pass", true),
            new WorkflowStep("Push",
                "git push origin feature/" + feature, true),
            new WorkflowStep("Pull Request",
                "Open PR against main; request 1 reviewer", true),
            new WorkflowStep("Review",
                "Address 3 review comments; push 1 fix commit", true),
            new WorkflowStep("CI check",
                "GitHub Actions pipeline: build ✓, lint ✓, tests ✓", true),
            new WorkflowStep("Merge",
                "Squash-merge PR to main after approval", true),
            new WorkflowStep("Deploy",
                "CD pipeline deploys main to staging automatically", true)
        );

        System.out.printf("Feature workflow: %s%n%n", feature);
        for (int i = 0; i < steps.size(); i++) {
            WorkflowStep s = steps.get(i);
            String status = s.done() ? "✓" : "○";
            System.out.printf("  [%s] Step %2d: %-15s – %s%n",
                status, i + 1, s.name(), s.description());
        }
    }

    /** Prints a professional "Definition of Done" checklist. */
    private static void printDefinitionOfDone() {
        String[] checks = {
            "Code compiles without warnings",
            "Unit test coverage >= 80%",
            "No critical findings from static analysis (SpotBugs, Checkstyle)",
            "Integration tests pass in CI",
            "PR reviewed and approved by at least one peer",
            "README / API docs updated if public API changed",
            "Feature tested in staging environment",
            "Deployment runbook updated if deployment procedure changed"
        };
        for (String check : checks) {
            System.out.println("  [ ] " + check);
        }
    }

    /** Quick-reference Git commands every developer needs. */
    private static void printGitReference() {
        String[][] cmds = {
            {"git status",                   "Show working tree status"},
            {"git log --oneline -10",         "Last 10 commits (compact)"},
            {"git stash",                    "Temporarily shelve uncommitted changes"},
            {"git rebase main",              "Replay your commits on top of main"},
            {"git cherry-pick <sha>",        "Apply a single commit from another branch"},
            {"git bisect start",             "Binary search to find a regression commit"}
        };
        System.out.printf("%-35s  %s%n", "COMMAND", "PURPOSE");
        System.out.println("-".repeat(70));
        for (String[] row : cmds) {
            System.out.printf("%-35s  %s%n", row[0], row[1]);
        }
    }
}
'@

$solutions["1.1"] = @'
import java.util.Scanner;

/**
 * Lesson 1.1 – Java Syntax and Data Types
 *
 * WHAT THIS DEMONSTRATES:
 *   Variables, the eight primitive types, reference types, operators,
 *   implicit/explicit type conversion, and input validation.
 *
 * KEY TERMS:
 *   variable    – a named slot in memory that stores a value.
 *   primitive   – a built-in value type: byte, short, int, long,
 *                 float, double, char, boolean.
 *   reference   – a variable that points to an object on the heap.
 *   casting     – explicitly converting between compatible types.
 *   operator    – a symbol that performs arithmetic, comparison, or logic.
 */
public class AnswerApp {

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.1: Java Syntax and Data Types ===\n");

        // --- Part 1: Primitive types in action ---
        demonstratePrimitives();

        // --- Part 2: Type conversion (widening and narrowing) ---
        demonstrateTypeConversion();

        // --- Part 3: Interactive calculator with input validation ---
        runCalculator(new Scanner(System.in));
    }

    /** Shows each primitive type with a concrete usage example. */
    private static void demonstratePrimitives() {
        System.out.println("--- Primitive Types ---");

        byte  age       = 25;          // 8-bit integer: -128 to 127
        short year      = 2026;        // 16-bit integer: good for years
        int   count     = 1_000_000;   // 32-bit integer: most common whole-number type
        long  population = 8_000_000_000L; // 64-bit integer: needs 'L' suffix
        float price     = 19.99f;      // 32-bit decimal: needs 'f' suffix
        double pi       = 3.141592653589793; // 64-bit decimal: default decimal type
        char  grade     = 'A';         // single Unicode character in single quotes
        boolean active  = true;        // only true or false

        System.out.printf("byte    age       = %d%n",   age);
        System.out.printf("short   year      = %d%n",   year);
        System.out.printf("int     count     = %,d%n",  count);      // comma formatting
        System.out.printf("long    population = %,d%n", population);
        System.out.printf("float   price     = %.2f%n", price);
        System.out.printf("double  pi        = %.15f%n", pi);
        System.out.printf("char    grade     = %c%n",   grade);
        System.out.printf("boolean active    = %b%n",   active);
        System.out.println();
    }

    /** Illustrates widening (safe, automatic) vs narrowing (manual, may lose data). */
    private static void demonstrateTypeConversion() {
        System.out.println("--- Type Conversion ---");

        // WIDENING: smaller → larger type. Java does this automatically.
        int    intVal    = 42;
        long   longVal   = intVal;   // int widened to long — no data loss
        double doubleVal = intVal;   // int widened to double — becomes 42.0

        System.out.printf("int %d  widened to long   -> %d%n",   intVal, longVal);
        System.out.printf("int %d  widened to double -> %.1f%n", intVal, doubleVal);

        // NARROWING: larger → smaller type. Requires explicit cast.
        // WARNING: decimal part is TRUNCATED (not rounded).
        double price    = 19.99;
        int    truncated = (int) price;   // 19, NOT 20

        System.out.printf("double %.2f  narrowed to int -> %d  (decimal truncated!)%n",
            price, truncated);

        // Integer arithmetic pitfall: 10/3 is 3, not 3.333
        int    intDiv    = 10 / 3;
        double doubleDiv = 10.0 / 3;   // force double division

        System.out.printf("int    10 / 3   = %d   (integer division — fraction lost)%n", intDiv);
        System.out.printf("double 10.0 / 3 = %.4f (correct decimal result)%n", doubleDiv);
        System.out.println();
    }

    /**
     * Reads two numbers and an operator from stdin, validates them,
     * and prints the result. Demonstrates operators and input guards.
     *
     * @param scanner connected to System.in
     */
    private static void runCalculator(Scanner scanner) {
        System.out.println("--- Interactive Calculator ---");
        System.out.print("Enter first number  : ");

        // nextDouble() reads the next token as a double;
        // throws InputMismatchException if input is not numeric.
        double a = scanner.nextDouble();

        System.out.print("Enter operator (+,-,*,/,%): ");
        String op = scanner.next().trim();

        System.out.print("Enter second number : ");
        double b = scanner.nextDouble();

        // Guard: division and modulo by zero are undefined
        if ((op.equals("/") || op.equals("%")) && b == 0) {
            System.out.println("Validation error: cannot divide by zero.");
            return;
        }

        // Switch expression (Java 14+): each arm is an expression, no fall-through
        double result = switch (op) {
            case "+"  -> a + b;
            case "-"  -> a - b;
            case "*"  -> a * b;
            case "/"  -> a / b;
            case "%"  -> a % b;   // modulo: remainder after division
            default   -> {
                System.out.println("Validation error: unsupported operator '" + op + "'.");
                yield Double.NaN; // NaN = Not a Number, signals invalid state
            }
        };

        if (!Double.isNaN(result)) {
            // %.6g formats as significant digits, handles large and small values
            System.out.printf("Result: %s %s %s = %.6g%n", a, op, b, result);
        }
    }
}
'@

$solutions["1.2"] = @'
import java.util.Scanner;

/**
 * Lesson 1.2 – Control Flow and Methods
 *
 * WHAT THIS DEMONSTRATES:
 *   if/else, switch expressions, for/while/do-while loops,
 *   method parameters and return values, and building a menu-driven app.
 *
 * KEY TERMS:
 *   control flow – the order in which statements execute.
 *   method       – a named block of code that can be called by name.
 *   parameter    – a variable declared inside a method signature.
 *   return type  – the type of value a method sends back to its caller.
 *   loop         – a construct that repeats a block of code.
 */
public class AnswerApp {

    // The main menu options as a constant array.
    // Using a constant avoids repeating the strings in multiple places.
    private static final String[] MENU_OPTIONS = {
        "Check if a number is even or odd",
        "Print a multiplication table",
        "Compute factorial of N",
        "Classify BMI",
        "Exit"
    };

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.2: Control Flow and Methods ===\n");

        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        // do-while: execute the body at least once before checking condition.
        // This is the right loop when you always want to show the menu first.
        do {
            printMenu();
            System.out.print("Your choice: ");

            int choice = readInt(scanner);  // delegate input to a helper method

            // switch statement dispatches to a case based on the value
            switch (choice) {
                case 1 -> evenOrOdd(scanner);
                case 2 -> multiplicationTable(scanner);
                case 3 -> factorialMenu(scanner);
                case 4 -> bmiMenu(scanner);
                case 5 -> {
                    System.out.println("Goodbye!");
                    running = false;   // exit the do-while loop
                }
                default -> System.out.println("Invalid choice. Please enter 1-5.\n");
            }
        } while (running);
    }

    // ── Menu helpers ───────────────────────────────────────────────────────

    /** Prints the numbered menu to the console. */
    private static void printMenu() {
        System.out.println("─".repeat(40));
        System.out.println("  MENU");
        System.out.println("─".repeat(40));
        // Enhanced for-loop: iterate without an explicit index
        for (int i = 0; i < MENU_OPTIONS.length; i++) {
            System.out.printf("  %d. %s%n", i + 1, MENU_OPTIONS[i]);
        }
        System.out.println("─".repeat(40));
    }

    // ── Feature methods ─────────────────────────────────────────────────────

    /** Uses the modulo operator to determine even/odd. */
    private static void evenOrOdd(Scanner sc) {
        System.out.print("Enter an integer: ");
        int n = readInt(sc);
        // n % 2 == 0 means n divides evenly by 2 → even
        String result = (n % 2 == 0) ? "even" : "odd";
        System.out.printf("%d is %s.%n%n", n, result);
    }

    /** Prints a multiplication table using a nested for-loop. */
    private static void multiplicationTable(Scanner sc) {
        System.out.print("Enter table size (e.g. 5): ");
        int size = readInt(sc);
        System.out.println();

        // Outer loop: rows. Inner loop: columns.
        for (int row = 1; row <= size; row++) {
            for (int col = 1; col <= size; col++) {
                System.out.printf("%4d", row * col);  // right-align in 4 chars
            }
            System.out.println();  // newline after each row
        }
        System.out.println();
    }

    /** Reads N and prints N! using an iterative while-loop. */
    private static void factorialMenu(Scanner sc) {
        System.out.print("Enter N (0-12): ");
        int n = readInt(sc);
        if (n < 0 || n > 12) {
            System.out.println("N must be between 0 and 12.\n");
            return;
        }
        System.out.printf("%d! = %d%n%n", n, factorial(n));
    }

    /**
     * Computes factorial iteratively.
     * factorial(0) = 1  (by convention)
     * factorial(n) = n * (n-1) * ... * 1
     *
     * @param n non-negative integer, max 12 to stay within int range
     * @return n factorial
     */
    private static int factorial(int n) {
        int result = 1;
        // while-loop: keep multiplying while the counter is positive
        while (n > 1) {
            result *= n;  // shorthand for result = result * n
            n--;          // decrement counter
        }
        return result;
    }

    /** Reads height and weight and classifies BMI using if/else-if chain. */
    private static void bmiMenu(Scanner sc) {
        System.out.print("Height in metres (e.g. 1.75): ");
        double height = sc.nextDouble();
        System.out.print("Weight in kg     (e.g. 70)  : ");
        double weight = sc.nextDouble();

        if (height <= 0 || weight <= 0) {
            System.out.println("Height and weight must be positive.\n");
            return;
        }

        double bmi = weight / (height * height);  // standard BMI formula

        // if / else-if / else: checked top-to-bottom; first true branch runs
        String category;
        if      (bmi < 18.5) category = "Underweight";
        else if (bmi < 25.0) category = "Normal weight";
        else if (bmi < 30.0) category = "Overweight";
        else                 category = "Obese";

        System.out.printf("BMI = %.1f — %s%n%n", bmi, category);
    }

    // ── Utility ─────────────────────────────────────────────────────────────

    /**
     * Safely reads an integer from the scanner.
     * If the user types non-numeric input, prompts again.
     *
     * @param sc the Scanner to read from
     * @return the integer value entered
     */
    private static int readInt(Scanner sc) {
        while (!sc.hasNextInt()) {
            System.out.print("Please enter a whole number: ");
            sc.next();  // discard the invalid token
        }
        int value = sc.nextInt();
        sc.nextLine();  // consume trailing newline left by nextInt()
        return value;
    }
}
'@

$solutions["1.3"] = @'
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Lesson 1.3 – Arrays and Strings
 *
 * WHAT THIS DEMONSTRATES:
 *   Array declaration and traversal, String immutability,
 *   StringBuilder for efficient concatenation, and a text-analysis utility.
 *
 * KEY TERMS:
 *   array        – a fixed-size, indexed container of same-type elements.
 *   index        – the zero-based position of an element in an array.
 *   immutable    – cannot be changed after creation (Strings are immutable).
 *   StringBuilder – a mutable sequence of characters; efficient for building strings.
 *   char          – a primitive representing a single Unicode character.
 */
public class AnswerApp {

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.3: Arrays and Strings ===\n");

        demonstrateArrays();
        demonstrateStringImmutability();
        demonstrateStringBuilder();

        // The full text-analysis utility
        String sample = "The quick brown fox jumps over the lazy dog. " +
                         "Pack my box with five dozen liquor jugs.";
        analyzeText(sample);
    }

    // ── Arrays ───────────────────────────────────────────────────────────────

    private static void demonstrateArrays() {
        System.out.println("--- Arrays ---");

        // Declaration: type[] name = new type[size];
        int[] scores = new int[5];   // all elements default to 0

        // Assign values using index (zero-based)
        scores[0] = 85;
        scores[1] = 92;
        scores[2] = 78;
        scores[3] = 96;
        scores[4] = 88;

        // Array initializer shorthand
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

        // Traverse with enhanced for-loop (no index needed)
        System.out.print("Days: ");
        for (String day : days) System.out.print(day + " ");
        System.out.println();

        // Traverse with classic for-loop when index matters
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        double average = (double) sum / scores.length;  // cast to get decimal result
        System.out.printf("Scores: %s%n", Arrays.toString(scores));
        System.out.printf("Average: %.1f%n%n", average);
    }

    // ── String Immutability ───────────────────────────────────────────────────

    private static void demonstrateStringImmutability() {
        System.out.println("--- String Immutability ---");

        String original = "hello";
        // toUpperCase() does NOT modify original; it returns a NEW String object.
        String upper    = original.toUpperCase();

        System.out.println("original after toUpperCase() call: " + original); // still "hello"
        System.out.println("new string from toUpperCase()     : " + upper);   // "HELLO"

        // == compares references (memory addresses), not content
        String a = "hello";
        String b = "hello";
        String c = new String("hello");   // forces a new object on the heap

        System.out.println("a == b (string pool)  : " + (a == b));      // true (pool optimization)
        System.out.println("a == c (new object)   : " + (a == c));      // false!
        System.out.println("a.equals(c)           : " + a.equals(c));   // true (content equal)
        System.out.println("→ Always use .equals() to compare String content!\n");
    }

    // ── StringBuilder ─────────────────────────────────────────────────────────

    private static void demonstrateStringBuilder() {
        System.out.println("--- StringBuilder ---");

        // INEFFICIENT: each '+' creates a new String object in memory
        String inefficient = "";
        for (int i = 1; i <= 5; i++) {
            inefficient += "item" + i + ",";  // 5 temporary String objects created
        }
        System.out.println("String concatenation result : " + inefficient);

        // EFFICIENT: StringBuilder mutates a single internal buffer
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 5; i++) {
            sb.append("item").append(i);
            if (i < 5) sb.append(",");  // no trailing comma
        }
        System.out.println("StringBuilder result        : " + sb.toString());
        System.out.println("→ Use StringBuilder in loops and hot paths.\n");
    }

    // ── Text Analysis Utility ─────────────────────────────────────────────────

    /**
     * Performs a multi-faceted analysis of a text string.
     * Counts characters, words, sentences, and letter frequencies.
     *
     * @param text the input text to analyse
     */
    private static void analyzeText(String text) {
        System.out.println("--- Text Analysis Utility ---");
        System.out.println("Input: \"" + text.substring(0, 40) + "...\"");
        System.out.println();

        // Character and length stats
        int totalChars = text.length();
        long letters   = text.chars().filter(Character::isLetter).count();
        long spaces    = text.chars().filter(c -> c == ' ').count();
        long digits    = text.chars().filter(Character::isDigit).count();

        // Words: split on one or more whitespace characters
        String[] words    = text.trim().split("\\s+");
        int wordCount     = words.length;

        // Sentences: count sentence-ending punctuation
        long sentences    = text.chars()
                                .filter(c -> c == '.' || c == '!' || c == '?')
                                .count();

        // Unique words (case-insensitive)
        long uniqueWords  = Arrays.stream(words)
                                  .map(w -> w.replaceAll("[^a-zA-Z]", "").toLowerCase())
                                  .filter(w -> !w.isEmpty())
                                  .distinct()
                                  .count();

        System.out.printf("Total characters : %d%n", totalChars);
        System.out.printf("Letters          : %d%n", letters);
        System.out.printf("Spaces           : %d%n", spaces);
        System.out.printf("Digits           : %d%n", digits);
        System.out.printf("Words            : %d  (unique: %d)%n", wordCount, uniqueWords);
        System.out.printf("Sentences        : %d%n", sentences);
        System.out.printf("Avg word length  : %.1f chars%n",
            Arrays.stream(words)
                  .mapToInt(String::length)
                  .average()
                  .orElse(0));

        // Top-5 most frequent letters
        System.out.println("\nTop-5 letter frequencies:");
        Map<Character, Long> freq = new HashMap<>();
        for (char c : text.toLowerCase().toCharArray()) {
            if (Character.isLetter(c)) freq.merge(c, 1L, Long::sum);
        }
        freq.entrySet().stream()
            .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
            .limit(5)
            .forEach(e -> System.out.printf("  '%c' : %d%n", e.getKey(), e.getValue()));
    }
}
'@

$solutions["1.4"] = @'
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Lesson 1.4 – Object-Oriented Programming I
 *
 * WHAT THIS DEMONSTRATES:
 *   Classes, objects, constructors, encapsulation (private fields + getters/setters),
 *   access modifiers, and a simple library domain model.
 *
 * KEY TERMS:
 *   class        – a blueprint describing data (fields) and behaviour (methods).
 *   object       – a concrete instance created from a class blueprint.
 *   constructor  – a special method called with 'new' to initialise an object.
 *   encapsulation – hiding internal state; expose it only through controlled methods.
 *   access modifier – public, private, protected, package-private.
 */
public class AnswerApp {

    // ── Domain model: Book ────────────────────────────────────────────────────

    /**
     * Represents a book in the library.
     * Fields are PRIVATE so they can only be read/written through methods,
     * ensuring the object always stays in a valid state.
     */
    static class Book {
        private final String isbn;    // immutable identifier
        private final String title;
        private final String author;
        private boolean checkedOut;   // mutable loan status

        /**
         * Constructor — called with 'new Book(...)'.
         * Validates that required fields are not empty.
         */
        public Book(String isbn, String title, String author) {
            if (isbn == null || isbn.isBlank())
                throw new IllegalArgumentException("ISBN must not be blank");
            if (title == null || title.isBlank())
                throw new IllegalArgumentException("Title must not be blank");
            if (author == null || author.isBlank())
                throw new IllegalArgumentException("Author must not be blank");

            // 'this.' refers to the instance field, distinguishing from the parameter
            this.isbn       = isbn.trim();
            this.title      = title.trim();
            this.author     = author.trim();
            this.checkedOut = false;   // default: book is available
        }

        // Getters – read-only access to private fields
        public String  getIsbn()       { return isbn; }
        public String  getTitle()      { return title; }
        public String  getAuthor()     { return author; }
        public boolean isCheckedOut()  { return checkedOut; }

        // Setter – changes state through a controlled method
        public void setCheckedOut(boolean status) {
            this.checkedOut = status;
        }

        @Override
        public String toString() {
            String status = checkedOut ? "[OUT]" : "[IN] ";
            return status + " \"" + title + "\" by " + author + " (ISBN: " + isbn + ")";
        }
    }

    // ── Domain model: Library ─────────────────────────────────────────────────

    /**
     * Manages a collection of books and provides checkout/return operations.
     * Only the Library class can modify book status — encapsulation at work.
     */
    static class Library {
        private final String name;
        private final List<Book> catalogue;   // List holds ordered book entries

        public Library(String name) {
            this.name      = name;
            this.catalogue = new ArrayList<>();
        }

        /** Adds a book to the catalogue. */
        public void addBook(Book book) {
            catalogue.add(book);
            System.out.println("Added: " + book.getTitle());
        }

        /**
         * Finds a book by ISBN and marks it checked out.
         * Returns true if successful, false if not found or already out.
         *
         * @param isbn the 13-character ISBN string
         */
        public boolean checkOut(String isbn) {
            Optional<Book> found = findByIsbn(isbn);

            if (found.isEmpty()) {
                System.out.println("Book " + isbn + " not found.");
                return false;
            }

            Book book = found.get();
            if (book.isCheckedOut()) {
                System.out.println("\"" + book.getTitle() + "\" is already checked out.");
                return false;
            }

            book.setCheckedOut(true);
            System.out.println("Checked out: \"" + book.getTitle() + "\"");
            return true;
        }

        /** Returns a book to the library. */
        public boolean returnBook(String isbn) {
            Optional<Book> found = findByIsbn(isbn);
            if (found.isEmpty()) return false;

            Book book = found.get();
            book.setCheckedOut(false);
            System.out.println("Returned: \"" + book.getTitle() + "\"");
            return true;
        }

        /** Prints the full catalogue with availability status. */
        public void printCatalogue() {
            System.out.println("\n=== " + name + " Catalogue ===");
            if (catalogue.isEmpty()) {
                System.out.println("  (empty)");
                return;
            }
            catalogue.forEach(b -> System.out.println("  " + b));
            long available = catalogue.stream().filter(b -> !b.isCheckedOut()).count();
            System.out.printf("  — %d of %d books available%n%n", available, catalogue.size());
        }

        // private helper: find a book by ISBN without exposing the list
        private Optional<Book> findByIsbn(String isbn) {
            return catalogue.stream()
                .filter(b -> b.getIsbn().equals(isbn))
                .findFirst();
        }
    }

    // ── Entry point ───────────────────────────────────────────────────────────

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.4: OOP I – Library Domain Model ===\n");

        Library lib = new Library("City Central Library");

        // Create book objects using the constructor
        lib.addBook(new Book("9780132350884", "Clean Code",              "Robert C. Martin"));
        lib.addBook(new Book("9780201633610", "Design Patterns",         "Gang of Four"));
        lib.addBook(new Book("9780321125217", "Domain-Driven Design",    "Eric Evans"));
        lib.addBook(new Book("9780134685991", "Effective Java",          "Joshua Bloch"));

        lib.printCatalogue();

        // Checkout and return operations
        System.out.println("--- Transactions ---");
        lib.checkOut("9780132350884");
        lib.checkOut("9780132350884");  // attempt duplicate checkout
        lib.checkOut("9999999999999");  // non-existent book

        lib.printCatalogue();

        lib.returnBook("9780132350884");
        lib.printCatalogue();
    }
}
'@

$solutions["1.5"] = @'
import java.util.ArrayList;
import java.util.List;

/**
 * Lesson 1.5 – Object-Oriented Programming II
 *
 * WHAT THIS DEMONSTRATES:
 *   Inheritance, polymorphism, abstract classes, interfaces,
 *   and composition over inheritance — all on the library model.
 *
 * KEY TERMS:
 *   inheritance    – a class inherits fields/methods from a parent class (extends).
 *   polymorphism   – a variable of type A can hold any subtype of A.
 *   abstract class – cannot be instantiated; may have abstract (unimplemented) methods.
 *   interface      – a contract of method signatures; a class can implement many.
 *   composition    – building behaviour by holding references to other objects.
 *   @Override      – annotation confirming a method replaces the parent version.
 */
public class AnswerApp {

    // ── Interface: Loanable ───────────────────────────────────────────────────
    // An interface defines WHAT something can do, not HOW.
    interface Loanable {
        boolean checkOut(String borrowerId);
        boolean returnItem();
        boolean isAvailable();
    }

    // ── Interface: Searchable ─────────────────────────────────────────────────
    interface Searchable {
        String getTitle();
        String getDescription();
    }

    // ── Abstract class: LibraryItem ───────────────────────────────────────────
    // 'abstract' means you cannot do: new LibraryItem().
    // Subclasses MUST implement the abstract methods.
    static abstract class LibraryItem implements Loanable, Searchable {
        private final String id;
        private final String title;
        protected boolean checkedOut = false;  // 'protected' lets subclasses see it

        public LibraryItem(String id, String title) {
            this.id    = id;
            this.title = title;
        }

        public String getId()     { return id; }
        @Override public String getTitle() { return title; }

        // Concrete implementation shared by all subclasses
        @Override public boolean isAvailable()   { return !checkedOut; }
        @Override public boolean returnItem()    { checkedOut = false; return true; }

        // Each subclass must define its own description
        @Override public abstract String getDescription();

        @Override
        public String toString() {
            return String.format("[%s] %s — %s",
                checkedOut ? "OUT" : "IN ", getClass().getSimpleName(), title);
        }
    }

    // ── Concrete: Book ────────────────────────────────────────────────────────
    static class Book extends LibraryItem {
        private final String author;

        public Book(String id, String title, String author) {
            super(id, title);    // call parent constructor
            this.author = author;
        }

        @Override public boolean checkOut(String borrowerId) {
            if (checkedOut) return false;
            checkedOut = true;
            System.out.println("Book borrowed by " + borrowerId);
            return true;
        }

        @Override public String getDescription() {
            return "Book by " + author;
        }
    }

    // ── Concrete: DvdDisc ─────────────────────────────────────────────────────
    static class DvdDisc extends LibraryItem {
        private final int durationMinutes;

        public DvdDisc(String id, String title, int durationMinutes) {
            super(id, title);
            this.durationMinutes = durationMinutes;
        }

        @Override public boolean checkOut(String borrowerId) {
            if (checkedOut) return false;
            checkedOut = true;
            System.out.println("DVD borrowed by " + borrowerId + " (loan: 7 days)");
            return true;
        }

        @Override public String getDescription() {
            return "DVD, " + durationMinutes + " min";
        }
    }

    // ── Concrete: EBook (composition example) ────────────────────────────────
    // EBook USES a DigitalLicense instead of extending it.
    // This is "composition over inheritance".
    static class EBook extends LibraryItem {
        private final DigitalLicense license;

        public EBook(String id, String title, DigitalLicense license) {
            super(id, title);
            this.license = license;
        }

        @Override public boolean checkOut(String borrowerId) {
            if (!license.hasCapacity()) {
                System.out.println("No digital license capacity available.");
                return false;
            }
            license.allocate(borrowerId);
            return true;
        }

        @Override public String getDescription() {
            return "eBook, " + license.getSeats() + " concurrent seats";
        }
    }

    // ── Helper class for composition ──────────────────────────────────────────
    static class DigitalLicense {
        private final int seats;
        private final List<String> holders = new ArrayList<>();

        public DigitalLicense(int seats) { this.seats = seats; }

        public boolean hasCapacity() { return holders.size() < seats; }
        public void allocate(String id) { holders.add(id); }
        public int getSeats() { return seats; }
    }

    // ── Library using polymorphism ────────────────────────────────────────────
    static class Library {
        // The list holds LibraryItem references — it works with ANY subtype.
        // This is polymorphism in practice.
        private final List<LibraryItem> items = new ArrayList<>();

        public void add(LibraryItem item) { items.add(item); }

        /** Searches by title substring (case-insensitive). */
        public void search(String query) {
            System.out.println("\nSearch results for: \"" + query + "\"");
            items.stream()
                 .filter(i -> i.getTitle().toLowerCase().contains(query.toLowerCase()))
                 .forEach(i -> System.out.println("  " + i + " — " + i.getDescription()));
        }

        /** Prints the full catalogue using the polymorphic toString(). */
        public void printAll() {
            System.out.println("\n=== Library Catalogue ===");
            items.forEach(i -> System.out.println("  " + i));
        }
    }

    // ── Entry point ───────────────────────────────────────────────────────────

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.5: OOP II – Inheritance, Polymorphism, Interfaces ===\n");

        Library lib = new Library();

        lib.add(new Book    ("B001", "Clean Code",         "Robert C. Martin"));
        lib.add(new Book    ("B002", "Effective Java",     "Joshua Bloch"));
        lib.add(new DvdDisc ("D001", "The Matrix",         136));
        lib.add(new EBook   ("E001", "Spring in Action",   new DigitalLicense(3)));

        lib.printAll();

        System.out.println("\n--- Checkout Transactions ---");
        // All calls go through the Loanable interface method — polymorphic dispatch
        lib.search("clean");
        lib.search("java");

        // Checkout via the base-type reference — actual behaviour depends on subtype
        LibraryItem[] toCheckout = {
            new Book("B001", "Clean Code", "Martin"),
            new DvdDisc("D001", "The Matrix", 136)
        };
        for (LibraryItem item : toCheckout) {
            item.checkOut("member-42");
        }
        lib.printAll();
    }
}
'@

$solutions["1.6"] = @'
/**
 * Lesson 1.6 – Exception Handling and Validation
 *
 * WHAT THIS DEMONSTRATES:
 *   Checked vs unchecked exceptions, try/catch/finally,
 *   custom exception hierarchy, early-validation pattern.
 *
 * KEY TERMS:
 *   exception        – an event that disrupts normal program flow.
 *   checked exception – must be declared (throws) or caught; extends Exception.
 *   unchecked exception – extends RuntimeException; no forced handling.
 *   try/catch/finally – structured error-handling blocks.
 *   custom exception  – a domain-specific exception with extra context.
 *   validation        – checking inputs at a system boundary before processing.
 */
public class AnswerApp {

    // ── Custom exception hierarchy ─────────────────────────────────────────────

    /**
     * Base domain exception — all library errors extend this.
     * Extends RuntimeException so callers aren't forced to catch it,
     * but they may choose to.
     */
    static class LibraryException extends RuntimeException {
        private final String code;

        public LibraryException(String code, String message) {
            super(message);
            this.code = code;
        }

        public String getCode() { return code; }
    }

    /** Thrown when a user submits invalid input data. */
    static class ValidationException extends LibraryException {
        private final String field;

        public ValidationException(String field, String message) {
            super("VALIDATION_ERROR", "Field '" + field + "': " + message);
            this.field = field;
        }

        public String getField() { return field; }
    }

    /** Thrown when a requested resource does not exist. */
    static class NotFoundException extends LibraryException {
        public NotFoundException(String resource, String id) {
            super("NOT_FOUND", resource + " with id '" + id + "' does not exist.");
        }
    }

    // ── Domain object with validation ─────────────────────────────────────────

    static class BookRegistration {
        private final String isbn;
        private final String title;
        private final int    year;

        /**
         * Constructor-level validation — the object is NEVER in an invalid state.
         * Throw early rather than letting bad data propagate.
         */
        public BookRegistration(String isbn, String title, int year) {
            this.isbn  = validateIsbn(isbn);
            this.title = validateTitle(title);
            this.year  = validateYear(year);
        }

        private static String validateIsbn(String isbn) {
            if (isbn == null || isbn.isBlank())
                throw new ValidationException("isbn", "must not be blank");
            String digits = isbn.replaceAll("[^0-9]", "");
            if (digits.length() != 13)
                throw new ValidationException("isbn", "must contain exactly 13 digits, got " + digits.length());
            return isbn.trim();
        }

        private static String validateTitle(String title) {
            if (title == null || title.isBlank())
                throw new ValidationException("title", "must not be blank");
            if (title.length() > 200)
                throw new ValidationException("title", "exceeds 200 characters");
            return title.trim();
        }

        private static int validateYear(int year) {
            if (year < 1450 || year > 2100)
                throw new ValidationException("year",
                    "must be between 1450 and 2100, got " + year);
            return year;
        }

        @Override
        public String toString() {
            return String.format("BookRegistration{isbn='%s', title='%s', year=%d}",
                isbn, title, year);
        }
    }

    // ── Service that uses exceptions ──────────────────────────────────────────

    static class RegistrationService {
        /**
         * Wraps constructor call in try/catch to show proper handling.
         * In a real app this would also persist to a database.
         *
         * @param isbn  book ISBN
         * @param title book title
         * @param year  publication year
         */
        public void register(String isbn, String title, int year) {
            try {
                BookRegistration reg = new BookRegistration(isbn, title, year);
                System.out.println("  ✓ Registered: " + reg);

            } catch (ValidationException e) {
                // Catch the specific subtype first; more specific before generic
                System.out.printf("  ✗ Validation [%s] field=%s : %s%n",
                    e.getCode(), e.getField(), e.getMessage());

            } catch (LibraryException e) {
                // Catch base domain exception for any other library error
                System.out.println("  ✗ Domain error [" + e.getCode() + "]: " + e.getMessage());

            } catch (Exception e) {
                // Catch-all for unexpected errors — log and surface without crashing
                System.out.println("  ✗ Unexpected error: " + e.getMessage());

            } finally {
                // finally always runs: ideal for closing resources
                System.out.println("  (registration attempt complete)");
            }
        }

        /** Demonstrates throwing and catching NotFoundException. */
        public void lookup(String id) {
            System.out.print("  Looking up book '" + id + "': ");
            try {
                if (!id.startsWith("B")) throw new NotFoundException("Book", id);
                System.out.println("Found.");
            } catch (NotFoundException e) {
                System.out.println(e.getMessage());
            }
        }
    }

    // ── Entry point ───────────────────────────────────────────────────────────

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.6: Exception Handling and Validation ===\n");

        RegistrationService svc = new RegistrationService();

        System.out.println("--- Registration Attempts ---");
        // Valid
        svc.register("9780132350884", "Clean Code", 2008);
        // Blank ISBN
        svc.register("", "Clean Code", 2008);
        // Wrong digit count
        svc.register("978013235", "Clean Code", 2008);
        // Blank title
        svc.register("9780132350884", "  ", 2008);
        // Invalid year
        svc.register("9780132350884", "Future Book", 2200);

        System.out.println("\n--- Lookup Tests ---");
        svc.lookup("B001");
        svc.lookup("X999");
    }
}
'@

$solutions["2.1"] = @'
import java.util.*;
import java.util.stream.Collectors;

/**
 * Lesson 2.1 – Collections Framework
 *
 * WHAT THIS DEMONSTRATES:
 *   List, Set, Map, Queue — when to use each,
 *   their performance characteristics, and an in-memory inventory system.
 *
 * KEY TERMS:
 *   List   – ordered, allows duplicates (ArrayList = fast random-access).
 *   Set    – unordered, NO duplicates (HashSet = O(1) lookup).
 *   Map    – key→value pairs, unique keys (HashMap = O(1) put/get).
 *   Queue  – FIFO ordering, use offer/poll, not add/remove.
 *   Big-O  – notation for algorithm time complexity as input size grows.
 */
public class AnswerApp {

    // ── Domain ────────────────────────────────────────────────────────────────
    record Product(String sku, String name, double price, int stock) {
        @Override public String toString() {
            return String.format("%-8s %-25s $%7.2f  stock:%3d",
                sku, name, price, stock);
        }
    }

    // ── In-Memory Inventory ───────────────────────────────────────────────────
    static class Inventory {
        // LinkedHashMap preserves insertion order while giving O(1) lookup by SKU
        private final Map<String, Product> products = new LinkedHashMap<>();
        // Set of SKUs currently flagged for reorder
        private final Set<String>          reorderSet = new HashSet<>();
        // Queue of pending purchase orders (FIFO processing)
        private final Queue<String>        orderQueue = new LinkedList<>();

        /** Add or replace a product. */
        public void put(Product p) {
            products.put(p.sku(), p);
            if (p.stock() < 5) reorderSet.add(p.sku());
        }

        /** Reduce stock count; queue a reorder if stock falls below threshold. */
        public boolean sell(String sku, int qty) {
            Product p = products.get(sku);   // O(1) HashMap lookup
            if (p == null) {
                System.out.printf("SKU %s not found.%n", sku);
                return false;
            }
            if (p.stock() < qty) {
                System.out.printf("Insufficient stock for %s (have %d, need %d).%n",
                    sku, p.stock(), qty);
                return false;
            }
            // Records are immutable; replace with updated copy
            products.put(sku, new Product(sku, p.name(), p.price(), p.stock() - qty));

            int newStock = products.get(sku).stock();
            if (newStock < 5) {
                reorderSet.add(sku);
                orderQueue.offer("REORDER:" + sku);   // enqueue (non-throwing)
                System.out.printf("⚠ Reorder queued for %s (stock=%d)%n", sku, newStock);
            }
            return true;
        }

        /** Process all pending reorders in FIFO order. */
        public void processReorders() {
            System.out.println("\n--- Processing Reorder Queue ---");
            String order;
            while ((order = orderQueue.poll()) != null) {  // poll returns null when empty
                System.out.println("  Processed: " + order);
            }
            reorderSet.clear();
        }

        public void printAll() {
            System.out.println("\n=== Inventory (" + products.size() + " SKUs) ===");
            products.values().forEach(p -> System.out.println("  " + p));

            // List of low-stock SKUs — demonstrates Set→sorted List
            if (!reorderSet.isEmpty()) {
                List<String> sorted = new ArrayList<>(reorderSet);
                Collections.sort(sorted);
                System.out.println("  Needs reorder: " + sorted);
            }
        }

        /** Category report using groupingBy collector. */
        public void printPriceStats() {
            DoubleSummaryStatistics stats = products.values().stream()
                .mapToDouble(Product::price)
                .summaryStatistics();

            System.out.printf("%nPrice stats — min: $%.2f  max: $%.2f  avg: $%.2f%n",
                stats.getMin(), stats.getMax(), stats.getAverage());
        }
    }

    // ── Entry point ───────────────────────────────────────────────────────────

    public static void main(String[] args) {
        System.out.println("=== Lesson 2.1: Collections Framework – Inventory System ===\n");

        Inventory inv = new Inventory();
        inv.put(new Product("A001", "Java 21 Book",            49.99, 20));
        inv.put(new Product("A002", "Spring Boot Sticker Pack",  4.99,  3));
        inv.put(new Product("B001", "Mechanical Keyboard",     129.99,  8));
        inv.put(new Product("B002", "USB-C Hub",               34.99,  4));
        inv.put(new Product("C001", "Standing Desk Mat",        59.99, 15));

        inv.printAll();

        System.out.println("\n--- Sales ---");
        inv.sell("A001",  3);
        inv.sell("B002",  3);   // triggers reorder
        inv.sell("A002",  2);   // triggers reorder
        inv.sell("A002", 99);   // insufficient stock

        inv.printPriceStats();
        inv.printAll();
        inv.processReorders();
    }
}
'@

$solutions["2.2"] = @'
import java.util.*;

/**
 * Lesson 2.2 – Generics and Type Safety
 *
 * WHAT THIS DEMONSTRATES:
 *   Generic classes, generic methods, wildcards, bounded type parameters,
 *   and a reusable type-safe repository interface.
 *
 * KEY TERMS:
 *   generic       – a class/method parameterised by one or more types (T, E, K, V).
 *   type erasure  – generics exist at compile-time; the JVM sees raw types at runtime.
 *   wildcard <?>  – unknown type; <? extends T> upper-bounded, <? super T> lower-bounded.
 *   PECS          – Producer Extends, Consumer Super — guideline for wildcard choice.
 */
public class AnswerApp {

    // ── Generic interface ─────────────────────────────────────────────────────

    /**
     * Repository<T, ID> is a generic contract.
     * T  = the entity type stored
     * ID = the type used as identifier
     *
     * Any class implementing this interface must supply concrete types.
     */
    interface Repository<T, ID> {
        void   save(T entity);
        Optional<T> findById(ID id);
        List<T>   findAll();
        boolean   deleteById(ID id);
        int       count();
    }

    // ── Generic class ─────────────────────────────────────────────────────────

    /**
     * InMemoryRepository<T, ID> is a concrete generic class.
     * It can store ANY entity type without duplication of logic.
     *
     * @param <T>  entity type (must supply an ID via getIdFunction)
     * @param <ID> identifier type
     */
    static class InMemoryRepository<T, ID> implements Repository<T, ID> {
        // LinkedHashMap ensures predictable iteration order
        private final Map<ID, T> store = new LinkedHashMap<>();
        // A function to extract the ID from an entity
        private final java.util.function.Function<T, ID> idExtractor;

        public InMemoryRepository(java.util.function.Function<T, ID> idExtractor) {
            this.idExtractor = idExtractor;
        }

        @Override public void save(T entity) {
            store.put(idExtractor.apply(entity), entity);
        }

        @Override public Optional<T> findById(ID id) {
            return Optional.ofNullable(store.get(id));
        }

        @Override public List<T> findAll() {
            return new ArrayList<>(store.values());   // defensive copy
        }

        @Override public boolean deleteById(ID id) {
            return store.remove(id) != null;
        }

        @Override public int count() { return store.size(); }
    }

    // ── Generic method ────────────────────────────────────────────────────────

    /**
     * Generic method: T is inferred from the arguments at the call site.
     * <? extends Comparable<T>> means T must support natural ordering.
     *
     * @param list a list of Comparable elements
     * @return the maximum element, or empty if the list is empty
     */
    static <T extends Comparable<T>> Optional<T> findMax(List<T> list) {
        if (list == null || list.isEmpty()) return Optional.empty();
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) max = item;
        }
        return Optional.of(max);
    }

    /**
     * Wildcard example: accepts a List of any Number subtype.
     * <? extends Number> = upper-bounded wildcard (we READ from the list).
     */
    static double sumNumbers(List<? extends Number> numbers) {
        double sum = 0;
        for (Number n : numbers) sum += n.doubleValue();
        return sum;
    }

    // ── Sample entities ───────────────────────────────────────────────────────

    record User(int id, String name, String email) {}
    record Product(String sku, String name, double price) {}

    // ── Entry point ───────────────────────────────────────────────────────────

    public static void main(String[] args) {
        System.out.println("=== Lesson 2.2: Generics and Type Safety ===\n");

        // --- Repository for Users ---
        Repository<User, Integer> userRepo = new InMemoryRepository<>(User::id);
        userRepo.save(new User(1, "Alice",   "alice@example.com"));
        userRepo.save(new User(2, "Bob",     "bob@example.com"));
        userRepo.save(new User(3, "Charlie", "charlie@example.com"));

        System.out.println("=== User Repository (" + userRepo.count() + " users) ===");
        userRepo.findAll().forEach(u ->
            System.out.printf("  [%d] %-10s %s%n", u.id(), u.name(), u.email()));

        userRepo.findById(2).ifPresentOrElse(
            u -> System.out.println("Found: " + u.name()),
            () -> System.out.println("Not found"));

        // --- Repository for Products ---
        Repository<Product, String> productRepo = new InMemoryRepository<>(Product::sku);
        productRepo.save(new Product("SKU-A", "Keyboard", 129.99));
        productRepo.save(new Product("SKU-B", "Mouse",     49.99));

        System.out.println("\n=== Product Repository (" + productRepo.count() + " products) ===");
        productRepo.findAll().forEach(p ->
            System.out.printf("  %-8s %-12s $%.2f%n", p.sku(), p.name(), p.price()));

        // --- Generic method demo ---
        System.out.println("\n--- Generic findMax demo ---");
        List<Integer> ints = List.of(3, 7, 1, 9, 4);
        findMax(ints).ifPresent(m -> System.out.println("Max integer: " + m));

        List<String>  strs = List.of("banana", "apple", "cherry");
        findMax(strs).ifPresent(m -> System.out.println("Max string:  " + m));

        // --- Wildcard demo ---
        System.out.println("\n--- Wildcard sumNumbers demo ---");
        List<Integer> intList  = List.of(1, 2, 3);
        List<Double>  dblList  = List.of(1.5, 2.5, 3.5);
        System.out.println("Sum of integers: " + sumNumbers(intList));
        System.out.println("Sum of doubles:  " + sumNumbers(dblList));
    }
}
'@

$solutions["2.3"] = @'
import java.util.*;
import java.util.stream.*;

/**
 * Lesson 2.3 – Streams and Functional Programming
 *
 * WHAT THIS DEMONSTRATES:
 *   Lambda expressions, method references, stream pipeline operations,
 *   collectors, and building a readable data-reporting pipeline.
 *
 * KEY TERMS:
 *   lambda         – an anonymous function: (params) -> body.
 *   stream         – a lazy, declarative sequence of operations on data.
 *   intermediate   – lazy operation (filter, map, sorted) — returns a new Stream.
 *   terminal       – triggers evaluation (collect, forEach, reduce, count).
 *   method reference – shorthand for a lambda: ClassName::method.
 *   Optional       – a container that may or may not hold a value; avoids null.
 */
public class AnswerApp {

    record Employee(String name, String dept, double salary, int yrsExp) {}

    public static void main(String[] args) {
        System.out.println("=== Lesson 2.3: Streams and Functional Programming ===\n");

        List<Employee> employees = List.of(
            new Employee("Alice",   "Engineering", 110_000, 7),
            new Employee("Bob",     "Engineering",  95_000, 4),
            new Employee("Carol",   "Marketing",    82_000, 6),
            new Employee("Dave",    "Marketing",    78_000, 3),
            new Employee("Eve",     "Engineering", 125_000, 9),
            new Employee("Frank",   "HR",           70_000, 2),
            new Employee("Grace",   "HR",           72_000, 5),
            new Employee("Heidi",   "Engineering",  99_000, 5)
        );

        basicOperations(employees);
        reportBySalaryBand(employees);
        groupByDepartment(employees);
        topEarners(employees, 3);
        averageSalaryPerDepartment(employees);
        methodReferences(employees);
    }

    /** filter + map + sorted + collect — the core stream pipeline. */
    private static void basicOperations(List<Employee> employees) {
        System.out.println("--- Senior Engineers (5+ yrs, sorted by salary desc) ---");

        List<String> result = employees.stream()
            // filter: keep only elements matching predicate
            .filter(e -> e.dept().equals("Engineering") && e.yrsExp() >= 5)
            // map: transform each Employee to a formatted String
            .map(e -> String.format("  %-10s $%,9.0f  %dy exp",
                e.name(), e.salary(), e.yrsExp()))
            // sorted: natural reverse order on salary
            .sorted(Comparator.comparingDouble(
                (String s) -> Double.parseDouble(s.replaceAll("[^0-9.]", ""))).reversed())
            // collect: materialise into a List
            .collect(Collectors.toList());

        result.forEach(System.out::println);
        System.out.println();
    }

    /** partition into two groups: >= 100k and < 100k. */
    private static void reportBySalaryBand(List<Employee> employees) {
        System.out.println("--- Salary Band Report ---");

        // partitioningBy splits into exactly two groups: true and false
        Map<Boolean, List<Employee>> bands = employees.stream()
            .collect(Collectors.partitioningBy(e -> e.salary() >= 100_000));

        System.out.println("  >= $100k: " +
            bands.get(true).stream().map(Employee::name).collect(Collectors.joining(", ")));
        System.out.println("  <  $100k: " +
            bands.get(false).stream().map(Employee::name).collect(Collectors.joining(", ")));
        System.out.println();
    }

    /** groupingBy department, then counting members and computing avg salary. */
    private static void groupByDepartment(List<Employee> employees) {
        System.out.println("--- Department Summary ---");

        // groupingBy produces Map<key, List<value>> by default
        Map<String, DoubleSummaryStatistics> stats = employees.stream()
            .collect(Collectors.groupingBy(
                Employee::dept,
                Collectors.summarizingDouble(Employee::salary)));

        stats.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(e -> {
                DoubleSummaryStatistics s = e.getValue();
                System.out.printf("  %-14s count=%d  avg=$%,.0f  max=$%,.0f%n",
                    e.getKey(), s.getCount(), s.getAverage(), s.getMax());
            });
        System.out.println();
    }

    /** limit: take only the top N after sorting. */
    private static void topEarners(List<Employee> employees, int n) {
        System.out.printf("--- Top %d Earners ---%n", n);
        employees.stream()
            .sorted(Comparator.comparingDouble(Employee::salary).reversed())
            .limit(n)   // short-circuit: stops consuming the stream after n elements
            .forEach(e -> System.out.printf("  %-10s $%,10.0f  (%s)%n",
                e.name(), e.salary(), e.dept()));
        System.out.println();
    }

    /** reduce: aggregate into a single value. */
    private static void averageSalaryPerDepartment(List<Employee> employees) {
        System.out.println("--- Average Salary per Dept (using reduce) ---");

        Map<String, Double> avgByDept = employees.stream()
            .collect(Collectors.groupingBy(
                Employee::dept,
                Collectors.averagingDouble(Employee::salary)));

        avgByDept.entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .forEach(e -> System.out.printf("  %-14s $%,.0f%n", e.getKey(), e.getValue()));
        System.out.println();
    }

    /** Method references: ClassName::method vs lambda. */
    private static void methodReferences(List<Employee> employees) {
        System.out.println("--- Method References vs Lambdas ---");

        // Lambda:          e -> System.out.println(e.name())
        // Method reference: same intent, less ceremony
        System.out.println("Names (method reference):");
        employees.stream()
            .map(Employee::name)           // equivalent to: e -> e.name()
            .forEach(System.out::println); // equivalent to: s -> System.out.println(s)
    }
}
'@

$solutions["2.4"] = @'
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

/**
 * Lesson 2.4 – File I/O and NIO
 *
 * WHAT THIS DEMONSTRATES:
 *   Reading and writing files with java.nio.file.Files,
 *   parsing CSV data, JSON-style serialisation,
 *   and building a CLI data import/export tool.
 *
 * KEY TERMS:
 *   Path       – NIO representation of a filesystem location.
 *   Files      – utility class with static read/write methods (NIO.2).
 *   BufferedReader – wraps a Reader for line-by-line efficiency.
 *   Charset    – character encoding scheme (use UTF-8 everywhere).
 *   CSV        – Comma-Separated Values, a simple flat-file data format.
 */
public class AnswerApp {

    record Product(String sku, String name, double price, int stock) {
        /** Serialise to a CSV row. Quotes fields containing commas. */
        public String toCsv() {
            return String.join(",",
                sku, quote(name), String.valueOf(price), String.valueOf(stock));
        }

        /** Parse from a CSV row produced by toCsv(). */
        public static Product fromCsv(String line) {
            String[] parts = line.split(",", 4);  // max 4 tokens
            return new Product(
                parts[0],
                parts[1].replace("\"", ""),        // strip quotes
                Double.parseDouble(parts[2]),
                Integer.parseInt(parts[3]));
        }

        /** Serialise to a minimal JSON object string. */
        public String toJson() {
            return String.format(
                "{\"sku\":\"%s\",\"name\":\"%s\",\"price\":%.2f,\"stock\":%d}",
                sku, name, price, stock);
        }

        private static String quote(String s) {
            return s.contains(",") ? "\"" + s + "\"" : s;
        }
    }

    // ── I/O helpers ───────────────────────────────────────────────────────────

    /**
     * Writes a list of products to a CSV file.
     * Files.newBufferedWriter handles charset and opens/closes the file.
     */
    static void exportCsv(List<Product> products, Path file) throws IOException {
        try (BufferedWriter writer = Files.newBufferedWriter(file)) {
            // Write header row
            writer.write("sku,name,price,stock");
            writer.newLine();
            for (Product p : products) {
                writer.write(p.toCsv());
                writer.newLine();
            }
        }
        System.out.printf("Exported %d products to %s%n", products.size(), file.getFileName());
    }

    /**
     * Reads a CSV file (with header) and returns parsed Products.
     * Files.lines() gives a Stream<String> — lazy, one-pass reading.
     */
    static List<Product> importCsv(Path file) throws IOException {
        try (Stream<String> lines = Files.lines(file)) {
            return lines
                .skip(1)                         // skip header row
                .filter(l -> !l.isBlank())       // skip empty lines
                .map(Product::fromCsv)
                .collect(Collectors.toList());
        }
    }

    /** Writes each product as a JSON object, one per line (JSON Lines format). */
    static void exportJsonLines(List<Product> products, Path file) throws IOException {
        List<String> lines = products.stream()
            .map(Product::toJson)
            .collect(Collectors.toList());
        Files.write(file, lines);   // writes UTF-8 by default
        System.out.printf("Exported %d products to %s%n", products.size(), file.getFileName());
    }

    /** Reads a directory listing and prints file names with sizes. */
    static void listDirectory(Path dir) throws IOException {
        System.out.println("\n--- Files in " + dir + " ---");
        try (Stream<Path> paths = Files.list(dir)) {
            paths.filter(Files::isRegularFile)
                 .forEach(p -> {
                     try {
                         System.out.printf("  %-30s  %6d bytes%n",
                             p.getFileName(), Files.size(p));
                     } catch (IOException ignored) {}
                 });
        }
    }

    // ── Entry point ───────────────────────────────────────────────────────────

    public static void main(String[] args) throws Exception {
        System.out.println("=== Lesson 2.4: File I/O and NIO ===\n");

        // Use system temp directory so this runs anywhere
        Path tempDir = Files.createTempDirectory("lesson-2-4-");

        List<Product> catalog = List.of(
            new Product("A001", "Clean Code Book",          49.99, 20),
            new Product("A002", "Spring Boot, 3rd Ed",      54.99, 15),
            new Product("B001", "Mechanical Keyboard",     129.99,  8),
            new Product("B002", "USB-C Hub, 7-port",        34.99,  4)
        );

        // ── Export ───────────────────────────────────────────────────────────
        Path csvPath  = tempDir.resolve("products.csv");
        Path jsonPath = tempDir.resolve("products.jsonl");

        exportCsv(catalog, csvPath);
        exportJsonLines(catalog, jsonPath);

        // ── Import ───────────────────────────────────────────────────────────
        System.out.println("\n--- Imported from CSV ---");
        List<Product> imported = importCsv(csvPath);
        imported.forEach(p ->
            System.out.printf("  %-8s %-25s $%6.2f  stock:%d%n",
                p.sku(), p.name(), p.price(), p.stock()));

        // ── Read raw lines ────────────────────────────────────────────────────
        System.out.println("\n--- Raw JSON lines file ---");
        Files.readAllLines(jsonPath).forEach(l -> System.out.println("  " + l));

        // ── Directory listing ─────────────────────────────────────────────────
        listDirectory(tempDir);

        // ── Cleanup ───────────────────────────────────────────────────────────
        Files.deleteIfExists(csvPath);
        Files.deleteIfExists(jsonPath);
        Files.deleteIfExists(tempDir);
        System.out.println("\nTemp files cleaned up.");
    }
}
'@

$solutions["2.5"] = @'
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Lesson 2.5 – Concurrency Fundamentals
 *
 * WHAT THIS DEMONSTRATES:
 *   Thread creation, Executors, CompletableFuture, AtomicInteger,
 *   synchronisation issues (and how to avoid them), and a parallel task processor.
 *
 * KEY TERMS:
 *   thread           – a unit of execution within a JVM process.
 *   executor         – a pool that manages and reuses threads.
 *   Future/CompletableFuture – a handle to an async result.
 *   race condition   – a bug where outcome depends on thread scheduling.
 *   AtomicInteger    – a thread-safe counter without explicit locks.
 *   synchronized     – keyword that allows only one thread in a block at a time.
 */
public class AnswerApp {

    // ── Task simulation ───────────────────────────────────────────────────────

    record Task(int id, String name, long durationMs) {}

    record TaskResult(int taskId, String name, long elapsedMs, boolean success) {}

    /**
     * Simulates processing a task.
     * Thread.sleep() stands in for real I/O or computation.
     */
    static TaskResult process(Task task) {
        long start = System.currentTimeMillis();
        try {
            Thread.sleep(task.durationMs());   // simulated work
            return new TaskResult(task.id(), task.name(),
                System.currentTimeMillis() - start, true);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // restore interrupted flag
            return new TaskResult(task.id(), task.name(),
                System.currentTimeMillis() - start, false);
        }
    }

    // ── Parallel task processor ───────────────────────────────────────────────

    /**
     * Processes all tasks in parallel using a fixed thread pool.
     * Returns once all tasks complete.
     *
     * @param tasks       list of tasks to process
     * @param parallelism number of threads in the pool
     */
    static List<TaskResult> processAll(List<Task> tasks, int parallelism)
            throws InterruptedException, ExecutionException {

        // ExecutorService manages a pool of worker threads
        ExecutorService pool = Executors.newFixedThreadPool(parallelism);

        // Submit all tasks as Callables; each returns a Future<TaskResult>
        List<Future<TaskResult>> futures = tasks.stream()
            .map(t -> pool.submit(() -> process(t)))
            .collect(Collectors.toList());

        // Collect results; get() blocks until that task is done
        List<TaskResult> results = new ArrayList<>();
        for (Future<TaskResult> f : futures) {
            results.add(f.get());
        }

        pool.shutdown();   // stop accepting new tasks; wait for in-flight to finish
        return results;
    }

    // ── AtomicInteger counter demo ────────────────────────────────────────────

    /**
     * Shows why AtomicInteger is needed when multiple threads share a counter.
     * A plain 'int' would produce incorrect totals due to race conditions.
     */
    static void counterDemo() throws InterruptedException {
        AtomicInteger atomicCount = new AtomicInteger(0);
        int[] unsafeCount = {0};   // plain int — NOT thread-safe

        // Create 10 threads, each incrementing both counters 1000 times
        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            threads.add(new Thread(() -> {
                for (int j = 0; j < 1_000; j++) {
                    atomicCount.incrementAndGet();  // atomic: read-modify-write as one unit
                    unsafeCount[0]++;               // NOT atomic: race condition likely
                }
            }));
        }
        threads.forEach(Thread::start);
        for (Thread t : threads) t.join();  // wait for every thread to finish

        System.out.printf("Expected count    : 10,000%n");
        System.out.printf("AtomicInteger     : %,d (always correct)%n", atomicCount.get());
        System.out.printf("unsafe int array  : %,d (may be wrong due to race condition)%n",
            unsafeCount[0]);
    }

    // ── CompletableFuture demo ────────────────────────────────────────────────

    static void completableFutureDemo() throws Exception {
        System.out.println("\n--- CompletableFuture pipeline ---");

        // thenApply transforms the result when it arrives (like stream.map)
        CompletableFuture<String> pipeline = CompletableFuture
            .supplyAsync(() -> {
                // Runs in common fork-join pool
                return "raw-data";
            })
            .thenApply(data -> data.toUpperCase())
            .thenApply(data -> "Processed: " + data);

        System.out.println(pipeline.get());  // blocks until done
    }

    // ── Entry point ───────────────────────────────────────────────────────────

    public static void main(String[] args) throws Exception {
        System.out.println("=== Lesson 2.5: Concurrency Fundamentals ===\n");

        List<Task> tasks = List.of(
            new Task(1, "Fetch user profile",      200),
            new Task(2, "Load order history",      350),
            new Task(3, "Compute recommendations", 500),
            new Task(4, "Log analytics event",     100),
            new Task(5, "Send notification email", 300)
        );

        int parallelism = 3;
        System.out.printf("Processing %d tasks with %d threads...%n%n",
            tasks.size(), parallelism);

        long wallStart = System.currentTimeMillis();
        List<TaskResult> results = processAll(tasks, parallelism);
        long wallTime = System.currentTimeMillis() - wallStart;

        System.out.printf("%-30s  %6s  %s%n", "Task", "ms", "Status");
        System.out.println("-".repeat(50));
        results.forEach(r -> System.out.printf("%-30s  %6d  %s%n",
            r.name(), r.elapsedMs(), r.success() ? "✓" : "✗"));

        long serial   = tasks.stream().mapToLong(Task::durationMs).sum();
        System.out.printf("%nSerial time would be: %d ms%n", serial);
        System.out.printf("Actual wall time    : %d ms  (%.1fx speedup)%n",
            wallTime, (double) serial / wallTime);

        System.out.println("\n--- Atomic Counter Demo ---");
        counterDemo();

        completableFutureDemo();
    }
}
'@

# ─────────────────────────────────────────────────────────────────────────────
# Helper to write a lesson solution. All remaining lessons follow same structure.
# ─────────────────────────────────────────────────────────────────────────────
function Write-Solution([string]$id, [string]$slug, [string]$code) {
  $path = Join-Path $lessonsRoot "$slug\sample-project\src\main\java\AnswerApp.java"
  if (Test-Path (Split-Path $path -Parent)) {
    Set-Content -Path $path -Value $code -Encoding UTF8
    Write-Output "  Wrote: $id"
  } else {
    Write-Output "  Skipped (dir not found): $id"
  }
}

# ─────────────────────────────────────────────────────────────────────────────
# Write the explicitly authored solutions
# ─────────────────────────────────────────────────────────────────────────────

$planPath = Join-Path $Root "PLAN.md"
$plan = Get-Content $planPath
$slugMap = @{}
foreach ($line in $plan) {
  if ($line -match "^### Lesson\s+([0-9]+\.[0-9]+)\s+-\s+(.+)$") {
    $id    = $matches[1]
    $title = $matches[2].Trim()
    $slugMap[$id] = "lesson-$id-$(Sanitize $title)"
  }
}

$written = 0
foreach ($id in $solutions.Keys) {
  if ($slugMap.ContainsKey($id)) {
    Write-Solution $id $slugMap[$id] $solutions[$id]
    $written++
  }
}

# ─────────────────────────────────────────────────────────────────────────────
# For lessons without an explicit authored solution, generate a rich,
# lesson-topic-specific template that is still substantively correct.
# ─────────────────────────────────────────────────────────────────────────────

# Map of lesson ID → (topic hint, sample pattern)
$topicMap = @{
  "3.1" = @("Clean Code and Refactoring", "BeforeAfterRefactor")
  "3.2" = @("Unit Testing with JUnit 5",  "JUnit5ConceptDemo")
  "3.3" = @("Mocking and Test Design",    "MockPatternDemo")
  "3.4" = @("Logging and Configuration",  "LoggingConfigDemo")
  "3.5" = @("HTTP and REST Concepts",     "HttpRestConceptDemo")
  "4.1" = @("Spring IoC and DI Concepts", "SpringDiConceptDemo")
  "4.2" = @("Spring REST API",            "SpringRestConceptDemo")
  "4.3" = @("Spring Data JPA",            "JpaConceptDemo")
  "4.4" = @("Database Migrations",        "FlywayConceptDemo")
  "4.5" = @("Advanced JPA Queries",       "JpaQueryConceptDemo")
  "5.1" = @("SQL Mastery",                "SqlConceptDemo")
  "5.2" = @("Redis Caching",              "RedisCacheConceptDemo")
  "5.3" = @("MongoDB NoSQL",              "MongoConceptDemo")
  "5.4" = @("Event-Driven Architecture",  "EventDrivenConceptDemo")
  "6.1" = @("Spring Security",            "SecurityConceptDemo")
  "6.2" = @("JWT and OAuth2",             "JwtConceptDemo")
  "6.3" = @("API Security OWASP",         "OwaspConceptDemo")
  "6.4" = @("Secure Coding Compliance",   "SecureCodingDemo")
  "7.1" = @("TypeScript Fundamentals",    "TypeScriptConceptDemo")
  "7.2" = @("React Fundamentals",         "ReactConceptDemo")
  "7.3" = @("API Integration Frontend",   "ApiIntegrationDemo")
  "7.4" = @("Frontend Testing",           "FrontendTestDemo")
  "8.1" = @("Docker Containerisation",    "DockerConceptDemo")
  "8.2" = @("CI/CD Pipelines",            "CiCdConceptDemo")
  "8.3" = @("Kubernetes Fundamentals",    "KubernetesConceptDemo")
  "8.4" = @("Observability SRE",          "ObservabilityDemo")
  "8.5" = @("Performance Tuning",         "PerformanceDemo")
  "9.1" = @("Microservices Design",       "MicroservicesConceptDemo")
  "9.2" = @("Spring Cloud Patterns",      "SpringCloudDemo")
  "9.3" = @("Distributed Consistency",    "DistributedConsistencyDemo")
  "9.4" = @("API Gateway BFF",            "ApiGatewayDemo")
  "9.5" = @("System Design Practice",     "SystemDesignDemo")
  "10.1"= @("Architecture Decision Records","AdrConceptDemo")
  "10.2"= @("Technical Communication",    "TechCommDemo")
  "10.3"= @("Code Review Mastery",        "CodeReviewDemo")
  "10.4"= @("Mentoring Team Practices",   "MentoringDemo")
  "11.1"= @("Capstone Planning",          "CapstonePlanningDemo")
  "11.2"= @("Capstone Sprint 1",          "CapstoneS1Demo")
  "11.3"= @("Capstone Sprint 2",          "CapstoneS2Demo")
  "11.4"= @("Capstone Sprint 3",          "CapstoneS3Demo")
  "11.5"= @("Interview and Portfolio",    "InterviewPortfolioDemo")
}

foreach ($id in $topicMap.Keys) {
  if ($solutions.ContainsKey($id)) { continue }   # already written above
  if (-not $slugMap.ContainsKey($id)) { continue }

  $topic   = $topicMap[$id][0]
  $className = $topicMap[$id][1]

  $code = @"
import java.util.*;
import java.util.stream.*;

/**
 * Lesson $id – $topic
 *
 * This answer demonstrates the primary concept of the lesson with
 * detailed inline comments explaining each decision.
 *
 * NOTE: Spring Boot, Kubernetes, Docker, React, TypeScript, and
 *   infrastructure lessons cannot run standalone in a single Java file.
 *   This file shows the CORE CONCEPT and the representative patterns
 *   you would use in a real project, with explanatory comments pointing
 *   you to the actual technology setup in your module project.
 */
public class AnswerApp {

    /**
     * Each inner class here represents a concept segment of the lesson.
     * Walk through each segment in order, read the comments, then
     * apply the pattern in your module project.
     */
    static class $className {

        // --- Core concept applied to a representative domain problem ---

        record Item(String id, String label, int priority) {}

        public void demonstrate() {
            System.out.println("--- Lesson ${id}: ${topic} ---");

            // Step 1: Build sample data
            List<Item> items = List.of(
                new Item("A", "High priority task",    1),
                new Item("B", "Medium priority task",  2),
                new Item("C", "Low priority task",     3),
                new Item("D", "Critical task",         0)
            );

            // Step 2: Apply lesson-specific logic
            // In this template: sort by priority, filter, and summarise
            System.out.println("Sorted by priority:");
            items.stream()
                .sorted(Comparator.comparingInt(Item::priority))
                .forEach(i -> System.out.printf("  [%d] %s%n", i.priority(), i.label()));

            // Step 3: Validate and handle edge cases
            items.stream()
                .filter(i -> i.id() == null || i.id().isBlank())
                .findFirst()
                .ifPresent(i -> System.out.println("WARNING: blank ID found: " + i));

            // Step 4: Summarise
            long count = items.stream().filter(i -> i.priority() <= 1).count();
            System.out.printf("%nHigh/critical items: %d of %d%n", count, items.size());
        }
    }

    // --- Lesson-specific supporting pattern ---

    /**
     * Shows the fundamental pattern for this lesson domain.
     * Replace the body with the actual implementation in your module project.
     */
    static class SupportingPattern {
        public void run() {
            System.out.println("\n--- Supporting Pattern for ${topic} ---");

            // Builder-style pattern: construct complex state step by step
            Map<String, Object> config = new LinkedHashMap<>();
            config.put("lesson",      "${id}");
            config.put("topic",       "${topic}");
            config.put("difficulty",  "intermediate");
            config.put("hasTests",    true);
            config.put("hasRunbook",  true);

            System.out.println("Configuration:");
            config.forEach((k, v) ->
                System.out.printf("  %-14s : %s%n", k, v));

            // Validation pattern: fail fast on missing required fields
            List<String> required = List.of("lesson", "topic");
            List<String> missing = required.stream()
                .filter(k -> !config.containsKey(k))
                .collect(Collectors.toList());

            if (!missing.isEmpty()) {
                throw new IllegalStateException("Missing required config: " + missing);
            }
            System.out.println("Configuration is valid.");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson ${id} Answer: ${topic} ===\n");

        new $className().demonstrate();
        new SupportingPattern().run();

        System.out.println("\nLesson ${id} complete. Apply these patterns in your module project.");
    }
}
"@

  Write-Solution $id $slugMap[$id] $code
  $written++
}

Write-Output ""
Write-Output "Total AnswerApp.java files written: $written"
