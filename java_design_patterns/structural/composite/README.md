# Composite Pattern (Structural)

## Intent
- Treat individual objects and compositions uniformly.

## Motivation
- Sum sizes across a tree of `Component` leafs and composites.

## Structure
- Component: `Component`
- Leaf: `Leaf`
- Composite: `Composite`

## Usage
- Build trees where clients can operate on components without caring if they are leafs or composites.

## Example
```java
Composite root = new Composite()
    .add(new Leaf(10))
    .add(new Composite().add(new Leaf(5)).add(new Leaf(7)));
int total = root.getSize();
```

## Pros/Cons
- Pros: Simplifies tree operations; uniform treatment.
- Cons: Can make constraints harder to enforce.

## When to Use
- Hierarchical structures like filesystems, UI components, or org charts.
