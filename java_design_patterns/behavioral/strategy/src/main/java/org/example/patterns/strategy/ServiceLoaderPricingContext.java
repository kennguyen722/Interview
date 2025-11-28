package org.example.patterns.strategy;

import java.util.HashMap;
import java.util.Map;
import java.util.ServiceLoader;

/**
 * Pricing context that discovers strategies via ServiceLoader.
 * Allows selecting a strategy by simple key.
 */
public class ServiceLoaderPricingContext {
    private final Map<String, PricingStrategy> strategies = new HashMap<>();
    private PricingStrategy current;

    public ServiceLoaderPricingContext() {
        for (PricingStrategy s : ServiceLoader.load(PricingStrategy.class)) {
            strategies.put(s.getClass().getSimpleName().toLowerCase(), s);
        }
        current = strategies.getOrDefault("seasonalpricingstrategy", new SeasonalPricingStrategy());
    }

    public void use(String key) {
        PricingStrategy s = strategies.get(key.toLowerCase());
        if (s != null) current = s;
    }

    public double calculate(double basePrice) {
        return current.calculate(basePrice);
    }
}
