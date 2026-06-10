# Answer Code Sample - Lesson 6.4: Secure Coding and Compliance Basics

## Java Answer (Complete Runnable)

~~~java
import java.util.*;

/**
 * Lesson 6.4 - Secure Coding and Compliance Basics
 *
 * Demonstrates audit logging, PII masking, and secrets-management rules.
 *
 * KEY TERMS:
 *   PII      - Personally Identifiable Information (email, SSN, phone).
 *   audit log - immutable record of who did what and when.
 *   principle of least privilege - grant only the minimum permissions needed.
 *   defence in depth - multiple security layers; one failure is not a breach.
 *   secrets  - credentials, API keys, tokens (NEVER in source code).
 */
public class AnswerApp {

    record AuditEvent(long ts, String user, String action, String resource, String result) {}

    static class AuditService {
        private final List<AuditEvent> log = new ArrayList<>();

        public void record(String user, String action, String resource, String result) {
            log.add(new AuditEvent(System.currentTimeMillis(), user, action, resource, result));
        }

        public void print() {
            System.out.println("--- Audit Log ---");
            log.forEach(e -> System.out.printf("  ts=%-14d user=%-8s action=%-8s resource=%-20s result=%s%n",
                e.ts(), e.user(), e.action(), e.resource(), e.result()));
        }
    }

    /** Masks all but the first character and domain of an email address. */
    static String maskEmail(String email) {
        int at = email.indexOf('@');
        if (at < 1) return "***";
        return email.charAt(0) + "***" + email.substring(at);
    }

    /** Masks all but last 4 digits of a credit card. */
    static String maskCard(String card) {
        if (card == null || card.length() < 4) return "****";
        return "*".repeat(card.length() - 4) + card.substring(card.length() - 4);
    }

    static void printSecretsRules() {
        System.out.println("\n--- Secrets Management Rules ---");
        System.out.println("  NEVER hardcode secrets, API keys, or passwords in source code.");
        System.out.println("  Store secrets in environment variables or a vault (AWS Secrets Manager, Vault).");
        System.out.println("  Rotate secrets regularly and immediately on any suspected exposure.");
        System.out.println("  Use separate secrets per environment (dev / staging / prod).");
        System.out.println("  Add .env to .gitignore; scan commits for secrets (git-secrets, Trufflehog).");
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 6.4: Secure Coding and Compliance ===\n");

        AuditService audit = new AuditService();
        audit.record("alice", "READ",   "order/ORD-001", "SUCCESS");
        audit.record("bob",   "DELETE", "user/42",       "DENIED");
        audit.record("alice", "UPDATE", "profile/alice", "SUCCESS");
        audit.print();

        System.out.println("\n--- PII Masking ---");
        String[] emails = {"alice@example.com", "bob@test.org", "x@y.io"};
        String[] cards  = {"4111111111111111", "5500005555555559"};

        for (String e : emails)
            System.out.printf("  %-30s -> %s%n", e, maskEmail(e));
        for (String c : cards)
            System.out.printf("  %-20s -> %s%n", c, maskCard(c));

        printSecretsRules();
    }
}
~~~
