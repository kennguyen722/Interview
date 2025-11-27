Module 01 — Q2: Designing an immutable class

Question
How do you design an immutable class in Java?

Answer (concise)
- Make the class `final` or use private constructors.
- Make fields `private final` and initialize in constructor.
- Defensively copy mutable inputs and return copies from accessors.
- Avoid setters and mutable static state.

Example
- `Module01Q2.java` demonstrates an immutable Point class.

How to compile & run
From repo root:

```powershell
javac java_tech_lead\topics\Module01Q2\Module01Q2.java
java -cp java_tech_lead\topics\Module01Q2 Module01Q2
```

Discussion
Immutable objects are thread-safe, easier to reason about, and make safe publication simpler.
