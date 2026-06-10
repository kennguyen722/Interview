import java.util.*;

/**
 * Lesson 11.1 - Capstone Planning
 *
 * Structures the capstone project into milestones, risks, and success criteria.
 */
public class AnswerApp {

    record Milestone(String name, String deliverable, String week) {}
    record Risk(String desc, String impact, String mitigation) {}

    public static void main(String[] args) {
        System.out.println("=== Lesson 11.1: Capstone Planning ===\n");
        System.out.println("Project: Library Management Platform (full-stack Java)");

        System.out.println("\n--- Milestones ---");
        List<Milestone> ms = List.of(
            new Milestone("M1: Core backend",    "Users API, Books API, JWT auth",         "Week 31, Day 1-2"),
            new Milestone("M2: Persistence",     "PostgreSQL + Flyway migrations + JPA",   "Week 31, Day 3"),
            new Milestone("M3: Frontend",        "React SPA + Axios API integration",      "Week 31, Day 4-5"),
            new Milestone("M4: DevOps",          "Docker + CI/CD + k8s manifests",         "Week 32, Day 1-2"),
            new Milestone("M5: Observability",   "Prometheus + Grafana + structured logs", "Week 32, Day 3"),
            new Milestone("M6: Hardening",       "Security audit + load test + ADRs",      "Week 32, Day 4-5")
        );
        System.out.printf("  %-22s %-45s %s%n", "Milestone", "Deliverable", "Timeline");
        System.out.println("  " + "-".repeat(85));
        ms.forEach(m -> System.out.printf("  %-22s %-45s %s%n", m.name(), m.deliverable(), m.week()));

        System.out.println("\n--- Risk Register ---");
        List<Risk> risks = List.of(
            new Risk("Scope creep",         "HIGH",   "Freeze feature list at M1; defer extras to backlog"),
            new Risk("Infra setup time",    "MEDIUM", "Use docker-compose first; add k8s in M4"),
            new Risk("Performance issues",  "LOW",    "Load test in M6; set SLOs in M5 first")
        );
        System.out.printf("  %-28s %-8s %s%n", "Risk", "Impact", "Mitigation");
        System.out.println("  " + "-".repeat(75));
        risks.forEach(r -> System.out.printf("  %-28s %-8s %s%n", r.desc(), r.impact(), r.mitigation()));

        System.out.println("\n--- Success criteria ---");
        String[] criteria = {
            "Full CRUD API with authentication deployed and reachable",
            "React frontend integrated with backend",
            "CI/CD pipeline builds, tests, and deploys on every push to main",
            "p99 API latency < 200ms under 100 RPS (k6 load test)",
            "Three ADRs documenting key architectural decisions",
            "Portfolio README with architecture diagram and runbook"
        };
        for (String c : criteria) System.out.println("  [ ] " + c);
    }
}