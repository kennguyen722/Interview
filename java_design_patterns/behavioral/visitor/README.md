# Visitor Pattern (Behavioral)

## Intent
- Represent an operation to be performed on the elements of an object structure, allowing new operations without changing the classes of the elements.

## Motivation
- `TaxVisitor` and `DiscountVisitor` add operations over `Product` and `Service` elements.

## Structure
- Element: `Element`
- Concrete Elements: `Product`, `Service`
- Visitor: `Visitor`
- Concrete Visitors: `TaxVisitor`, `DiscountVisitor`

## Usage
- Elements accept visitors; visitors implement operations per element type.

## Example
```java
Visitor tax = new TaxVisitor();
Product p = new Product("Book", 20);
p.accept(tax);
```

## Pros/Cons
- Pros: Add new operations easily; separates algorithms from data.
- Cons: Hard to add new element types; double dispatch complexity.

## When to Use
- Operations that traverse object structures and need to vary independently.
