# Lesson 25: Behavioral Design Patterns - Deep Dive

## Objective
Master behavioral patterns concerned with algorithms and assignment of responsibilities: Strategy, Observer, Command, Chain of Responsibility, Iterator, Mediator, Memento, State, Template Method, Visitor, and Interpreter patterns.

## Topics Covered

### 1. Strategy Pattern
Define family of algorithms, encapsulate each one, and make them interchangeable.

### 2. Observer Pattern
Define one-to-many dependency so when one object changes state, all dependents are notified.

### 3. Command Pattern
Encapsulate request as object, allowing parameterization and queuing of requests.

### 4. Chain of Responsibility
Avoid coupling sender of request to receiver by giving multiple objects a chance to handle request.

### 5. Iterator Pattern
Provide way to access elements of aggregate object sequentially without exposing underlying representation.

### 6. Mediator Pattern
Define object that encapsulates how set of objects interact, promoting loose coupling.

### 7. Memento Pattern
Capture and externalize object's internal state for later restoration without violating encapsulation.

### 8. State Pattern
Allow object to alter behavior when internal state changes. Object appears to change its class.

### 9. Template Method Pattern
Define skeleton of algorithm, deferring some steps to subclasses.

### 10. Visitor Pattern
Represent operation to be performed on elements of object structure, letting new operations be defined without changing classes.

### 11. Interpreter Pattern
Define grammar for language and interpreter to interpret sentences in the language.

## Pattern Comparison

| Pattern | Purpose | Key Benefit |
|---------|---------|-------------|
| Strategy | Algorithm selection | Runtime algorithm switching |
| Observer | Event notification | Loose coupling between subjects/observers |
| Command | Encapsulate requests | Undo/redo, macro commands |
| Chain of Responsibility | Request handling chain | Dynamic handler assignment |
| State | State-dependent behavior | Cleaner than if/else chains |
| Memento | Save/restore state | Undo functionality |

## Learning Outcomes
- Implement event-driven architectures
- Design command systems with undo/redo
- Build state machines with type safety
- Create flexible algorithm selection systems

## Resources
- [Behavioral Patterns - Refactoring Guru](https://refactoring.guru/design-patterns/behavioral-patterns)
