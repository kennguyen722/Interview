# Module 5: Java Performance Optimization

## Table of Contents
1. [JVM Tuning](#jvm-tuning)
2. [Profiling](#profiling)
3. [Memory Optimization](#memory-optimization)
4. [Code Optimization](#code-optimization)

---

## JVM Tuning

### Question 1: What are the important JVM parameters for performance tuning?

**Answer:**
Key JVM parameters:
1. **Heap size**: -Xms, -Xmx
2. **GC selection**: -XX:+UseG1GC, -XX:+UseZGC
3. **GC tuning**: -XX:MaxGCPauseMillis
4. **Metaspace**: -XX:MetaspaceSize
5. **Thread stack**: -Xss

**Detailed Code Example:**

```java
import java.lang.management.*;
import java.util.*;

public class JVMTuningDemo {
    
    public static void main(String[] args) {
        // Display JVM settings
        System.out.println("=== JVM Memory Settings ===");
        
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory() / (1024 * 1024);
        long totalMemory = runtime.totalMemory() / (1024 * 1024);
        long freeMemory = runtime.freeMemory() / (1024 * 1024);
        
        System.out.println("Max Memory (-Xmx): " + maxMemory + " MB");
        System.out.println("Total Memory: " + totalMemory + " MB");
        System.out.println("Free Memory: " + freeMemory + " MB");
        System.out.println("Used Memory: " + (totalMemory - freeMemory) + " MB");
        
        // Memory Pools
        System.out.println("\n=== Memory Pools ===");
        List<MemoryPoolMXBean> memoryPools = ManagementFactory.getMemoryPoolMXBeans();
        for (MemoryPoolMXBean pool : memoryPools) {
            System.out.println(pool.getName() + ": " + 
                pool.getUsage().getUsed() / (1024 * 1024) + " MB");
        }
        
        // GC Info
        System.out.println("\n=== Garbage Collectors ===");
        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
        for (GarbageCollectorMXBean gc : gcBeans) {
            System.out.println(gc.getName() + 
                " - Collections: " + gc.getCollectionCount() +
                ", Time: " + gc.getCollectionTime() + " ms");
        }
        
        // Thread Info
        System.out.println("\n=== Thread Info ===");
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        System.out.println("Thread Count: " + threadBean.getThreadCount());
        System.out.println("Peak Thread Count: " + threadBean.getPeakThreadCount());
        
        // Recommended JVM settings
        System.out.println("\n=== Recommended JVM Settings ===");
        System.out.println("Production settings example:");
        System.out.println("-Xms4g -Xmx4g");
        System.out.println("-XX:+UseG1GC");
        System.out.println("-XX:MaxGCPauseMillis=200");
        System.out.println("-XX:+HeapDumpOnOutOfMemoryError");
        System.out.println("-XX:HeapDumpPath=/logs/heapdump.hprof");
        System.out.println("-Xlog:gc*:file=/logs/gc.log:time,uptime:filecount=5,filesize=100M");
    }
}
```

### Question 2: How do you analyze and tune garbage collection?

**Answer:**
GC tuning involves:
1. Choosing right GC algorithm
2. Setting appropriate heap sizes
3. Analyzing GC logs
4. Monitoring pause times

**Detailed Code Example:**

```java
import java.util.*;
import java.lang.management.*;

public class GCAnalysisDemo {
    
    private static List<byte[]> memoryHog = new ArrayList<>();
    
    public static void main(String[] args) throws Exception {
        System.out.println("=== GC Analysis Demo ===");
        System.out.println("Watch GC behavior during memory pressure\n");
        
        // Register GC notification listener
        for (GarbageCollectorMXBean gc : ManagementFactory.getGarbageCollectorMXBeans()) {
            System.out.println("GC: " + gc.getName());
        }
        
        // Monitor GC
        GCMonitor monitor = new GCMonitor();
        monitor.start();
        
        // Create memory pressure
        System.out.println("\nCreating memory pressure...");
        for (int i = 0; i < 100; i++) {
            memoryHog.add(new byte[1024 * 1024]); // 1MB
            
            if (i % 10 == 0) {
                System.out.println("Allocated: " + (i + 1) + " MB");
                printMemoryUsage();
            }
            
            // Occasionally release some memory
            if (i % 20 == 0 && i > 0) {
                int toRemove = memoryHog.size() / 2;
                for (int j = 0; j < toRemove; j++) {
                    memoryHog.remove(0);
                }
                System.out.println("Released " + toRemove + " MB");
            }
            
            Thread.sleep(50);
        }
        
        monitor.stop();
        System.out.println("\nFinal GC Statistics:");
        printGCStats();
    }
    
    static void printMemoryUsage() {
        Runtime rt = Runtime.getRuntime();
        long used = (rt.totalMemory() - rt.freeMemory()) / (1024 * 1024);
        long total = rt.totalMemory() / (1024 * 1024);
        System.out.println("Memory: " + used + "/" + total + " MB");
    }
    
    static void printGCStats() {
        for (GarbageCollectorMXBean gc : ManagementFactory.getGarbageCollectorMXBeans()) {
            System.out.println(gc.getName() + ":");
            System.out.println("  Collections: " + gc.getCollectionCount());
            System.out.println("  Total time: " + gc.getCollectionTime() + " ms");
            if (gc.getCollectionCount() > 0) {
                System.out.println("  Avg time: " + 
                    gc.getCollectionTime() / gc.getCollectionCount() + " ms");
            }
        }
    }
}

class GCMonitor extends Thread {
    private volatile boolean running = true;
    private long lastYoungGC = 0;
    private long lastOldGC = 0;
    
    @Override
    public void run() {
        while (running) {
            for (GarbageCollectorMXBean gc : ManagementFactory.getGarbageCollectorMXBeans()) {
                String name = gc.getName();
                long count = gc.getCollectionCount();
                
                if (name.contains("Young") || name.contains("G1 Young") || name.contains("PS Scavenge")) {
                    if (count > lastYoungGC) {
                        System.out.println("[GC] Young collection #" + count);
                        lastYoungGC = count;
                    }
                } else {
                    if (count > lastOldGC) {
                        System.out.println("[GC] Old collection #" + count);
                        lastOldGC = count;
                    }
                }
            }
            
            try { Thread.sleep(100); } catch (InterruptedException e) { break; }
        }
    }
    
    public void stopMonitor() {
        running = false;
    }
}
```

---

## Profiling

### Question 3: How do you identify performance bottlenecks in Java applications?

**Answer:**
Profiling techniques:
1. **CPU Profiling**: Identify hot methods
2. **Memory Profiling**: Find memory leaks
3. **Thread Profiling**: Detect contention
4. **I/O Profiling**: Find slow operations

**Detailed Code Example:**

```java
import java.util.*;
import java.util.concurrent.*;

public class ProfilingDemo {
    
    public static void main(String[] args) throws Exception {
        System.out.println("=== Profiling Demo ===\n");
        
        // 1. CPU Profiling - Measure method execution time
        System.out.println("=== CPU Profiling ===");
        Profiler profiler = new Profiler();
        
        profiler.start("inefficientSort");
        int[] data = generateRandomArray(10000);
        inefficientSort(data);
        profiler.stop("inefficientSort");
        
        profiler.start("efficientSort");
        data = generateRandomArray(10000);
        Arrays.sort(data);
        profiler.stop("efficientSort");
        
        profiler.printResults();
        
        // 2. Memory Tracking
        System.out.println("\n=== Memory Tracking ===");
        MemoryTracker memTracker = new MemoryTracker();
        memTracker.snapshot("before");
        
        List<String> strings = new ArrayList<>();
        for (int i = 0; i < 100000; i++) {
            strings.add("String number " + i);
        }
        
        memTracker.snapshot("after");
        memTracker.compare("before", "after");
        
        // 3. Thread Contention Demo
        System.out.println("\n=== Thread Contention ===");
        demonstrateContention();
    }
    
    static int[] generateRandomArray(int size) {
        Random random = new Random();
        int[] arr = new int[size];
        for (int i = 0; i < size; i++) {
            arr[i] = random.nextInt();
        }
        return arr;
    }
    
    // O(n^2) bubble sort - inefficient
    static void inefficientSort(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    static void demonstrateContention() throws Exception {
        Object lock = new Object();
        int numThreads = 4;
        CountDownLatch latch = new CountDownLatch(numThreads);
        
        long start = System.currentTimeMillis();
        
        for (int i = 0; i < numThreads; i++) {
            new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    synchronized (lock) {
                        // Simulate work
                        try { Thread.sleep(1); } catch (InterruptedException e) {}
                    }
                }
                latch.countDown();
            }).start();
        }
        
        latch.await();
        long elapsed = System.currentTimeMillis() - start;
        System.out.println("With contention: " + elapsed + " ms");
        System.out.println("Expected without contention: ~" + numThreads * 1000 + " ms");
    }
}

class Profiler {
    private Map<String, Long> startTimes = new HashMap<>();
    private Map<String, Long> durations = new HashMap<>();
    
    public void start(String name) {
        startTimes.put(name, System.nanoTime());
    }
    
    public void stop(String name) {
        long endTime = System.nanoTime();
        long startTime = startTimes.get(name);
        durations.put(name, endTime - startTime);
    }
    
    public void printResults() {
        System.out.println("\nProfiling Results:");
        durations.forEach((name, duration) -> 
            System.out.printf("  %s: %.2f ms%n", name, duration / 1_000_000.0));
    }
}

class MemoryTracker {
    private Map<String, long[]> snapshots = new HashMap<>();
    
    public void snapshot(String name) {
        Runtime rt = Runtime.getRuntime();
        System.gc(); // Request GC for accurate measurement
        try { Thread.sleep(100); } catch (InterruptedException e) {}
        
        long total = rt.totalMemory();
        long free = rt.freeMemory();
        long used = total - free;
        
        snapshots.put(name, new long[]{total, free, used});
    }
    
    public void compare(String before, String after) {
        long[] beforeSnap = snapshots.get(before);
        long[] afterSnap = snapshots.get(after);
        
        long memoryIncrease = afterSnap[2] - beforeSnap[2];
        System.out.printf("Memory increase: %.2f MB%n", memoryIncrease / (1024.0 * 1024.0));
    }
}
```

---

## Memory Optimization

### Question 4: How do you optimize memory usage in Java?

**Answer:**
Memory optimization strategies:
1. Use appropriate data structures
2. Object pooling
3. Avoid memory leaks
4. Use primitives over wrappers
5. Lazy initialization

**Detailed Code Example:**

```java
import java.util.*;

public class MemoryOptimizationDemo {
    
    public static void main(String[] args) {
        System.out.println("=== Memory Optimization Demo ===\n");
        
        // 1. Primitive vs Wrapper
        System.out.println("=== Primitive vs Wrapper ===");
        comparePrimitiveWrapper();
        
        // 2. String optimization
        System.out.println("\n=== String Optimization ===");
        demonstrateStringOptimization();
        
        // 3. Collection sizing
        System.out.println("\n=== Collection Sizing ===");
        demonstrateCollectionSizing();
        
        // 4. Object pooling
        System.out.println("\n=== Object Pooling ===");
        demonstrateObjectPooling();
    }
    
    static void comparePrimitiveWrapper() {
        int size = 1_000_000;
        
        // Using int[] (primitive)
        Runtime rt = Runtime.getRuntime();
        System.gc();
        long before = rt.totalMemory() - rt.freeMemory();
        
        int[] primitiveArray = new int[size];
        for (int i = 0; i < size; i++) {
            primitiveArray[i] = i;
        }
        
        System.gc();
        long afterPrimitive = rt.totalMemory() - rt.freeMemory();
        System.out.printf("int[]: %.2f MB%n", (afterPrimitive - before) / (1024.0 * 1024.0));
        
        // Using Integer[] (wrapper)
        System.gc();
        before = rt.totalMemory() - rt.freeMemory();
        
        Integer[] wrapperArray = new Integer[size];
        for (int i = 0; i < size; i++) {
            wrapperArray[i] = i;
        }
        
        System.gc();
        long afterWrapper = rt.totalMemory() - rt.freeMemory();
        System.out.printf("Integer[]: %.2f MB%n", (afterWrapper - before) / (1024.0 * 1024.0));
        
        // Clear
        primitiveArray = null;
        wrapperArray = null;
    }
    
    static void demonstrateStringOptimization() {
        int iterations = 10000;
        
        // Bad: String concatenation in loop
        long start = System.currentTimeMillis();
        String badString = "";
        for (int i = 0; i < iterations; i++) {
            badString += "a";
        }
        System.out.println("String concatenation: " + (System.currentTimeMillis() - start) + " ms");
        
        // Good: StringBuilder
        start = System.currentTimeMillis();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < iterations; i++) {
            sb.append("a");
        }
        String goodString = sb.toString();
        System.out.println("StringBuilder: " + (System.currentTimeMillis() - start) + " ms");
        
        // String interning
        String s1 = new String("hello").intern();
        String s2 = "hello";
        System.out.println("Interned strings equal: " + (s1 == s2));
    }
    
    static void demonstrateCollectionSizing() {
        int elements = 10000;
        
        // Without initial capacity
        long start = System.currentTimeMillis();
        List<Integer> list1 = new ArrayList<>();
        for (int i = 0; i < elements; i++) {
            list1.add(i);
        }
        System.out.println("Without capacity: " + (System.currentTimeMillis() - start) + " ms");
        
        // With initial capacity
        start = System.currentTimeMillis();
        List<Integer> list2 = new ArrayList<>(elements);
        for (int i = 0; i < elements; i++) {
            list2.add(i);
        }
        System.out.println("With capacity: " + (System.currentTimeMillis() - start) + " ms");
    }
    
    static void demonstrateObjectPooling() {
        // Simple object pool
        ObjectPool<ExpensiveObject> pool = new ObjectPool<>(
            ExpensiveObject::new, 5);
        
        // Borrow and return objects
        ExpensiveObject obj1 = pool.borrow();
        System.out.println("Borrowed: " + obj1.getId());
        
        ExpensiveObject obj2 = pool.borrow();
        System.out.println("Borrowed: " + obj2.getId());
        
        pool.returnObject(obj1);
        System.out.println("Returned: " + obj1.getId());
        
        ExpensiveObject obj3 = pool.borrow();
        System.out.println("Borrowed (reused): " + obj3.getId());
    }
}

class ExpensiveObject {
    private static int counter = 0;
    private final int id;
    
    public ExpensiveObject() {
        this.id = ++counter;
        // Simulate expensive initialization
        try { Thread.sleep(10); } catch (InterruptedException e) {}
    }
    
    public int getId() { return id; }
}

class ObjectPool<T> {
    private final Queue<T> pool = new LinkedList<>();
    private final java.util.function.Supplier<T> factory;
    
    public ObjectPool(java.util.function.Supplier<T> factory, int initialSize) {
        this.factory = factory;
        for (int i = 0; i < initialSize; i++) {
            pool.offer(factory.get());
        }
    }
    
    public synchronized T borrow() {
        if (pool.isEmpty()) {
            return factory.get();
        }
        return pool.poll();
    }
    
    public synchronized void returnObject(T obj) {
        pool.offer(obj);
    }
}
```

---

## Code Optimization

### Question 5: What are common code-level optimizations?

**Answer:**
Code optimizations:
1. Avoid unnecessary object creation
2. Use efficient algorithms
3. Minimize I/O operations
4. Use lazy evaluation
5. Cache computed values

**Detailed Code Example:**

```java
import java.util.*;
import java.util.stream.*;

public class CodeOptimizationDemo {
    
    public static void main(String[] args) {
        System.out.println("=== Code Optimization Demo ===\n");
        
        // 1. Loop optimization
        System.out.println("=== Loop Optimization ===");
        demonstrateLoopOptimization();
        
        // 2. Caching / Memoization
        System.out.println("\n=== Memoization ===");
        demonstrateMemoization();
        
        // 3. Lazy evaluation
        System.out.println("\n=== Lazy Evaluation ===");
        demonstrateLazyEvaluation();
        
        // 4. Efficient collection usage
        System.out.println("\n=== Efficient Collections ===");
        demonstrateEfficientCollections();
    }
    
    static void demonstrateLoopOptimization() {
        int size = 1_000_000;
        int[] array = new int[size];
        Arrays.fill(array, 1);
        
        // Bad: Method call in loop condition
        long start = System.nanoTime();
        int sum1 = 0;
        for (int i = 0; i < array.length; i++) {
            sum1 += array[i];
        }
        System.out.println("array.length in loop: " + (System.nanoTime() - start) / 1000 + " µs");
        
        // Good: Cache length
        start = System.nanoTime();
        int sum2 = 0;
        int length = array.length;
        for (int i = 0; i < length; i++) {
            sum2 += array[i];
        }
        System.out.println("Cached length: " + (System.nanoTime() - start) / 1000 + " µs");
        
        // Better: Enhanced for loop
        start = System.nanoTime();
        int sum3 = 0;
        for (int val : array) {
            sum3 += val;
        }
        System.out.println("Enhanced for: " + (System.nanoTime() - start) / 1000 + " µs");
        
        // Stream (parallel)
        start = System.nanoTime();
        int sum4 = Arrays.stream(array).parallel().sum();
        System.out.println("Parallel stream: " + (System.nanoTime() - start) / 1000 + " µs");
    }
    
    static void demonstrateMemoization() {
        // Without memoization
        long start = System.nanoTime();
        int fib1 = fibRecursive(35);
        System.out.println("Recursive fib(35): " + (System.nanoTime() - start) / 1_000_000 + " ms");
        
        // With memoization
        FibonacciMemoized fibMemo = new FibonacciMemoized();
        start = System.nanoTime();
        long fib2 = fibMemo.fib(35);
        System.out.println("Memoized fib(35): " + (System.nanoTime() - start) / 1_000_000 + " ms");
    }
    
    static int fibRecursive(int n) {
        if (n <= 1) return n;
        return fibRecursive(n - 1) + fibRecursive(n - 2);
    }
    
    static void demonstrateLazyEvaluation() {
        // Eager evaluation (always computes)
        ExpensiveComputation eager = new ExpensiveComputation();
        System.out.println("Eager value (computed immediately)");
        
        // Lazy evaluation (computes on demand)
        Lazy<Integer> lazy = new Lazy<>(() -> {
            System.out.println("  Computing lazy value...");
            return 42;
        });
        System.out.println("Lazy created (not computed yet)");
        System.out.println("First access: " + lazy.get());
        System.out.println("Second access: " + lazy.get());
    }
    
    static void demonstrateEfficientCollections() {
        int lookups = 100_000;
        int size = 10_000;
        
        // ArrayList lookup
        List<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < size; i++) arrayList.add(i);
        
        long start = System.nanoTime();
        for (int i = 0; i < lookups; i++) {
            arrayList.contains(i % size);
        }
        System.out.println("ArrayList contains: " + (System.nanoTime() - start) / 1_000_000 + " ms");
        
        // HashSet lookup
        Set<Integer> hashSet = new HashSet<>(arrayList);
        
        start = System.nanoTime();
        for (int i = 0; i < lookups; i++) {
            hashSet.contains(i % size);
        }
        System.out.println("HashSet contains: " + (System.nanoTime() - start) / 1_000_000 + " ms");
    }
}

class ExpensiveComputation {
    private final int value;
    
    public ExpensiveComputation() {
        System.out.println("  ExpensiveComputation: computing...");
        this.value = 42;
    }
}

class Lazy<T> {
    private T value;
    private boolean computed = false;
    private final java.util.function.Supplier<T> supplier;
    
    public Lazy(java.util.function.Supplier<T> supplier) {
        this.supplier = supplier;
    }
    
    public T get() {
        if (!computed) {
            value = supplier.get();
            computed = true;
        }
        return value;
    }
}

class FibonacciMemoized {
    private Map<Integer, Long> cache = new HashMap<>();
    
    public long fib(int n) {
        if (n <= 1) return n;
        
        return cache.computeIfAbsent(n, k -> fib(k - 1) + fib(k - 2));
    }
}
```

---

## Summary

Performance optimization requires:

1. **JVM Tuning**: Right GC, heap sizes
2. **Profiling**: Identify bottlenecks
3. **Memory Management**: Efficient data structures
4. **Code Optimization**: Algorithm efficiency

Continue to [Module 6: Microservices](06-microservices.md) →
