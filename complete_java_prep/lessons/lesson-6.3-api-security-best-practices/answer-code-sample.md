# Answer Code Sample - Lesson 6.3: API Security Best Practices

## Java Answer (Complete Runnable)

~~~java
import java.util.*;
import java.util.regex.*;

/**
 * Lesson 6.3 - API Security Best Practices (OWASP Top 10)
 *
 * KEY TERMS:
 *   OWASP          - Open Web Application Security Project.
 *   injection      - inserting malicious input that changes command intent.
 *   CORS           - Cross-Origin Resource Sharing; controls which origins can call your API.
 *   CSRF           - Cross-Site Request Forgery; tricking a user into making an unwanted request.
 *   rate limiting  - throttling requests per client to prevent abuse.
 *   input validation - rejecting invalid input at system boundaries.
 */
public class AnswerApp {

    // ── Input validation ─────────────────────────────────────────────
    static class InputValidator {
        // Allowlist pattern: only safe characters
        private static final Pattern SAFE_EMAIL    = Pattern.compile("^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$");
        private static final Pattern SAFE_USERNAME = Pattern.compile("^[a-zA-Z0-9_\\-]{3,50}$");

        public boolean validateEmail(String email) {
            return email != null && SAFE_EMAIL.matcher(email).matches();
        }
        public boolean validateUsername(String username) {
            return username != null && SAFE_USERNAME.matcher(username).matches();
        }
        /** Prevent SQL injection by rejecting SQL keywords in free-text fields. */
        public boolean isSafeSearchQuery(String query) {
            if (query == null) return false;
            String upper = query.toUpperCase();
            for (String kw : new String[]{"SELECT", "DROP", "INSERT", "DELETE", "UNION", "--", ";"}) {
                if (upper.contains(kw)) return false;
            }
            return query.length() <= 200;
        }
    }

    // ── Token bucket rate limiter ────────────────────────────────────
    static class RateLimiter {
        private final int capacity;
        private int tokens;
        RateLimiter(int capacity) { this.capacity = tokens = capacity; }

        public boolean tryAcquire() {
            if (tokens > 0) { tokens--; return true; }
            return false;
        }
        public void refill(int count) { tokens = Math.min(capacity, tokens + count); }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 6.3: API Security Best Practices ===\n");

        // ── OWASP Top 10 reference ───────────────────────────────────
        System.out.println("--- OWASP API Security Top 10 ---");
        Object[][] owasp = {
            {"A1", "Broken Object Level Auth",    "Validate: can THIS user access THIS resource ID"},
            {"A2", "Broken Authentication",       "Short-lived JWTs, MFA, brute-force protection"},
            {"A3", "Broken Object Property Auth", "Return only fields the caller is allowed to see"},
            {"A4", "Unrestricted Resource Use",   "Rate-limit all endpoints"},
            {"A5", "Broken Function Level Auth",  "Separate admin/user APIs with explicit role checks"},
            {"A7", "Server-Side Request Forgery", "Validate and allowlist URLs before fetching"},
            {"A8", "Security Misconfiguration",   "Disable debug endpoints, strict CORS, security headers"},
        };
        for (Object[] r : owasp)
            System.out.printf("  %-5s %-35s %s%n", r[0], r[1], r[2]);

        // ── Input validation demo ────────────────────────────────────
        System.out.println("\n--- Input Validation ---");
        InputValidator v = new InputValidator();
        String[][] inputs = {
            {"alice@example.com",       "email"},
            {"<script>alert(1)</script>","email"},
            {"valid_user-123",           "username"},
            {"SELECT * FROM users",      "search"},
            {"Java programming",         "search"}
        };
        for (String[] i : inputs) {
            boolean ok = switch (i[1]) {
                case "email"    -> v.validateEmail(i[0]);
                case "username" -> v.validateUsername(i[0]);
                default         -> v.isSafeSearchQuery(i[0]);
            };
            System.out.printf("  %-40s [%s] -> %s%n",
                i[0], i[1], ok ? "ALLOWED" : "REJECTED");
        }

        // ── Rate limiting demo ───────────────────────────────────────
        System.out.println("\n--- Rate Limiter (capacity=3, refill=2 every 3 requests) ---");
        RateLimiter rl = new RateLimiter(3);
        for (int i = 1; i <= 8; i++) {
            boolean ok = rl.tryAcquire();
            System.out.printf("  Request %d: %s%n", i, ok ? "200 OK" : "429 Too Many Requests");
            if (i % 3 == 0) { rl.refill(2); System.out.println("  [refilled 2 tokens]"); }
        }
    }
}
~~~
