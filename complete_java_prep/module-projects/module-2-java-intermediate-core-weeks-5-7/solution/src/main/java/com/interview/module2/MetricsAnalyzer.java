package com.interview.module2;

import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MetricsAnalyzer {

    public Map<String, DoubleSummaryStatistics> summarizeByService(List<MetricEvent> events) {
        return events.stream().collect(Collectors.groupingBy(MetricEvent::service,
                Collectors.summarizingDouble(MetricEvent::value)));
    }

    public List<MetricEvent> filterByMetric(List<MetricEvent> events, String metricName) {
        return events.stream().filter(event -> event.metric().equals(metricName)).toList();
    }
}
