/**
 * Advanced Concurrency Programming - Thread Safety and Synchronization
 * 
 * Key Points:
 * - Thread safety through proper synchronization mechanisms
 * - Atomic operations and lock-free programming
 * - Concurrent collections and their usage patterns
 * - Performance implications of different synchronization approaches
 */

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.concurrent.locks.*;

// Thread-safe counter implementations comparison
class UnsafeCounter {
    private int count = 0;
    
    public void increment() {
        count++; // Not thread-safe!
    }
    
    public int getCount() {
        return count;
    }
}

class SynchronizedCounter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
}

class AtomicCounter {
    private final AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet();
    }
    
    public int getCount() {
        return count.get();
    }
}

class ReentrantLockCounter {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock();
    
    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }
    
    public int getCount() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }
}

// Bank account with thread-safe operations
class BankAccount {
    private final AtomicLong balance;
    private final String accountNumber;
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    
    public BankAccount(String accountNumber, long initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = new AtomicLong(initialBalance);
    }
    
    public boolean withdraw(long amount) {
        while (true) {
            long currentBalance = balance.get();
            if (currentBalance < amount) {
                return false; // Insufficient funds
            }
            if (balance.compareAndSet(currentBalance, currentBalance - amount)) {
                return true;
            }
            // Retry if CAS failed due to concurrent modification
        }
    }
    
    public void deposit(long amount) {
        balance.addAndGet(amount);
    }
    
    public long getBalance() {
        return balance.get();
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
    
    // Transfer with deadlock prevention (ordered locking)
    public static boolean transfer(BankAccount from, BankAccount to, long amount) {
        // Order accounts by hash code to prevent deadlock
        BankAccount firstLock = from.hashCode() < to.hashCode() ? from : to;
        BankAccount secondLock = from.hashCode() < to.hashCode() ? to : from;
        
        firstLock.lock.writeLock().lock();
        try {
            secondLock.lock.writeLock().lock();
            try {
                if (from.withdraw(amount)) {
                    to.deposit(amount);
                    return true;
                }
                return false;
            } finally {
                secondLock.lock.writeLock().unlock();
            }
        } finally {
            firstLock.lock.writeLock().unlock();
        }
    }
}

// Thread pool monitoring and management
class ThreadPoolMonitor {
    private final ThreadPoolExecutor executor;
    private final ScheduledExecutorService monitor;
    
    public ThreadPoolMonitor(int corePoolSize, int maximumPoolSize, 
                           long keepAliveTime, TimeUnit unit,
                           BlockingQueue<Runnable> workQueue) {
        this.executor = new ThreadPoolExecutor(corePoolSize, maximumPoolSize, 
                                             keepAliveTime, unit, workQueue);
        this.monitor = Executors.newScheduledThreadPool(1);
        startMonitoring();
    }
    
    private void startMonitoring() {
        monitor.scheduleAtFixedRate(() -> {
            System.out.printf("[MONITOR] Active: %d, Pool: %d, Queue: %d, Completed: %d%n",
                executor.getActiveCount(),
                executor.getPoolSize(), 
                executor.getQueue().size(),
                executor.getCompletedTaskCount());
        }, 0, 1, TimeUnit.SECONDS);
    }
    
    public Future<?> submit(Runnable task) {
        return executor.submit(task);
    }
    
    public void shutdown() {
        executor.shutdown();
        monitor.shutdown();
    }
}

public class Example_ConcurrentProgramming {
    private static final int NUM_THREADS = 10;
    private static final int ITERATIONS_PER_THREAD = 1000;
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Advanced Concurrency Programming ===\n");
        
        // 1. THREAD SAFETY COMPARISON
        System.out.println("1. Thread Safety Comparison:");
        compareCounterImplementations();
        
        // 2. CONCURRENT COLLECTIONS
        System.out.println("\n2. Concurrent Collections:");
        demonstrateConcurrentCollections();
        
        // 3. BANK ACCOUNT SIMULATION
        System.out.println("\n3. Bank Account Thread Safety:");
        bankAccountSimulation();
        
        // 4. THREAD POOL MANAGEMENT
        System.out.println("\n4. Thread Pool Management:");
        threadPoolDemo();
        
        // 5. ADVANCED SYNCHRONIZATION
        System.out.println("\n5. Advanced Synchronization:");
        advancedSynchronizationDemo();
        
        // 6. PERFORMANCE ANALYSIS
        System.out.println("\n6. Performance Analysis:");
        performanceAnalysis();
    }
    
