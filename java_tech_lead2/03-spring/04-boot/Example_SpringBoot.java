/**
 * Spring Boot - Auto-Configuration and Production-Ready Features
 * 
 * Key Points:
 * - Auto-configuration and starter dependencies
 * - Application properties and profiles
 * - Actuator endpoints for monitoring
 * - Health checks and metrics
 * - Configuration properties binding
 * - Embedded server configuration
 */

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.lang.annotation.*;
import java.time.LocalDateTime;
import java.util.function.*;

// Spring Boot annotations
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface SpringBootApplication {
    Class<?>[] exclude() default {};
    String[] scanBasePackages() default {};
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface EnableAutoConfiguration {
    Class<?>[] exclude() default {};
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface ConfigurationProperties {
    String prefix() default "";
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface Profile {
    String[] value();
}

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@interface ConditionalOnProperty {
    String name();
    String havingValue() default "";
    boolean matchIfMissing() default false;
}

// Application properties
class ApplicationProperties {
    private final Map<String, String> properties = new HashMap<>();
    private String activeProfile = "default";
    
    public ApplicationProperties() {
        // Default properties
        setProperty("server.port", "8080");
        setProperty("spring.application.name", "spring-boot-demo");
        setProperty("management.endpoints.web.exposure.include", "health,info,metrics");
        setProperty("management.endpoint.health.show-details", "always");
        setProperty("logging.level.com.example", "INFO");
        
        // Database properties
        setProperty("spring.datasource.url", "jdbc:h2:mem:testdb");
        setProperty("spring.datasource.username", "sa");
        setProperty("spring.datasource.password", "");
        setProperty("spring.jpa.hibernate.ddl-auto", "create-drop");
        
        // Custom application properties
        setProperty("app.name", "Spring Boot Demo Application");
        setProperty("app.version", "1.0.0");
        setProperty("app.description", "Demo application showcasing Spring Boot features");
        setProperty("app.features.cache.enabled", "true");
        setProperty("app.features.security.enabled", "false");
        setProperty("app.features.monitoring.enabled", "true");
    }
    
    public void setProperty(String key, String value) {
        properties.put(key, value);
    }
    
    public String getProperty(String key) {
        return properties.get(key);
    }
    
    public String getProperty(String key, String defaultValue) {
        return properties.getOrDefault(key, defaultValue);
    }
    
    public void setActiveProfile(String profile) {
        this.activeProfile = profile;
        System.out.println("[SPRING BOOT] Active profile: " + profile);
    }
    
    public String getActiveProfile() {
        return activeProfile;
    }
    
    public Map<String, String> getAllProperties() {
        return new HashMap<>(properties);
    }
}

// Configuration properties classes
@ConfigurationProperties(prefix = "app")
class AppProperties {
    private String name;
    private String version;
    private String description;
    private Features features = new Features();
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Features getFeatures() { return features; }
    public void setFeatures(Features features) { this.features = features; }
    
    public static class Features {
        private Cache cache = new Cache();
        private Security security = new Security();
        private Monitoring monitoring = new Monitoring();
        
        public Cache getCache() { return cache; }
        public void setCache(Cache cache) { this.cache = cache; }
        
        public Security getSecurity() { return security; }
        public void setSecurity(Security security) { this.security = security; }
        
        public Monitoring getMonitoring() { return monitoring; }
        public void setMonitoring(Monitoring monitoring) { this.monitoring = monitoring; }
    }
    
    public static class Cache {
        private boolean enabled = true;
        
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }
    
    public static class Security {
        private boolean enabled = false;
        
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }
    
    public static class Monitoring {
        private boolean enabled = true;
        
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }
    
    @Override
    public String toString() {
        return String.format("AppProperties{name='%s', version='%s', description='%s'}", 
            name, version, description);
    }
}

@ConfigurationProperties(prefix = "server")
class ServerProperties {
    private int port = 8080;
    private String contextPath = "";
    private Ssl ssl = new Ssl();
    
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    
    public String getContextPath() { return contextPath; }
    public void setContextPath(String contextPath) { this.contextPath = contextPath; }
    
    public Ssl getSsl() { return ssl; }
    public void setSsl(Ssl ssl) { this.ssl = ssl; }
    
    public static class Ssl {
        private boolean enabled = false;
        private String keyStore;
        private String keyStorePassword;
        
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        
        public String getKeyStore() { return keyStore; }
        public void setKeyStore(String keyStore) { this.keyStore = keyStore; }
        
        public String getKeyStorePassword() { return keyStorePassword; }
        public void setKeyStorePassword(String keyStorePassword) { this.keyStorePassword = keyStorePassword; }
    }
}

// Health indicators
interface HealthIndicator {
    Health health();
}

class Health {
    public enum Status {
        UP, DOWN, OUT_OF_SERVICE, UNKNOWN
    }
    
    private final Status status;
    private final Map<String, Object> details;
    
    public Health(Status status) {
        this(status, new HashMap<>());
    }
    
    public Health(Status status, Map<String, Object> details) {
        this.status = status;
        this.details = new HashMap<>(details);
    }
    
    public Status getStatus() { return status; }
    public Map<String, Object> getDetails() { return details; }
    
    public static Health up() {
        return new Health(Status.UP);
    }
    
    public static Health down() {
        return new Health(Status.DOWN);
    }
    
    public static Health.Builder up() {
        return new Builder(Status.UP);
    }
    
    public static Health.Builder down() {
        return new Builder(Status.DOWN);
    }
    
    @Override
    public String toString() {
        return String.format("Health{status=%s, details=%s}", status, details);
    }
    
    public static class Builder {
        private final Status status;
        private final Map<String, Object> details = new HashMap<>();
        
        public Builder(Status status) {
            this.status = status;
        }
        
        public Builder withDetail(String key, Object value) {
            details.put(key, value);
            return this;
        }
        
        public Health build() {
            return new Health(status, details);
        }
    }
}

@Component
class DatabaseHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        try {
            // Simulate database health check
            boolean dbConnected = checkDatabaseConnection();
            
            if (dbConnected) {
                return Health.up()
                    .withDetail("database", "H2 in-memory")
                    .withDetail("status", "Connected")
                    .withDetail("connections", 5)
                    .build();
            } else {
                return Health.down()
                    .withDetail("database", "H2 in-memory")
                    .withDetail("status", "Disconnected")
                    .withDetail("error", "Connection timeout")
                    .build();
            }
        } catch (Exception e) {
            return Health.down()
                .withDetail("database", "H2 in-memory")
                .withDetail("error", e.getMessage())
                .build();
        }
    }
    
    private boolean checkDatabaseConnection() {
        // Simulate database connection check
        return Math.random() > 0.1; // 90% success rate
    }
}

@Component
class DiskSpaceHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        try {
            long totalSpace = 1000000000L; // 1GB
            long freeSpace = 500000000L;   // 500MB
            long usedSpace = totalSpace - freeSpace;
            double usagePercentage = (double) usedSpace / totalSpace * 100;
            
            Health.Builder builder = usagePercentage > 90 ? Health.down() : Health.up();
            
            return builder
                .withDetail("total", totalSpace)
                .withDetail("free", freeSpace)
                .withDetail("used", usedSpace)
                .withDetail("usage_percentage", String.format("%.1f%%", usagePercentage))
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
    }
}

