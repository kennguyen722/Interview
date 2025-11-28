# Builder Pattern (Creational)

## Intent
Separate the construction of a complex object from its representation so the same construction process can create different representations.

## Motivation
Telescoping constructors and long parameter lists are hard to read and maintain. Builder provides fluent, incremental assembly and can enforce invariants before `build()` returns.

## Structure
- Builder interface / ConcreteBuilder hold intermediate state.
- Product is immutable or finalized object.
- (Optional) Director orchestrates steps if sequence matters.

## Participants
- Builder (fluent setters)
- Product (immutable aggregate)
- Director (optional ordering abstraction)

## Example
`OrderBuilder` accumulates items, discount, then computes totals when building an immutable `Order`.

## Advantages
- Readable object creation.
- Supports validation and invariant checks.
- Enables immutable products.

## Disadvantages
- Extra code and classes for simple objects.
- Potential misuse when only 1-2 params exist.

## When to Use
- Objects with many optional fields.
- Need for stepwise conditional construction.

## When to Avoid
- Simple POJOs with few parameters (prefer constructor or Java records).

## Implementation Notes
- Thread-safety: use builder per thread; do not share.
- Consider adding `toBuilder()` on Product for modifications.

## Related Patterns
- Prototype (clone then modify vs rebuild).
- Factory Method (encapsulation of creation without intermediate state).
- Fluent Interface style (chaining methods for readability).
