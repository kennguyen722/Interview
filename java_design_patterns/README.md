# Design Patterns in Java

## Module 1: Introduction to Design Patterns
**Objectives:**
- Define what a software design pattern is and why it matters.
- Classify patterns into Creational, Structural, Behavioral (GoF taxonomy).
- Interpret a standard pattern description template (Intent, Motivation, Structure, Participants, Collaborations, Consequences, Implementation, Sample Code, Known Uses, Related Patterns).
- Identify benefits and limitations of pattern-driven design in modern Java architectures.
- Set up a Java project structure suitable for experimenting with patterns (Maven/Gradle, JDK 17+, testing setup).

**Topics:**
1. History & Origin (Christopher Alexander → GoF → Modern usage)
2. Why Patterns Still Matter (communication, reuse of design, architectural consistency)
3. GoF Classification Overview
4. Pattern Template Walkthrough
5. Patterns vs. Principles (SOLID, DRY, KISS, YAGNI)
6. Overuse & Anti-Patterns (Golden Hammer, needless abstraction)
7. Evaluating When a Pattern Fits: Decision heuristics
8. Lab Environment Setup (Project skeleton, test harness, benchmarking basics)

**Lab: Environment Setup**
- Initialize a multi-module Maven project (`patterns-core`, `patterns-examples`).
- Configure JUnit tests and logging.
- Create a baseline domain (e.g., simple order processing model) to reuse across pattern examples.

---
## Module 2: Creational Patterns Overview
**Objectives:**
- Explain how creational patterns manage object creation complexity.
- Match each creational pattern to typical use cases (flexibility, performance trade-offs, lifecycle management).
- Choose appropriate creational patterns for evolving requirements.

**Topics:**
1. Creation Complexity & Object Lifecycles
2. Immutability, Builders, and Fluent APIs
3. Dependency Injection & Creational Patterns interplay (DI frameworks vs explicit patterns)
4. Performance & Resource Management Considerations
5. Summary Comparison Matrix (Flexibility vs Simplicity vs Extensibility)

---
### Pattern: Singleton
- **Intent:** Ensure a class has only one instance and provide a global access point.
- **Motivation:** Centralized configuration, shared caches.
- **Structure (UML Simplified):** Class with private constructor, static instance accessor.
- **Example (Java):** Thread-safe lazy initialization using `Holder` idiom.
- **Advantages:** Controlled access, lazy instantiation possible.
- **Disadvantages:** Hidden dependencies, testing difficulty, potential statefulness issues.
- **When to Use:** Truly one logical instance (e.g., application-wide registry).
- **When to Avoid:** Replace with DI-managed scope; avoid global mutable state.
- **Lab:** Implement three variants (eager, synchronized, inner static holder); add tests & benchmark access overhead.

### Pattern: Factory Method
- **Intent:** Define an interface for object creation, letting subclasses decide which class to instantiate.
- **Motivation:** Defer exact type selection; promote extensibility without changing client code.
- **Structure:** Creator (abstract) declares factory method; ConcreteCreator overrides to produce ConcreteProduct.
- **Example:** Parsing different document formats (`DocumentParserFactory`).
- **Advantages:** Open/Closed adherence, localized instantiation logic.
- **Disadvantages:** More subclasses, can become hierarchical complexity.
- **Use:** Framework extension points, pluggable product families.
- **Avoid:** When simple constructor or builder suffices.
- **Lab:** Create parsers (JSON, XML, CSV) via factory hierarchy; add a new format without touching existing clients.

### Pattern: Abstract Factory
- **Intent:** Provide an interface for creating families of related objects without specifying concrete classes.
- **Motivation:** Ensure compatible product combinations (e.g., themed UI components).
- **Structure:** AbstractFactory → ConcreteFactories → Product Interfaces → ConcreteProducts.
- **Example:** UI theme factory (Dark vs Light producing Button, Menu, Dialog).
- **Advantages:** Ensures consistency across product families.
- **Disadvantages:** Many factory classes; rigid for adding new product types.
- **Use:** Cross-cutting style consistency; portability layers.
- **Avoid:** If product combinations seldom change; prefer DI config.