// Metrics collection
class Metrics {
    private final Map<String, Counter> counters = new ConcurrentHashMap<>();
    private final Map<String, Gauge> gauges = new ConcurrentHashMap<>();
    private final Map<String, Timer> timers = new ConcurrentHashMap<>();
    
    public Counter counter(String name) {
        return counters.computeIfAbsent(name, Counter::new);
    }
    
    public Gauge gauge(String name, Supplier<Double> valueSupplier) {
        return gauges.computeIfAbsent(name, k -> new Gauge(k, valueSupplier));
    }
    
    public Timer timer(String name) {
        return timers.computeIfAbsent(name, Timer::new);
    }
    
    public Map<String, Object> getAllMetrics() {
        Map<String, Object> allMetrics = new HashMap<>();
        
        counters.forEach((name, counter) -> 
            allMetrics.put(name, Map.of("type", "counter", "value", counter.count())));
        
        gauges.forEach((name, gauge) -> 
            allMetrics.put(name, Map.of("type", "gauge", "value", gauge.value())));
        
        timers.forEach((name, timer) -> 
            allMetrics.put(name, Map.of("type", "timer", "count", timer.count(), "avg", timer.mean())));
        
        return allMetrics;
    }
    
    public static class Counter {
        private final String name;
        private volatile long count = 0;
        
