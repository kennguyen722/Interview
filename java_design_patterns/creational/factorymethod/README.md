# Factory Method Pattern (Creational)

## Intent
Define an interface for creating an object, but let subclasses decide which concrete class to instantiate.

## Motivation
Direct instantiation scatters type selection logic. Factory Method centralizes and defers concrete choice enabling extension without modifying calling code.

## Structure
- Creator (abstract class) declares factory method `create(type)`.
- ConcreteCreator overrides to return appropriate ConcreteProduct.
- Product interface defines common behavior.

## Participants
- Product / ConcreteProduct
- Creator / ConcreteCreator (contains factory method)
- Client (uses Creator to obtain Product without knowing concrete type)

## Example
`DefaultDocumentParserFactory` returns `JsonDocumentParser`, `XmlDocumentParser`, or `CsvDocumentParser` based on a string key.

## Advantages
- Adheres to Open/Closed: add new products by subclassing/branch extension.
- Encapsulates object creation logic.

## Disadvantages
- Proliferation of subclasses if many product variants.
- Simple cases become verbose.

## When to Use
- Framework extension points.
- Pluggable parser/handler implementations.

## When to Avoid
- If construction logic is trivial; prefer direct constructor or Builder for complex assembly.

## Implementation Notes
- Use switch or map registry internally; can evolve into reflection/classpath scanning for plugin systems.

## Related Patterns
- Abstract Factory (families of factories).
- Strategy (swap behaviors at runtime vs instantiation phase).
- Prototype (cloning instead of manufacturing from scratch).
