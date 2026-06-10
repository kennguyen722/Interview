# Answer Code Sample - Lesson 9.4: API Gateway and BFF

## Java Answer (Complete Runnable)

~~~java
/**
 * Lesson 9.4 - API Gateway and Backend for Frontend (BFF)
 *
 * KEY TERMS:
 *   gateway     - single entry point that routes, authenticates, and rate-limits.
 *   BFF         - Backend for Frontend: dedicated aggregation layer per client type.
 *   route predicate - condition that determines if a request matches a rule.
 *   filter      - code that runs on requests/responses (auth, logging, CORS).
 *   rate limiter - controls request volume per client/IP/user.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 9.4: API Gateway and BFF ===\n");

        System.out.println("--- Spring Cloud Gateway configuration ---");
        System.out.println("  spring:");
        System.out.println("    cloud:");
        System.out.println("      gateway:");
        System.out.println("        routes:");
        System.out.println("          - id: user-service");
        System.out.println("            uri: lb://user-service");
        System.out.println("            predicates: [ Path=/api/v1/users/** ]");
        System.out.println("            filters:");
        System.out.println("              - AuthenticationFilter     # validate JWT");
        System.out.println("              - RequestRateLimiter        # per-user rate limit");
        System.out.println("              - CircuitBreaker=name=user  # Resilience4j CB");
        System.out.println("          - id: order-service");
        System.out.println("            uri: lb://order-service");
        System.out.println("            predicates: [ Path=/api/v1/orders/** ]");

        System.out.println("\n--- Gateway responsibilities ---");
        String[] resp = {
            "TLS termination",
            "JWT authentication (before request reaches service)",
            "Per-user rate limiting",
            "Request routing to correct microservice",
            "Circuit breaking for downstream services",
            "Cross-cutting logging and tracing",
            "CORS policy enforcement"
        };
        for (String r : resp) System.out.println("  - " + r);

        System.out.println("\n--- BFF pattern ---");
        System.out.println("  Problem: mobile app needs compact payloads; web needs richer data.");
        System.out.println("  Solution: separate BFF per client type.");
        System.out.println();
        System.out.println("  mobile-bff:  aggregates user-service + order-service");
        System.out.println("               returns slim { id, name, orderCount }");
        System.out.println();
        System.out.println("  web-bff:     aggregates user + order + analytics + recommendation");
        System.out.println("               returns rich dashboard payload");

        System.out.println("\n--- Rate limiter simulation (token bucket) ---");
        int capacity = 5, tokens = 5;
        for (int i = 1; i <= 8; i++) {
            if (tokens > 0) {
                tokens--;
                System.out.printf("  Request %d: 200 OK    (tokens left: %d)%n", i, tokens);
            } else {
                System.out.printf("  Request %d: 429 Too Many Requests%n", i);
            }
            if (i == 5) { tokens = Math.min(capacity, tokens + 3); System.out.println("  [+3 tokens refilled]"); }
        }
    }
}
~~~
