package org.example.patterns.strategy;

public class VolumePricingStrategy implements PricingStrategy {
    @Override
    public double calculate(double basePrice) {
        return basePrice >= 100 ? basePrice * 0.85 : basePrice; // 15% off for volume
    }
}
