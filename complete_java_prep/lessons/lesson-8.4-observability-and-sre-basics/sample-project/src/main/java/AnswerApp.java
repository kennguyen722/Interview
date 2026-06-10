/**
 * Lesson 8.4 - Observability and SRE Basics
 *
 * KEY TERMS:
 *   observability - ability to understand system state from external outputs.
 *   metrics       - numeric time-series (request rate, error rate, latency).
 *   traces        - distributed request spans across services.
 *   SLI/SLO       - Service Level Indicator / Objective.
 *   error budget  - allowable unreliability before action is required.
 *   Prometheus    - pull-based metrics collection system.
 *   Grafana       - visualization and alerting dashboard tool.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 8.4: Observability and SRE Basics ===\n");

        System.out.println("--- Three Pillars of Observability ---");
        System.out.println("  METRICS (Prometheus + Grafana)");
        System.out.println("    - Spring Boot Actuator exposes /actuator/prometheus");
        System.out.println("    - Key metrics: http_server_requests_seconds, jvm_memory_used_bytes");
        System.out.println("    - Micrometer annotations: @Timed, @Counted");
        System.out.println("\n  LOGS (Logback + structured JSON + Loki/ELK)");
        System.out.println("    - Use traceId field in every log line for correlation");
        System.out.println("    - logback-spring.xml: JsonEncoder for structured output");
        System.out.println("\n  TRACES (OpenTelemetry + Jaeger/Zipkin)");
        System.out.println("    - Add micrometer-tracing-bridge-otel dependency");
        System.out.println("    - W3C TraceContext propagated via traceparent header");

        System.out.println("\n--- SLI / SLO example ---");
        System.out.println("  SLI: percentage of requests completing in < 200 ms");
        System.out.println("  SLO: 99.9% of requests complete in < 200 ms over 30 days");
        System.out.println("  Error budget: 0.1% = ~43.8 minutes/month of allowable degradation");
        System.out.println("  Burn rate: 1x = consuming budget at exactly the SLO rate");
        System.out.println("  Alert when burn rate > 14.4x (budget exhausted in < 1 hour)");

        System.out.println("\n--- PromQL alert examples ---");
        System.out.println("  # Error rate > 5%");
        System.out.println("  rate(http_requests_total{status=~\"5..\"}[5m])");
        System.out.println("    / rate(http_requests_total[5m]) > 0.05");
        System.out.println("\n  # p99 latency > 1 second");
        System.out.println("  histogram_quantile(0.99, rate(http_server_requests_seconds_bucket[5m])) > 1");

        System.out.println("\n--- Runbook template ---");
        System.out.println("  Alert: HighErrorRate");
        System.out.println("  1. Check Grafana for error spike timeline");
        System.out.println("  2. kubectl logs <pod> --tail=100 | grep ERROR");
        System.out.println("  3. Check recent deployments (kubectl rollout history)");
        System.out.println("  4. If new deploy: kubectl rollout undo deploy/backend");
        System.out.println("  5. Escalate if not resolved in 15 minutes");
    }
}