        public Counter(String name) {
            this.name = name;
        }
        
        public void increment() {
            increment(1);
        }
        
        public void increment(long delta) {
            count += delta;
        }
        
        public long count() {
            return count;
        }
    }
    
    public static class Gauge {
        private final String name;
        private final Supplier<Double> valueSupplier;
        
        public Gauge(String name, Supplier<Double> valueSupplier) {
            this.name = name;
            this.valueSupplier = valueSupplier;
        }
        
        public double value() {
            return valueSupplier.get();
        }
    }
    
    public static class Timer {
        private final String name;
        private volatile long count = 0;
        private volatile long totalTime = 0;
        
        public Timer(String name) {
            this.name = name;
        }
        
        public void record(long duration) {
            count++;
            totalTime += duration;
        }
        
        public <T> T recordCallable(Supplier<T> callable) {
            long start = System.currentTimeMillis();
            try {
                return callable.get();
            } finally {
                long duration = System.currentTimeMillis() - start;
                record(duration);
            }
        }
        
        public long count() {
            return count;
        }
        
        public double mean() {
            return count > 0 ? (double) totalTime / count : 0.0;
        }
    }
}

// Actuator endpoints
interface ActuatorEndpoint {
    String getId();
    Object invoke();
}

@Component
class HealthEndpoint implements ActuatorEndpoint {
    private final List<HealthIndicator> healthIndicators;
    
    public HealthEndpoint(List<HealthIndicator> healthIndicators) {
        this.healthIndicators = healthIndicators;
    }
    
    @Override
    public String getId() {
        return "health";
    }
    
    @Override
    public Object invoke() {
        Map<String, Object> healthInfo = new HashMap<>();
        Health.Status overallStatus = Health.Status.UP;
        Map<String, Health> components = new HashMap<>();
        
        for (HealthIndicator indicator : healthIndicators) {
            try {
                Health health = indicator.health();
                String componentName = indicator.getClass().getSimpleName()
                    .replace("HealthIndicator", "").toLowerCase();
                components.put(componentName, health);
                
                if (health.getStatus() == Health.Status.DOWN) {
                    overallStatus = Health.Status.DOWN;
                }
            } catch (Exception e) {
                overallStatus = Health.Status.DOWN;
                components.put("unknown", Health.down().withDetail("error", e.getMessage()).build());
            }
        }
        
        healthInfo.put("status", overallStatus);
        healthInfo.put("components", components);
        
        return healthInfo;
    }
}

@Component
class InfoEndpoint implements ActuatorEndpoint {
    private final AppProperties appProperties;
    
    public InfoEndpoint(AppProperties appProperties) {
        this.appProperties = appProperties;
    }
    
    @Override
    public String getId() {
        return "info";
    }
    
    @Override
    public Object invoke() {
        Map<String, Object> info = new HashMap<>();
        
        // Application info
        Map<String, Object> app = new HashMap<>();
        app.put("name", appProperties.getName());
        app.put("version", appProperties.getVersion());
        app.put("description", appProperties.getDescription());
        info.put("app", app);
        
        // Build info
        Map<String, Object> build = new HashMap<>();
        build.put("time", LocalDateTime.now().toString());
        build.put("java", System.getProperty("java.version"));
        info.put("build", build);
        
        // Git info (simulated)
        Map<String, Object> git = new HashMap<>();
        git.put("branch", "main");
        git.put("commit", "abc123def456");
        info.put("git", git);
        
        return info;
    }
}

@Component
class MetricsEndpoint implements ActuatorEndpoint {
    private final Metrics metrics;
    
    public MetricsEndpoint(Metrics metrics) {
        this.metrics = metrics;
    }
    
    @Override
    public String getId() {
        return "metrics";
    }
    
