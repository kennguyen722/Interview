# Mediator Pattern (Behavioral)

## Intent
- Define an object that encapsulates how a set of objects interact.

## Motivation
- `ChatRoomMediator` coordinates communication between `User`s without them referencing each other directly.

## Structure
- Mediator: `ChatMediator`
- Concrete Mediator: `ChatRoomMediator`
- Colleagues: `User`

## Usage
- Colleagues communicate through the mediator; mediator decides routing.

## Example
```java
ChatMediator mediator = new ChatRoomMediator();
User alice = new User("Alice", mediator);
User bob = new User("Bob", mediator);
alice.send("Hi Bob!");
```

## Pros/Cons
- Pros: Reduces coupling; centralizes interaction logic.
- Cons: Mediator can become complex; single point of control.

## When to Use
- Complex interaction networks among objects.
