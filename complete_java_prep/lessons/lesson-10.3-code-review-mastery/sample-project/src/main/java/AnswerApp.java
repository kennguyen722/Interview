import java.util.*;

/**
 * Lesson 10.3 - Code Review Mastery
 *
 * Shows a structured review process with a severity model.
 *
 * KEY TERMS:
 *   BLOCKING   - must fix before merge (correctness, security, data loss risk).
 *   SUGGESTION - worth doing; not a blocker.
 *   NIT        - minor style / polish.
 *   nit        - small, optional cleanup comment (prefix with "nit:").
 *   praise     - leave positive comments to reinforce good patterns.
 */
public class AnswerApp {

    enum Severity { BLOCKING, SUGGESTION, NIT, PRAISE }

    record ReviewComment(Severity sev, String file, int line, String message) {}

    public static void main(String[] args) {
        System.out.println("=== Lesson 10.3: Code Review Mastery ===\n");

        List<ReviewComment> comments = List.of(
            new ReviewComment(Severity.BLOCKING,
                "OrderService.java", 42,
                "findById() result not checked before .get() -- NPE risk. Use orElseThrow()."),
            new ReviewComment(Severity.BLOCKING,
                "UserController.java", 18,
                "User password logged at DEBUG level. Remove immediately -- security violation."),
            new ReviewComment(Severity.SUGGESTION,
                "ProductController.java", 55,
                "Add @Valid to @RequestBody to activate Bean Validation automatically."),
            new ReviewComment(Severity.SUGGESTION,
                "OrderRepository.java", 28,
                "This query loads all orders without a limit. Add Pageable parameter for safety."),
            new ReviewComment(Severity.NIT,
                "StringUtils.java", 5,
                "nit: rename 'str' to 'input' -- clearer intent."),
            new ReviewComment(Severity.PRAISE,
                "PaymentService.java", 10,
                "Great use of the Outbox pattern here. Clear and well-tested.")
        );

        System.out.println("--- Review comments ---");
        System.out.printf("  %-12s %-25s %4s  %s%n", "Severity", "File", "Line", "Comment");
        System.out.println("  " + "-".repeat(85));
        comments.forEach(c -> System.out.printf("  %-12s %-25s %4d  %s%n",
            c.sev(), c.file(), c.line(), c.message()));

        long blocking = comments.stream().filter(c -> c.sev() == Severity.BLOCKING).count();
        System.out.printf("%n  Total: %d comment(s), %d blocking.%n", comments.size(), blocking);
        System.out.println(blocking > 0 ? "  Decision: REQUEST CHANGES" : "  Decision: APPROVE");

        System.out.println("\n--- Review checklist ---");
        String[] checks = {
            "Correctness: does it do what the requirements say?",
            "Edge cases: null, empty, overflow, concurrent access handled?",
            "Security: no injection, no exposed secrets, no excessive permissions?",
            "Performance: no N+1, no blocking calls on the hot path?",
            "Test coverage: new logic has tests; edge cases covered?",
            "Readability: would a new team member understand this in 5 minutes?"
        };
        for (String c : checks) System.out.println("  [ ] " + c);

        System.out.println("\n--- Review tone guidelines ---");
        System.out.println("  Comment on code, never on the author.");
        System.out.println("  Phrase suggestions as questions: 'Could we use orElseThrow here?'");
        System.out.println("  Explain the WHY, not just the WHAT.");
        System.out.println("  Leave praise when you see a good pattern -- it reinforces behaviour.");
    }
}