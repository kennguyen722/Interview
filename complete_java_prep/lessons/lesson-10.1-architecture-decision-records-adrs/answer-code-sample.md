# Answer Code Sample - Lesson 10.1: Architecture Decision Records (ADRs)

## Java Answer (Complete Runnable)

~~~java
import java.time.LocalDate;
import java.util.*;

/**
 * Lesson 10.1 - Architecture Decision Records (ADRs)
 *
 * Generates sample ADRs and explains the lifecycle.
 *
 * KEY TERMS:
 *   ADR        - Architecture Decision Record: a short document capturing
 *                a significant architectural decision.
 *   status     - Proposed, Accepted, Deprecated, Superseded.
 *   context    - why the decision was needed.
 *   decision   - the chosen approach and brief rationale.
 *   consequences - trade-offs and impact.
 */
public class AnswerApp {

    record Adr(int number, String title, String status,
               String context, String decision, String consequences) {}

    static void print(Adr a) {
        System.out.printf("# ADR-%04d: %s%n",   a.number(), a.title());
        System.out.printf("Date    : %s%n",       LocalDate.now());
        System.out.printf("Status  : %s%n",       a.status());
        System.out.println("Context :");
        System.out.println("  " + a.context());
        System.out.println("Decision:");
        System.out.println("  " + a.decision());
        System.out.println("Consequences:");
        System.out.println("  " + a.consequences());
        System.out.println();
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 10.1: Architecture Decision Records ===\n");

        List<Adr> adrs = List.of(
            new Adr(1, "Use PostgreSQL as primary datastore", "Accepted",
                "We need a relational database with ACID guarantees and complex query support.",
                "Use PostgreSQL 16. Justification: mature, jsonb support, excellent tooling, team familiarity.",
                "Pro: ACID, jsonb, partitioning. Con: requires DBA expertise at high scale."),
            new Adr(2, "Use Kafka for cross-service events", "Accepted",
                "Services need to communicate asynchronously to avoid tight coupling.",
                "Kafka for event streaming. Retained for 7 days. Avro schemas via Schema Registry.",
                "Pro: decoupled, replayable, high throughput. Con: operational overhead, eventual consistency."),
            new Adr(3, "JWT for stateless API authentication", "Accepted",
                "Need stateless auth compatible with horizontal pod scaling.",
                "Short-lived access tokens (15 min) + long-lived refresh tokens in HttpOnly cookies.",
                "Pro: stateless, standard. Con: token revocation requires blacklist or short TTL.")
        );

        adrs.forEach(AnswerApp::print);

        System.out.println("--- ADR lifecycle ---");
        System.out.println("  Proposed -> Accepted (team agrees) -> Deprecated (no longer relevant)");
        System.out.println("  Superseded by ADR-0004 (replaced by a newer decision)");

        System.out.println("\n--- File naming convention ---");
        System.out.println("  docs/adr/0001-use-postgresql.md");
        System.out.println("  docs/adr/0002-use-kafka-for-events.md");
        System.out.println("  docs/adr/0003-jwt-authentication.md");
    }
}
~~~
