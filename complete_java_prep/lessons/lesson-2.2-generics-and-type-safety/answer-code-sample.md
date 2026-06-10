# Answer Code Sample - Lesson 2.2: Generics and Type Safety

## Java Answer (Complete Runnable)

~~~java
import java.util.*;

/**
 * Lesson 2.2 â€“ Generics and Type Safety
 *
 * WHAT THIS DEMONSTRATES:
 *   Generic classes, generic methods, wildcards, bounded type parameters,
 *   and a reusable type-safe repository interface.
 *
 * KEY TERMS:
 *   generic       â€“ a class/method parameterised by one or more types (T, E, K, V).
 *   type erasure  â€“ generics exist at compile-time; the JVM sees raw types at runtime.
 *   wildcard <?>  â€“ unknown type; <? extends T> upper-bounded, <? super T> lower-bounded.
 *   PECS          â€“ Producer Extends, Consumer Super â€” guideline for wildcard choice.
 */
public class AnswerApp {

    // â”€â”€ Generic interface â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Repository<T, ID> is a generic contract.
     * T  = the entity type stored
     * ID = the type used as identifier
     *
     * Any class implementing this interface must supply concrete types.
     */
    interface Repository<T, ID> {
        void   save(T entity);
        Optional<T> findById(ID id);
        List<T>   findAll();
        boolean   deleteById(ID id);
        int       count();
    }

    // â”€â”€ Generic class â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * InMemoryRepository<T, ID> is a concrete generic class.
     * It can store ANY entity type without duplication of logic.
     *
     * @param <T>  entity type (must supply an ID via getIdFunction)
     * @param <ID> identifier type
     */
    static class InMemoryRepository<T, ID> implements Repository<T, ID> {
        // LinkedHashMap ensures predictable iteration order
        private final Map<ID, T> store = new LinkedHashMap<>();
        // A function to extract the ID from an entity
        private final java.util.function.Function<T, ID> idExtractor;

        public InMemoryRepository(java.util.function.Function<T, ID> idExtractor) {
            this.idExtractor = idExtractor;
        }

        @Override public void save(T entity) {
            store.put(idExtractor.apply(entity), entity);
        }

        @Override public Optional<T> findById(ID id) {
            return Optional.ofNullable(store.get(id));
        }

        @Override public List<T> findAll() {
            return new ArrayList<>(store.values());   // defensive copy
        }

        @Override public boolean deleteById(ID id) {
            return store.remove(id) != null;
        }

        @Override public int count() { return store.size(); }
    }

    // â”€â”€ Generic method â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Generic method: T is inferred from the arguments at the call site.
     * <? extends Comparable<T>> means T must support natural ordering.
     *
     * @param list a list of Comparable elements
     * @return the maximum element, or empty if the list is empty
     */
    static <T extends Comparable<T>> Optional<T> findMax(List<T> list) {
        if (list == null || list.isEmpty()) return Optional.empty();
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) max = item;
        }
        return Optional.of(max);
    }

    /**
     * Wildcard example: accepts a List of any Number subtype.
     * <? extends Number> = upper-bounded wildcard (we READ from the list).
     */
    static double sumNumbers(List<? extends Number> numbers) {
        double sum = 0;
        for (Number n : numbers) sum += n.doubleValue();
        return sum;
    }

    // â”€â”€ Sample entities â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    record User(int id, String name, String email) {}
    record Product(String sku, String name, double price) {}

    // â”€â”€ Entry point â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public static void main(String[] args) {
        System.out.println("=== Lesson 2.2: Generics and Type Safety ===\n");

        // --- Repository for Users ---
        Repository<User, Integer> userRepo = new InMemoryRepository<>(User::id);
        userRepo.save(new User(1, "Alice",   "alice@example.com"));
        userRepo.save(new User(2, "Bob",     "bob@example.com"));
        userRepo.save(new User(3, "Charlie", "charlie@example.com"));

        System.out.println("=== User Repository (" + userRepo.count() + " users) ===");
        userRepo.findAll().forEach(u ->
            System.out.printf("  [%d] %-10s %s%n", u.id(), u.name(), u.email()));

        userRepo.findById(2).ifPresentOrElse(
            u -> System.out.println("Found: " + u.name()),
            () -> System.out.println("Not found"));

        // --- Repository for Products ---
        Repository<Product, String> productRepo = new InMemoryRepository<>(Product::sku);
        productRepo.save(new Product("SKU-A", "Keyboard", 129.99));
        productRepo.save(new Product("SKU-B", "Mouse",     49.99));

        System.out.println("\n=== Product Repository (" + productRepo.count() + " products) ===");
        productRepo.findAll().forEach(p ->
            System.out.printf("  %-8s %-12s $%.2f%n", p.sku(), p.name(), p.price()));

        // --- Generic method demo ---
        System.out.println("\n--- Generic findMax demo ---");
        List<Integer> ints = List.of(3, 7, 1, 9, 4);
        findMax(ints).ifPresent(m -> System.out.println("Max integer: " + m));

        List<String>  strs = List.of("banana", "apple", "cherry");
        findMax(strs).ifPresent(m -> System.out.println("Max string:  " + m));

        // --- Wildcard demo ---
        System.out.println("\n--- Wildcard sumNumbers demo ---");
        List<Integer> intList  = List.of(1, 2, 3);
        List<Double>  dblList  = List.of(1.5, 2.5, 3.5);
        System.out.println("Sum of integers: " + sumNumbers(intList));
        System.out.println("Sum of doubles:  " + sumNumbers(dblList));
    }
}

~~~
