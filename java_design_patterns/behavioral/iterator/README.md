# Iterator Pattern (Behavioral)

## Intent
- Provide a way to access elements of an aggregate object sequentially without exposing its underlying representation.

## Motivation
- `TreeIterator` walks a `TreeNode` structure.

## Structure
- Aggregate: `TreeNode`
- Iterator: `TreeIterator`

## Usage
- Obtain an iterator from the aggregate and iterate.

## Example
```java
TreeIterator it = new TreeIterator(root);
while (it.hasNext()) { System.out.println(it.next()); }
```

## Pros/Cons
- Pros: Encapsulates traversal; supports multiple iterator strategies.
- Cons: Extra objects; must maintain traversal state.

## When to Use
- Collections with custom traversal (trees, graphs).
