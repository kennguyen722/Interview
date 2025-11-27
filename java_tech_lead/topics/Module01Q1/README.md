Module 01 — Q1: == vs equals()

Question
What is the difference between `==` and `equals()` in Java?

Answer (concise)
- `==` compares reference identity for objects and value for primitives.
- `equals()` is a method allowing classes to implement logical equality (String, Integer, collections override it).
- When overriding `equals()` also override `hashCode()`.

Detailed explanation
Using `==` on two object references returns true only if they refer to the same object instance. Many classes override `equals()` to compare internal state (for example, `String` compares the sequence of characters). Boxed primitives may be cached for some ranges (e.g., Integer -128..127), which can produce surprising `==` behavior.

Example file
- `Module01Q1.java` (in this folder)

How to compile & run
From repo root (PowerShell):

```powershell
cd d:\GitHub_Src\Interview
javac java_tech_lead\topics\Module01Q1\Module01Q1.java
java -cp java_tech_lead\topics\Module01Q1 Module01Q1
```

What to look for
- Observe `a == b` vs `a.equals(b)` for Strings created with `new`.
- Observe `Integer` caching by changing the integer values and re-running.
