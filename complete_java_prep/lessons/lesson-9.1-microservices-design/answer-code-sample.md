# Answer Code Sample - Lesson 9.1: Microservices Design

## Java Answer (Complete Runnable)

~~~java
import java.util.*;

/**
 * Lesson 9.1 - Microservices Design
 *
 * Shows service decomposition, communication patterns, and trade-offs.
 *
 * KEY TERMS:
 *   bounded context - a domain area with its own model and language.
 *   cohesion        - high if all parts of a service change together.
 *   coupling        - low coupling means services change independently.
 *   sync call       - REST/gRPC; caller blocks waiting for response.
 *   async message   - Kafka/RabbitMQ; caller publishes and moves on.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 9.1: Microservices Design ===\n");

        System.out.println("--- Service decomposition by bounded context ---");
        Object[][] services = {
            {"user-service",     "Users, profiles, authentication delegation"},
            {"order-service",    "Order lifecycle, status transitions, history"},
            {"product-service",  "Product catalogue, pricing, availability"},
            {"payment-service",  "Payment processing, refunds, fraud detection"},
            {"notification-svc", "Email, SMS, push notifications"},
            {"api-gateway",      "Auth validation, routing, rate-limiting, BFF"}
        };
        System.out.printf("  %-20s  %s%n", "Service", "Responsibility");
        System.out.println("  " + "-".repeat(70));
        for (Object[] s : services)
            System.out.printf("  %-20s  %s%n", s[0], s[1]);

        System.out.println("\n--- Communication pattern guide ---");
        System.out.println("  Synchronous (REST / gRPC):");
        System.out.println("    Use for: queries, reads, operations needing immediate response");
        System.out.println("    Risk: cascade failures if downstream is slow or down");
        System.out.println("    Mitigation: timeouts + circuit breaker (Resilience4j)");
        System.out.println("\n  Asynchronous (Kafka / RabbitMQ):");
        System.out.println("    Use for: cross-domain writes, notifications, analytics");
        System.out.println("    Benefit: producer decoupled from consumer downtime");
        System.out.println("    Risk: eventual consistency; duplicate message handling needed");
        System.out.println("\n  Rule of thumb:");
        System.out.println("    - Same bounded context: direct call is fine");
        System.out.println("    - Cross bounded context: prefer events");

        System.out.println("\n--- Monolith vs Microservices trade-off ---");
        System.out.println("  Monolith   : easy to run, test, debug; hard to scale independently");
        System.out.println("  Microsvcs  : independent scale/deploy/tech; complex ops and data");
        System.out.println("  Guideline  : start with a modular monolith; extract when team/scale demands it");
    }
}
~~~
