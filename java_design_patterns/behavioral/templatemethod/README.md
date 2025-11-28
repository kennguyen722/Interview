# Template Method Pattern (Behavioral)

## Intent
- Define the skeleton of an algorithm in an operation, deferring some steps to subclasses.

## Motivation
- `AbstractExporter` defines export flow; `JsonExporter` and `XmlExporter` implement steps.

## Structure
- Abstract Class: `AbstractExporter`
- Concrete Implementations: `JsonExporter`, `XmlExporter`

## Usage
- Call the template method to run the algorithm; override hooks in subclasses.

## Example
```java
AbstractExporter exporter = new JsonExporter();
exporter.export(data);
```

## Pros/Cons
- Pros: Code reuse; controls algorithm structure.
- Cons: Inheritance coupling; limited runtime variability.

## When to Use
- Stable algorithm structures with varying steps.
