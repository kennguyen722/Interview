Module 03 — Q1: Stack vs Heap

Question
What is the difference between stack and heap memory?

Answer
The stack stores method frames, local primitives, and references and is thread-local. The heap stores object instances and is shared and garbage-collected.

Example
`Module03Q1.java` demonstrates an object on the heap and a stack-local primitive.

Compile & run
```powershell
javac java_tech_lead\topics\Module03Q1\Module03Q1.java
java -cp java_tech_lead\topics\Module03Q1 Module03Q1
```
