# Answer Code Sample - Lesson 10.2: Technical Communication

## Java Answer (Complete Runnable)

~~~java
/**
 * Lesson 10.2 - Technical Communication
 *
 * Documents, templates, and best practices for technical writing.
 *
 * KEY TERMS:
 *   design doc      - a document describing a proposed technical solution.
 *   RFC             - Request for Comments; a design document seeking feedback.
 *   runbook         - step-by-step operational guide for handling incidents.
 *   postmortem      - blame-free analysis of an incident to prevent recurrence.
 *   technical brief - concise summary of a decision for non-technical stakeholders.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 10.2: Technical Communication ===\n");

        System.out.println("--- Design Document Structure ---");
        String[] sections = {
            "1. Problem Statement     - What are we solving and why now?",
            "2. Goals / Non-Goals     - Explicit scope; what is out of scope",
            "3. Proposed Solution     - High-level approach with architecture diagram",
            "4. Alternatives Considered - What else was evaluated and why rejected",
            "5. Data Model            - Schema or document structure",
            "6. API Contract          - Endpoints, DTOs, error codes",
            "7. Security Considerations - Auth, data protection, threat model",
            "8. Operational Plan      - Rollout stages, monitoring, rollback plan",
            "9. Open Questions        - Unresolved decisions needing team input"
        };
        for (String s : sections) System.out.println("  " + s);

        System.out.println("\n--- Stakeholder update (DONE/NEXT/RISKS) ---");
        System.out.println("  STATUS: On track");
        System.out.println("  DONE  : Completed user API (US-101), Flyway migrations (US-102)");
        System.out.println("  NEXT  : JWT auth (US-103), React login page (US-104)");
        System.out.println("  RISKS : Third-party payment SDK has known bug (workaround in place)");
        System.out.println("  ASKS  : Need access to staging payment credentials by Thursday");

        System.out.println("\n--- Postmortem template ---");
        System.out.println("  Incident  : Production outage 2025-06-07 14:32-15:10 UTC");
        System.out.println("  Impact    : 100% of orders failing; 38 minutes");
        System.out.println("  Root cause: DB connection pool exhausted after deploy config typo");
        System.out.println("  Timeline  :");
        System.out.println("    14:32 - Alert: error rate 100%");
        System.out.println("    14:45 - Identified connection pool size = 1");
        System.out.println("    15:05 - Config fixed, rolled out");
        System.out.println("    15:10 - Error rate back to normal");
        System.out.println("  Action items:");
        System.out.println("    [ ] Add config validation step to CI pipeline");
        System.out.println("    [ ] Alert on connection pool utilisation > 80%");

        System.out.println("\n--- Writing principles ---");
        System.out.println("  Lead with the conclusion, then supporting details.");
        System.out.println("  One idea per sentence; avoid passive voice.");
        System.out.println("  Replace 'we should consider' with 'I recommend'.");
        System.out.println("  Diagrams beat paragraphs for system relationships.");
    }
}
~~~
