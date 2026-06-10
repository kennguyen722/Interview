package com.interview.module2;

import java.time.Instant;
import java.util.Objects;

public record MetricEvent(
        String service,
        String metric,
        double value,
        Instant timestamp
) {
    public MetricEvent {
        Objects.requireNonNull(service, "service is required");
        Objects.requireNonNull(metric, "metric is required");
        Objects.requireNonNull(timestamp, "timestamp is required");
    }
}