    @Override
    public Object invoke() {
        Map<String, Object> metricsInfo = new HashMap<>();
        metricsInfo.put("names", new ArrayList<>(metrics.getAllMetrics().keySet()));
        metricsInfo.putAll(metrics.getAllMetrics());
        return metricsInfo;
    }
}

// Auto-configuration
@EnableAutoConfiguration
class WebAutoConfiguration {
    
    @ConditionalOnProperty(name = "server.port")
    @Configuration
    public ServerProperties serverProperties() {
        System.out.println("[AUTO-CONFIG] Configuring embedded server");
        return new ServerProperties();
    }
    
    @ConditionalOnProperty(name = "management.endpoints.web.exposure.include")
    @Configuration
    public List<ActuatorEndpoint> actuatorEndpoints() {
        System.out.println("[AUTO-CONFIG] Configuring actuator endpoints");
        return new ArrayList<>();
    }
}

// Application runner
interface ApplicationRunner {
    void run(ApplicationArguments args) throws Exception;
}

class ApplicationArguments {
    private final String[] args;
    
    public ApplicationArguments(String[] args) {
        this.args = args != null ? args.clone() : new String[0];
    }
    
    public String[] getSourceArgs() {
        return args.clone();
    }
    
    public Set<String> getOptionNames() {
        Set<String> optionNames = new HashSet<>();
        for (String arg : args) {
            if (arg.startsWith("--") && arg.contains("=")) {
                optionNames.add(arg.substring(2, arg.indexOf("=")));
            }
        }
        return optionNames;
    }
    
    public List<String> getOptionValues(String name) {
        List<String> values = new ArrayList<>();
        String prefix = "--" + name + "=";
        for (String arg : args) {
            if (arg.startsWith(prefix)) {
                values.add(arg.substring(prefix.length()));
            }
        }
        return values;
    }
}

// Main Spring Boot Application
@SpringBootApplication
public class Example_SpringBoot {
    private static final ApplicationProperties properties = new ApplicationProperties();
    private static final Metrics metrics = new Metrics();
    
    public static void main(String[] args) {
        System.out.println("=== Spring Boot Application ===\n");
        
        // 1. APPLICATION STARTUP
        System.out.println("1. Spring Boot Application Startup:");
        SpringBootContext context = startApplication(args);
        
        // 2. AUTO-CONFIGURATION
        System.out.println("\n2. Auto-Configuration:");
        demonstrateAutoConfiguration(context);
        
        // 3. CONFIGURATION PROPERTIES
        System.out.println("\n3. Configuration Properties:");
        demonstrateConfigurationProperties(context);
        
        // 4. ACTUATOR ENDPOINTS
        System.out.println("\n4. Actuator Endpoints:");
        demonstrateActuatorEndpoints(context);
        
        // 5. METRICS AND MONITORING
        System.out.println("\n5. Metrics and Monitoring:");
        demonstrateMetrics(context);
        
        // 6. PROFILES
        System.out.println("\n6. Spring Profiles:");
        demonstrateProfiles(context);
        
        System.out.println("\n=== Summary ===");
        printSpringBootSummary();
    }
    
    private static SpringBootContext startApplication(String[] args) {
        System.out.println("Starting Spring Boot application...");
        
        // Parse application arguments
        ApplicationArguments applicationArgs = new ApplicationArguments(args);
        
        // Initialize configuration properties
        AppProperties appProperties = bindConfigurationProperties();
        ServerProperties serverProperties = new ServerProperties();
        
        // Initialize health indicators
        List<HealthIndicator> healthIndicators = Arrays.asList(
            new DatabaseHealthIndicator(),
            new DiskSpaceHealthIndicator()
        );
        
        // Initialize actuator endpoints
        List<ActuatorEndpoint> endpoints = Arrays.asList(
            new HealthEndpoint(healthIndicators),
            new InfoEndpoint(appProperties),
            new MetricsEndpoint(metrics)
        );
        
        // Create application runner
        ApplicationRunner runner = (appArgs) -> {
            System.out.println("[APPLICATION] Custom initialization logic executed");
            
            // Initialize some metrics
            metrics.counter("app.requests.total");
            metrics.counter("app.errors.total");
            metrics.gauge("app.memory.usage", () -> Math.random() * 100);
            metrics.timer("app.request.duration");
        };
        
        SpringBootContext context = new SpringBootContext(
            appProperties, serverProperties, healthIndicators, endpoints, runner, applicationArgs);
        
        System.out.println("Spring Boot application started successfully");
        System.out.printf("  Application: %s%n", appProperties.getName());
        System.out.printf("  Version: %s%n", appProperties.getVersion());
        System.out.printf("  Port: %d%n", serverProperties.getPort());
        
        // Run application runner
        try {
            runner.run(applicationArgs);
        } catch (Exception e) {
            System.err.println("Application runner failed: " + e.getMessage());
        }
        
        return context;
    }
    
