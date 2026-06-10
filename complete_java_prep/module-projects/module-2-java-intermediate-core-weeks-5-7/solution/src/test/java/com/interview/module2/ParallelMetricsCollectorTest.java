package com.interview.module2;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ParallelMetricsCollectorTest {

    @Test
    void shouldCollectForAllServices() {
        ParallelMetricsCollector collector = new ParallelMetricsCollector();
        List<MetricEvent> events = collector.collect(List.of("one", "two", "three"));

        assertEquals(3, events.size());
    }
}
