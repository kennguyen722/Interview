Module 03 — Q3: GC generations and promotion

Question
Explain GC generations and a basic tuning strategy.

Answer
Young generation is collected frequently for short-lived objects; survivor spaces copy survivors; promotion happens to old generation. Choose collector and tune heap/new size depending on throughput vs latency needs.

Example
`Module03Q3.java` creates short- and long-lived objects to illustrate promotion behavior.

Compile & run
```powershell
javac java_tech_lead\topics\Module03Q3\Module03Q3.java
java -cp java_tech_lead\topics\Module03Q3 Module03Q3
```
