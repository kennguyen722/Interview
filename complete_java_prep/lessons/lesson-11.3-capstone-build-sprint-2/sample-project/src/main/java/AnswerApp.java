/**
 * Lesson 11.3 - Capstone Build Sprint 2 (Frontend + Integration + Observability)
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 11.3: Capstone Sprint 2 - Frontend + Observability ===\n");

        System.out.println("--- Sprint 2 acceptance criteria ---");
        String[] criteria = {
            "React SPA: login page, book list, book detail (React Router)",
            "Axios API client with request interceptor adding JWT header",
            "On 401: refresh token then auto-retry the failed request",
            "Micrometer + Prometheus: /actuator/prometheus endpoint",
            "Grafana dashboard showing: RPS, error rate, p99 latency, JVM heap",
            "Structured JSON logs with traceId field from OpenTelemetry",
            "Testcontainers integration test: full happy-path E2E"
        };
        for (String c : criteria) System.out.println("  [ ] " + c);

        System.out.println("\n--- Observability stack setup ---");
        System.out.println("  # pom.xml dependencies");
        System.out.println("  spring-boot-starter-actuator");
        System.out.println("  micrometer-registry-prometheus");
        System.out.println("  micrometer-tracing-bridge-otel");
        System.out.println("  opentelemetry-exporter-otlp");

        System.out.println("\n  # application.yml");
        System.out.println("  management.endpoints.web.exposure.include: health,prometheus,info");
        System.out.println("  management.metrics.export.prometheus.enabled: true");
        System.out.println("  logging.pattern.level: '%5p [${spring.application.name},%X{traceId},%X{spanId}]'");

        System.out.println("\n--- Testcontainers integration test pattern ---");
        System.out.println("  @SpringBootTest(webEnvironment = RANDOM_PORT)");
        System.out.println("  @Testcontainers");
        System.out.println("  class BookApiIT {");
        System.out.println("    @Container");
        System.out.println("    static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>(\"postgres:16\");");
        System.out.println("\n    @Test");
        System.out.println("    void createBook_returnsCreated() {");
        System.out.println("      // Arrange: get JWT, build request");
        System.out.println("      // Act: POST /api/books");
        System.out.println("      // Assert: 201 Created + book in DB");
        System.out.println("    }");
        System.out.println("  }");
    }
}