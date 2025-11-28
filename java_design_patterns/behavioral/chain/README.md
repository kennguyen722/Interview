# Chain of Responsibility (Behavioral)

## Intent
- Avoid coupling the sender of a request to its receiver by giving multiple objects a chance to handle the request.

## Motivation
- `AuthHandler`, `ValidationHandler`, `TransformHandler` form a chain to process requests.

## Structure
- Handler: `Handler`
- Base: `AbstractHandler`
- Concrete Handlers: `AuthHandler`, `ValidationHandler`, `TransformHandler`

## Usage
- Link handlers and pass requests to the head; each decides to handle or pass on.

## Example
```java
Handler chain = new AuthHandler().linkWith(new ValidationHandler()).linkWith(new TransformHandler());
chain.handle(req);
```

## Pros/Cons
- Pros: Flexible processing; reduces coupling.
- Cons: Debugging order/cut-through can be tricky.

## When to Use
- Pipelines, middleware, authorization flows.
