package org.example.patterns.strategy;

public class PricingContext {
    private PricingStrategy strategy;

    public PricingContext(PricingStrategy strategy) { this.strategy = strategy; }

    public void setStrategy(PricingStrategy strategy) { this.strategy = strategy; }

    public double calculate(double basePrice) { return strategy.calculate(basePrice); }
}