    private static AppProperties bindConfigurationProperties() {
        AppProperties appProperties = new AppProperties();
        
        // Bind properties from application.properties
        appProperties.setName(properties.getProperty("app.name"));
        appProperties.setVersion(properties.getProperty("app.version"));
        appProperties.setDescription(properties.getProperty("app.description"));
        
        // Bind nested properties
        appProperties.getFeatures().getCache().setEnabled(
            Boolean.parseBoolean(properties.getProperty("app.features.cache.enabled", "true")));
        appProperties.getFeatures().getSecurity().setEnabled(
            Boolean.parseBoolean(properties.getProperty("app.features.security.enabled", "false")));
        appProperties.getFeatures().getMonitoring().setEnabled(
            Boolean.parseBoolean(properties.getProperty("app.features.monitoring.enabled", "true")));
        
        return appProperties;
    }
    
    private static void demonstrateAutoConfiguration(SpringBootContext context) {
        System.out.println("--- Auto-Configuration Results ---");
        System.out.println("✓ Embedded Tomcat server configured");
        System.out.println("✓ Spring MVC auto-configured");
        System.out.println("✓ Jackson JSON processor configured");
        System.out.println("✓ Error page mapping configured");
        System.out.println("✓ Actuator endpoints configured");
        
        System.out.println("\nConditional configuration:");
        System.out.println("  - Database: " + (Math.random() > 0.5 ? "H2 configured" : "No database"));
        System.out.println("  - Security: " + (context.appProperties.getFeatures().getSecurity().isEnabled() 
            ? "Enabled" : "Disabled"));
        System.out.println("  - Caching: " + (context.appProperties.getFeatures().getCache().isEnabled() 
            ? "Enabled" : "Disabled"));
    }
    
    private static void demonstrateConfigurationProperties(SpringBootContext context) {
        System.out.println("--- Configuration Properties ---");
        System.out.println("Application Properties:");
        System.out.println("  " + context.appProperties);
        
        System.out.println("\nServer Properties:");
        System.out.printf("  Port: %d%n", context.serverProperties.getPort());
        System.out.printf("  Context Path: %s%n", context.serverProperties.getContextPath());
        System.out.printf("  SSL Enabled: %s%n", context.serverProperties.getSsl().isEnabled());
        
        System.out.println("\nFeature Flags:");
        System.out.printf("  Cache: %s%n", context.appProperties.getFeatures().getCache().isEnabled());
        System.out.printf("  Security: %s%n", context.appProperties.getFeatures().getSecurity().isEnabled());
        System.out.printf("  Monitoring: %s%n", context.appProperties.getFeatures().getMonitoring().isEnabled());
        
        System.out.println("\nAll application properties:");
        properties.getAllProperties().entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(entry -> System.out.printf("  %s = %s%n", entry.getKey(), entry.getValue()));
    }
    
    private static void demonstrateActuatorEndpoints(SpringBootContext context) {
        System.out.println("--- Actuator Endpoints ---");
        
        for (ActuatorEndpoint endpoint : context.endpoints) {
            System.out.printf("\n/%s endpoint:%n", endpoint.getId());
            Object response = endpoint.invoke();
            System.out.println("  Response: " + response);
        }
        
        System.out.println("\nAvailable endpoints:");
        System.out.println("  GET /actuator/health - Application health status");
        System.out.println("  GET /actuator/info - Application information");
        System.out.println("  GET /actuator/metrics - Application metrics");
        System.out.println("  GET /actuator/env - Environment properties");
        System.out.println("  GET /actuator/configprops - Configuration properties");
    }
    
