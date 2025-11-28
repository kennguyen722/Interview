# Flyweight Pattern (Structural)

## Intent
- Share common intrinsic state across many fine-grained objects to save memory.

## Motivation
- Reusing glyph objects by symbol while varying extrinsic state (position).

## Structure
- Flyweight: `Glyph`
- Concrete Flyweight: `ConcreteGlyph`
- Flyweight Factory: `GlyphFactory`

## Usage
- Obtain shared instances from the factory and supply extrinsic state on use.

## Example
```java
GlyphFactory factory = new GlyphFactory();
Glyph g = factory.get('A');
g.draw(10, 20);
```

## Pros/Cons
- Pros: Reduced memory footprint; centralized caching.
- Cons: Complexity; separation of intrinsic/extrinsic state.

## When to Use
- Large numbers of similar objects with shared data (e.g., text rendering).
