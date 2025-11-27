# Java Tech Lead Interview Course – Overview

<!-- @copilot:generate -->
<!-- @copilot:expand -->
<!-- @copilot:lesson-auto -->

This document enumerates all modules, submodules, and planned lessons for automated scaffolding. Each lesson follows the standard structure:

```
lesson-XX-slug/
  README.md
  LESSON.md
  QUIZ.md
  ANSWERS.md
  EXERCISES.md
  code/
    starter/
    solution/
    tests/
```

## Module Index

1. 01-java
2. 02-advanced-java
3. 03-spring
4. 04-microservices
5. 05-aws
6. 06-system-design
7. 07-architecture
8. 08-leadership
9. 09-behavioral
10. 10-coding-challenges

---
## 01-java

### Submodules & Lessons
| Submodule | Lessons |
|-----------|---------|
| 01-basics | JDK-JRE-JVM, Primitives-vs-References, Control-Flow, Stack-vs-Heap, Memory-Model |
| 02-oop | Four-Pillars, Overriding-vs-Overloading, Interfaces-vs-Abstract-Classes, This-and-Super |
| 03-collections | Collections-Framework, ArrayList-vs-LinkedList, HashMap-Internals |
| 04-generics | Generic-Basics, Wildcards-PECS, Type-Erasure |
| 05-streams | Streams-Intro, Functional-Interfaces, Optional-Class, Collectors-Advanced |
| 06-exceptions | Exception-Hierarchy, Checked-vs-Unchecked, Custom-Exceptions |
| 07-io | IO-vs-NIO2, File-Streaming, Async-IO |
| 08-functional | Advanced-Functional, Lambdas-DeepDive, Method-References |

## 02-advanced-java
| Submodule | Lessons |
|-----------|---------|
| 01-concurrency | Concurrency-Overview, Thread-Pools, Locks-and-Synchronization, Futures-and-CompletableFuture |
| 02-jvm | JVM-Architecture, Class-Loading, Bytecode-Inspection |
| 03-gc | Garbage-Collectors, GC-Tuning, Memory-Leaks-Diagnosis |
| 04-memory-model | Java-Memory-Model, Happens-Before, Visibility-Ordering |

## 03-spring
| Submodule | Lessons |
|-----------|---------|
| 01-core | IoC-and-DI, Bean-Lifecycle, Profiles-and-Conditions |
| 02-mvc | Spring-MVC, Validation, Exception-Handling |
| 03-web | REST-Best-Practices, HATEOAS, Versioning |
| 03-data | Spring-Data-Access, Transactions, Query-Performance |
| 04-boot | Spring-Boot-Auto-Configuration, Starter-Dependencies, Actuator-and-Observability |
| 04-security | Spring-Security-Basics, JWT-Auth, Method-Security |
| 05-testing | Testing-Strategies, Slice-Tests, Testcontainers |

## 04-microservices
| Submodule | Lessons |
|-----------|---------|
| 01-design-patterns | Microservices-Patterns, Service-Boundaries, API-Gateway |
| 02-communication | Service-Communication, Sync-vs-Async, gRPC-vs-REST |
| 02-saga | Saga-Pattern, Outbox-Pattern |
| 03-cqrs | CQRS-Pattern, Read-Model-Design |
| 03-resilience | Resilience-Observability, Circuit-Breakers, Rate-Limiting |
| 04-event-driven | Event-Driven-Architecture, Messaging-Guarantees |
| 05-deployment | Deployment-Strategies, Blue-Green, Canary-Releases |

## 05-aws
| Submodule | Lessons |
|-----------|---------|
| 01-ec2 | EC2-Basics |
| 02-lambda | Lambda-Basics |
| 03-s3 | S3-Data-Patterns |
| 04-sqs | SQS-Basics |
| 05-sns | SNS-PubSub |
| 06-dynamodb | DynamoDB-Design |
| 07-apigateway | APIGateway-Patterns |

## 06-system-design
| Submodule | Lessons |
|-----------|---------|
| core | Load-Balancing, Caching, Databases, Horizontal-Scaling, Consistency-Models |
| practice | URL-Shortener, Rate-Limiter, Feed-System |

## 07-architecture
| Submodule | Lessons |
|-----------|---------|
| patterns | Layered-Architecture, Hexagonal-Architecture, Event-Sourcing, Clean-Architecture |

## 08-leadership
| Submodule | Lessons |
|-----------|---------|
| core | Conflict-Resolution, Delegation, Root-Cause-Analysis, Communication-Frameworks, Mentoring |

## 09-behavioral
| Submodule | Lessons |
|-----------|---------|
| core | Ownership, Handling-Failure, Stakeholder-Management, Prioritization |

## 10-coding-challenges
| Submodule | Lessons |
|-----------|---------|
| algorithms | Arrays-Algorithms, Concurrency-Challenges, Data-Structures, Graph-Problems |

---
## Automation Triggers Summary
Embedded comments enable Copilot to expand placeholders:

```
<!-- @copilot:lesson-build -->
<!-- @copilot:expand-section core-theory -->
<!-- @copilot:expand-section examples -->
<!-- @copilot:expand-section pitfalls -->
```

```
# @copilot:challenge-generate
```

## Maintenance
Use `/copilot audit repo` then `/copilot fix repo` to ensure alignment with templates. Run `/copilot sync templates` after changing any template file.

---
*Generated overview – update as new lessons are added.*
