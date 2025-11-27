# Lesson 02: Reactive Streams

## 1. Learning Objectives
- Understand Reactive Streams fundamentals
- Apply Reactive Streams in spring scenarios
- Communicate trade-offs and best practices clearly

## 2. Why This Matters for a Java Tech Lead
A Tech Lead must evaluate, justify, and guide correct usage of Reactive Streams ensuring reliability, performance, and maintainability across teams. Mastery enables mentoring and architectural judgment.

## 3. Core Theory
### 3.1 Key Concepts
This section presents the foundational concepts of reactive-streams relevant to the spring domain.
- Framework abstraction boundaries
- Lifecycle and context interactions
- Annotation vs programmatic configuration
- Integration and testability concerns

### 3.2 Interview-Style Explanation
In interviews emphasize:
- Clarity of definition
- Production failure or success anecdote
- Trade-off awareness and when NOT to apply
- Performance or scalability angle

## 4. Code Examples
#### Example 1: Annotated Service Bean
```java
import org.springframework.stereotype.Service;
@Service
public class PriceService {
  public BigDecimal calculate(){ return BigDecimal.TEN; }
}
```

#### Example 2: Configuration vs Auto-Configuration
```java
@Configuration
public class AppConfig {
  @Bean PriceService priceService(){ return new PriceService(); }
}
```
Leverage auto-config unless custom wiring or conditional creation needed.

#### Example 3: Slice Test (DataJpaTest)
```java
@DataJpaTest
class RepoTest {
  @Autowired MyRepo repo;
  @Test void findsEntity(){
    assertTrue(repo.findById(1L).isPresent());
  }
}
```
Focused context speeds tests; avoids full application start.
Provide commentary explaining decisions, complexity, and alternatives.

## 5. Pitfalls and Best Practices
- Misunderstood concept boundary
- Common performance trap
- Incorrect assumption under load
- Testing oversight
- Security or reliability oversight
Guidance: Prefer measurable approaches, instrument early, document decisions.

## 6. Hands-On Exercises
### Exercise 1: REST Endpoint + Validation
Create POST /items with Bean Validation, custom error response.
Acceptance: 2 validation rules enforced; integration test green.

### Exercise 2: Data Layer & Slice Test
Add JPA entity + repository; write @DataJpaTest verifying query method.
Acceptance: Test isolates persistence; no full context startup.

## 7. Interview Cheat Sheet
Definition: One-liner summarizing reactive-streams.
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

