# Lesson 03: Distributed Transactions

## 1. Learning Objectives
- Understand Distributed Transactions fundamentals
- Apply Distributed Transactions in microservices scenarios
- Communicate trade-offs and best practices clearly

## 2. Why This Matters for a Java Tech Lead
A Tech Lead must evaluate, justify, and guide correct usage of Distributed Transactions ensuring reliability, performance, and maintainability across teams. Mastery enables mentoring and architectural judgment.

## 3. Core Theory
### 3.1 Key Concepts
This section presents the foundational concepts of distributed-transactions relevant to the microservices domain.
- Service boundaries and autonomy
- Sync vs async communication
- Resilience and observability primitives
- Data consistency and evolution patterns

### 3.2 Interview-Style Explanation
In interviews emphasize:
- Clarity of definition
- Production failure or success anecdote
- Trade-off awareness and when NOT to apply
- Performance or scalability angle

## 4. Code Examples
#### Example 1: Resilient REST Endpoint
```java
@GetMapping("/price/{id}")
public PriceDto get(@PathVariable long id){
  return circuit.executeSupplier(() -> service.fetch(id));
}
```
Pattern: Wrap dependencies with circuit breaker & timeout.

#### Example 2: Async Event Publishing
```java
eventBus.publish(new PriceUpdatedEvent(id, newValue));
```
Decouples write path from downstream processing.

#### Example 3: DTO vs Entity Separation
```java
class PriceEntity { Long id; BigDecimal amount; }
class PriceDto { long id; String formatted; }
```
Avoid leaking persistence concerns across service boundary.
Provide commentary explaining decisions, complexity, and alternatives.

## 5. Pitfalls and Best Practices
- Misunderstood concept boundary
- Common performance trap
- Incorrect assumption under load
- Testing oversight
- Security or reliability oversight
Guidance: Prefer measurable approaches, instrument early, document decisions.

## 6. Hands-On Exercises
### Exercise 1: Circuit Breaker Integration
Wrap external call with breaker + timeout; simulate failures.
Acceptance: Open state triggers fallback metric.

### Exercise 2: Async Event Flow
Publish domain event and process via in-memory queue worker.
Acceptance: Event processed independently of request latency.

## 7. Interview Cheat Sheet
Definition: One-liner summarizing distributed-transactions.
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