### Pattern: Builder
- **Intent:** Separate construction of a complex object from its representation.
- **Motivation:** Handling telescoping constructors; progressive configuration.
- **Structure:** Director (optional), Builder interface, ConcreteBuilder, Product.
- **Example:** Building immutable `Report` objects with optional sections.
- **Advantages:** Readable, incremental, enforces invariants, immutability.
- **Disadvantages:** Extra classes; possible verbosity for simple objects.
- **Use:** Complex aggregates, immutability, conditional assembly.
- **Avoid:** Simple POJOs; prefer constructors or records.
- **Lab:** Implement fluent builder for `Order` supporting discounts, promotions, validations; property-based tests.

### Pattern: Prototype
- **Intent:** Create new objects by cloning existing prototypes.
- **Motivation:** Dynamic object composition at runtime; avoid subclass explosion.
- **Structure:** Prototype interface with clone; ConcretePrototype implementing deep/shallow copy.
- **Example:** Cloning graphical shape templates.
- **Advantages:** Runtime flexibility; avoids re-building complex state.
- **Disadvantages:** Deep copy complexity; potential performance issues.
- **Use:** When instances share expensive setup; dynamic composition.
- **Avoid:** When constructors are cheap or state is simple.

### Pattern: Object Pool (Supplemental)
- **Intent:** Reuse a set of initialized objects instead of creating/destroying repeatedly.
- **Motivation:** Performance optimization for expensive objects (e.g., database connections). Not GoF but relevant.
- **Brief:** Pool manager tracks available vs in-use objects.

---
## Module 3: Structural Patterns Overview
**Objectives:**
- Describe how structural patterns organize relationships between classes and objects.
- Evaluate patterns for decoupling, extensibility, and composition trade-offs.
- Select appropriate patterns for large-scale modular Java systems.

**Topics:**
1. Composition vs Inheritance Revisited
2. Interface Adaptation Strategies
3. Managing Cross-Cutting Concerns via Wrappers
4. Structural Pattern Comparison Grid

---
### Pattern: Adapter
- **Intent:** Convert interface of a class into another expected by clients.
- **Motivation:** Integrate legacy code or third-party APIs seamlessly.
- **Structure:** Target interface, Adaptee, Adapter translating calls.
- **Example:** Wrapping a legacy payment gateway to match new `PaymentProcessor` interface.
- **Advantages:** Reuse without modifying existing code; promotes interoperability.
- **Disadvantages:** Can multiply layers; potential performance overhead.
- **Use:** Bridging incompatible APIs; gradual migrations.
- **Avoid:** When refactoring source is possible; prefer direct interface alignment.
- **Lab:** Adapt multiple shipping provider APIs to a unified `ShippingService` interface; test error handling.

### Pattern: Decorator
- **Intent:** Attach responsibilities to objects dynamically.
- **Motivation:** Flexible feature composition (vs large inheritance trees).
- **Structure:** Component interface, ConcreteComponent, Decorator abstract, ConcreteDecorators layering behavior.
- **Example:** Adding compression + encryption to data streams.
- **Advantages:** Runtime flexibility; adheres to Open/Closed.
- **Disadvantages:** Debug complexity; proliferation of small classes.
- **Use:** Combinable orthogonal behaviors (I/O filters).
- **Avoid:** When composition order ambiguity harms clarity; consider strategy chain.
- **Lab:** Implement message processing pipeline (logging, validation, transformation) via decorators; benchmark stacking.

### Pattern: Composite
- **Intent:** Compose objects into tree structures to represent whole-part hierarchies; treat individual and composite uniformly.
- **Motivation:** Simplify client code dealing with hierarchies.
- **Structure:** Component interface, Leaf, Composite holding children.
- **Example:** File system hierarchy (Files & Folders) operations.
- **Advantages:** Uniformity; simplifies recursive algorithms.
- **Disadvantages:** Can blur constraints between leaf/composite responsibilities.
- **Use:** Recursive hierarchical structures (UI components, menus).
- **Avoid:** When hierarchy depth is trivial; simpler lists suffice.

