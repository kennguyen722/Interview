Module 3 — JVM & Memory

Q1: What is the difference between stack and heap memory?
Answer: Stack holds frame-local primitive values and references and is thread-local; heap stores objects shared by threads and is garbage-collected.

Example: `examples/Module03Q1.java` shows stack vs heap behavior via references.

Q2: How do you approach diagnosing a memory leak in Java?
Answer: Reproduce; take heap dump; analyze with tools (MAT, jmap/jhat, VisualVM); find GC roots and large retained sets; inspect caches and listeners for unintentional strong references.

Example: `examples/Module03Q2.java` demonstrates a simple leak pattern with a static list (toy example).

Q3: Explain GC generations and a simple tuning strategy.
Answer: Most GCs use young/old generation. Young gen collects frequently; survivor spaces copy survivors; promotion to old gen happens when survivorship or allocation thresholds hit. Tune by sizing heap, tuning new generation for short-lived objects, and choosing an appropriate collector (G1, Shenandoah, ZGC) for throughput vs latency.

Example: `examples/Module03Q3.java` creates short- and long-lived objects to illustrate promotion.
