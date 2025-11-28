package org.example.patterns.strategy;

public class PromotionalPricingStrategy implements PricingStrategy {
    @Override
    public double calculate(double basePrice) {
        return Math.max(0, basePrice - 20); // flat promo
    }
}
