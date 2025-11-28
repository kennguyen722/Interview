package org.example.patterns.strategy;

/**
 * Strategy interface for pricing algorithms.
 * Implementations must be stateless or thread-safe to allow reuse.
 */
public interface PricingStrategy {
    /**
     * Compute final price based on a base price.
     * @param basePrice the original price
     * @return computed final price (non-negative)
     */
    double calculate(double basePrice);
}
