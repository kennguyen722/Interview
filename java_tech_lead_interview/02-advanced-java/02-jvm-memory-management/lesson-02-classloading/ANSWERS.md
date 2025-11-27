## Q1 Answer
Use LongAdder / striped locks for high write concurrency to reduce contention.
## Q2 Answer
Check active threads & queue depth; inspect rejection policy and task duration.
## Q3 Answer
Primitive arrays avoid boxing overhead & GC pressure in tight loops.
## Q4 Answer
synchronized on shared object inflates contention; use ReentrantLock or finer-grained locking.
## Q5 Answer
Deoptimization triggered by uncommon traps, type instability, or speculation failure.
## Q6 Answer
Reduce allocation rate & resize young gen; tune eden size or use G1 region parameters.
## Q7 Answer
volatile does not make compound operations atomic; race still possible—use atomic classes or locks.
## Q8 Answer
Inline hot method or remove unnecessary abstraction after profiler confirmation.

