# Adapter Pattern (Structural)

## Intent
- Enable incompatible interfaces to work together by converting one interface to another expected by clients.

## Motivation
- When integrating a legacy shipping carrier (`LegacyCarrierA`) with a modern `ShippingService` interface, the adapter (`CarrierAShippingAdapter`) allows reuse without modifying legacy code.

## Structure
- Target: `ShippingService`
- Adaptee: `LegacyCarrierA`
- Adapter: `CarrierAShippingAdapter`

## Usage
- Create an adapter with the legacy client and pass it where `ShippingService` is expected.

## Example
```java
ShippingService service = new CarrierAShippingAdapter(new LegacyCarrierA());
service.ship("PKG-42", "NYC");
```

## Pros/Cons
- Pros: Reuse existing code; isolates conversion logic.
- Cons: Can add indirection; multiple adapters may be needed.

## When to Use
- Integrating third-party or legacy APIs that mismatch your domain interface.
