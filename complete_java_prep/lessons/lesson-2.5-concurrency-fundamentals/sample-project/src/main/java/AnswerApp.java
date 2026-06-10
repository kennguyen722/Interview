import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Lesson 2.5 â€“ Concurrency Fundamentals
 *
 * WHAT THIS DEMONSTRATES:
 *   Thread creation, Executors, CompletableFuture, AtomicInteger,
 *   synchronisation issues (and how to avoid them), and a parallel task processor.
 *
 * KEY TERMS:
 *   thread           â€“ a unit of execution within a JVM process.
 *   executor         â€“ a pool that manages and reuses threads.
 *   Future/CompletableFuture â€“ a handle to an async result.
 *   race condition   â€“ a bug where outcome depends on thread scheduling.
 *   AtomicInteger    â€“ a thread-safe counter without explicit locks.
 *   synchronized     â€“ keyword that allows only one thread in a block at a time.
 */
public class AnswerApp {

    // â”€â”€ Task simulation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    record Task(int id, String name, long durationMs) {}

    record TaskResult(int taskId, String name, long elapsedMs, boolean success) {}

    /**
     * Simulates processing a task.
     * Thread.sleep() stands in for real I/O or computation.
     */
    static TaskResult process(Task task) {
        long start = System.currentTimeMillis();
        try {
            Thread.sleep(task.durationMs());   // simulated work
            return new TaskResult(task.id(), task.name(),
                System.currentTimeMillis() - start, true);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // restore interrupted flag
            return new TaskResult(task.id(), task.name(),
                System.currentTimeMillis() - start, false);
        }
    }

    // â”€â”€ Parallel task processor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Processes all tasks in parallel using a fixed thread pool.
     * Returns once all tasks complete.
     *
     * @param tasks       list of tasks to process
     * @param parallelism number of threads in the pool
     */
    static List<TaskResult> processAll(List<Task> tasks, int parallelism)
            throws InterruptedException, ExecutionException {

        // ExecutorService manages a pool of worker threads
        ExecutorService pool = Executors.newFixedThreadPool(parallelism);

        // Submit all tasks as Callables; each returns a Future<TaskResult>
        List<Future<TaskResult>> futures = tasks.stream()
            .map(t -> pool.submit(() -> process(t)))
            .collect(Collectors.toList());

        // Collect results; get() blocks until that task is done
        List<TaskResult> results = new ArrayList<>();
        for (Future<TaskResult> f : futures) {
            results.add(f.get());
        }

        pool.shutdown();   // stop accepting new tasks; wait for in-flight to finish
        return results;
    }

    // â”€â”€ AtomicInteger counter demo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Shows why AtomicInteger is needed when multiple threads share a counter.
     * A plain 'int' would produce incorrect totals due to race conditions.
     */
    static void counterDemo() throws InterruptedException {
        AtomicInteger atomicCount = new AtomicInteger(0);
        int[] unsafeCount = {0};   // plain int â€” NOT thread-safe

        // Create 10 threads, each incrementing both counters 1000 times
        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            threads.add(new Thread(() -> {
                for (int j = 0; j < 1_000; j++) {
                    atomicCount.incrementAndGet();  // atomic: read-modify-write as one unit
                    unsafeCount[0]++;               // NOT atomic: race condition likely
                }
            }));
        }
        threads.forEach(Thread::start);
        for (Thread t : threads) t.join();  // wait for every thread to finish

        System.out.printf("Expected count    : 10,000%n");
        System.out.printf("AtomicInteger     : %,d (always correct)%n", atomicCount.get());
        System.out.printf("unsafe int array  : %,d (may be wrong due to race condition)%n",
            unsafeCount[0]);
    }

    // â”€â”€ CompletableFuture demo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static void completableFutureDemo() throws Exception {
        System.out.println("\n--- CompletableFuture pipeline ---");

        // thenApply transforms the result when it arrives (like stream.map)
        CompletableFuture<String> pipeline = CompletableFuture
            .supplyAsync(() -> {
                // Runs in common fork-join pool
                return "raw-data";
            })
            .thenApply(data -> data.toUpperCase())
            .thenApply(data -> "Processed: " + data);

        System.out.println(pipeline.get());  // blocks until done
    }

    // â”€â”€ Entry point â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public static void main(String[] args) throws Exception {
        System.out.println("=== Lesson 2.5: Concurrency Fundamentals ===\n");

        List<Task> tasks = List.of(
            new Task(1, "Fetch user profile",      200),
            new Task(2, "Load order history",      350),
            new Task(3, "Compute recommendations", 500),
            new Task(4, "Log analytics event",     100),
            new Task(5, "Send notification email", 300)
        );

        int parallelism = 3;
        System.out.printf("Processing %d tasks with %d threads...%n%n",
            tasks.size(), parallelism);

        long wallStart = System.currentTimeMillis();
        List<TaskResult> results = processAll(tasks, parallelism);
        long wallTime = System.currentTimeMillis() - wallStart;

        System.out.printf("%-30s  %6s  %s%n", "Task", "ms", "Status");
        System.out.println("-".repeat(50));
        results.forEach(r -> System.out.printf("%-30s  %6d  %s%n",
            r.name(), r.elapsedMs(), r.success() ? "âœ“" : "âœ—"));

        long serial   = tasks.stream().mapToLong(Task::durationMs).sum();
        System.out.printf("%nSerial time would be: %d ms%n", serial);
        System.out.printf("Actual wall time    : %d ms  (%.1fx speedup)%n",
            wallTime, (double) serial / wallTime);

        System.out.println("\n--- Atomic Counter Demo ---");
        counterDemo();

        completableFutureDemo();
    }
}