### Pattern: Facade
- **Intent:** Provide a simplified interface to a complex subsystem.
- **Motivation:** Reduce learning curve; decouple clients from internal complexity.
- **Structure:** Facade class delegating to multiple subsystem classes.
- **Example:** `ImageProcessingFacade` wrapping decoding, filtering, caching steps.
- **Advantages:** Shields complexity; fosters layering.
- **Disadvantages:** Risk of god-object if bloated; may hide important capabilities.
- **Use:** Entry points; migrating legacy subsystems.
- **Avoid:** Unnecessary abstraction for already simple APIs.

### Pattern: Proxy
- **Intent:** Provide a surrogate controlling access to another object.
- **Motivation:** Lazy loading, remote invocation, access control.
- **Structure:** Subject interface, RealSubject, Proxy containing RealSubject reference.
- **Example:** Lazy-loading large product catalog data.
- **Advantages:** Controlled access, performance optimization.
- **Disadvantages:** Indirection overhead; complexity for transparent semantics.
- **Use:** Remote services, security checks, caching.
- **Avoid:** If direct access is sufficient; do not stack proxies excessively.

### Pattern: Bridge
- **Intent:** Decouple abstraction from implementation so both can vary independently.
- **Motivation:** Avoid explosion of subclasses combining orthogonal dimensions.
- **Structure:** Abstraction, RefinedAbstraction, Implementor interface, ConcreteImplementors.
- **Example:** Rendering API abstraction (Vector vs Raster) for different shapes.

### Pattern: Flyweight
- **Intent:** Share fine-grained object state efficiently.
- **Motivation:** Reduce memory for large numbers of similar objects.
- **Structure:** Flyweight interface, ConcreteFlyweight (intrinsic state), Extrinsic state supplied by client, Factory managing cache.
- **Example:** Character glyph caching in a text editor.

### Pattern: Composite + Decorator Synergy (Mini-Topic)
- Interplay in UI frameworks; layering responsibilities across hierarchical components.

---
## Module 4: Behavioral Patterns Overview
**Objectives:**
- Explain how behavioral patterns manage algorithms, communication, and responsibility distribution.
- Distinguish between encapsulating behavior vs controlling object interaction.
- Select patterns to improve flexibility and testability of workflows.

**Topics:**
1. Collaboration & Responsibility Allocation
2. Event-Driven vs Command-Driven Designs
3. Behavioral Pattern Comparison Grid

---
### Pattern: Strategy
- **Intent:** Define a family of algorithms, encapsulate each, make them interchangeable.
- **Motivation:** Swap behaviors without conditional logic sprawl.
- **Structure:** Strategy interface, ConcreteStrategies, Context holding reference.
- **Example:** Pricing strategies (seasonal, volume-based, promotional).
- **Advantages:** Eliminates large conditional blocks; promotes Open/Closed.
- **Disadvantages:** More objects; overhead if strategies are trivial.
- **Use:** Algorithm variation; dynamic selection at runtime.
- **Avoid:** When single implementation suffices.
- **Lab:** Implement dynamic discount engine loading strategies via service discovery; unit test switching logic.

### Pattern: Observer
- **Intent:** Define one-to-many dependency so that dependents are notified automatically.
- **Motivation:** Decouple publishers and subscribers.
- **Structure:** Subject, Observer interface, ConcreteObservers.
- **Example:** Inventory level notifications to multiple storefronts.
- **Advantages:** Reactive updates; decoupled observers.
- **Disadvantages:** Notification storms; ordering unpredictability.
- **Use:** Event propagation, UI models.
- **Avoid:** When single listener suffices; consider direct callback.
- **Lab:** Build event bus with asynchronous observer notifications; measure throughput.

### Pattern: Command
- **Intent:** Encapsulate a request as an object to parameterize and queue operations.
- **Motivation:** Undo/redo, logging, transactional batching.
- **Structure:** Command interface, ConcreteCommands, Invoker, Receiver.
- **Example:** Operations in a text editor (insert, delete, format).
- **Advantages:** Adds undo capability; decouples invoker from receiver.
- **Disadvantages:** Boilerplate for simple actions.
- **Use:** Task scheduling, macros.
- **Avoid:** When direct method calls are sufficient.
- **Lab:** Implement command history with undo/redo and persistence.

