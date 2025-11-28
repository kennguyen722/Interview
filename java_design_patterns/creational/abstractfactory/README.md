# Abstract Factory Pattern (Creational)

## Intent
Provide an interface for creating families of related or dependent objects without specifying their concrete classes.

## Motivation
Ensure consistent combinations (e.g., themed UI components) so clients do not mix incompatible variants.

## Structure
- AbstractFactory declares creation methods (e.g., `createButton`, `createMenu`).
- ConcreteFactories implement them returning family-specific concrete products.
- Product interfaces (Button, Menu) define roles.

## Participants
- AbstractFactory / ConcreteFactory
- AbstractProduct / ConcreteProduct
- Client (uses factory, unaware of concrete classes)

## Example
`DarkThemeFactory` and `LightThemeFactory` produce coordinated `Button` and `Menu` implementations.

## Advantages
- Enforces product consistency.
- Isolates concrete class proliferation.

## Disadvantages
- Difficult to add a new product type (must modify all factories).
- Many small classes.

## When to Use
- Need a suite of variants that must match (themes, platform portability layer).

## When to Avoid
- Products rarely change together; prefer Factory Method or DI bindings.

## Implementation Notes
- Combine with Builder for complex product construction inside factory methods.
- DI frameworks can effectively replace custom factories; configure beans per profile.

## Related Patterns
- Factory Method (used inside Abstract Factory implementations).
- Prototype (clone prototype per family variant).
- Bridge (decouple abstraction and implementation vs producing families).
