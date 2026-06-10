import java.util.*;

/**
 * Lesson 10.4 - Mentoring and Team Practices
 *
 * Structured growth plans and team cadence framework.
 *
 * KEY TERMS:
 *   growth plan - documented goals, actions, measures, and timeline for a person.
 *   SMART goals - Specific, Measurable, Achievable, Relevant, Time-bound.
 *   pair programming - two developers share one workstation / screen.
 *   mob programming - whole team collaborates on one problem at once.
 *   retrospective  - team reflection on what to start, stop, continue.
 */
public class AnswerApp {

    record GrowthPlan(String name, String level, String goal,
                      String action, String measure, String timeline) {}

    static void print(GrowthPlan p) {
        System.out.printf("  Engineer : %s (%s)%n", p.name(), p.level());
        System.out.printf("  Goal     : %s%n",       p.goal());
        System.out.printf("  Action   : %s%n",       p.action());
        System.out.printf("  Measure  : %s%n",       p.measure());
        System.out.printf("  Timeline : %s%n%n",     p.timeline());
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 10.4: Mentoring and Team Practices ===\n");

        List<GrowthPlan> plans = List.of(
            new GrowthPlan("Alice", "Junior",
                "Ship a feature end-to-end without structural review feedback",
                "Own one complete story: design, implement, test, deploy, monitor",
                "PR merged with only NIT comments; feature stable in prod for 2 weeks",
                "8 weeks"),
            new GrowthPlan("Bob", "Mid-level",
                "Lead a technical design discussion",
                "Write a design doc for next feature; present to team; incorporate feedback",
                "Team aligned after single review cycle; ADR written and accepted",
                "4 weeks"),
            new GrowthPlan("Carol", "Senior",
                "Mentor two junior engineers to their first independent feature",
                "Weekly 1:1s, code review coaching, design review feedback",
                "Both engineers ship independently; their review comments drop 50%",
                "Quarter")
        );

        System.out.println("--- Individual Growth Plans ---");
        plans.forEach(AnswerApp::print);

        System.out.println("--- Team Cadence ---");
        String[][] cadence = {
            {"Daily standup",     "15 min", "Async-first; blockers only; no status reporting"},
            {"Sprint planning",   "2 hrs",  "Every 2 weeks; team estimates and commits"},
            {"Sprint review",     "1 hr",   "Demo completed work to stakeholders"},
            {"Retrospective",     "1 hr",   "Start/Stop/Continue; action items with owners"},
            {"Pair programming",  "20%",    "Junior+Senior on complex stories; knowledge transfer"},
            {"Tech talk",         "30 min", "Bi-weekly; team member presents a learning"}
        };
        System.out.printf("  %-22s %-8s  %s%n", "Ceremony", "Duration", "Purpose");
        System.out.println("  " + "-".repeat(75));
        for (String[] c : cadence)
            System.out.printf("  %-22s %-8s  %s%n", c[0], c[1], c[2]);
    }
}