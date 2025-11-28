package org.example.patterns.behavioral.strategy;

import org.example.patterns.strategy.PricingContext;
import org.example.patterns.strategy.PromotionalPricingStrategy;
import org.example.patterns.strategy.SeasonalPricingStrategy;
import org.example.patterns.strategy.ServiceLoaderPricingContext;
import org.example.patterns.strategy.VolumePricingStrategy;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class StrategyAdvancedTest {
    @Test
    void contextSwitchesStrategiesAtRuntime() {
        PricingContext ctx = new PricingContext(new SeasonalPricingStrategy());
        assertEquals(90.0, ctx.calculate(100.0));
        ctx.setStrategy(new VolumePricingStrategy());
        assertEquals(85.0, ctx.calculate(100.0));
        ctx.setStrategy(new PromotionalPricingStrategy());
        assertEquals(80.0, ctx.calculate(100.0));
    }

    @Test
    void serviceLoaderFindsStrategiesByName() {
        ServiceLoaderPricingContext ctx = new ServiceLoaderPricingContext();
        assertEquals(90.0, ctx.calculate(100.0));
        ctx.use("VolumePricingStrategy");
        assertEquals(85.0, ctx.calculate(100.0));
        ctx.use("PromotionalPricingStrategy");
        assertEquals(80.0, ctx.calculate(100.0));
    }
}
