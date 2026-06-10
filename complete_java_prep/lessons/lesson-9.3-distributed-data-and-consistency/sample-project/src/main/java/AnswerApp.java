import java.util.*;

/**
 * Lesson 9.3 - Distributed Data and Consistency
 *
 * Demonstrates the Saga choreography pattern and the Outbox pattern.
 *
 * KEY TERMS:
 *   Saga       - distributed transaction using local transactions + compensating actions.
 *   Outbox     - write entity + event in one DB tx; poller publishes to broker.
 *   idempotency - same message processed twice yields same result.
 *   eventual consistency - all nodes converge to the same state eventually.
 *   2PC        - Two-Phase Commit; strong consistency but slow and fragile.
 */
public class AnswerApp {

    record SagaStep(String name, String action, String compensation) {}

    static class SagaOrchestrator {
        private final List<SagaStep> steps;
        private final List<SagaStep> completed = new ArrayList<>();

        SagaOrchestrator(List<SagaStep> steps) { this.steps = steps; }

        public boolean execute(String failAt) {
            for (SagaStep step : steps) {
                System.out.printf("  [SAGA] Execute  %-20s -> %s%n", step.name(), step.action());
                if (step.name().equals(failAt)) {
                    System.out.println("  [SAGA] FAILURE at " + step.name() + " -- rolling back");
                    rollback();
                    return false;
                }
                completed.add(step);
            }
            return true;
        }

        private void rollback() {
            List<SagaStep> rev = new ArrayList<>(completed);
            Collections.reverse(rev);
            rev.forEach(s -> System.out.printf(
                "  [SAGA] Compensate %-20s -> %s%n", s.name(), s.compensation()));
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 9.3: Distributed Data and Consistency ===\n");

        List<SagaStep> orderSteps = List.of(
            new SagaStep("ReserveInventory", "lock stock",         "release stock"),
            new SagaStep("ChargePayment",    "charge card",        "refund card"),
            new SagaStep("CreateShipment",   "schedule delivery",  "cancel shipment")
        );

        System.out.println("--- Saga: success path ---");
        boolean ok1 = new SagaOrchestrator(orderSteps).execute("none");
        System.out.println("Outcome: " + (ok1 ? "COMMITTED" : "ROLLED BACK"));

        System.out.println("\n--- Saga: payment failure ---");
        boolean ok2 = new SagaOrchestrator(orderSteps).execute("ChargePayment");
        System.out.println("Outcome: " + (ok2 ? "COMMITTED" : "ROLLED BACK"));

        System.out.println("\n--- Outbox Pattern ---");
        System.out.println("  Problem: publish event AND save entity atomically across DB + Kafka.");
        System.out.println("  Solution:");
        System.out.println("    1. Begin DB transaction.");
        System.out.println("    2. Save entity (e.g. ORDER row).");
        System.out.println("    3. Insert event into outbox table (same transaction).");
        System.out.println("    4. Commit DB transaction.");
        System.out.println("    5. Outbox poller reads unpublished rows and publishes to Kafka.");
        System.out.println("    6. Mark row as published.");
        System.out.println("  Result: no message is lost even if Kafka is temporarily unavailable.");

        System.out.println("\n--- Idempotency key pattern ---");
        System.out.println("  Client sends: POST /orders  Idempotency-Key: uuid-abc123");
        System.out.println("  Server: store (key, response) in DB.");
        System.out.println("  On retry: return stored response instead of re-processing.");
        System.out.println("  Prevents duplicate orders on network retry.");
    }
}