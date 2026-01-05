# Lesson 24: Structural Design Patterns - Deep Dive

## Objective
Master structural patterns that compose classes and objects: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, and Proxy patterns with practical TypeScript implementations.

## Topics Covered

### 1. Adapter Pattern
Convert interface of a class into another interface clients expect. Allows incompatible interfaces to work together.

### 2. Bridge Pattern
Decouple abstraction from implementation so both can vary independently.

### 3. Composite Pattern
Compose objects into tree structures to represent part-whole hierarchies. Treat individual objects and compositions uniformly.

### 4. Decorator Pattern
Attach additional responsibilities to object dynamically. Provides flexible alternative to subclassing.

### 5. Facade Pattern
Provide unified interface to set of interfaces in subsystem. Makes subsystem easier to use.

### 6. Flyweight Pattern
Use sharing to support large numbers of fine-grained objects efficiently.

### 7. Proxy Pattern
Provide surrogate or placeholder for another object to control access to it.

## Pattern Comparison

| Pattern | Purpose | Use Case |
|---------|---------|----------|
| Adapter | Interface compatibility | Integrate with legacy/third-party code |
| Bridge | Separate abstraction/implementation | Multiple dimensions of variation |
| Composite | Tree structures | Hierarchical data (files, UI components) |
| Decorator | Add responsibilities | Chain of transformations |
| Facade | Simplify interface | Hide complex subsystem |
| Flyweight | Memory optimization | Many similar objects |
| Proxy | Control access | Lazy loading, access control, caching |

## Learning Outcomes
- Apply structural patterns to organize codebases
- Choose appropriate pattern for each scenario
- Implement type-safe wrappers and decorators
- Design flexible component hierarchies

## Resources
- [Structural Patterns - Refactoring Guru](https://refactoring.guru/design-patterns/structural-patterns)
