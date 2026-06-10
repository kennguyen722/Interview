# Answer Code Sample - Lesson 2.1: Collections Framework

## Java Answer (Complete Runnable)

~~~java
import java.util.*;
import java.util.stream.Collectors;

/**
 * Lesson 2.1 â€“ Collections Framework
 *
 * WHAT THIS DEMONSTRATES:
 *   List, Set, Map, Queue â€” when to use each,
 *   their performance characteristics, and an in-memory inventory system.
 *
 * KEY TERMS:
 *   List   â€“ ordered, allows duplicates (ArrayList = fast random-access).
 *   Set    â€“ unordered, NO duplicates (HashSet = O(1) lookup).
 *   Map    â€“ keyâ†’value pairs, unique keys (HashMap = O(1) put/get).
 *   Queue  â€“ FIFO ordering, use offer/poll, not add/remove.
 *   Big-O  â€“ notation for algorithm time complexity as input size grows.
 */
public class AnswerApp {

    // â”€â”€ Domain â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    record Product(String sku, String name, double price, int stock) {
        @Override public String toString() {
            return String.format("%-8s %-25s $%7.2f  stock:%3d",
                sku, name, price, stock);
        }
    }

    // â”€â”€ In-Memory Inventory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    static class Inventory {
        // LinkedHashMap preserves insertion order while giving O(1) lookup by SKU
        private final Map<String, Product> products = new LinkedHashMap<>();
        // Set of SKUs currently flagged for reorder
        private final Set<String>          reorderSet = new HashSet<>();
        // Queue of pending purchase orders (FIFO processing)
        private final Queue<String>        orderQueue = new LinkedList<>();

        /** Add or replace a product. */
        public void put(Product p) {
            products.put(p.sku(), p);
            if (p.stock() < 5) reorderSet.add(p.sku());
        }

        /** Reduce stock count; queue a reorder if stock falls below threshold. */
        public boolean sell(String sku, int qty) {
            Product p = products.get(sku);   // O(1) HashMap lookup
            if (p == null) {
                System.out.printf("SKU %s not found.%n", sku);
                return false;
            }
            if (p.stock() < qty) {
                System.out.printf("Insufficient stock for %s (have %d, need %d).%n",
                    sku, p.stock(), qty);
                return false;
            }
            // Records are immutable; replace with updated copy
            products.put(sku, new Product(sku, p.name(), p.price(), p.stock() - qty));

            int newStock = products.get(sku).stock();
            if (newStock < 5) {
                reorderSet.add(sku);
                orderQueue.offer("REORDER:" + sku);   // enqueue (non-throwing)
                System.out.printf("âš  Reorder queued for %s (stock=%d)%n", sku, newStock);
            }
            return true;
        }

        /** Process all pending reorders in FIFO order. */
        public void processReorders() {
            System.out.println("\n--- Processing Reorder Queue ---");
            String order;
            while ((order = orderQueue.poll()) != null) {  // poll returns null when empty
                System.out.println("  Processed: " + order);
            }
            reorderSet.clear();
        }

        public void printAll() {
            System.out.println("\n=== Inventory (" + products.size() + " SKUs) ===");
            products.values().forEach(p -> System.out.println("  " + p));

            // List of low-stock SKUs â€” demonstrates Setâ†’sorted List
            if (!reorderSet.isEmpty()) {
                List<String> sorted = new ArrayList<>(reorderSet);
                Collections.sort(sorted);
                System.out.println("  Needs reorder: " + sorted);
            }
        }

        /** Category report using groupingBy collector. */
        public void printPriceStats() {
            DoubleSummaryStatistics stats = products.values().stream()
                .mapToDouble(Product::price)
                .summaryStatistics();

            System.out.printf("%nPrice stats â€” min: $%.2f  max: $%.2f  avg: $%.2f%n",
                stats.getMin(), stats.getMax(), stats.getAverage());
        }
    }

    // â”€â”€ Entry point â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public static void main(String[] args) {
        System.out.println("=== Lesson 2.1: Collections Framework â€“ Inventory System ===\n");

        Inventory inv = new Inventory();
        inv.put(new Product("A001", "Java 21 Book",            49.99, 20));
        inv.put(new Product("A002", "Spring Boot Sticker Pack",  4.99,  3));
        inv.put(new Product("B001", "Mechanical Keyboard",     129.99,  8));
        inv.put(new Product("B002", "USB-C Hub",               34.99,  4));
        inv.put(new Product("C001", "Standing Desk Mat",        59.99, 15));

        inv.printAll();

        System.out.println("\n--- Sales ---");
        inv.sell("A001",  3);
        inv.sell("B002",  3);   // triggers reorder
        inv.sell("A002",  2);   // triggers reorder
        inv.sell("A002", 99);   // insufficient stock

        inv.printPriceStats();
        inv.printAll();
        inv.processReorders();
    }
}

~~~
