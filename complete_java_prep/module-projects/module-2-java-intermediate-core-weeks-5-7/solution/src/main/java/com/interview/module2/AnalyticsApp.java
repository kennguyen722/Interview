package com.interview.module2;

import java.nio.file.Path;
import java.util.List;

public class AnalyticsApp {

    public static void main(String[] args) throws Exception {
        ParallelMetricsCollector collector = new ParallelMetricsCollector();
        List<MetricEvent> events = collector.collect(List.of("order-service", "payment-service", "gateway-service"));

        MetricsAnalyzer analyzer = new MetricsAnalyzer();
        System.out.println(analyzer.summarizeByService(events));

        new MetricsExporter().exportAsJsonLines(events, Path.of("target", "metrics", "events.jsonl"));
        System.out.println("Exported metrics to target/metrics/events.jsonl");
    }
}
