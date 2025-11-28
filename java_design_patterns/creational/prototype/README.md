# Prototype Pattern (Creational)

## Intent
Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.

## Motivation
Dynamic runtime configuration: when object creation is expensive or has numerous configuration permutations, cloning a prepared exemplar reduces complexity or avoids subclass explosion.

## Structure
- Prototype interface declares `copy()` / `clone()`.
- ConcretePrototype implements deep or shallow copy.
- Client requests new instances via cloning instead of constructor.

## Participants
- Prototype / ConcretePrototype
- Client (manages registry of prototypes if needed)

## Example
`Shape` implements `Prototype<Shape>` returning a new Shape with same intrinsic properties.

## Advantages
- Runtime flexibility (register/unregister prototypes).
- Avoids building complex state from scratch repeatedly.

## Disadvantages
- Deep copy complexity (graphs, cycles).
- Performance pitfalls if copies are large or unnecessary.

## When to Use
- Many similar objects differ slightly.
- Object creation cost is high (I/O, heavy computation).

## When to Avoid
- Constructors are simple and cheap.
- Deep cloning semantics unclear.

## Implementation Notes
- For deep copies use copy constructors or serialization strategies (caution: performance).
- Maintain a Prototype registry (map key → instance) for dynamic composition.

## Related Patterns
- Builder (construct complex object vs clone existing).
- Object Pool (reuse instead of clone new instance).
- Flyweight (share intrinsic state instead of duplicating it).
