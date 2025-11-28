# State Pattern (Behavioral)

## Intent
- Allow an object to alter its behavior when its internal state changes.

## Motivation
- `OrderContext` delegates to `OrderState` implementations (`CreatedState`, `PaidState`, `ShippedState`, `DeliveredState`).

## Structure
- Context: `OrderContext`
- State: `OrderState`
- Concrete States: `CreatedState`, `PaidState`, `ShippedState`, `DeliveredState`

## Usage
- Transition context state to change behavior without conditionals.

## Example
```java
OrderContext ctx = new OrderContext();
ctx.pay();
ctx.ship();
```

## Pros/Cons
- Pros: Eliminates complex conditionals; behavior localized per state.
- Cons: More classes and wiring.

## When to Use
- Objects with well-defined state-dependent behavior.
