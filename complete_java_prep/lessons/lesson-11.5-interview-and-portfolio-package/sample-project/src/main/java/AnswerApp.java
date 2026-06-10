/**
 * Lesson 11.5 - Interview and Portfolio Package
 *
 * STAR story framework, system design interview structure,
 * and portfolio README checklist.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 11.5: Interview and Portfolio Package ===\n");

        System.out.println("--- STAR Story Framework ---");
        System.out.println("  Situation : Context and challenge (1-2 sentences)");
        System.out.println("  Task      : YOUR specific responsibility (use 'I', not 'we')");
        System.out.println("  Action    : Concrete steps you took (3-5 bullet points)");
        System.out.println("  Result    : Measurable outcome (%, $, time saved)");

        System.out.println("\n  Example story: Performance optimization");
        System.out.println("  S: Our checkout API had p99 latency of 2.5s, causing 8% cart abandonment.");
        System.out.println("  T: I owned the performance investigation and fix.");
        System.out.println("  A: Profiled with async-profiler; found N+1 query loading orders.");
        System.out.println("     Added JOIN FETCH in JPQL; added Redis cache for product data.");
        System.out.println("     Tuned connection pool from 10 to 50.");
        System.out.println("  R: p99 dropped from 2.5s to 120ms; cart abandonment fell to 2%.");

        System.out.println("\n--- System Design Interview Framework ---");
        System.out.println("  1. Clarify requirements      (2-3 min) - functional + non-functional");
        System.out.println("  2. Estimate scale            (2 min)   - reads/writes/storage");
        System.out.println("  3. High-level design         (10 min)  - draw components + data flow");
        System.out.println("  4. Deep dive x2              (15 min)  - interviewer picks components");
        System.out.println("  5. Trade-offs and bottlenecks (5 min)  - what would you improve next");

        System.out.println("\n--- Portfolio README checklist ---");
        String[] items = {
            "Problem statement in 2 sentences",
            "Architecture diagram (draw.io, Mermaid, or C4)",
            "Tech stack with one-line justification for each choice",
            "'How to run locally' in ONE command (docker compose up)",
            "Live demo link or video walkthrough (< 3 minutes)",
            "Links to ADRs for key decisions",
            "Metrics: test coverage %, load test results",
            "What you would build next (shows product thinking)"
        };
        for (String i : items) System.out.println("  [ ] " + i);

        System.out.println("\n--- Common interview questions for tech leads ---");
        String[] questions = {
            "Walk me through a system you designed from scratch.",
            "How do you handle disagreements on architecture within your team?",
            "Tell me about a production incident you led the response to.",
            "How do you decide when to refactor vs rewrite?",
            "How do you mentor engineers who are struggling?",
            "Design a notification service for 10M users."
        };
        for (int i = 0; i < questions.length; i++)
            System.out.printf("  %2d. %s%n", i + 1, questions[i]);
    }
}