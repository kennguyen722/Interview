import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Lesson 3.4 - Logging and Configuration
 *
 * Demonstrates structured logging, log levels, and environment-based
 * configuration -- simulated without external dependencies.
 *
 * In your project use:
 *   private static final Logger log = LoggerFactory.getLogger(MyClass.class);
 *   log.info("Order placed orderId={} amount={}", orderId, amount);
 *
 * KEY TERMS:
 *   log level    - severity rank: TRACE < DEBUG < INFO < WARN < ERROR.
 *   structured log - JSON or key=value format for machine parsing.
 *   MDC          - Mapped Diagnostic Context; thread-local context fields.
 *   appender     - log destination (console, file, remote).
 */
public class AnswerApp {

    enum Level { TRACE, DEBUG, INFO, WARN, ERROR }

    static class Logger {
        private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("HH:mm:ss.SSS").withZone(ZoneOffset.UTC);

        private final String name;
        private final Level  min;

        Logger(String name, Level min) { this.name = name; this.min = min; }

        void trace(String msg, Object... v) { log(Level.TRACE, msg, v); }
        void debug(String msg, Object... v) { log(Level.DEBUG, msg, v); }
        void info (String msg, Object... v) { log(Level.INFO,  msg, v); }
        void warn (String msg, Object... v) { log(Level.WARN,  msg, v); }
        void error(String msg, Object... v) { log(Level.ERROR, msg, v); }

        private void log(Level level, String msg, Object... args) {
            if (level.ordinal() < min.ordinal()) return;
            for (Object a : args) msg = msg.replaceFirst("\\{}", String.valueOf(a));
            System.out.printf("%s %-5s [%-18s] %s%n",
                FMT.format(Instant.now()), level, name, msg);
        }
    }

    static class AppConfig {
        private final Map<String, String> props;
        AppConfig(Map<String, String> p) { this.props = new HashMap<>(p); }
        String get(String k, String d) { return props.getOrDefault(k, d); }
        int getInt(String k, int d) {
            try { return Integer.parseInt(props.getOrDefault(k, String.valueOf(d))); }
            catch (NumberFormatException e) { return d; }
        }
    }

    static class OrderService {
        private static final Logger LOG = new Logger("OrderService", Level.DEBUG);
        private final AppConfig cfg;

        OrderService(AppConfig cfg) { this.cfg = cfg; }

        public void processOrder(String orderId, double amount) {
            LOG.info("Processing orderId={} amount={}", orderId, String.format("%.2f", amount));
            int retries = cfg.getInt("order.maxRetries", 3);
            LOG.debug("maxRetries={}", retries);

            if (amount <= 0) {
                LOG.warn("Invalid amount orderId={} amount={}", orderId, amount);
                return;
            }
            try {
                if (orderId.startsWith("ERR")) throw new RuntimeException("Gateway timeout");
                LOG.info("Order {} completed", orderId);
            } catch (RuntimeException e) {
                LOG.error("Order {} failed: {}", orderId, e.getMessage());
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 3.4: Logging and Configuration ===\n");

        for (String env : new String[]{"dev", "prod"}) {
            System.out.println("--- Environment: " + env + " ---");
            Map<String, String> cfg = Map.of(
                "app.env",          env,
                "order.maxRetries", env.equals("prod") ? "5" : "1"
            );
            OrderService svc = new OrderService(new AppConfig(cfg));
            svc.processOrder("ORD-001", 99.99);
            svc.processOrder("ORD-002", 0.0);
            svc.processOrder("ERR-003", 50.0);
            System.out.println();
        }
    }
}