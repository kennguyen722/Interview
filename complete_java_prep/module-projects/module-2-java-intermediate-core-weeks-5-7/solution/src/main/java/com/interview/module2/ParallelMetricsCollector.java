package com.interview.module2;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ParallelMetricsCollector {

    public List<MetricEvent> collect(List<String> services) {
        ExecutorService executor = Executors.newFixedThreadPool(Math.min(services.size(), 4));
        try {
            List<Callable<MetricEvent>> tasks = new ArrayList<>();
            for (String service : services) {
                tasks.add(() -> new MetricEvent(service, "latency_ms", Math.random() * 100, Instant.now()));
            }
            List<Future<MetricEvent>> futures = executor.invokeAll(tasks);
            List<MetricEvent> results = new ArrayList<>();
            for (Future<MetricEvent> future : futures) {
                results.add(future.get());
            }
            return results;
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to collect metrics", ex);
        } finally {
            executor.shutdown();
        }
    }
}
