import java.util.*;
import java.util.stream.*;

/**
 * Lesson 4.5 - Advanced Querying and Performance
 *
 * Demonstrates JPA query patterns (simulated with in-memory data):
 *   - JPQL with predicates
 *   - Projections (select only needed fields)
 *   - JOIN FETCH to avoid N+1
 *   - Aggregation with GROUP BY
 *
 * KEY TERMS:
 *   JPQL       - JPA Query Language; entity-centric (not table-centric).
 *   projection - selecting a subset of fields to reduce data transfer.
 *   N+1 query  - one query for list + one query per item = performance killer.
 *   JOIN FETCH - eagerly load association in one query.
 *   pagination - @PageableDefault; limit/offset in the query.
 */
public class AnswerApp {

    record Order(int id, int userId, double total, String status) {}
    record OrderItem(int orderId, String product, int qty, double price) {}

    // ── Simulate JPA repository methods ─────────────────────────────
    static class OrderRepository {
        final List<Order>     orders;
        final List<OrderItem> items;

        OrderRepository(List<Order> orders, List<OrderItem> items) {
            this.orders = orders; this.items = items;
        }

        // JPQL: SELECT o FROM Order o WHERE o.status = :status
        List<Order> findByStatus(String status) {
            return orders.stream().filter(o -> status.equals(o.status())).toList();
        }

        // Projection: only id + total (avoids loading unused fields)
        List<int[]> findIdAndTotalByUserId(int userId) {
            return orders.stream()
                .filter(o -> o.userId() == userId)
                .map(o -> new int[]{o.id(), (int) o.total()})
                .toList();
        }

        // JOIN FETCH simulation: load orders with items in one pass (avoids N+1)
        Map<Order, List<OrderItem>> findAllWithItems() {
            Map<Integer, List<OrderItem>> byOrder = items.stream()
                .collect(Collectors.groupingBy(OrderItem::orderId));
            Map<Order, List<OrderItem>> result = new LinkedHashMap<>();
            orders.forEach(o -> result.put(o, byOrder.getOrDefault(o.id(), List.of())));
            return result;
        }

        // GROUP BY equivalent: revenue per user
        Map<Integer, Double> revenueByUser() {
            return orders.stream()
                .filter(o -> "COMPLETED".equals(o.status()))
                .collect(Collectors.groupingBy(Order::userId,
                    Collectors.summingDouble(Order::total)));
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 4.5: Advanced Querying and Performance ===\n");

        List<Order> orders = List.of(
            new Order(1, 1, 180.00, "COMPLETED"),
            new Order(2, 1, 95.00,  "PENDING"),
            new Order(3, 2, 50.00,  "COMPLETED"),
            new Order(4, 3, 220.00, "COMPLETED")
        );
        List<OrderItem> items = List.of(
            new OrderItem(1, "Book A",    2, 45.00),
            new OrderItem(1, "Keyboard",  1, 90.00),
            new OrderItem(3, "Book B",    1, 50.00),
            new OrderItem(4, "Monitor",   1, 220.00)
        );

        OrderRepository repo = new OrderRepository(orders, items);

        System.out.println("--- COMPLETED orders ---");
        repo.findByStatus("COMPLETED")
            .forEach(o -> System.out.printf("  #%d user=%d total=%.2f%n", o.id(), o.userId(), o.total()));

        System.out.println("\n--- Projection: id+total for user 1 ---");
        repo.findIdAndTotalByUserId(1)
            .forEach(p -> System.out.printf("  orderId=%d total=%d%n", p[0], p[1]));

        System.out.println("\n--- JOIN FETCH: orders with items (no N+1) ---");
        repo.findAllWithItems().forEach((o, oi) ->
            System.out.printf("  Order#%d has %d item(s)%n", o.id(), oi.size()));

        System.out.println("\n--- Revenue per user (GROUP BY) ---");
        repo.revenueByUser().forEach((uid, rev) ->
            System.out.printf("  user %d revenue = $%.2f%n", uid, rev));
    }
}