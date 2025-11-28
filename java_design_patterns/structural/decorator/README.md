# Decorator Pattern (Structural)

## Intent
- Add responsibilities to objects dynamically without changing their class.

## Motivation
- Extend `MessageProcessor` behavior (logging, validation, transformation) at runtime using wrappers.

## Structure
- Component: `MessageProcessor`
- Concrete Component: `BasicMessageProcessor`
- Decorators: `LoggingDecorator`, `ValidationDecorator`, `TransformDecorator`

## Usage
- Wrap a `MessageProcessor` in one or more decorators to compose behaviors.

## Example
```java
MessageProcessor base = new BasicMessageProcessor();
MessageProcessor proc = new LoggingDecorator(new ValidationDecorator(base));
String out = proc.process("Hello");
```

## Pros/Cons
- Pros: Flexible composition; adheres to open/closed principle.
- Cons: Many small objects; debugging call chains can be harder.

## When to Use
- When subclassing leads to explosion of variants; prefer runtime composition.
