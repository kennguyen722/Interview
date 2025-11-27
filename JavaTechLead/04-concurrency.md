# Module 4: Concurrency and Multithreading

## Table of Contents
1. [Thread Basics](#thread-basics)
2. [Synchronization](#synchronization)
3. [Concurrent Collections](#concurrent-collections)
4. [Executors and Thread Pools](#executors-and-thread-pools)
5. [CompletableFuture](#completablefuture)

---

## Thread Basics

### Question 1: What are the different ways to create threads in Java?

**Answer:**
Three main ways:
1. Extending Thread class
2. Implementing Runnable interface
3. Implementing Callable interface (with return value)

**Detailed Code Example:**

```java
import java.util.concurrent.*;

public class ThreadCreationDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. Extending Thread
        System.out.println("=== Extending Thread ===");
        MyThread thread1 = new MyThread("Thread-1");
        thread1.start();
        
        // 2. Implementing Runnable
        System.out.println("\n=== Implementing Runnable ===");
        Thread thread2 = new Thread(new MyRunnable(), "Thread-2");
        thread2.start();
        
        // 3. Lambda Runnable
        System.out.println("\n=== Lambda Runnable ===");
        Thread thread3 = new Thread(() -> {
            System.out.println("Lambda running in: " + Thread.currentThread().getName());
        }, "Thread-3");
        thread3.start();
        
        // 4. Callable with Future
        System.out.println("\n=== Callable with Future ===");
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<Integer> future = executor.submit(new MyCallable());
        System.out.println("Callable result: " + future.get());
        executor.shutdown();
        
        // Wait for all threads
        thread1.join();
        thread2.join();
        thread3.join();
        
        // 5. Thread States
        System.out.println("\n=== Thread States ===");
        demonstrateThreadStates();
    }
    
    static void demonstrateThreadStates() throws InterruptedException {
        Thread stateThread = new Thread(() -> {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        System.out.println("State after creation: " + stateThread.getState());
        stateThread.start();
        System.out.println("State after start: " + stateThread.getState());
        Thread.sleep(50);
        System.out.println("State during sleep: " + stateThread.getState());
        stateThread.join();
        System.out.println("State after completion: " + stateThread.getState());
    }
}

class MyThread extends Thread {
    public MyThread(String name) {
        super(name);
    }
    
    @Override
    public void run() {
        System.out.println("MyThread running in: " + getName());
    }
}

class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("MyRunnable running in: " + Thread.currentThread().getName());
    }
}

class MyCallable implements Callable<Integer> {
    @Override
    public Integer call() {
        System.out.println("Callable running in: " + Thread.currentThread().getName());
        return 42;
    }
}
```

### Question 2: Explain the difference between wait(), notify(), and notifyAll().

**Answer:**
- **wait()**: Releases lock and waits until notified
- **notify()**: Wakes up one waiting thread
- **notifyAll()**: Wakes up all waiting threads

All must be called within synchronized block.

**Detailed Code Example:**

```java
import java.util.*;

public class WaitNotifyDemo {
    
    public static void main(String[] args) throws InterruptedException {
        // Producer-Consumer using wait/notify
        System.out.println("=== Producer-Consumer ===");
        
        BlockingBuffer<Integer> buffer = new BlockingBuffer<>(5);
        
        Thread producer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    buffer.put(i);
                    System.out.println("Produced: " + i);
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "Producer");
        
        Thread consumer = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    int item = buffer.take();
                    System.out.println("Consumed: " + item);
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "Consumer");
        
        producer.start();
        consumer.start();
        
        producer.join();
        consumer.join();
    }
}

class BlockingBuffer<T> {
    private final Queue<T> queue = new LinkedList<>();
    private final int capacity;
    
    public BlockingBuffer(int capacity) {
        this.capacity = capacity;
    }
    
    public synchronized void put(T item) throws InterruptedException {
        while (queue.size() == capacity) {
            wait(); // Buffer full, wait
        }
        queue.add(item);
        notifyAll(); // Notify consumers
    }
    
    public synchronized T take() throws InterruptedException {
        while (queue.isEmpty()) {
            wait(); // Buffer empty, wait
        }
        T item = queue.poll();
        notifyAll(); // Notify producers
        return item;
    }
}
```

---

## Synchronization

### Question 3: What are the different synchronization mechanisms in Java?

**Answer:**
1. **synchronized keyword**: Method or block level
2. **ReentrantLock**: More flexible than synchronized
3. **ReadWriteLock**: Separate read/write locks
4. **Semaphore**: Limit concurrent access
5. **CountDownLatch**: Wait for multiple operations
6. **CyclicBarrier**: Synchronize multiple threads

**Detailed Code Example:**

```java
import java.util.concurrent.*;
import java.util.concurrent.locks.*;

public class SynchronizationDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. synchronized keyword
        System.out.println("=== synchronized ===");
        SynchronizedCounter syncCounter = new SynchronizedCounter();
        runCounterTest(syncCounter::increment, syncCounter::getCount);
        
        // 2. ReentrantLock
        System.out.println("\n=== ReentrantLock ===");
        LockCounter lockCounter = new LockCounter();
        runCounterTest(lockCounter::increment, lockCounter::getCount);
        
        // 3. ReadWriteLock
        System.out.println("\n=== ReadWriteLock ===");
        ReadWriteCache<String, Integer> cache = new ReadWriteCache<>();
        
        Thread writer = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                cache.put("key" + i, i);
                System.out.println("Written: key" + i + "=" + i);
            }
        });
        
        Thread reader = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                Integer value = cache.get("key" + i);
                System.out.println("Read: key" + i + "=" + value);
            }
        });
        
        writer.start();
        reader.start();
        writer.join();
        reader.join();
        
        // 4. Semaphore
        System.out.println("\n=== Semaphore ===");
        ConnectionPool pool = new ConnectionPool(3);
        
        for (int i = 1; i <= 5; i++) {
            final int id = i;
            new Thread(() -> {
                try {
                    pool.getConnection(id);
                    Thread.sleep(1000);
                    pool.releaseConnection(id);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
        Thread.sleep(3000);
        
        // 5. CountDownLatch
        System.out.println("\n=== CountDownLatch ===");
        int numWorkers = 3;
        CountDownLatch latch = new CountDownLatch(numWorkers);
        
        for (int i = 1; i <= numWorkers; i++) {
            final int workerId = i;
            new Thread(() -> {
                System.out.println("Worker " + workerId + " starting");
                try { Thread.sleep(1000); } catch (InterruptedException e) {}
                System.out.println("Worker " + workerId + " done");
                latch.countDown();
            }).start();
        }
        
        latch.await();
        System.out.println("All workers completed!");
        
        // 6. CyclicBarrier
        System.out.println("\n=== CyclicBarrier ===");
        int parties = 3;
        CyclicBarrier barrier = new CyclicBarrier(parties, () -> {
            System.out.println("All threads reached barrier!");
        });
        
        for (int i = 1; i <= parties; i++) {
            final int id = i;
            new Thread(() -> {
                try {
                    System.out.println("Thread " + id + " approaching barrier");
                    Thread.sleep(id * 500);
                    barrier.await();
                    System.out.println("Thread " + id + " passed barrier");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }
        
        Thread.sleep(3000);
    }
    
    static void runCounterTest(Runnable increment, java.util.function.Supplier<Integer> getCount) 
            throws InterruptedException {
        int numThreads = 10;
        int incrementsPerThread = 1000;
        Thread[] threads = new Thread[numThreads];
        
        for (int i = 0; i < numThreads; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < incrementsPerThread; j++) {
                    increment.run();
                }
            });
            threads[i].start();
        }
        
        for (Thread t : threads) {
            t.join();
        }
        
        System.out.println("Expected: " + (numThreads * incrementsPerThread));
        System.out.println("Actual: " + getCount.get());
    }
}

// synchronized counter
class SynchronizedCounter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
}

// ReentrantLock counter
class LockCounter {
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

// ReadWriteLock cache
class ReadWriteCache<K, V> {
    private final java.util.Map<K, V> cache = new java.util.HashMap<>();
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    
    public V get(K key) {
        lock.readLock().lock();
        try {
            return cache.get(key);
        } finally {
            lock.readLock().unlock();
        }
    }
    
    public void put(K key, V value) {
        lock.writeLock().lock();
        try {
            cache.put(key, value);
        } finally {
            lock.writeLock().unlock();
        }
    }
}

// Semaphore connection pool
class ConnectionPool {
    private final Semaphore semaphore;
    
    public ConnectionPool(int maxConnections) {
        this.semaphore = new Semaphore(maxConnections);
    }
    
    public void getConnection(int clientId) throws InterruptedException {
        System.out.println("Client " + clientId + " requesting connection...");
        semaphore.acquire();
        System.out.println("Client " + clientId + " got connection!");
    }
    
    public void releaseConnection(int clientId) {
        System.out.println("Client " + clientId + " releasing connection");
        semaphore.release();
    }
}
```

### Question 4: What is a deadlock and how do you prevent it?

**Answer:**
Deadlock occurs when threads wait indefinitely for locks held by each other.

Prevention strategies:
1. **Lock ordering**: Always acquire locks in same order
2. **Lock timeout**: Use tryLock with timeout
3. **Deadlock detection**: Monitor and break cycles
4. **Avoid nested locks**: Minimize lock scope

**Detailed Code Example:**

```java
import java.util.concurrent.*;
import java.util.concurrent.locks.*;

public class DeadlockDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. Deadlock Example (commented - would hang)
        System.out.println("=== Deadlock Prevention ===");
        // demonstrateDeadlock();
        
        // 2. Prevention with Lock Ordering
        System.out.println("Lock ordering prevents deadlock");
        BankAccountSafe account1 = new BankAccountSafe(1, 1000);
        BankAccountSafe account2 = new BankAccountSafe(2, 1000);
        
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                BankAccountSafe.transfer(account1, account2, 10);
            }
        });
        
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                BankAccountSafe.transfer(account2, account1, 10);
            }
        });
        
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        
        System.out.println("Account 1: " + account1.getBalance());
        System.out.println("Account 2: " + account2.getBalance());
        
        // 3. Prevention with tryLock
        System.out.println("\n=== tryLock Prevention ===");
        demonstrateTryLock();
    }
    
    // This would cause deadlock - DO NOT RUN
    static void demonstrateDeadlock() {
        Object lock1 = new Object();
        Object lock2 = new Object();
        
        Thread t1 = new Thread(() -> {
            synchronized (lock1) {
                System.out.println("T1: Holding lock1");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lock2) {
                    System.out.println("T1: Holding lock1 & lock2");
                }
            }
        });
        
        Thread t2 = new Thread(() -> {
            synchronized (lock2) { // Opposite order - deadlock!
                System.out.println("T2: Holding lock2");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lock1) {
                    System.out.println("T2: Holding lock2 & lock1");
                }
            }
        });
        
        t1.start();
        t2.start();
    }
    
    static void demonstrateTryLock() throws InterruptedException {
        ReentrantLock lock1 = new ReentrantLock();
        ReentrantLock lock2 = new ReentrantLock();
        
        Thread t1 = new Thread(() -> {
            while (true) {
                if (lock1.tryLock()) {
                    try {
                        if (lock2.tryLock()) {
                            try {
                                System.out.println("T1: Got both locks");
                                return;
                            } finally {
                                lock2.unlock();
                            }
                        }
                    } finally {
                        lock1.unlock();
                    }
                }
                try { Thread.sleep(1); } catch (InterruptedException e) { return; }
            }
        });
        
        Thread t2 = new Thread(() -> {
            while (true) {
                if (lock2.tryLock()) {
                    try {
                        if (lock1.tryLock()) {
                            try {
                                System.out.println("T2: Got both locks");
                                return;
                            } finally {
                                lock1.unlock();
                            }
                        }
                    } finally {
                        lock2.unlock();
                    }
                }
                try { Thread.sleep(1); } catch (InterruptedException e) { return; }
            }
        });
        
        t1.start();
        t2.start();
        t1.join(1000);
        t2.join(1000);
    }
}

// Safe bank transfer with lock ordering
class BankAccountSafe {
    private final int id;
    private double balance;
    private final Object lock = new Object();
    
    public BankAccountSafe(int id, double balance) {
        this.id = id;
        this.balance = balance;
    }
    
    public int getId() { return id; }
    public double getBalance() { return balance; }
    
    public static void transfer(BankAccountSafe from, BankAccountSafe to, double amount) {
        // Lock ordering by ID to prevent deadlock
        BankAccountSafe first = from.id < to.id ? from : to;
        BankAccountSafe second = from.id < to.id ? to : from;
        
        synchronized (first.lock) {
            synchronized (second.lock) {
                if (from.balance >= amount) {
                    from.balance -= amount;
                    to.balance += amount;
                }
            }
        }
    }
}
```

---

## Concurrent Collections

### Question 5: Explain the concurrent collections in Java.

**Answer:**
Key concurrent collections:
1. **ConcurrentHashMap**: Thread-safe HashMap
2. **CopyOnWriteArrayList**: Thread-safe for reads
3. **BlockingQueue**: Producer-consumer support
4. **ConcurrentLinkedQueue**: Non-blocking queue

**Detailed Code Example:**

```java
import java.util.*;
import java.util.concurrent.*;

public class ConcurrentCollectionsDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. ConcurrentHashMap
        System.out.println("=== ConcurrentHashMap ===");
        ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
        
        // Atomic operations
        map.put("counter", 0);
        map.compute("counter", (k, v) -> v + 1);
        map.computeIfAbsent("new", k -> 42);
        map.merge("counter", 1, Integer::sum);
        
        System.out.println("counter: " + map.get("counter"));
        System.out.println("new: " + map.get("new"));
        
        // 2. CopyOnWriteArrayList
        System.out.println("\n=== CopyOnWriteArrayList ===");
        CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        
        // Safe iteration during modification
        for (String item : list) {
            System.out.println("Item: " + item);
            if (item.equals("B")) {
                list.add("D"); // Safe - creates new copy
            }
        }
        System.out.println("Final list: " + list);
        
        // 3. BlockingQueue - Producer/Consumer
        System.out.println("\n=== BlockingQueue ===");
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(5);
        
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    queue.put("Item-" + i);
                    System.out.println("Produced: Item-" + i);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 5; i++) {
                    String item = queue.take();
                    System.out.println("Consumed: " + item);
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
        
        // 4. ConcurrentLinkedQueue
        System.out.println("\n=== ConcurrentLinkedQueue ===");
        ConcurrentLinkedQueue<Integer> clq = new ConcurrentLinkedQueue<>();
        
        // Multiple threads adding
        Thread[] threads = new Thread[3];
        for (int i = 0; i < 3; i++) {
            final int threadId = i;
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 5; j++) {
                    clq.offer(threadId * 10 + j);
                }
            });
            threads[i].start();
        }
        
        for (Thread t : threads) t.join();
        System.out.println("Queue size: " + clq.size());
        
        // 5. ConcurrentSkipListMap (sorted)
        System.out.println("\n=== ConcurrentSkipListMap ===");
        ConcurrentSkipListMap<Integer, String> skipMap = new ConcurrentSkipListMap<>();
        skipMap.put(3, "Three");
        skipMap.put(1, "One");
        skipMap.put(2, "Two");
        
        System.out.println("First: " + skipMap.firstEntry());
        System.out.println("Last: " + skipMap.lastEntry());
        System.out.println("Sorted: " + skipMap);
    }
}
```

---

## Executors and Thread Pools

### Question 6: Explain the different types of thread pools.

**Answer:**
1. **FixedThreadPool**: Fixed number of threads
2. **CachedThreadPool**: Grows as needed
3. **SingleThreadExecutor**: Single worker thread
4. **ScheduledThreadPool**: For scheduled tasks
5. **WorkStealingPool**: Fork-join based

**Detailed Code Example:**

```java
import java.util.concurrent.*;
import java.util.*;

public class ThreadPoolDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. FixedThreadPool
        System.out.println("=== FixedThreadPool ===");
        ExecutorService fixed = Executors.newFixedThreadPool(3);
        
        for (int i = 1; i <= 6; i++) {
            final int taskId = i;
            fixed.submit(() -> {
                System.out.println("Task " + taskId + " on " + Thread.currentThread().getName());
                try { Thread.sleep(500); } catch (InterruptedException e) {}
            });
        }
        
        fixed.shutdown();
        fixed.awaitTermination(5, TimeUnit.SECONDS);
        
        // 2. CachedThreadPool
        System.out.println("\n=== CachedThreadPool ===");
        ExecutorService cached = Executors.newCachedThreadPool();
        
        for (int i = 1; i <= 5; i++) {
            final int taskId = i;
            cached.submit(() -> {
                System.out.println("Task " + taskId + " on " + Thread.currentThread().getName());
            });
        }
        
        cached.shutdown();
        cached.awaitTermination(5, TimeUnit.SECONDS);
        
        // 3. ScheduledThreadPool
        System.out.println("\n=== ScheduledThreadPool ===");
        ScheduledExecutorService scheduled = Executors.newScheduledThreadPool(2);
        
        // One-time delay
        scheduled.schedule(() -> System.out.println("Delayed task"), 1, TimeUnit.SECONDS);
        
        // Fixed rate
        ScheduledFuture<?> periodic = scheduled.scheduleAtFixedRate(
            () -> System.out.println("Periodic: " + System.currentTimeMillis()),
            0, 500, TimeUnit.MILLISECONDS
        );
        
        Thread.sleep(2000);
        periodic.cancel(false);
        scheduled.shutdown();
        
        // 4. Custom ThreadPoolExecutor
        System.out.println("\n=== Custom ThreadPoolExecutor ===");
        ThreadPoolExecutor custom = new ThreadPoolExecutor(
            2,                      // Core pool size
            4,                      // Maximum pool size
            60L, TimeUnit.SECONDS,  // Keep alive time
            new LinkedBlockingQueue<>(10), // Work queue
            new CustomThreadFactory(),
            new ThreadPoolExecutor.CallerRunsPolicy() // Rejection policy
        );
        
        for (int i = 1; i <= 8; i++) {
            final int taskId = i;
            custom.submit(() -> {
                System.out.println("Custom task " + taskId + " on " + Thread.currentThread().getName());
                try { Thread.sleep(300); } catch (InterruptedException e) {}
            });
        }
        
        custom.shutdown();
        custom.awaitTermination(5, TimeUnit.SECONDS);
        
        // 5. WorkStealingPool
        System.out.println("\n=== WorkStealingPool ===");
        ExecutorService workStealing = Executors.newWorkStealingPool();
        
        List<Callable<Integer>> tasks = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            final int taskId = i;
            tasks.add(() -> {
                Thread.sleep(100);
                return taskId * taskId;
            });
        }
        
        List<Future<Integer>> results = workStealing.invokeAll(tasks);
        for (Future<Integer> result : results) {
            System.out.print(result.get() + " ");
        }
        System.out.println();
        
        workStealing.shutdown();
    }
}

class CustomThreadFactory implements ThreadFactory {
    private int counter = 0;
    
    @Override
    public Thread newThread(Runnable r) {
        Thread t = new Thread(r, "CustomThread-" + counter++);
        t.setDaemon(false);
        t.setPriority(Thread.NORM_PRIORITY);
        return t;
    }
}
```

---

## CompletableFuture

### Question 7: How do you use CompletableFuture for async programming?

**Answer:**
CompletableFuture provides:
1. Async operations
2. Chaining and composition
3. Exception handling
4. Combining multiple futures

**Detailed Code Example:**

```java
import java.util.concurrent.*;
import java.util.*;

public class CompletableFutureDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. Basic async
        System.out.println("=== Basic Async ===");
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            sleep(500);
            return "Hello";
        });
        
        System.out.println("Result: " + future.get());
        
        // 2. Chaining with thenApply
        System.out.println("\n=== Chaining ===");
        CompletableFuture<String> chained = CompletableFuture
            .supplyAsync(() -> "Hello")
            .thenApply(s -> s + " World")
            .thenApply(String::toUpperCase);
        
        System.out.println("Chained: " + chained.get());
        
        // 3. thenCompose (flatMap)
        System.out.println("\n=== thenCompose ===");
        CompletableFuture<String> composed = getUserId()
            .thenCompose(CompletableFutureDemo::getUserDetails);
        
        System.out.println("User: " + composed.get());
        
        // 4. thenCombine (zip)
        System.out.println("\n=== thenCombine ===");
        CompletableFuture<String> combined = getPrice()
            .thenCombine(getDiscount(), (price, discount) -> 
                "Final Price: " + (price - discount));
        
        System.out.println(combined.get());
        
        // 5. allOf
        System.out.println("\n=== allOf ===");
        CompletableFuture<String> f1 = CompletableFuture.supplyAsync(() -> {
            sleep(300);
            return "Result 1";
        });
        CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> {
            sleep(200);
            return "Result 2";
        });
        CompletableFuture<String> f3 = CompletableFuture.supplyAsync(() -> {
            sleep(100);
            return "Result 3";
        });
        
        CompletableFuture<Void> allOf = CompletableFuture.allOf(f1, f2, f3);
        allOf.get();
        System.out.println("All completed: " + f1.get() + ", " + f2.get() + ", " + f3.get());
        
        // 6. anyOf
        System.out.println("\n=== anyOf ===");
        CompletableFuture<Object> anyOf = CompletableFuture.anyOf(
            CompletableFuture.supplyAsync(() -> { sleep(300); return "Slow"; }),
            CompletableFuture.supplyAsync(() -> { sleep(100); return "Fast"; }),
            CompletableFuture.supplyAsync(() -> { sleep(200); return "Medium"; })
        );
        System.out.println("First completed: " + anyOf.get());
        
        // 7. Exception handling
        System.out.println("\n=== Exception Handling ===");
        CompletableFuture<String> withError = CompletableFuture
            .supplyAsync(() -> {
                if (true) throw new RuntimeException("Error!");
                return "Success";
            })
            .exceptionally(ex -> "Recovered from: " + ex.getMessage());
        
        System.out.println(withError.get());
        
        // 8. handle (both success and error)
        CompletableFuture<String> handled = CompletableFuture
            .supplyAsync(() -> {
                if (Math.random() > 0.5) throw new RuntimeException("Random error");
                return "Success";
            })
            .handle((result, ex) -> {
                if (ex != null) return "Handled error: " + ex.getMessage();
                return result;
            });
        
        System.out.println("Handled: " + handled.get());
        
        // 9. Timeout (Java 9+)
        System.out.println("\n=== Timeout ===");
        CompletableFuture<String> withTimeout = CompletableFuture
            .supplyAsync(() -> {
                sleep(2000);
                return "Slow result";
            })
            .completeOnTimeout("Timeout default", 500, TimeUnit.MILLISECONDS);
        
        System.out.println("With timeout: " + withTimeout.get());
    }
    
    static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) {}
    }
    
    static CompletableFuture<Integer> getUserId() {
        return CompletableFuture.supplyAsync(() -> {
            sleep(100);
            return 123;
        });
    }
    
    static CompletableFuture<String> getUserDetails(int userId) {
        return CompletableFuture.supplyAsync(() -> {
            sleep(100);
            return "User-" + userId + " Details";
        });
    }
    
    static CompletableFuture<Double> getPrice() {
        return CompletableFuture.supplyAsync(() -> {
            sleep(100);
            return 100.0;
        });
    }
    
    static CompletableFuture<Double> getDiscount() {
        return CompletableFuture.supplyAsync(() -> {
            sleep(150);
            return 10.0;
        });
    }
}
```

---

## Summary

Concurrency is essential for Java Tech Leads:

1. **Thread Basics**: Creation, states, lifecycle
2. **Synchronization**: Locks, barriers, latches
3. **Concurrent Collections**: Thread-safe data structures
4. **Thread Pools**: Efficient thread management
5. **CompletableFuture**: Modern async programming

Continue to [Module 5: Performance](05-performance.md) →
