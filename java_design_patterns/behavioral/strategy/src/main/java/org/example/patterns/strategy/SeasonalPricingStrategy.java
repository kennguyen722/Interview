package org.example.patterns.strategy;

public class SeasonalPricingStrategy implements PricingStrategy {
    @Override
    public double calculate(double basePrice) {
        return basePrice * 0.9; // 10% seasonal discount
    }
}
