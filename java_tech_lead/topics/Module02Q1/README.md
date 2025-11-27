Module 02 — Q1: Preventing deadlocks

Question
How do you prevent deadlocks?

Answer (concise)
- Avoid circular lock ordering and establish a global lock order when multiple locks are needed.
- Use `tryLock` with timeout, prefer higher-level concurrency utilities, or design lock-free algorithms.

Example
- `Module02Q1.java` demonstrates acquiring locks in the same global order to avoid deadlock.

How to compile & run
From repo root:

```powershell
javac java_tech_lead\topics\Module02Q1\Module02Q1.java
java -cp java_tech_lead\topics\Module02Q1 Module02Q1
```