    private static void demonstrateMetrics(SpringBootContext context) {
        System.out.println("--- Metrics and Monitoring ---");
        
        // Simulate some application activity
        metrics.counter("app.requests.total").increment(15);
        metrics.counter("app.errors.total").increment(2);
        
        // Record some timer measurements
        metrics.timer("app.request.duration").record(150);
        metrics.timer("app.request.duration").record(200);
        metrics.timer("app.request.duration").record(125);
        
        System.out.println("Current metrics:");
        Map<String, Object> allMetrics = metrics.getAllMetrics();
        allMetrics.forEach((name, metric) -> {
            System.out.printf("  %s: %s%n", name, metric);
        });
        
        System.out.println("\nCustom business metrics:");
        System.out.printf("  Success rate: %.1f%%%n", 
            (15.0 - 2.0) / 15.0 * 100);
        System.out.printf("  Average response time: %.1fms%n", 
            metrics.timer("app.request.duration").mean());
    }
    
    private static void demonstrateProfiles(SpringBootContext context) {
        System.out.println("--- Spring Profiles ---");
        
        // Default profile
        System.out.println("Current profile: " + properties.getActiveProfile());
        
        // Simulate different profiles
        String[] profiles = {"dev", "test", "prod"};
        
        for (String profile : profiles) {
            System.out.printf("\nProfile: %s%n", profile);
            
            switch (profile) {
                case "dev":
                    System.out.println("  - Debug logging enabled");
                    System.out.println("  - H2 console enabled");
                    System.out.println("  - Hot reload enabled");
                    break;
                case "test":
                    System.out.println("  - Test database configuration");
                    System.out.println("  - Mock external services");
                    System.out.println("  - Detailed test logging");
                    break;
                case "prod":
                    System.out.println("  - Production database");
                    System.out.println("  - Error logging only");
                    System.out.println("  - Security enabled");
                    System.out.println("  - Performance monitoring");
                    break;
            }
        }
        
        // Profile-specific properties
        System.out.println("\nProfile-specific configuration:");
        System.out.println("  application.properties (default)");
        System.out.println("  application-dev.properties");
        System.out.println("  application-prod.properties");
    }
    
    private static void printSpringBootSummary() {
        System.out.println("Spring Boot Key Features:");
        System.out.println("1. Auto-Configuration - Automatic bean configuration");
        System.out.println("2. Starter Dependencies - Pre-configured dependency sets");
        System.out.println("3. Embedded Servers - Tomcat, Jetty, Undertow");
        System.out.println("4. Production Features - Actuator, metrics, health checks");
        System.out.println("5. Configuration Properties - Type-safe configuration");
        System.out.println("6. Profile Support - Environment-specific configuration");
        System.out.println("7. DevTools - Hot reload and development utilities");
        System.out.println("8. Testing Support - Comprehensive testing framework");
        
        System.out.println("\nBest Practices:");
        System.out.println("- Use starter dependencies");
        System.out.println("- Leverage auto-configuration");
        System.out.println("- Implement proper configuration properties");
        System.out.println("- Use profiles for different environments");
        System.out.println("- Enable actuator endpoints for monitoring");
        System.out.println("- Implement custom health indicators");
        System.out.println("- Use proper logging configuration");
        System.out.println("- Follow 12-factor app principles");
    }
    
    private static class SpringBootContext {
        final AppProperties appProperties;
        final ServerProperties serverProperties;
        final List<HealthIndicator> healthIndicators;
        final List<ActuatorEndpoint> endpoints;
        final ApplicationRunner applicationRunner;
        final ApplicationArguments applicationArguments;
        
        SpringBootContext(AppProperties appProperties, ServerProperties serverProperties,
                         List<HealthIndicator> healthIndicators, List<ActuatorEndpoint> endpoints,
                         ApplicationRunner applicationRunner, ApplicationArguments applicationArguments) {
            this.appProperties = appProperties;
            this.serverProperties = serverProperties;
            this.healthIndicators = healthIndicators;
            this.endpoints = endpoints;
            this.applicationRunner = applicationRunner;
            this.applicationArguments = applicationArguments;
        }
    }
}