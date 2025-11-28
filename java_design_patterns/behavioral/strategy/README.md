# Strategy Pattern (Behavioral)

## Intent
- Define a family of algorithms, encapsulate each one, and make them interchangeable.

## Motivation
- Different pricing strategies (`SeasonalPricingStrategy`, `VolumePricingStrategy`, `PromotionalPricingStrategy`) are interchangeable via `PricingStrategy` and selected by `PricingContext`.

## Structure
- Strategy: `PricingStrategy`
- Concrete Strategies: `SeasonalPricingStrategy`, `VolumePricingStrategy`, `PromotionalPricingStrategy`
- Context: `PricingContext`

## Usage
- Configure the context with a strategy at runtime and delegate calculation.

## Example
```java
PricingContext ctx = new PricingContext(new SeasonalPricingStrategy());
double price = ctx.calculate(100.0);
```

## Pros/Cons
- Pros: Removes conditional logic; open for extension.
- Cons: More classes; strategy selection responsibility.

## When to Use
- When you have multiple ways to perform an operation and want to swap dynamically.