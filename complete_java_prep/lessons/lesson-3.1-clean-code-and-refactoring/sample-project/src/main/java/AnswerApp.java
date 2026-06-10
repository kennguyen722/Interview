/**
 * Lesson 3.1 - Clean Code and Refactoring
 *
 * Shows a BEFORE class (poor names, long method, duplication)
 * next to an AFTER class (SRP, DRY, guard clauses, pure methods).
 *
 * KEY TERMS:
 *   SRP         - Single Responsibility Principle.
 *   DRY         - Don't Repeat Yourself.
 *   guard clause - early-return validation at the top of a method.
 */
public class AnswerApp {

    // ── BEFORE (code smells) ─────────────────────────────────────────
    static class Before {
        // BAD: one big method, short variable names, duplicated output
        public void proc(String o, int q, double p) {
            if (o == null || o.isEmpty()) { System.out.println("bad order"); return; }
            if (q <= 0) { System.out.println("bad qty"); return; }
            double t = q * p * 1.08;
            System.out.println("Order: " + o + " total: " + t);
            System.out.println("Order: " + o);   // <-- duplicated by mistake (DRY violation)
        }
    }

    // ── AFTER (refactored) ──────────────────────────────────────────
    static class After {
        record Summary(double subtotal, double tax, double total) {}

        /** Single entry point: delegates to focused helpers. */
        public void processOrder(String orderId, int quantity, double unitPrice) {
            if (!validate(orderId, quantity, unitPrice)) return;
            Summary s = compute(quantity, unitPrice);
            print(orderId, quantity, unitPrice, s);
        }

        private boolean validate(String id, int qty, double price) {
            if (id == null || id.isBlank())  { System.out.println("INVALID: orderId blank"); return false; }
            if (qty <= 0)                    { System.out.println("INVALID: qty must be > 0"); return false; }
            if (price <= 0)                  { System.out.println("INVALID: price must be > 0"); return false; }
            return true;
        }

        /** Pure function: no I/O, easy to unit-test in isolation. */
        private Summary compute(int qty, double price) {
            double sub = qty * price;
            double tax = sub * 0.08;
            return new Summary(sub, tax, sub + tax);
        }

        /** One place for receipt formatting (DRY). */
        private void print(String id, int qty, double price, Summary s) {
            System.out.println("=== Receipt ===");
            System.out.printf("  Order    : %s%n",    id);
            System.out.printf("  Qty      : %d @ $%.2f%n", qty, price);
            System.out.printf("  Subtotal : $%.2f%n", s.subtotal());
            System.out.printf("  Tax  8%% : $%.2f%n", s.tax());
            System.out.printf("  TOTAL    : $%.2f%n", s.total());
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 3.1: Clean Code and Refactoring ===\n");

        System.out.println("--- BEFORE ---");
        new Before().proc("ORD-001", 3, 49.99);

        System.out.println("\n--- AFTER ---");
        After a = new After();
        a.processOrder("ORD-001", 3, 49.99);

        System.out.println("\n--- Validation ---");
        a.processOrder("", 3, 49.99);
        a.processOrder("ORD-002", 0, 49.99);
    }
}