### Pattern: Template Method
- **Intent:** Define skeleton of algorithm, deferring steps to subclasses.
- **Motivation:** Enforce invariant algorithm sequence.
- **Structure:** AbstractClass with template method calling abstract/overridable steps.
- **Example:** Data export workflow (validate → transform → write → finalize).
- **Advantages:** Promotes reuse; enforces structure.
- **Disadvantages:** Inheritance coupling; limited runtime variability.
- **Use:** Algorithms with stable high-level flow.
- **Avoid:** When runtime behavior switching needed (prefer Strategy).

### Pattern: Chain of Responsibility
- **Intent:** Pass request along a chain of handlers until one processes it.
- **Motivation:** Decouple sender from receiver; dynamic processing pipeline.
- **Structure:** Handler interface, ConcreteHandlers, linkage via next reference.
- **Example:** HTTP request middleware (auth, validation, transformation).
- **Advantages:** Flexible ordering; promotes single-responsibility handlers.
- **Disadvantages:** Debugging traversal; potential unhandled requests.
- **Use:** Filtering pipelines, layered checks.
- **Avoid:** When single handler is always sufficient.

### Pattern: State
- **Intent:** Allow object to alter behavior when internal state changes.
- **Motivation:** Replace switch/conditional state machines with polymorphism.
- **Structure:** Context, State interface, ConcreteStates updating context.
- **Example:** Order lifecycle (Created → Paid → Shipped → Delivered → Returned).

### Pattern: Iterator
- **Intent:** Provide sequential access to elements without exposing underlying representation.
- **Motivation:** Uniform traversal API.
- **Structure:** Iterator interface, ConcreteIterator, Aggregate interface.
- **Example:** Custom tree traversal in domain model.

### Pattern: Mediator
- **Intent:** Encapsulate how a set of objects interact.
- **Motivation:** Reduce coupling between colleague objects.
- **Structure:** Mediator interface, ConcreteMediator, Colleague classes.
- **Example:** Chat room server orchestrating user interactions.

### Pattern: Memento
- **Intent:** Capture and externalize an object's internal state without violating encapsulation for restoration later.
- **Motivation:** Undo operations, state snapshots.
- **Structure:** Originator, Memento, Caretaker.
- **Example:** Editor version checkpoints.

### Pattern: Visitor
- **Intent:** Represent operations to perform on elements of object structure.
- **Motivation:** Add new operations without modifying element classes.
- **Structure:** Visitor interface, ConcreteVisitors, Element interface, ConcreteElements.
- **Example:** AST traversal with formatting vs optimization visitors.

### Pattern: Strategy vs Template vs Chain (Comparative Mini-Topic)
- Decision matrix for selecting behavior encapsulation variant.

**Lab (Extended):** Combine Observer + Command to implement an event-sourced audit log for order operations.

---
## Module 5: Integrating Patterns in Architecture
**Objectives:**
- Compose multiple patterns to form robust subsystems.
- Evaluate patterns under concurrency and scalability constraints.
- Apply patterns with modern frameworks (Spring, reactive libraries) cautiously.

**Topics:**
1. Pattern Composition Examples (Facade + Strategy + Observer in payments)
2. Concurrency Considerations (Singleton with double-checked locking pitfalls, immutability strategies)
3. Patterns in Spring (DI reducing need for factories & singletons)
4. Reactive & Event-Driven Adaptations (Observer vs Reactor model)
5. Measuring Impact (Maintainability, Coupling metrics)
6. Refactoring Toward Patterns vs Premature Adoption

**Mini-Lab:** Refactor an ad-hoc conditional workflow into Chain of Responsibility + Strategy combination; write comparative complexity analysis.

---
## Module 6: Anti-Patterns & Misuse
**Objectives:**
- Identify common misapplications of popular patterns.
- Develop heuristics to avoid over-engineering.

**Topics:**
1. Singleton Abuse (global mutable state, hidden dependencies)
2. Over-Abstracted Factories & Indirection
3. Decorator Hell (too many layered wrappers)
4. God Facade / Bloated Mediator
5. Visitor misuse for trivial operations
6. Refactoring Anti-Patterns Back to Simplicity

