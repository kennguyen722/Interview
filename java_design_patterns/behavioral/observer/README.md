# Observer Pattern (Behavioral)

## Intent
- Define a one-to-many dependency so when one object changes state, all its dependents are notified and updated automatically.

## Motivation
- `EventBus` notifies registered `EventListener`s when an `Event` such as `OrderCreatedEvent` is published.

## Structure
- Subject: `EventBus`
- Observers: `EventListener`
- Events: `Event`, `OrderCreatedEvent`

## Usage
- Register listeners, then publish events to notify them.

## Example
```java
EventBus bus = new EventBus();
bus.register(e -> System.out.println(e));
bus.publish(new OrderCreatedEvent("ORDER-1"));
```

## Pros/Cons
- Pros: Decouples subjects from observers; supports dynamic subscribers.
- Cons: Ordering and error handling can be complex.

## When to Use
- UI events, domain events, messaging between components.