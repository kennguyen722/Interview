/**
 * Comprehensive performance analysis of primitive vs wrapper collections
 * Provides detailed metrics for architectural decision making
 */
import java.util.*;

public class CollectionPerformanceAnalyzer {
    
    private static final int[] SIZES = {1_000, 10_000, 100_000, 1_000_000};
    private static final int WARMUP_ITERATIONS = 3;
    
    public void analyzeIntegerStorage() {
        System.out.println("=== Collection Performance Analysis ===\n");
        
        // Warm up JVM
        System.out.println("Warming up JVM...");
        for (int i = 0; i < WARMUP_ITERATIONS; i++) {
            measurePrimitiveArray(1000);
            measureWrapperList(1000);
        }
        
        for (int size : SIZES) {
            System.out.printf("=== Analysis for %,d elements ===%n", size);
            
            long primitiveTime = measurePrimitiveArray(size);
            long wrapperTime = measureWrapperList(size);
            measureMemoryUsage(size);
            
            double slowdownFactor = (double) wrapperTime / primitiveTime;
            System.out.printf("Performance: Wrapper is %.1fx slower%n%n", slowdownFactor);
        }
    }
    
    private long measurePrimitiveArray(int size) {
        // Creation timing
        long startTime = System.nanoTime();
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = i;
        }
        long creationTime = System.nanoTime() - startTime;
        
        // Sum calculation timing
        startTime = System.nanoTime();
        long sum = 0L;
        for (int value : array) {
            sum += value; // Pure primitive arithmetic
        }
        long sumTime = System.nanoTime() - startTime;
        
        System.out.printf("Primitive int[]: Creation %,d ns, Sum %,d ns (sum: %,d)%n",
                         creationTime, sumTime, sum);
        
        return creationTime + sumTime;
    }
    
    private long measureWrapperList(int size) {
        // Creation timing with autoboxing
        long startTime = System.nanoTime();
        List<Integer> list = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            list.add(i); // Autoboxing on each add
        }
        long creationTime = System.nanoTime() - startTime;
        
        // Sum calculation with unboxing
        startTime = System.nanoTime();
        Long sum = 0L; // Wrapper type for accumulator
        for (Integer value : list) {
            sum += value; // Unboxing + boxing operations
        }
        long sumTime = System.nanoTime() - startTime;
        
        System.out.printf("ArrayList<Integer>: Creation %,d ns, Sum %,d ns (sum: %,d)%n",
                         creationTime, sumTime, sum);
        
        return creationTime + sumTime;
    }
    
    private void measureMemoryUsage(int size) {
        Runtime runtime = Runtime.getRuntime();
        
        // Force garbage collection and measure baseline
        System.gc();
        try { Thread.sleep(100); } catch (InterruptedException e) {}
        
        // Measure primitive array memory
        long beforePrimitive = runtime.totalMemory() - runtime.freeMemory();
        int[] primitiveArray = new int[size];
        for (int i = 0; i < size; i++) {
            primitiveArray[i] = i;
        }
        long afterPrimitive = runtime.totalMemory() - runtime.freeMemory();
        
        // Clear and measure wrapper list memory  
        primitiveArray = null;
        System.gc();
        try { Thread.sleep(100); } catch (InterruptedException e) {}
        
        long beforeWrapper = runtime.totalMemory() - runtime.freeMemory();
        List<Integer> wrapperList = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            wrapperList.add(i);
        }
        long afterWrapper = runtime.totalMemory() - runtime.freeMemory();
        
        long primitiveMemory = afterPrimitive - beforePrimitive;
        long wrapperMemory = afterWrapper - beforeWrapper;
        
        // Theoretical calculations
        long theoreticalPrimitiveMemory = size * 4L; // 4 bytes per int
        long theoreticalWrapperMemory = size * 16L;   // ~16 bytes per Integer object
        
        System.out.printf("Memory Usage:%n");
        System.out.printf("  int[%,d]: %,d bytes (theoretical: %,d bytes)%n",
                         size, primitiveMemory, theoreticalPrimitiveMemory);
        System.out.printf("  ArrayList<Integer>: %,d bytes (theoretical: %,d+ bytes)%n",
                         size, wrapperMemory, theoreticalWrapperMemory);
        System.out.printf("  Memory overhead: %.1fx%n",
                         (double) wrapperMemory / primitiveMemory);
    }
    
    public void demonstrateAutoboxingOverhead() {
        final int iterations = 10_000_000;
        
        System.out.println("=== Autoboxing Overhead Analysis ===");
        
        long primitiveTime = timePrimitiveLoop(iterations);
        long wrapperTime = timeWrapperLoop(iterations);
        
        System.out.printf("Pure primitive arithmetic: %,d ns%n", primitiveTime);
        System.out.printf("Wrapper arithmetic: %,d ns%n", wrapperTime);
        System.out.printf("Autoboxing overhead: %.1fx slower%n%n",
                         (double) wrapperTime / primitiveTime);
    }
    
    private long timePrimitiveLoop(int iterations) {
        long startTime = System.nanoTime();
        
        long sum = 0L; // Primitive accumulator
        for (int i = 0; i < iterations; i++) {
            sum += i * 2L; // Pure primitive arithmetic
        }
        
        long endTime = System.nanoTime();
        
        // Prevent optimization by using result
        if (sum < 0) System.out.println("Unexpected negative sum");
        
        return endTime - startTime;
    }
    
    private long timeWrapperLoop(int iterations) {
        long startTime = System.nanoTime();
        
        Long sum = 0L; // Wrapper accumulator
        for (Integer i = 0; i < iterations; i++) { // Autoboxing in loop condition
            sum += i * 2L; // Unboxing i, boxing intermediate result
        }
        
        long endTime = System.nanoTime();
        
        // Prevent optimization by using result
        if (sum < 0) System.out.println("Unexpected negative sum");
        
        return endTime - startTime;
    }
    
    public static void main(String[] args) {
        CollectionPerformanceAnalyzer analyzer = new CollectionPerformanceAnalyzer();
        analyzer.analyzeIntegerStorage();
        analyzer.demonstrateAutoboxingOverhead();
    }
}