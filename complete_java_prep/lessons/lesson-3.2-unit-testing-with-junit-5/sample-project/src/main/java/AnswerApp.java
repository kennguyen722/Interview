import java.util.ArrayList;
import java.util.List;

/**
 * Lesson 3.2 - Unit Testing with JUnit 5
 *
 * Runs tests without requiring JUnit on the classpath.
 * Each test() call mirrors a @Test method; helper asserts mirror
 * assertEquals / assertTrue from JUnit Jupiter.
 *
 * KEY TERMS:
 *   AAA           - Arrange-Act-Assert: three phases of every test.
 *   @Test         - JUnit 5 annotation marking a test method.
 *   @BeforeEach   - runs setup before every test.
 *   assertion     - a check that throws AssertionError on failure.
 *   coverage      - percentage of production lines exercised by tests.
 */
public class AnswerApp {

    // ── Production class under test ──────────────────────────────────
    static class ShoppingCart {
        private final List<Double> items = new ArrayList<>();

        /** Adds a positive-price item; throws on negative price. */
        public void addItem(double price) {
            if (price < 0) throw new IllegalArgumentException("Price cannot be negative");
            items.add(price);
        }

        public int    itemCount() { return items.size(); }
        public void   clear()     { items.clear(); }

        /**
         * Returns total with a 10% bulk discount when 5 or more items.
         * discount threshold = 5 items.
         */
        public double total() {
            double sub = items.stream().mapToDouble(Double::doubleValue).sum();
            return items.size() >= 5 ? sub * 0.90 : sub;
        }
    }

    // ── Minimal test harness ────────────────────────────────────────
    static int pass = 0, fail = 0;

    static void test(String name, Runnable body) {
        try { body.run(); System.out.printf("  PASS  %s%n", name); pass++; }
        catch (Throwable t) { System.out.printf("  FAIL  %s -- %s%n", name, t.getMessage()); fail++; }
    }

    static void assertEquals(double expected, double actual, double delta) {
        if (Math.abs(expected - actual) > delta)
            throw new AssertionError(String.format("Expected %.4f but got %.4f", expected, actual));
    }
    static void assertEquals(int expected, int actual) {
        if (expected != actual) throw new AssertionError("Expected " + expected + " got " + actual);
    }
    static void assertTrue(boolean cond, String msg) {
        if (!cond) throw new AssertionError(msg);
    }

    // ── Test cases ──────────────────────────────────────────────────
    static void runTests() {
        test("empty cart total is zero", () -> {
            // Arrange
            ShoppingCart cart = new ShoppingCart();
            // Act + Assert
            assertEquals(0.0, cart.total(), 0.001);
        });

        test("one item - total equals item price", () -> {
            ShoppingCart cart = new ShoppingCart();
            cart.addItem(29.99);
            assertEquals(29.99, cart.total(), 0.001);
        });

        test("three items - no discount applied", () -> {
            ShoppingCart cart = new ShoppingCart();
            cart.addItem(10.00); cart.addItem(20.00); cart.addItem(30.00);
            assertEquals(60.00, cart.total(), 0.001);  // 3 items < 5
        });

        test("five items - 10% bulk discount", () -> {
            ShoppingCart cart = new ShoppingCart();
            for (int i = 0; i < 5; i++) cart.addItem(10.00);
            assertEquals(45.00, cart.total(), 0.001);  // 50 * 0.90
        });

        test("negative price throws IllegalArgumentException", () -> {
            ShoppingCart cart = new ShoppingCart();
            try {
                cart.addItem(-5.00);
                throw new AssertionError("Expected exception not thrown");
            } catch (IllegalArgumentException e) {
                assertTrue(e.getMessage().contains("negative"), "message should mention negative");
            }
        });

        test("clear resets item count and total to zero", () -> {
            ShoppingCart cart = new ShoppingCart();
            cart.addItem(10.00); cart.addItem(20.00);
            cart.clear();
            assertEquals(0,   cart.itemCount());
            assertEquals(0.0, cart.total(), 0.001);
        });

        test("boundary: exactly five items triggers discount", () -> {
            ShoppingCart cart = new ShoppingCart();
            for (int i = 0; i < 5; i++) cart.addItem(20.00);
            // 100 * 0.90 = 90 (discount triggers AT exactly 5)
            assertEquals(90.00, cart.total(), 0.001);
        });
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 3.2: Unit Testing with JUnit 5 ===\n");
        System.out.println("(Embedded harness mirrors JUnit 5 API)\n");
        runTests();
        System.out.printf("%n%d passed, %d failed%n", pass, fail);
    }
}