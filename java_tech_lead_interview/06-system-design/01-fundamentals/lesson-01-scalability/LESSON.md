# Lesson 01: Scalability

## 1. Learning Objectives
- Understand Scalability fundamentals
- Apply Scalability in system-design scenarios
- Communicate trade-offs and best practices clearly

## 2. Why This Matters for a Java Tech Lead
A Tech Lead must evaluate, justify, and guide correct usage of Scalability ensuring reliability, performance, and maintainability across teams. Mastery enables mentoring and architectural judgment.

## 3. Core Theory
### 3.1 Key Concepts
This section presents the foundational concepts of scalability relevant to the system-design domain.
- Core functional requirements
- Non-functional constraints
- Component decomposition
- Data flow and storage strategy

### 3.2 Interview-Style Explanation
In interviews emphasize:
- Clarity of definition
- Production failure or success anecdote
- Trade-off awareness and when NOT to apply
- Performance or scalability angle

## 4. Code Examples
#### Example: High-Level Request Flow (Pseudo)
```text
Client -> API Gateway -> Service A -> Cache -> DB
             |              |miss
             +--> Service B (async event) -> Queue -> Worker -> DB
```
Highlight: separation of sync read path & async write pipeline.

#### Example: Cache Read-Through
```java
Price getPrice(long id){
  return cache.computeIfAbsent(id, k -> repo.fetch(k));
}
```
Ensures single DB hit per cold key.

#### Example: Circuit Breaker Policy (Pseudo YAML)
```yaml
circuit:
  failureThreshold: 50%
  windowSeconds: 30
  openSeconds: 15
  timeoutMillis: 800
```
Provide commentary explaining decisions, complexity, and alternatives.

## 5. Pitfalls and Best Practices
- Misunderstood concept boundary
- Common performance trap
- Incorrect assumption under load
- Testing oversight
- Security or reliability oversight
Guidance: Prefer measurable approaches, instrument early, document decisions.

## 6. Hands-On Exercises
### Exercise 1: High-Level Architecture Diagram
Sketch components for read-heavy service (gateway, cache, DB, async worker).
Acceptance: Justify each component vs requirement.

### Exercise 2: Capacity Estimate
Compute QPS, storage, and cache hit assumptions; produce sizing table.
Acceptance: Numbers traceable from given input metrics.

## 7. Interview Cheat Sheet
Definition: One-liner summarizing scalability.
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

