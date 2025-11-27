Module 2 — Concurrency & Threading

Q1: How do you prevent deadlocks?
Answer: Avoid circular lock ordering, prefer a single global order for acquiring multiple locks, use tryLock with timeout, prefer lock-free algorithms or higher-level concurrency utilities from `java.util.concurrent`.

Example: `examples/Module02Q1.java` shows ordering vs deadlock.

Q2: Explain `ExecutorService` and thread pools.
Answer: `ExecutorService` decouples task submission from execution. Use fixed, cached, or scheduled pools depending on workload. Shutdown with `shutdown()` and await termination; handle rejected execution.

Example: `examples/Module02Q2.java` shows a simple fixed thread pool.

Q3: How to safely publish mutable objects to other threads?
Answer: Use immutability, volatile references, final fields, synchronized blocks, or concurrent data structures. Prefer immutability and well-defined publishing patterns.

Example: `examples/Module02Q3.java` demonstrates safe publication.
