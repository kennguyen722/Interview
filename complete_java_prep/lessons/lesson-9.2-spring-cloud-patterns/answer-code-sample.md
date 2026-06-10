# Answer Code Sample - Lesson 9.2: Spring Cloud Patterns

## Java Answer (Complete Runnable)

~~~java
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Lesson 9.2 - Spring Cloud Patterns
 *
 * Implements a circuit breaker simulation and documents
 * the full Spring Cloud component set.
 *
 * KEY TERMS:
 *   circuit breaker - stops calling a failing service to allow recovery.
 *   CLOSED  state - requests flow through normally.
 *   OPEN    state - requests short-circuit to fallback immediately.
 *   HALF-OPEN - sends a test request; closes if it succeeds.
 *   retry   - re-attempt a failed call with optional back-off.
 *   bulkhead - limits concurrent calls to one service to protect others.
 */
public class AnswerApp {

    enum CbState { CLOSED, OPEN, HALF_OPEN }

    static class CircuitBreaker {
        private CbState state    = CbState.CLOSED;
        private int     failures = 0;
        private final int threshold;

        CircuitBreaker(int threshold) { this.threshold = threshold; }

        public String call(String svcName, java.util.function.Supplier<String> action) {
            if (state == CbState.OPEN) {
                System.out.printf("  [CB-%s OPEN] short-circuit fallback%n", svcName);
                return "FALLBACK";
            }
            try {
                String result = action.get();
                if (state == CbState.HALF_OPEN) {
                    state    = CbState.CLOSED;
                    failures = 0;
                    System.out.printf("  [CB-%s] -> CLOSED (probe succeeded)%n", svcName);
                }
                failures = 0;
                return result;
            } catch (Exception e) {
                failures++;
                System.out.printf("  [CB-%s] failure %d/%d: %s%n",
                    svcName, failures, threshold, e.getMessage());
                if (failures >= threshold) {
                    state = CbState.OPEN;
                    System.out.printf("  [CB-%s] -> OPEN%n", svcName);
                }
                return "ERROR: " + e.getMessage();
            }
        }

        /** Simulate time passing -- in Resilience4j this is automatic. */
        public void halfOpen() { if (state == CbState.OPEN) state = CbState.HALF_OPEN; }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 9.2: Spring Cloud Patterns ===\n");

        CircuitBreaker cb = new CircuitBreaker(3);
        AtomicInteger  callNo = new AtomicInteger();

        System.out.println("--- Circuit breaker demo (threshold=3) ---");
        for (int i = 0; i < 8; i++) {
            int n = callNo.incrementAndGet();
            String r = cb.call("payment-svc", () -> {
                if (n <= 5) throw new RuntimeException("Connection refused");
                return "200 OK";
            });
            System.out.printf("  Call %d -> %s%n", n, r);
            if (n == 6) { System.out.println("  [Simulating timeout recovery]"); cb.halfOpen(); }
        }

        System.out.println("\n--- Spring Cloud components ---");
        String[][] comps = {
            {"Spring Cloud Config",  "Centralised config from Git repo; refresh on change"},
            {"Eureka / Consul",      "Service discovery and health-based registry"},
            {"Spring Cloud Gateway", "API gateway with route predicates and filters"},
            {"Resilience4j",         "Circuit breaker, retry, rate limiter, bulkhead, time-limiter"},
            {"Micrometer Tracing",   "Distributed tracing context propagation (W3C / B3)"},
            {"Spring Cloud Bus",     "Broadcast config refresh events to all instances"}
        };
        System.out.printf("  %-30s  %s%n", "Component", "Purpose");
        System.out.println("  " + "-".repeat(75));
        for (String[] c : comps) System.out.printf("  %-30s  %s%n", c[0], c[1]);
    }
}
~~~
