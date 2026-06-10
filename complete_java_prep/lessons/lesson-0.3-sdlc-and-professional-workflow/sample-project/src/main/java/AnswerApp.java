import java.util.ArrayList;
import java.util.List;

/**
 * Lesson 0.3 â€“ SDLC and Professional Workflow
 *
 * WHAT THIS DEMONSTRATES:
 *   A simulation of a professional Git-based feature development workflow
 *   following a trunk-based or GitFlow branching strategy.
 *
 * KEY TERMS:
 *   SDLC         â€“ Software Development Lifecycle: plan, develop, test, deploy, maintain.
 *   branch       â€“ A parallel line of development in a Git repository.
 *   pull request â€“ A proposal to merge changes, triggers code review.
 *   CI           â€“ Continuous Integration: automatically build and test every commit.
 *   definition of done â€“ A shared checklist that marks a task as complete.
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
                "GitHub Actions pipeline: build âœ“, lint âœ“, tests âœ“", true),
            new WorkflowStep("Merge",
                "Squash-merge PR to main after approval", true),
            new WorkflowStep("Deploy",
                "CD pipeline deploys main to staging automatically", true)
        );

        System.out.printf("Feature workflow: %s%n%n", feature);
        for (int i = 0; i < steps.size(); i++) {
            WorkflowStep s = steps.get(i);
            String status = s.done() ? "âœ“" : "â—‹";
            System.out.printf("  [%s] Step %2d: %-15s â€“ %s%n",
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
