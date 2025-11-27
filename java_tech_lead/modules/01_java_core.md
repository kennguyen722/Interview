Module 1 — Java Core

Q1: What's the difference between `==` and `equals()` in Java?
Answer: `==` compares reference identity for objects (and value for primitives). `equals()` is a method that by default (in `Object`) does the same as `==`, but many classes (String, boxed primitives, collections) override it to compare logical equality. When overriding `equals()`, also override `hashCode()`.

Example: `examples/Module01Q1.java` demonstrates `==` vs `equals()`.

Q2: How do you design an immutable class in Java?
Answer: Make the class `final` (or use private constructors), make fields `private final`, initialize all fields in constructor, defensively copy mutable inputs and return copies for accessors. Avoid setters.

Example: `examples/Module01Q2.java` shows an immutable Point class.

Q3: Explain the Java memory model basics, `volatile`, and `final` semantics.
Answer: The Java Memory Model defines visibility and ordering. `volatile` ensures reads/writes go to main memory and provides a happens-before relationship for single variable accesses — it prevents reordering around the volatile access. `final` fields have special semantics guaranteeing that once constructor finishes, other threads see the properly constructed value (if the object reference is properly published).

Example: `examples/Module01Q3.java` shows `volatile` usage and atomic publication.
