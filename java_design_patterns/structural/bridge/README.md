# Bridge Pattern (Structural)

## Intent
- Decouple an abstraction from its implementation so both can vary independently.

## Motivation
- `Shape` abstraction uses `Renderer` implementations (`VectorRenderer`, `RasterRenderer`) without tight coupling.

## Structure
- Abstraction: `Shape`
- Implementor: `Renderer`
- Concrete Implementors: `VectorRenderer`, `RasterRenderer`
- Refined Abstraction: `Circle`

## Usage
- Inject a `Renderer` into a `Shape` to choose implementation at runtime.

## Example
```java
Renderer renderer = new VectorRenderer();
Shape circle = new Circle(renderer, 10, 10, 5);
circle.draw();
```

## Pros/Cons
- Pros: Independent evolution of abstractions and implementations.
- Cons: More indirection and setup.

## When to Use
- When you need to support multiple implementations without subclass explosion.
