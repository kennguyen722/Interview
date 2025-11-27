# Module 1: Core Java Concepts

## Table of Contents
1. [JVM Internals](#jvm-internals)
2. [Memory Management](#memory-management)
3. [Java 8+ Features](#java-8-features)
4. [Collections Framework](#collections-framework)
5. [Exception Handling](#exception-handling)
6. [Generics](#generics)

---

## JVM Internals

### Question 1: Explain the JVM architecture and its main components.

**Answer:**
The Java Virtual Machine (JVM) is the runtime environment that executes Java bytecode. Its main components include:

1. **Class Loader Subsystem**: Loads, links, and initializes classes
2. **Runtime Data Areas**: Memory areas used during program execution
3. **Execution Engine**: Executes the bytecode
4. **Native Method Interface (JNI)**: Interface with native libraries
5. **Native Method Libraries**: Platform-specific libraries

**Detailed Code Example:**

```java
public class JVMInternalsDemo {
    
    public static void main(String[] args) {
        // Demonstrating class loading
        System.out.println("Class Loader Demo");
        
        // Get the class loader of this class
        ClassLoader classLoader = JVMInternalsDemo.class.getClassLoader();
        System.out.println("Class Loader: " + classLoader);
        
        // Get parent class loader (Platform ClassLoader in Java 9+)
        System.out.println("Parent Class Loader: " + classLoader.getParent());
        
        // Bootstrap class loader (returns null)
        System.out.println("Bootstrap Class Loader: " + classLoader.getParent().getParent());
        
        // Demonstrating runtime memory
        Runtime runtime = Runtime.getRuntime();
        System.out.println("\nMemory Information:");
        System.out.println("Max Memory: " + runtime.maxMemory() / (1024 * 1024) + " MB");
        System.out.println("Total Memory: " + runtime.totalMemory() / (1024 * 1024) + " MB");
        System.out.println("Free Memory: " + runtime.freeMemory() / (1024 * 1024) + " MB");
        System.out.println("Used Memory: " + (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024) + " MB");
    }
}
```

### Question 2: What are the different memory areas in JVM?

**Answer:**
The JVM has several memory areas:

1. **Heap**: Stores objects and their instance variables (shared among threads)
2. **Stack**: Stores local variables, method parameters, and partial results (per thread)
3. **Method Area (Metaspace)**: Stores class metadata, static variables, and constants
4. **Program Counter (PC) Register**: Holds address of current instruction (per thread)
5. **Native Method Stack**: Stores native method information

**Detailed Code Example:**

```java
public class MemoryAreasDemo {
    
    // Static variables - stored in Method Area (Metaspace)
    private static final String CONSTANT = "Stored in Constant Pool";
    private static int staticCounter = 0;
    
    // Instance variable - stored in Heap
    private String instanceVariable = "Stored in Heap";
    
    public void demonstrateMemoryAreas() {
        // Local variables - stored in Stack
        int localVariable = 10;
        String localReference = new String("Object in Heap, Reference in Stack");
        
        // Creating objects - Object in Heap
        Object[] array = new Object[100];
        
        System.out.println("Local Variable (Stack): " + localVariable);
        System.out.println("Instance Variable (Heap): " + instanceVariable);
        System.out.println("Static Variable (Metaspace): " + staticCounter);
        System.out.println("Constant (Constant Pool): " + CONSTANT);
    }
    
    // Recursive method to demonstrate stack overflow
    public void demonstrateStackOverflow(int depth) {
        // Each recursive call adds a new frame to the stack
        System.out.println("Stack Depth: " + depth);
        demonstrateStackOverflow(depth + 1); // Will eventually cause StackOverflowError
    }
    
    public static void main(String[] args) {
        MemoryAreasDemo demo = new MemoryAreasDemo();
        demo.demonstrateMemoryAreas();
        
        // Uncomment to see StackOverflowError
        // demo.demonstrateStackOverflow(0);
    }
}
```

---

## Memory Management

### Question 3: Explain Garbage Collection in Java and different GC algorithms.

**Answer:**
Garbage Collection (GC) is the automatic memory management process that identifies and removes unused objects. Key GC algorithms include:

1. **Serial GC**: Single-threaded, suitable for small applications
2. **Parallel GC**: Multi-threaded, default in Java 8
3. **G1 GC**: Region-based, default since Java 9
4. **ZGC**: Low-latency collector for large heaps
5. **Shenandoah**: Low-pause-time collector

**Detailed Code Example:**

```java
import java.lang.ref.WeakReference;
import java.lang.ref.SoftReference;
import java.lang.ref.PhantomReference;
import java.lang.ref.ReferenceQueue;

public class GarbageCollectionDemo {
    
    public static void main(String[] args) throws InterruptedException {
        // Demonstrating different types of references
        
        // 1. Strong Reference - never garbage collected while reachable
        Object strongRef = new Object();
        System.out.println("Strong Reference: " + strongRef);
        
        // 2. Weak Reference - collected at next GC
        WeakReference<Object> weakRef = new WeakReference<>(new Object());
        System.out.println("Weak Reference before GC: " + weakRef.get());
        System.gc();
        Thread.sleep(100);
        System.out.println("Weak Reference after GC: " + weakRef.get());
        
        // 3. Soft Reference - collected only when memory is low
        SoftReference<byte[]> softRef = new SoftReference<>(new byte[1024 * 1024]);
        System.out.println("Soft Reference: " + (softRef.get() != null ? "exists" : "null"));
        
        // 4. Phantom Reference - used for cleanup actions
        ReferenceQueue<Object> refQueue = new ReferenceQueue<>();
        PhantomReference<Object> phantomRef = new PhantomReference<>(new Object(), refQueue);
        System.out.println("Phantom Reference get(): " + phantomRef.get()); // Always null
        
        // Demonstrating object lifecycle
        demonstrateObjectLifecycle();
    }
    
    static void demonstrateObjectLifecycle() {
        // Creating objects
        System.out.println("\n--- Object Lifecycle Demo ---");
        
        for (int i = 0; i < 5; i++) {
            // Objects become eligible for GC after each iteration
            GarbageCollectableObject obj = new GarbageCollectableObject("Object-" + i);
            System.out.println("Created: " + obj.getName());
        }
        
        // Suggest garbage collection
        System.gc();
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}

class GarbageCollectableObject {
    private String name;
    
    public GarbageCollectableObject(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    @Override
    protected void finalize() throws Throwable {
        // Note: finalize() is deprecated since Java 9
        // Use Cleaner or PhantomReference instead
        System.out.println("Finalizing: " + name);
        super.finalize();
    }
}
```

### Question 4: What are memory leaks in Java and how do you prevent them?

**Answer:**
Memory leaks occur when objects are no longer needed but cannot be garbage collected because they are still referenced. Common causes include:

1. Static collections that grow indefinitely
2. Unclosed resources (streams, connections)
3. Inner class references to outer class
4. Listener/callback not unregistered
5. Using wrong collection as cache

**Detailed Code Example:**

```java
import java.util.*;
import java.io.*;

public class MemoryLeakPreventionDemo {
    
    // BAD: Static collection - potential memory leak
    private static List<Object> staticCache = new ArrayList<>();
    
    // GOOD: Use WeakHashMap for caches
    private static Map<Object, Object> properCache = new WeakHashMap<>();
    
    // BAD: Unclosed resources
    public void badResourceHandling() throws IOException {
        FileInputStream fis = new FileInputStream("file.txt");
        // If exception occurs before close(), resource leaks
        fis.close();
    }
    
    // GOOD: Use try-with-resources
    public void goodResourceHandling() throws IOException {
        try (FileInputStream fis = new FileInputStream("file.txt");
             BufferedReader reader = new BufferedReader(new InputStreamReader(fis))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } // Resources automatically closed
    }
    
    // BAD: Inner class holding reference to outer class
    public class InnerClass {
        public void doSomething() {
            // Implicitly holds reference to MemoryLeakPreventionDemo.this
        }
    }
    
    // GOOD: Use static inner class when outer reference not needed
    public static class StaticInnerClass {
        public void doSomething() {
            // No implicit reference to outer class
        }
    }
    
    // GOOD: Bounded cache implementation
    public static class BoundedCache<K, V> extends LinkedHashMap<K, V> {
        private final int maxSize;
        
        public BoundedCache(int maxSize) {
            super(maxSize, 0.75f, true); // accessOrder = true for LRU
            this.maxSize = maxSize;
        }
        
        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > maxSize;
        }
    }
    
    // Example: Event listener memory leak prevention
    public interface DataChangeListener {
        void onDataChanged(String data);
    }
    
    public static class DataSource {
        private Set<WeakReference<DataChangeListener>> listeners = new HashSet<>();
        
        // Using WeakReference to prevent memory leaks
        public void addListener(DataChangeListener listener) {
            listeners.add(new WeakReference<>(listener));
        }
        
        public void notifyListeners(String data) {
            Iterator<WeakReference<DataChangeListener>> iterator = listeners.iterator();
            while (iterator.hasNext()) {
                DataChangeListener listener = iterator.next().get();
                if (listener == null) {
                    iterator.remove(); // Clean up dead references
                } else {
                    listener.onDataChanged(data);
                }
            }
        }
    }
    
    public static void main(String[] args) {
        // Demonstrate bounded cache
        BoundedCache<Integer, String> cache = new BoundedCache<>(3);
        cache.put(1, "One");
        cache.put(2, "Two");
        cache.put(3, "Three");
        System.out.println("Cache before overflow: " + cache);
        
        cache.put(4, "Four"); // This will remove the eldest entry
        System.out.println("Cache after overflow: " + cache);
    }
}
```

---

## Java 8+ Features

### Question 5: Explain Lambda expressions and Functional Interfaces in Java.

**Answer:**
Lambda expressions provide a concise way to implement functional interfaces. A functional interface has exactly one abstract method (can have default and static methods).

Key functional interfaces in `java.util.function`:
- `Function<T, R>`: Takes T, returns R
- `Predicate<T>`: Takes T, returns boolean
- `Consumer<T>`: Takes T, returns void
- `Supplier<T>`: Takes nothing, returns T
- `BiFunction<T, U, R>`: Takes T and U, returns R

**Detailed Code Example:**

```java
import java.util.*;
import java.util.function.*;

public class LambdaDemo {
    
    public static void main(String[] args) {
        // 1. Basic Lambda Syntax
        System.out.println("=== Basic Lambda ===");
        
        // Traditional anonymous class
        Runnable oldWay = new Runnable() {
            @Override
            public void run() {
                System.out.println("Old way");
            }
        };
        
        // Lambda expression
        Runnable newWay = () -> System.out.println("New way with lambda");
        
        oldWay.run();
        newWay.run();
        
        // 2. Functional Interfaces
        System.out.println("\n=== Functional Interfaces ===");
        
        // Function: Takes T, returns R
        Function<String, Integer> stringLength = s -> s.length();
        System.out.println("Length of 'Hello': " + stringLength.apply("Hello"));
        
        // Predicate: Takes T, returns boolean
        Predicate<Integer> isEven = n -> n % 2 == 0;
        System.out.println("Is 4 even? " + isEven.test(4));
        
        // Consumer: Takes T, returns void
        Consumer<String> printer = s -> System.out.println("Consuming: " + s);
        printer.accept("Hello Lambda");
        
        // Supplier: Returns T
        Supplier<Double> randomSupplier = () -> Math.random();
        System.out.println("Random: " + randomSupplier.get());
        
        // BiFunction: Takes T and U, returns R
        BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
        System.out.println("5 + 3 = " + add.apply(5, 3));
        
        // 3. Method References
        System.out.println("\n=== Method References ===");
        
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        
        // Lambda
        names.forEach(name -> System.out.println(name));
        
        // Method reference (equivalent)
        names.forEach(System.out::println);
        
        // Static method reference
        Function<String, Integer> parser = Integer::parseInt;
        System.out.println("Parsed: " + parser.apply("42"));
        
        // Instance method reference
        Function<String, String> toUpper = String::toUpperCase;
        System.out.println("Upper: " + toUpper.apply("hello"));
        
        // Constructor reference
        Supplier<ArrayList<String>> listCreator = ArrayList::new;
        ArrayList<String> newList = listCreator.get();
        
        // 4. Composing Functions
        System.out.println("\n=== Composing Functions ===");
        
        Function<Integer, Integer> doubleIt = n -> n * 2;
        Function<Integer, Integer> addTen = n -> n + 10;
        
        // compose: addTen is applied first, then doubleIt
        Function<Integer, Integer> addThenDouble = doubleIt.compose(addTen);
        System.out.println("Add 10 then double 5: " + addThenDouble.apply(5)); // (5+10)*2 = 30
        
        // andThen: doubleIt is applied first, then addTen
        Function<Integer, Integer> doubleThenAdd = doubleIt.andThen(addTen);
        System.out.println("Double 5 then add 10: " + doubleThenAdd.apply(5)); // (5*2)+10 = 20
        
        // 5. Custom Functional Interface
        System.out.println("\n=== Custom Functional Interface ===");
        
        TriFunction<Integer, Integer, Integer, Integer> sumThree = (a, b, c) -> a + b + c;
        System.out.println("Sum of 1, 2, 3: " + sumThree.apply(1, 2, 3));
    }
    
    // Custom functional interface
    @FunctionalInterface
    interface TriFunction<A, B, C, R> {
        R apply(A a, B b, C c);
    }
}
```

### Question 6: Explain the Stream API and its operations.

**Answer:**
The Stream API provides a functional approach to processing collections. Streams support:
- **Intermediate operations**: filter, map, flatMap, sorted, distinct, peek (lazy)
- **Terminal operations**: collect, forEach, reduce, count, findFirst, anyMatch (eager)

**Detailed Code Example:**

```java
import java.util.*;
import java.util.stream.*;

public class StreamAPIDemo {
    
    public static void main(String[] args) {
        List<Person> people = Arrays.asList(
            new Person("Alice", 30, "Engineering"),
            new Person("Bob", 25, "Marketing"),
            new Person("Charlie", 35, "Engineering"),
            new Person("Diana", 28, "HR"),
            new Person("Eve", 32, "Engineering")
        );
        
        // 1. Filter and Map
        System.out.println("=== Filter and Map ===");
        List<String> engineerNames = people.stream()
            .filter(p -> p.getDepartment().equals("Engineering"))
            .map(Person::getName)
            .collect(Collectors.toList());
        System.out.println("Engineers: " + engineerNames);
        
        // 2. Reduce
        System.out.println("\n=== Reduce ===");
        int totalAge = people.stream()
            .map(Person::getAge)
            .reduce(0, Integer::sum);
        System.out.println("Total age: " + totalAge);
        
        // Alternative using sum()
        int totalAge2 = people.stream()
            .mapToInt(Person::getAge)
            .sum();
        System.out.println("Total age (mapToInt): " + totalAge2);
        
        // 3. Grouping
        System.out.println("\n=== Grouping ===");
        Map<String, List<Person>> byDepartment = people.stream()
            .collect(Collectors.groupingBy(Person::getDepartment));
        byDepartment.forEach((dept, persons) -> 
            System.out.println(dept + ": " + persons));
        
        // 4. Partitioning
        System.out.println("\n=== Partitioning ===");
        Map<Boolean, List<Person>> partitioned = people.stream()
            .collect(Collectors.partitioningBy(p -> p.getAge() >= 30));
        System.out.println("Age >= 30: " + partitioned.get(true));
        System.out.println("Age < 30: " + partitioned.get(false));
        
        // 5. Statistics
        System.out.println("\n=== Statistics ===");
        IntSummaryStatistics stats = people.stream()
            .mapToInt(Person::getAge)
            .summaryStatistics();
        System.out.println("Average age: " + stats.getAverage());
        System.out.println("Max age: " + stats.getMax());
        System.out.println("Min age: " + stats.getMin());
        
        // 6. FlatMap
        System.out.println("\n=== FlatMap ===");
        List<List<Integer>> nestedList = Arrays.asList(
            Arrays.asList(1, 2, 3),
            Arrays.asList(4, 5, 6),
            Arrays.asList(7, 8, 9)
        );
        List<Integer> flatList = nestedList.stream()
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
        System.out.println("Flattened: " + flatList);
        
        // 7. Parallel Streams
        System.out.println("\n=== Parallel Streams ===");
        long start = System.currentTimeMillis();
        long count = people.parallelStream()
            .filter(p -> {
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                return p.getAge() > 25;
            })
            .count();
        long end = System.currentTimeMillis();
        System.out.println("Parallel count: " + count + " in " + (end - start) + "ms");
        
        // 8. Custom Collector
        System.out.println("\n=== Custom Collector ===");
        String names = people.stream()
            .map(Person::getName)
            .collect(Collectors.joining(", ", "Names: [", "]"));
        System.out.println(names);
        
        // 9. Stream creation methods
        System.out.println("\n=== Stream Creation ===");
        
        // From values
        Stream<String> streamOfValues = Stream.of("a", "b", "c");
        
        // From array
        Stream<String> streamFromArray = Arrays.stream(new String[]{"x", "y", "z"});
        
        // Generate infinite stream
        Stream<Double> infiniteRandom = Stream.generate(Math::random).limit(5);
        System.out.println("Random numbers: " + infiniteRandom.collect(Collectors.toList()));
        
        // Iterate
        Stream<Integer> iterated = Stream.iterate(0, n -> n + 2).limit(5);
        System.out.println("Even numbers: " + iterated.collect(Collectors.toList()));
        
        // IntStream range
        IntStream range = IntStream.rangeClosed(1, 5);
        System.out.println("Range 1-5: " + range.boxed().collect(Collectors.toList()));
    }
    
    static class Person {
        private String name;
        private int age;
        private String department;
        
        public Person(String name, int age, String department) {
            this.name = name;
            this.age = age;
            this.department = department;
        }
        
        public String getName() { return name; }
        public int getAge() { return age; }
        public String getDepartment() { return department; }
        
        @Override
        public String toString() {
            return name + "(" + age + ")";
        }
    }
}
```

---

## Collections Framework

### Question 7: Compare HashMap, TreeMap, and LinkedHashMap.

**Answer:**

| Feature | HashMap | TreeMap | LinkedHashMap |
|---------|---------|---------|---------------|
| Ordering | No order | Sorted by key | Insertion order |
| Time Complexity | O(1) | O(log n) | O(1) |
| Null Keys | 1 null key | No null keys | 1 null key |
| Implementation | Hash table | Red-Black tree | Hash table + linked list |
| Use Case | General purpose | Need sorted keys | Need predictable iteration |

**Detailed Code Example:**

```java
import java.util.*;

public class MapComparisonDemo {
    
    public static void main(String[] args) {
        // 1. HashMap - No guaranteed order
        System.out.println("=== HashMap ===");
        Map<String, Integer> hashMap = new HashMap<>();
        hashMap.put("Charlie", 3);
        hashMap.put("Alice", 1);
        hashMap.put("Bob", 2);
        hashMap.put(null, 0); // Allows null key
        System.out.println("HashMap: " + hashMap);
        
        // 2. TreeMap - Sorted by key
        System.out.println("\n=== TreeMap ===");
        Map<String, Integer> treeMap = new TreeMap<>();
        treeMap.put("Charlie", 3);
        treeMap.put("Alice", 1);
        treeMap.put("Bob", 2);
        // treeMap.put(null, 0); // NullPointerException!
        System.out.println("TreeMap: " + treeMap);
        
        // TreeMap with custom comparator (reverse order)
        Map<String, Integer> reverseTreeMap = new TreeMap<>(Comparator.reverseOrder());
        reverseTreeMap.put("Charlie", 3);
        reverseTreeMap.put("Alice", 1);
        reverseTreeMap.put("Bob", 2);
        System.out.println("Reverse TreeMap: " + reverseTreeMap);
        
        // 3. LinkedHashMap - Maintains insertion order
        System.out.println("\n=== LinkedHashMap ===");
        Map<String, Integer> linkedHashMap = new LinkedHashMap<>();
        linkedHashMap.put("Charlie", 3);
        linkedHashMap.put("Alice", 1);
        linkedHashMap.put("Bob", 2);
        System.out.println("LinkedHashMap: " + linkedHashMap);
        
        // LinkedHashMap with access order (for LRU cache)
        Map<String, Integer> accessOrderMap = new LinkedHashMap<>(16, 0.75f, true);
        accessOrderMap.put("Charlie", 3);
        accessOrderMap.put("Alice", 1);
        accessOrderMap.put("Bob", 2);
        accessOrderMap.get("Charlie"); // Access Charlie
        System.out.println("Access-order LinkedHashMap: " + accessOrderMap);
        
        // 4. Performance comparison
        System.out.println("\n=== Performance Comparison ===");
        int size = 100000;
        
        // HashMap
        Map<Integer, Integer> hashMapPerf = new HashMap<>();
        long start = System.nanoTime();
        for (int i = 0; i < size; i++) {
            hashMapPerf.put(i, i);
        }
        long hashMapInsertTime = System.nanoTime() - start;
        
        start = System.nanoTime();
        for (int i = 0; i < size; i++) {
            hashMapPerf.get(i);
        }
        long hashMapGetTime = System.nanoTime() - start;
        
        // TreeMap
        Map<Integer, Integer> treeMapPerf = new TreeMap<>();
        start = System.nanoTime();
        for (int i = 0; i < size; i++) {
            treeMapPerf.put(i, i);
        }
        long treeMapInsertTime = System.nanoTime() - start;
        
        start = System.nanoTime();
        for (int i = 0; i < size; i++) {
            treeMapPerf.get(i);
        }
        long treeMapGetTime = System.nanoTime() - start;
        
        System.out.println("HashMap Insert: " + hashMapInsertTime / 1000000 + " ms");
        System.out.println("HashMap Get: " + hashMapGetTime / 1000000 + " ms");
        System.out.println("TreeMap Insert: " + treeMapInsertTime / 1000000 + " ms");
        System.out.println("TreeMap Get: " + treeMapGetTime / 1000000 + " ms");
        
        // 5. Special operations
        System.out.println("\n=== Special TreeMap Operations ===");
        NavigableMap<Integer, String> navigableMap = new TreeMap<>();
        navigableMap.put(1, "One");
        navigableMap.put(3, "Three");
        navigableMap.put(5, "Five");
        navigableMap.put(7, "Seven");
        
        System.out.println("Lower than 5: " + navigableMap.lowerEntry(5));
        System.out.println("Floor of 4: " + navigableMap.floorEntry(4));
        System.out.println("Ceiling of 4: " + navigableMap.ceilingEntry(4));
        System.out.println("Higher than 5: " + navigableMap.higherEntry(5));
        System.out.println("SubMap [2,6): " + navigableMap.subMap(2, 6));
    }
}
```

### Question 8: How does HashMap work internally?

**Answer:**
HashMap uses an array of buckets (Node array). Each bucket can contain a linked list or a tree (when list size exceeds threshold):

1. **Hashing**: Key's hashCode is computed and distributed
2. **Index calculation**: `index = hash & (n-1)` where n is array size
3. **Collision handling**: Linked list or tree (when size > 8)
4. **Load factor**: Default 0.75, triggers resize when exceeded
5. **Treeification**: Bucket converts to tree when size > 8 and array size > 64

**Detailed Code Example:**

```java
import java.util.*;
import java.lang.reflect.Field;

public class HashMapInternalsDemo {
    
    public static void main(String[] args) throws Exception {
        // Custom class to demonstrate hashing
        System.out.println("=== Hash Distribution ===");
        
        Map<CustomKey, String> map = new HashMap<>();
        
        // Same hash codes will cause collision
        CustomKey key1 = new CustomKey(1, "Key1");
        CustomKey key2 = new CustomKey(1, "Key2"); // Same hashCode as key1
        CustomKey key3 = new CustomKey(2, "Key3");
        
        map.put(key1, "Value1");
        map.put(key2, "Value2");
        map.put(key3, "Value3");
        
        System.out.println("Key1 hashCode: " + key1.hashCode());
        System.out.println("Key2 hashCode: " + key2.hashCode());
        System.out.println("Key3 hashCode: " + key3.hashCode());
        
        // Demonstrating resize
        System.out.println("\n=== HashMap Resize ===");
        HashMap<Integer, Integer> resizeMap = new HashMap<>(4, 0.75f);
        System.out.println("Initial capacity: 4, Load factor: 0.75");
        System.out.println("Threshold: 4 * 0.75 = 3");
        
        for (int i = 0; i < 5; i++) {
            resizeMap.put(i, i);
            System.out.println("Put " + i + ", Size: " + resizeMap.size());
        }
        
        // Custom HashMap implementation for understanding
        System.out.println("\n=== Custom Simple HashMap ===");
        SimpleHashMap<String, Integer> simpleMap = new SimpleHashMap<>();
        simpleMap.put("one", 1);
        simpleMap.put("two", 2);
        simpleMap.put("three", 3);
        
        System.out.println("Get 'one': " + simpleMap.get("one"));
        System.out.println("Get 'two': " + simpleMap.get("two"));
        System.out.println("Get 'three': " + simpleMap.get("three"));
        
        // Demonstrating collision resolution
        System.out.println("\n=== Collision Resolution ===");
        simpleMap.put("owt", 4); // "owt" and "two" might have same bucket
        simpleMap.printBuckets();
    }
    
    // Custom key class demonstrating equals/hashCode contract
    static class CustomKey {
        private int id;
        private String name;
        
        public CustomKey(int id, String name) {
            this.id = id;
            this.name = name;
        }
        
        @Override
        public int hashCode() {
            return id; // Intentionally simple for demo
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            CustomKey other = (CustomKey) obj;
            return id == other.id && Objects.equals(name, other.name);
        }
        
        @Override
        public String toString() {
            return "CustomKey{id=" + id + ", name='" + name + "'}";
        }
    }
    
    // Simple HashMap implementation for educational purposes
    static class SimpleHashMap<K, V> {
        private static final int INITIAL_CAPACITY = 16;
        private Node<K, V>[] buckets;
        private int size;
        
        @SuppressWarnings("unchecked")
        public SimpleHashMap() {
            buckets = new Node[INITIAL_CAPACITY];
        }
        
        public void put(K key, V value) {
            int index = getIndex(key);
            Node<K, V> newNode = new Node<>(key, value);
            
            if (buckets[index] == null) {
                buckets[index] = newNode;
            } else {
                Node<K, V> current = buckets[index];
                while (current != null) {
                    if (current.key.equals(key)) {
                        current.value = value;
                        return;
                    }
                    if (current.next == null) {
                        current.next = newNode;
                        break;
                    }
                    current = current.next;
                }
            }
            size++;
        }
        
        public V get(K key) {
            int index = getIndex(key);
            Node<K, V> current = buckets[index];
            
            while (current != null) {
                if (current.key.equals(key)) {
                    return current.value;
                }
                current = current.next;
            }
            return null;
        }
        
        private int getIndex(K key) {
            return Math.abs(key.hashCode()) % buckets.length;
        }
        
        public void printBuckets() {
            for (int i = 0; i < buckets.length; i++) {
                if (buckets[i] != null) {
                    System.out.print("Bucket " + i + ": ");
                    Node<K, V> current = buckets[i];
                    while (current != null) {
                        System.out.print("[" + current.key + "=" + current.value + "] -> ");
                        current = current.next;
                    }
                    System.out.println("null");
                }
            }
        }
        
        static class Node<K, V> {
            K key;
            V value;
            Node<K, V> next;
            
            Node(K key, V value) {
                this.key = key;
                this.value = value;
            }
        }
    }
}
```

---

## Exception Handling

### Question 9: Explain the difference between checked and unchecked exceptions.

**Answer:**

| Feature | Checked Exceptions | Unchecked Exceptions |
|---------|-------------------|---------------------|
| Compile-time check | Yes | No |
| Inheritance | Extends Exception | Extends RuntimeException |
| Must handle | Yes (try-catch or throws) | No |
| Examples | IOException, SQLException | NullPointerException, IllegalArgumentException |
| Use case | Recoverable errors | Programming errors |

**Detailed Code Example:**

```java
import java.io.*;
import java.sql.*;

public class ExceptionHandlingDemo {
    
    public static void main(String[] args) {
        ExceptionHandlingDemo demo = new ExceptionHandlingDemo();
        
        // 1. Checked exception handling
        System.out.println("=== Checked Exceptions ===");
        try {
            demo.readFile("nonexistent.txt");
        } catch (IOException e) {
            System.out.println("Caught IOException: " + e.getMessage());
        }
        
        // 2. Unchecked exception
        System.out.println("\n=== Unchecked Exceptions ===");
        try {
            demo.divide(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("Caught ArithmeticException: " + e.getMessage());
        }
        
        // 3. Multi-catch
        System.out.println("\n=== Multi-catch ===");
        try {
            demo.riskyOperation(1);
        } catch (IOException | IllegalArgumentException e) {
            System.out.println("Caught: " + e.getClass().getSimpleName());
        }
        
        // 4. Try-with-resources
        System.out.println("\n=== Try-with-resources ===");
        demo.demonstrateTryWithResources();
        
        // 5. Custom exception
        System.out.println("\n=== Custom Exception ===");
        try {
            demo.validateAge(-5);
        } catch (InvalidAgeException e) {
            System.out.println("Caught custom exception: " + e.getMessage());
            System.out.println("Invalid value: " + e.getInvalidValue());
        }
        
        // 6. Exception chaining
        System.out.println("\n=== Exception Chaining ===");
        try {
            demo.processData();
        } catch (ProcessingException e) {
            System.out.println("Caught: " + e.getMessage());
            System.out.println("Caused by: " + e.getCause().getMessage());
        }
    }
    
    // Checked exception - must be declared or caught
    public void readFile(String filename) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line = reader.readLine();
            System.out.println(line);
        }
    }
    
    // Unchecked exception - doesn't need declaration
    public int divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Division by zero");
        }
        return a / b;
    }
    
    // Multi-catch example
    public void riskyOperation(int flag) throws IOException {
        if (flag == 1) {
            throw new IOException("IO Error");
        } else {
            throw new IllegalArgumentException("Invalid argument");
        }
    }
    
    // Try-with-resources with custom AutoCloseable
    public void demonstrateTryWithResources() {
        try (CustomResource resource = new CustomResource()) {
            resource.doWork();
        } catch (Exception e) {
            System.out.println("Exception during work: " + e.getMessage());
            
            // Get suppressed exceptions
            for (Throwable suppressed : e.getSuppressed()) {
                System.out.println("Suppressed: " + suppressed.getMessage());
            }
        }
    }
    
    // Custom exception usage
    public void validateAge(int age) throws InvalidAgeException {
        if (age < 0 || age > 150) {
            throw new InvalidAgeException("Age must be between 0 and 150", age);
        }
        System.out.println("Valid age: " + age);
    }
    
    // Exception chaining
    public void processData() throws ProcessingException {
        try {
            // Simulating lower-level exception
            throw new SQLException("Database connection failed");
        } catch (SQLException e) {
            // Wrap in higher-level exception
            throw new ProcessingException("Failed to process data", e);
        }
    }
    
    // Custom AutoCloseable resource
    static class CustomResource implements AutoCloseable {
        public CustomResource() {
            System.out.println("Resource opened");
        }
        
        public void doWork() throws Exception {
            System.out.println("Doing work...");
            throw new Exception("Work failed");
        }
        
        @Override
        public void close() throws Exception {
            System.out.println("Closing resource...");
            throw new Exception("Close failed");
        }
    }
    
    // Custom checked exception
    static class InvalidAgeException extends Exception {
        private final int invalidValue;
        
        public InvalidAgeException(String message, int invalidValue) {
            super(message);
            this.invalidValue = invalidValue;
        }
        
        public int getInvalidValue() {
            return invalidValue;
        }
    }
    
    // Custom unchecked exception for processing
    static class ProcessingException extends RuntimeException {
        public ProcessingException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
```

---

## Generics

### Question 10: Explain bounded type parameters and wildcards in Generics.

**Answer:**

1. **Upper Bounded**: `<T extends Type>` - T must be Type or subtype
2. **Lower Bounded**: `<? super Type>` - Unknown type that is Type or supertype
3. **Unbounded**: `<?>` - Any type
4. **PECS Principle**: Producer Extends, Consumer Super

**Detailed Code Example:**

```java
import java.util.*;

public class GenericsDemo {
    
    public static void main(String[] args) {
        // 1. Basic Generic Class
        System.out.println("=== Basic Generic Class ===");
        Box<String> stringBox = new Box<>("Hello");
        Box<Integer> intBox = new Box<>(42);
        System.out.println("String Box: " + stringBox.get());
        System.out.println("Integer Box: " + intBox.get());
        
        // 2. Upper Bounded Type Parameter
        System.out.println("\n=== Upper Bounded ===");
        List<Integer> integers = Arrays.asList(1, 2, 3, 4, 5);
        List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);
        System.out.println("Sum of integers: " + sumOfNumbers(integers));
        System.out.println("Sum of doubles: " + sumOfNumbers(doubles));
        
        // 3. Wildcards
        System.out.println("\n=== Wildcards ===");
        
        List<Integer> intList = new ArrayList<>(Arrays.asList(1, 2, 3));
        List<Number> numList = new ArrayList<>(Arrays.asList(1, 2.5, 3L));
        List<Object> objList = new ArrayList<>(Arrays.asList("a", 1, 2.5));
        
        // Upper bounded wildcard (? extends Number) - can read
        printNumbers(intList);  // Works - Integer extends Number
        printNumbers(numList);  // Works - Number is Number
        // printNumbers(objList); // Error - Object doesn't extend Number
        
        // Lower bounded wildcard (? super Integer) - can write
        addIntegers(intList);   // Works - Integer is Integer
        addIntegers(numList);   // Works - Number is supertype of Integer
        addIntegers(objList);   // Works - Object is supertype of Integer
        
        // 4. PECS Principle (Producer Extends, Consumer Super)
        System.out.println("\n=== PECS Principle ===");
        List<Integer> source = Arrays.asList(1, 2, 3);
        List<Number> destination = new ArrayList<>();
        copy(source, destination);
        System.out.println("Copied: " + destination);
        
        // 5. Generic Method
        System.out.println("\n=== Generic Method ===");
        String[] strings = {"apple", "banana", "cherry"};
        Integer[] integers2 = {1, 2, 3};
        System.out.println("First String: " + getFirst(strings));
        System.out.println("First Integer: " + getFirst(integers2));
        
        // 6. Multiple Type Parameters
        System.out.println("\n=== Multiple Type Parameters ===");
        Pair<String, Integer> pair = new Pair<>("Age", 25);
        System.out.println(pair.getFirst() + ": " + pair.getSecond());
        
        // 7. Type Erasure Demo
        System.out.println("\n=== Type Erasure ===");
        List<String> stringList = new ArrayList<>();
        List<Integer> integerList = new ArrayList<>();
        System.out.println("Same class: " + (stringList.getClass() == integerList.getClass()));
        System.out.println("Class: " + stringList.getClass());
        
        // 8. Generic Bounds with Comparable
        System.out.println("\n=== Generic Bounds with Comparable ===");
        Integer max = findMax(Arrays.asList(3, 1, 4, 1, 5, 9));
        System.out.println("Max: " + max);
    }
    
    // Generic class
    static class Box<T> {
        private T item;
        
        public Box(T item) {
            this.item = item;
        }
        
        public T get() {
            return item;
        }
        
        public void set(T item) {
            this.item = item;
        }
    }
    
    // Upper bounded type parameter
    public static double sumOfNumbers(List<? extends Number> numbers) {
        double sum = 0;
        for (Number n : numbers) {
            sum += n.doubleValue();
        }
        return sum;
    }
    
    // Upper bounded wildcard - Producer Extends (read from)
    public static void printNumbers(List<? extends Number> numbers) {
        for (Number n : numbers) {
            System.out.print(n + " ");
        }
        System.out.println();
        // numbers.add(1); // Compile error - can't add
    }
    
    // Lower bounded wildcard - Consumer Super (write to)
    public static void addIntegers(List<? super Integer> list) {
        list.add(100);
        list.add(200);
        // Integer i = list.get(0); // Compile error - can only get Object
    }
    
    // PECS: Producer Extends, Consumer Super
    public static <T> void copy(List<? extends T> source, List<? super T> destination) {
        for (T item : source) {
            destination.add(item);
        }
    }
    
    // Generic method
    public static <T> T getFirst(T[] array) {
        if (array == null || array.length == 0) {
            return null;
        }
        return array[0];
    }
    
    // Multiple type parameters
    static class Pair<K, V> {
        private K first;
        private V second;
        
        public Pair(K first, V second) {
            this.first = first;
            this.second = second;
        }
        
        public K getFirst() { return first; }
        public V getSecond() { return second; }
    }
    
    // Bounded type with Comparable
    public static <T extends Comparable<T>> T findMax(List<T> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) {
                max = item;
            }
        }
        return max;
    }
}
```

---

## Summary

Core Java concepts are fundamental for any Java Tech Lead. Key areas to master:

1. **JVM Architecture**: Understanding how Java runs helps in performance optimization
2. **Memory Management**: Crucial for building scalable applications
3. **Java 8+ Features**: Modern Java development requires fluency in lambdas and streams
4. **Collections Framework**: Choosing the right collection impacts performance
5. **Exception Handling**: Proper error handling ensures robust applications
6. **Generics**: Type-safe code is essential for maintainable codebases

Continue to [Module 2: Design Patterns](02-design-patterns.md) →
