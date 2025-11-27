Module 6 — Performance & Profiling

Q1: How do you find and fix a JVM CPU hotspot?
Answer: Reproduce high CPU, use profilers (async-profiler, JFR, VisualVM), inspect flame graphs, pinpoint hot methods and optimize algorithmic complexity, reduce locking, or cache results.

Example: `examples/Module06Q1.java` simulates a hot loop and shows a possible optimization.

Q2: What are trade-offs between latency and throughput?
Answer: Increasing batch sizes or async processing can increase throughput but also add latency. Choose batching, parallelism, and buffer sizing based on SLOs.

Example: `examples/Module06Q2.java` compares naive vs batched processing.

Q3: How to measure performance safely in Java?
Answer: Use microbenchmark harness (JMH) for small code; for system-level tests, simulate realistic loads, measure p95/p99 latencies, and avoid warm-up bias.

Example: `examples/Module06Q3.java` is a simple warm-up demonstration (not a JMH replacement).