**Checklist:** Reducing unnecessary patterns; pattern removal guidelines.

---
## Module 7: Testing & Maintainability with Patterns
**Objectives:**
- Design tests leveraging pattern seams (Strategy injection, mockable observers).
- Assess impact on code readability and evolution.

**Topics:**
1. Testing Strategies & Factories (Parameterized tests)
2. Mocking Proxies and Adapters
3. Verifying Chain Processing Order
4. Mutation Testing & Patterned Code
5. Benchmarking Decorator Stacks

**Lab:** Implement mutation tests on Strategy implementations; analyze survivorship.

---
## Module 8: Performance & Resource Considerations
**Objectives:**
- Understand runtime costs introduced by indirection and abstraction.
- Optimize pattern implementations (caching, pooling, lazy init).

**Topics:**
1. Allocation Patterns (Prototype vs Builder overhead)
2. Memory Sharing (Flyweight trade-offs)
3. Indirection Costs (Proxy, Adapter layering)
4. JVM Features (Records simplifying Builder cases)
5. Profiling a Pattern-Rich Module

**Lab:** Profile decorated vs monolithic I/O pipeline; report latency & allocations.

---
## Module 9: Pattern Selection Framework
**Objectives:**
- Apply a structured decision rubric for pattern adoption.
- Map requirements to candidate patterns.

**Topics:**
1. Classification Decision Tree
2. Domain-Driven Design Alignment (Aggregates & Patterns)
3. Risk Assessment (Complexity vs Flexibility)
4. Scoring Matrix Exercise

**Lab:** Given evolving requirements scenario, produce pattern adoption roadmap & justify each choice.

---
## Module 10: Conclusion & Next Steps
**Objectives:**
- Summarize key insights & adoption best practices.
- Formulate a personal improvement plan for architectural thinking.

**Topics:**
1. Review of All Patterns & Core Trade-offs
2. Patterns in Modern Context (Microservices, CQRS, Event Sourcing)
3. Emerging Patterns & Alternatives (CQRS vs Command, Pub/Sub vs Observer, Hexagonal Architecture contexts)
4. Continuous Learning Path (Refactoring catalogs, architecture books)
5. Creating Internal Pattern Repositories / Playbooks

**Capstone Project (Suggestion):** Design a modular order fulfillment subsystem employing at least: Factory Method, Strategy, Observer, Composite, Chain of Responsibility, and Decorator. Provide architectural ADRs documenting decisions.

**Next Steps:**
- Extend to Enterprise Integration Patterns.
- Explore concurrency-focused patterns (Fork/Join, Reactor, Actor model abstractions).
- Contribute pattern examples to internal knowledge base.

---
## Labs Summary (8+ Key Hands-On Labs)
1. Singleton Variants & Benchmarking
2. Factory Method for Multi-Format Parsing
3. Builder for Complex Immutable Order
4. Adapter Wrapping External APIs
5. Decorator-Based Message Pipeline
6. Strategy Discount Engine with Dynamic Loading
7. Observer Event Bus & Throughput Measurement
8. Command History with Undo/Redo Persistence
9. (Extended) Event-Sourced Audit (Observer + Command)
10. Performance Profiling of Decorator vs Monolith

---
## Reference Cross-Matrix (Outline Only)
- Creational: Flexibility (Builder, Abstract Factory), Simplicity (Singleton), Cloning (Prototype), Families (Abstract Factory), Variation (Factory Method).
- Structural: Composition (Composite), Interface Alignment (Adapter), Layered Responsibilities (Decorator), Access Control (Proxy), Simplification (Facade), Separation Dimensions (Bridge), Memory Efficiency (Flyweight).
- Behavioral: Algorithm Variation (Strategy), Notification (Observer), Request Encapsulation (Command), Algorithm Skeleton (Template Method), Request Routing (Chain), Stateful Behavior (State), Traversal (Iterator), Interaction Mediator (Mediator), Snapshot (Memento), Operation Injection (Visitor).

