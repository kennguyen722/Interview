package com.interview.module2;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MetricsAnalyzerTest {

    @Test
    void shouldFilterMetricByName() {
        MetricsAnalyzer analyzer = new MetricsAnalyzer();
        List<MetricEvent> events = List.of(
                new MetricEvent("a", "latency_ms", 10, Instant.now()),
                new MetricEvent("a", "error_rate", 0.1, Instant.now())
        );

        assertEquals(1, analyzer.filterByMetric(events, "latency_ms").size());
    }
}