    private static void compareCounterImplementations() throws InterruptedException {
        System.out.println("--- Counter Implementation Comparison ---");
        
        // Test unsafe counter
        UnsafeCounter unsafeCounter = new UnsafeCounter();
        runCounterTest("Unsafe Counter", 
            () -> unsafeCounter.increment(), 
            unsafeCounter::getCount);
        
        // Test synchronized counter
        SynchronizedCounter syncCounter = new SynchronizedCounter();
        runCounterTest("Synchronized Counter", 
            syncCounter::increment, 
            syncCounter::getCount);
        
        // Test atomic counter
        AtomicCounter atomicCounter = new AtomicCounter();
        runCounterTest("Atomic Counter", 
            atomicCounter::increment, 
            atomicCounter::getCount);
        
        // Test ReentrantLock counter
        ReentrantLockCounter lockCounter = new ReentrantLockCounter();
        runCounterTest("ReentrantLock Counter", 
            lockCounter::increment, 
            lockCounter::getCount);
    }
    
    private static void runCounterTest(String name, Runnable incrementTask, 
                                     Supplier<Integer> getCount) throws InterruptedException {
        long startTime = System.nanoTime();
        
        Thread[] threads = new Thread[NUM_THREADS];
        for (int i = 0; i < NUM_THREADS; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < ITERATIONS_PER_THREAD; j++) {
                    incrementTask.run();
                }
            });
        }
        
        // Start all threads
        for (Thread thread : threads) {
            thread.start();
        }
        
        // Wait for completion
        for (Thread thread : threads) {
            thread.join();
        }
        
        long duration = System.nanoTime() - startTime;
        int expectedCount = NUM_THREADS * ITERATIONS_PER_THREAD;
        int actualCount = getCount.get();
        
        System.out.printf("%s: Expected=%d, Actual=%d, Correct=%b, Time=%.2fms%n",
            name, expectedCount, actualCount, expectedCount == actualCount, 
            duration / 1_000_000.0);
    }
    
    private static void demonstrateConcurrentCollections() throws InterruptedException {
        System.out.println("--- Concurrent Collections Demo ---");
        
        // ConcurrentHashMap
        ConcurrentHashMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
        CountDownLatch latch = new CountDownLatch(NUM_THREADS);
        
        for (int i = 0; i < NUM_THREADS; i++) {
            final int threadId = i;
            new Thread(() -> {
                try {
                    for (int j = 0; j < 100; j++) {
                        String key = "key" + (j % 10);
                        concurrentMap.compute(key, (k, v) -> (v == null ? 0 : v) + 1);
                    }
                } finally {
                    latch.countDown();
                }
            }).start();
        }
        
        latch.await();
        System.out.println("ConcurrentHashMap size: " + concurrentMap.size());
        System.out.println("Sample entries: " + concurrentMap.entrySet().stream()
            .limit(3).map(e -> e.getKey() + "=" + e.getValue()).toList());
        
        // BlockingQueue
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(50);
        
        // Producer
        Thread producer = new Thread(() -> {
            try {
                for (int i = 0; i < 20; i++) {
                    queue.put("Item " + i);
                    Thread.sleep(10);
                }
                queue.put("END"); // Signal end
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        // Consumer
        Thread consumer = new Thread(() -> {
            try {
                String item;
                while (!(item = queue.take()).equals("END")) {
                    System.out.println("Consumed: " + item);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
    }
    
    private static void bankAccountSimulation() throws InterruptedException {
        System.out.println("--- Bank Account Thread Safety ---");
        
        BankAccount account1 = new BankAccount("ACC001", 10000);
        BankAccount account2 = new BankAccount("ACC002", 5000);
        
        System.out.printf("Initial balances: %s=$%d, %s=$%d%n",
            account1.getAccountNumber(), account1.getBalance(),
            account2.getAccountNumber(), account2.getBalance());
        
        // Simulate concurrent transactions
        ExecutorService executor = Executors.newFixedThreadPool(20);
        CountDownLatch transactionLatch = new CountDownLatch(100);
        
        for (int i = 0; i < 50; i++) {
            // Transfer from account1 to account2
            executor.submit(() -> {
                try {
                    boolean success = BankAccount.transfer(account1, account2, 10);
                    if (success) {
                        System.out.println("Transfer ACC001->ACC002: $10");
                    }
                } finally {
                    transactionLatch.countDown();
                }
            });
            
            // Transfer from account2 to account1
            executor.submit(() -> {
                try {
                    boolean success = BankAccount.transfer(account2, account1, 5);
                    if (success) {
                        System.out.println("Transfer ACC002->ACC001: $5");
                    }
                } finally {
                    transactionLatch.countDown();
                }
            });
        }
        
        transactionLatch.await();
        executor.shutdown();
        
        long totalBalance = account1.getBalance() + account2.getBalance();
        System.out.printf("Final balances: %s=$%d, %s=$%d, Total=$%d%n",
            account1.getAccountNumber(), account1.getBalance(),
            account2.getAccountNumber(), account2.getBalance(), totalBalance);
        System.out.println("Balance preservation: " + (totalBalance == 15000 ? "✓" : "✗"));
    }
    
    private static void threadPoolDemo() throws InterruptedException {
        System.out.println("--- Thread Pool Management ---");
        
        ThreadPoolMonitor monitor = new ThreadPoolMonitor(
            2, 5, 60L, TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(10)
        );
        
        // Submit various tasks
        List<Future<?>> futures = new ArrayList<>();
        
        for (int i = 0; i < 15; i++) {
            final int taskId = i;
            Future<?> future = monitor.submit(() -> {
                try {
                    System.out.println("Executing task " + taskId);
                    Thread.sleep(2000 + (int)(Math.random() * 1000));
                    System.out.println("Completed task " + taskId);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.out.println("Task " + taskId + " interrupted");
                }
            });
            futures.add(future);
        }
        
        // Wait for some tasks to complete
        Thread.sleep(8000);
        
        System.out.println("Cancelling remaining tasks...");
        futures.stream().filter(f -> !f.isDone()).forEach(f -> f.cancel(true));
        
        monitor.shutdown();
    }
    
    private static void advancedSynchronizationDemo() throws InterruptedException {
        System.out.println("--- Advanced Synchronization Patterns ---");
        
        // Semaphore for resource limiting
        Semaphore resourcePool = new Semaphore(3, true); // Fair semaphore
        
        ExecutorService executor = Executors.newFixedThreadPool(10);
        CountDownLatch semaphoreLatch = new CountDownLatch(10);
        
        for (int i = 0; i < 10; i++) {
            final int workerId = i;
            executor.submit(() -> {
                try {
                    System.out.println("Worker " + workerId + " waiting for resource");
                    resourcePool.acquire();
                    System.out.println("Worker " + workerId + " acquired resource");
                    
                    Thread.sleep(1000); // Use resource
                    
                    System.out.println("Worker " + workerId + " releasing resource");
                    resourcePool.release();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    semaphoreLatch.countDown();
                }
            });
        }
        
        semaphoreLatch.await();
        executor.shutdown();
        
        // CyclicBarrier for coordinated execution
        System.out.println("\n--- CyclicBarrier Demo ---");
        CyclicBarrier barrier = new CyclicBarrier(3, () -> 
            System.out.println("All threads reached barrier!"));
        
        for (int i = 0; i < 3; i++) {
            final int threadId = i;
            new Thread(() -> {
                try {
                    System.out.println("Thread " + threadId + " working...");
                    Thread.sleep(1000 + threadId * 500);
                    System.out.println("Thread " + threadId + " reached barrier");
                    barrier.await();
                    System.out.println("Thread " + threadId + " continuing after barrier");
                } catch (InterruptedException | BrokenBarrierException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
        
        Thread.sleep(4000); // Wait for barrier demo to complete
    }
    
    private static void performanceAnalysis() throws InterruptedException {
        System.out.println("--- Performance Analysis ---");
        
        int iterations = 1_000_000;
        
        // Compare synchronization mechanisms
        System.out.println("Performance comparison (lower is better):");
        
        // Atomic operations
        AtomicInteger atomicInt = new AtomicInteger(0);
        long start = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            atomicInt.incrementAndGet();
        }
        long atomicTime = System.nanoTime() - start;
        
        // Synchronized increment
        Object lock = new Object();
        int[] syncInt = {0};
        start = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            synchronized(lock) {
                syncInt[0]++;
            }
        }
        long syncTime = System.nanoTime() - start;
        
        // Volatile (not thread-safe for increment, but shows cost)
        volatile int[] volatileInt = {0};
        start = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            volatileInt[0]++; // Not thread-safe!
        }
        long volatileTime = System.nanoTime() - start;
        
        System.out.printf("Atomic operations: %.2f ms%n", atomicTime / 1_000_000.0);
        System.out.printf("Synchronized: %.2f ms (%.1fx slower)%n", 
            syncTime / 1_000_000.0, (double)syncTime / atomicTime);
        System.out.printf("Volatile: %.2f ms (%.1fx faster, but unsafe!)%n", 
            volatileTime / 1_000_000.0, (double)atomicTime / volatileTime);
        
        System.out.println("\nKey takeaways:");
        System.out.println("- Atomic operations are faster than synchronized blocks");
        System.out.println("- Synchronized blocks ensure thread safety with some overhead");
        System.out.println("- Volatile provides visibility but not atomicity");
        System.out.println("- Choose synchronization mechanism based on requirements");
    }
}