# Lesson 02: Method References

## 1. Learning Objectives
- Understand Method References fundamentals
- Apply Method References in java-basics scenarios
- Communicate trade-offs and best practices clearly

## 2. Why This Matters for a Java Tech Lead
A Tech Lead must evaluate, justify, and guide correct usage of Method References ensuring reliability, performance, and maintainability across teams. Mastery enables mentoring and architectural judgment.

## 3. Core Theory
### 3.1 Key Concepts
This section presents the foundational concepts of method-references relevant to the java-basics domain.
- Definition and primary purpose
- Memory / execution model basics
- Key APIs and usage patterns
- Interview framing: clarity and fundamentals

### 3.2 Interview-Style Explanation
In interviews emphasize:
- Clarity of definition
- Production failure or success anecdote
- Trade-off awareness and when NOT to apply
- Performance or scalability angle

## 4. Code Examples
#### Example 1: Minimal Class & Usage
```java
public class Greeter {
  private final String name;
  public Greeter(String name){ this.name = name; }
  public String greet(){ return "Hello, " + name; }
  public static void main(String[] args){
    System.out.println(new Greeter("Java").greet());
  }
}
```
Explanation: Demonstrates object instantiation and method invocation.

#### Example 2: String Immutability Pitfall
```java
String base = "start";
for(int i=0;i<3;i++){
  base += i; // Creates new String each iteration
}
System.out.println(base);
```
Better: use StringBuilder for iterative concatenation.

#### Example 3: Basic Unit Test (JUnit 5)
```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class GreeterTest {
  @Test void greetReturnsExpected(){
    assertEquals("Hello, Java", new Greeter("Java").greet());
  }
}
```
Focus: correctness, readability.
Provide commentary explaining decisions, complexity, and alternatives.

## 5. Pitfalls and Best Practices
- Misunderstood concept boundary
- Common performance trap
- Incorrect assumption under load
- Testing oversight
- Security or reliability oversight
Guidance: Prefer measurable approaches, instrument early, document decisions.

## 6. Hands-On Exercises
### Exercise 1: Build a Utility Class
Goal: Implement method-references fundamentals (immutability, basic API).
Tasks:
- Create a small utility with one pure and one stateful method.
- Write 3 JUnit tests covering normal, edge, and error input.
Acceptance: All tests pass; code free of duplicated logic.

### Exercise 2: Refactor for Performance
Goal: Replace naive string handling with StringBuilder and measure runtime.
Tasks:
- Implement naive version (loop concatenation).
- Implement optimized version.
- Benchmark using System.nanoTime() for 100k iterations.
Acceptance: Optimized version at least 3x faster; brief rationale documented.

## 7. Interview Cheat Sheet
Definition: One-liner summarizing method-references.
When to Use: Ideal scenario conditions.
When to Avoid: Red flags and anti-pattern contexts.
Metrics: Observable indicators of success or failure.
Checklist: Design clarity, performance, testability, resilience.

## 8. Further Reading
- Official docs
- Authoritative spec or RFC
- High-quality blog deep dive
- Performance or scaling study
- Security considerations article
Select sources that reinforce depth beyond introductory tutorials.