---
## Prerequisites Recap
- Comfortable with OOP (inheritance, interfaces, polymorphism)
- Java 11+ (preferably 17+), Maven/Gradle basics
- Unit testing (JUnit), basic profiling (JFR / VisualVM)
- Understanding of SOLID principles

---
## Glossary (Abbreviated)
- OCP: Open/Closed Principle
- DI: Dependency Injection
- ADR: Architecture Decision Record
- DDD: Domain-Driven Design

---
## Suggested Reading
- "Design Patterns" (Gamma et al.)
- "Refactoring" (Fowler)
- "Effective Java" (Bloch)
- "Patterns of Enterprise Application Architecture" (Fowler)
- "Domain-Driven Design" (Evans)

---
## Expansion Hooks (For Future Modules)
- Concurrency Patterns
- Reactive Streams Patterns
- Cloud-Native & Microservices Patterns (Circuit Breaker, Retry, Bulkhead)
- Architectural Patterns (Hexagonal, Clean Architecture)

---
## Evaluation Criteria (For Each Lab)
- Correctness: Passes unit tests.
- Design Quality: Pattern applied appropriately (no over-engineering).
- Extensibility: Ease of adding new variants/features.
- Performance: Meets baseline benchmarks.
- Documentation: Includes brief rationale & UML sketch.

---
End of structured outline.

---

## Build & Test Guide

### Prerequisites
- Java 17 on `PATH` (Temurin/OpenJDK)
- Maven 3.9+ on `PATH`

Verify in PowerShell:

```
java -version
mvn -v
```

If Maven is installed in a user-local folder, add to `PATH` for this session:

```
$env:PATH = "$env:LOCALAPPDATA\apache-maven-3.9.6\bin;$env:PATH"
```

### Build All Modules (skip tests)

```
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -DskipTests package
```

### Run All Tests

```
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" test
```

### Build/Test a Category Aggregator

```
# Behavioral (build only)
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl behavioral -am -DskipTests package

# Structural (run tests)
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl structural -am test
```

### Build/Test an Individual Pattern Module

Pattern modules live under their category aggregators. Use `-pl <category>/<module>` with `-am`:

```
# Creational
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl creational/singleton -am test
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl creational/factorymethod -am -DskipTests package

# Structural
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl structural/adapter -am test
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl structural/decorator -am -DskipTests package

# Behavioral
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl behavioral/observer -am test
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl behavioral/strategy -am -DskipTests package
```

### Running a `main` Class (optional)

If a module defines a runnable `main`, you can invoke it via Maven Exec:

```
mvn -q -pl <category>/<module> -am exec:java -Dexec.mainClass="fully.qualified.Main"
```

Replace `<category>/<module>` and `fully.qualified.Main` with the actual values. Otherwise, prefer unit tests under `src/test/java`.

### Troubleshooting
- Use `-e` or `-X` for verbose error output:

```
mvn -e -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl behavioral -am test
```

- Ensure submodule POMs inherit from their category aggregator (`creational`, `structural`, `behavioral`).

\n+## Module Grouping (GoF Categories)\n+**Creational Modules:** `singleton`, `factorymethod`, `builder`, `abstractfactory`, `prototype`, `objectpool`\n+**Structural Modules:** `adapter`, `decorator`, `composite`, `facade`, `proxy`, `bridge`, `flyweight`\n+**Behavioral Modules:** `strategy`, `observer`, `command`, `templatemethod`, `chain`, `state`, `iterator`, `mediator`, `memento`, `visitor`\n+**Supplemental/Integration:** `eventsource` (pattern composition), `performance` (profiling scenarios)\n+\n+The parent aggregator POM now lists category aggregators (`creational`, `structural`, `behavioral`) to simplify selective builds and focused learning. Each aggregator POM references its pattern modules; pattern directories remain at root for clarity.\n+\n+### Next Enhancement Ideas\n+- Add UML diagrams per pattern (PlantUML sources).\n+- Implement real test cases benchmarking differences (e.g., Decorator stack vs monolith).\n+- Provide integration examples combining multiple patterns (e.g., Facade + Strategy + Observer).\n+- Introduce Spring-based variants for Factory/Singleton replacement via DI scopes.\n+- Add mutation testing configuration for Strategy & State patterns.\n\n
