param([string]$Root = "d:\GitHub_Src\Interview\complete_java_prep")

$ErrorActionPreference = "Stop"
$lessonsRoot = Join-Path $Root "lessons"

function Sanitize([string]$t) { (($t.ToLower() -replace "[^a-z0-9]+","-").Trim("-")) }

# Build slug map from PLAN.md
$slugMap = @{}
foreach ($line in (Get-Content (Join-Path $Root "PLAN.md"))) {
    if ($line -match "^### Lesson\s+([0-9]+\.[0-9]+)\s+-\s+(.+)$") {
        $slugMap[$matches[1]] = "lesson-$($matches[1])-$(Sanitize $matches[2].Trim())"
    }
}

# Write using explicit UTF-8 to avoid PowerShell default-encoding garbling
function Write-Java([string]$id, [string]$java) {
    if (-not $slugMap.ContainsKey($id)) { Write-Host "  SKIP (no slug): $id"; return }
    $dir = Join-Path $lessonsRoot "$($slugMap[$id])\sample-project\src\main\java"
    if (-not (Test-Path $dir)) { Write-Host "  SKIP (no dir): $id"; return }
    $path = Join-Path $dir "AnswerApp.java"
    [System.IO.File]::WriteAllText($path, $java, [System.Text.Encoding]::UTF8)
    Write-Host "  OK $id"
}

# ============================================================
# LESSON 3.1 - Clean Code and Refactoring
# ============================================================
Write-Java "3.1" @'
/**
 * Lesson 3.1 - Clean Code and Refactoring
 *
 * WHAT THIS DEMONSTRATES:
 *   Side-by-side "before" and "after" code to make naming, method length,
 *   single responsibility, and duplication removal tangible.
 *
 * KEY TERMS:
 *   code smell     - a pattern that hints at a deeper design problem.
 *   refactoring    - restructuring code without changing behaviour.
 *   SRP            - Single Responsibility Principle: one reason to change.
 *   DRY            - Don't Repeat Yourself: eliminate duplication.
 *   cohesion       - how closely related the responsibilities of a module are.
 */
public class AnswerApp {

    // ================================================================
    // BEFORE: "bad" version - all in one method, poor names, duplication
    // ================================================================
    static class OrderProcessorBefore {
        // BAD: method does three unrelated things; name is vague
        public void process(String o, int q, double p) {
            // validate
            if (o == null || o.isEmpty()) {
                System.out.println("bad order");
                return;
            }
            if (q <= 0) {
                System.out.println("bad qty");
                return;
            }
            if (p <= 0) {
                System.out.println("bad price");
                return;
            }
            // calculate
            double total = q * p;
            double tax   = total * 0.08;
            double final_ = total + tax;
            // print - duplicated format string
            System.out.println("Order: " + o);
            System.out.println("Qty: " + q);
            System.out.println("Price: " + p);
            System.out.println("Total: " + final_);
            System.out.println("Order: " + o);  // BUG: printed twice by mistake
        }
    }

    // ================================================================
    // AFTER: refactored - clear names, focused methods, no duplication
    // ================================================================
    static class OrderProcessorAfter {

        // Each method has exactly ONE job (SRP)
        // Names clearly describe what they do

        /**
         * Entry point: orchestrates validation, calculation, and display.
         *
         * @param orderId  the unique order identifier
         * @param quantity how many units ordered
         * @param unitPrice cost per unit in dollars
         */
        public void processOrder(String orderId, int quantity, double unitPrice) {
            // Guard clause: validate early, return on failure
            if (!isValidOrder(orderId, quantity, unitPrice)) return;

            OrderSummary summary = calculateSummary(quantity, unitPrice);
            printReceipt(orderId, quantity, unitPrice, summary);
        }

        /** Returns true only if all inputs satisfy business constraints. */
        private boolean isValidOrder(String orderId, int quantity, double unitPrice) {
            if (orderId == null || orderId.isBlank()) {
                System.out.println("Validation failed: orderId must not be blank.");
                return false;
            }
            if (quantity <= 0) {
                System.out.println("Validation failed: quantity must be positive.");
                return false;
            }
            if (unitPrice <= 0) {
                System.out.println("Validation failed: unit price must be positive.");
                return false;
            }
            return true;
        }

        /**
         * Pure calculation: no I/O, no side effects.
         * Easy to unit-test in isolation.
         */
        private OrderSummary calculateSummary(int quantity, double unitPrice) {
            double subtotal = quantity * unitPrice;
            double tax      = subtotal * 0.08;
            double total    = subtotal + tax;
            return new OrderSummary(subtotal, tax, total);
        }

        /** Single place that knows how to print a receipt. */
        private void printReceipt(String orderId, int qty, double price, OrderSummary s) {
            System.out.println("=== Order Receipt ===");
            System.out.printf("  Order ID  : %s%n",    orderId);
            System.out.printf("  Quantity  : %d%n",    qty);
            System.out.printf("  Unit price: $%.2f%n", price);
            System.out.printf("  Subtotal  : $%.2f%n", s.subtotal());
            System.out.printf("  Tax (8%%) : $%.2f%n", s.tax());
            System.out.printf("  TOTAL     : $%.2f%n", s.total());
        }

        record OrderSummary(double subtotal, double tax, double total) {}
    }

    // ================================================================
    // Entry point
    // ================================================================
    public static void main(String[] args) {
        System.out.println("=== Lesson 3.1: Clean Code and Refactoring ===\n");

        System.out.println("--- BEFORE (code smells present) ---");
        new OrderProcessorBefore().process("ORD-001", 3, 49.99);

        System.out.println("\n--- AFTER (refactored) ---");
        OrderProcessorAfter after = new OrderProcessorAfter();
        after.processOrder("ORD-001", 3, 49.99);

        System.out.println("\n--- Edge cases (validation) ---");
        after.processOrder("",        3, 49.99);   // blank orderId
        after.processOrder("ORD-002", 0, 49.99);   // zero quantity
        after.processOrder("ORD-003", 3, -5.00);   // negative price
    }
}
'@

# ============================================================
# LESSON 3.2 - Unit Testing with JUnit 5
# ============================================================
Write-Java "3.2" @'
import java.util.List;
import java.util.ArrayList;

/**
 * Lesson 3.2 - Unit Testing with JUnit 5
 *
 * WHAT THIS DEMONSTRATES:
 *   The anatomy of a test (Arrange-Act-Assert), testing edge cases,
 *   and what a full JUnit 5 test class looks like -- demonstrated here
 *   as runnable Java without requiring JUnit on the classpath.
 *
 *   In your real project add JUnit 5 via Maven:
 *     <dependency>
 *       <groupId>org.junit.jupiter</groupId>
 *       <artifactId>junit-jupiter</artifactId>
 *       <version>5.10.0</version>
 *       <scope>test</scope>
 *     </dependency>
 *
 * KEY TERMS:
 *   Arrange-Act-Assert (AAA) - structure every test in three clear phases.
 *   @Test                    - JUnit annotation marking a test method.
 *   @BeforeEach              - runs before every test method (fixture setup).
 *   assertion                - a check that throws if the condition is false.
 *   test coverage            - percentage of production lines exercised by tests.
 */
public class AnswerApp {

    // ---- Production class under test ----------------------------------------

    static class ShoppingCart {
        private final List<Double> itemPrices = new ArrayList<>();

        public void addItem(double price) {
            if (price < 0) throw new IllegalArgumentException("Price cannot be negative");
            itemPrices.add(price);
        }

        public int  itemCount()  { return itemPrices.size(); }
        public void clear()      { itemPrices.clear(); }

        /** Returns subtotal with 10% discount when 5+ items. */
        public double total() {
            double subtotal = itemPrices.stream().mapToDouble(Double::doubleValue).sum();
            return itemPrices.size() >= 5 ? subtotal * 0.90 : subtotal;
        }
    }

    // ---- Minimal test harness (mirrors what JUnit 5 provides) ---------------

    static int passed = 0;
    static int failed = 0;

    /** Equivalent to @Test in JUnit 5. */
    static void test(String name, Runnable body) {
        try {
            body.run();
            System.out.printf("  PASS  %s%n", name);
            passed++;
        } catch (AssertionError | Exception e) {
            System.out.printf("  FAIL  %s  -- %s%n", name, e.getMessage());
            failed++;
        }
    }

    static void assertEquals(double expected, double actual, double delta) {
        if (Math.abs(expected - actual) > delta)
            throw new AssertionError(
                String.format("Expected %.4f but was %.4f", expected, actual));
    }
    static void assertEquals(int expected, int actual) {
        if (expected != actual)
            throw new AssertionError("Expected " + expected + " but was " + actual);
    }
    static void assertTrue(boolean condition, String msg) {
        if (!condition) throw new AssertionError(msg);
    }

    // ---- Test cases (what a JUnit 5 test class looks like) ------------------

    static void runTests() {
        System.out.println("--- ShoppingCart Tests ---");

        test("emptyCart_totalIsZero", () -> {
            // Arrange
            ShoppingCart cart = new ShoppingCart();
            // Act + Assert (AAA)
            assertEquals(0.0, cart.total(), 0.001);
        });

        test("oneItem_totalEqualsItemPrice", () -> {
            ShoppingCart cart = new ShoppingCart();
            cart.addItem(29.99);
            assertEquals(29.99, cart.total(), 0.001);
        });

        test("threeItems_noDiscount", () -> {
            ShoppingCart cart = new ShoppingCart();
            cart.addItem(10.00);
            cart.addItem(20.00);
            cart.addItem(30.00);
            // 3 items < 5, so no discount
            assertEquals(60.00, cart.total(), 0.001);
        });

        test("fiveItems_tenPercentDiscount", () -> {
            ShoppingCart cart = new ShoppingCart();
            for (int i = 0; i < 5; i++) cart.addItem(10.00);
            // 50.00 * 0.90 = 45.00
            assertEquals(45.00, cart.total(), 0.001);
        });

        test("addItem_negativePrice_throwsException", () -> {
            ShoppingCart cart = new ShoppingCart();
            try {
                cart.addItem(-5.00);
                throw new AssertionError("Expected IllegalArgumentException");
            } catch (IllegalArgumentException e) {
                assertTrue(e.getMessage().contains("negative"), "Message should mention 'negative'");
            }
        });

        test("clear_resetsCart", () -> {
            ShoppingCart cart = new ShoppingCart();
            cart.addItem(10.00);
            cart.addItem(20.00);
            cart.clear();
            assertEquals(0,   cart.itemCount());
            assertEquals(0.0, cart.total(), 0.001);
        });

        test("boundaryCase_exactlyFiveItems", () -> {
            ShoppingCart cart = new ShoppingCart();
            for (int i = 0; i < 5; i++) cart.addItem(20.00);
            // 100.00 * 0.90 = 90.00 (discount kicks in AT 5)
            assertEquals(90.00, cart.total(), 0.001);
        });
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 3.2: Unit Testing with JUnit 5 ===\n");
        System.out.println("(Running tests with embedded harness; same patterns apply in JUnit 5)\n");

        runTests();

        System.out.printf("%n%d passed, %d failed%n", passed, failed);
        if (failed == 0) System.out.println("All tests GREEN.");
    }
}
'@

# ============================================================
# LESSON 3.3 - Mocking and Test Design
# ============================================================
Write-Java "3.3" @'
import java.util.*;

/**
 * Lesson 3.3 - Mocking and Test Design
 *
 * WHAT THIS DEMONSTRATES:
 *   Using interfaces to create hand-written fakes (manual mocks),
 *   verifying behaviour rather than state, and testing service boundaries.
 *
 *   In your real project use Mockito:
 *     UserRepository mockRepo = Mockito.mock(UserRepository.class);
 *     Mockito.when(mockRepo.findById(1)).thenReturn(Optional.of(user));
 *
 * KEY TERMS:
 *   mock      - a test double that records and verifies interactions.
 *   stub      - a test double that returns pre-programmed responses.
 *   fake      - a lightweight implementation used only in tests.
 *   spy       - wraps a real object, overriding selected methods.
 *   verify    - assert that a collaborator was called in an expected way.
 */
public class AnswerApp {

    // ---- Interfaces (the service boundaries we can mock) --------------------

    interface UserRepository {
        Optional<User> findById(int id);
        void save(User user);
    }

    interface EmailService {
        void sendWelcome(String email);
    }

    record User(int id, String name, String email) {}

    // ---- Production service -------------------------------------------------

    static class UserRegistrationService {
        private final UserRepository repo;
        private final EmailService    email;

        UserRegistrationService(UserRepository repo, EmailService email) {
            // Dependencies are injected - makes them swappable with mocks in tests
            this.repo  = repo;
            this.email = email;
        }

        public boolean register(String name, String emailAddr) {
            if (name == null || name.isBlank())  throw new IllegalArgumentException("name blank");
            if (emailAddr == null || !emailAddr.contains("@"))
                throw new IllegalArgumentException("invalid email");

            User user = new User((int)(Math.random() * 10000), name, emailAddr);
            repo.save(user);
            email.sendWelcome(emailAddr);
            return true;
        }
    }

    // ---- Fake (manual mock) implementations ---------------------------------

    /** Fake repository: stores in memory, tracks calls. */
    static class FakeUserRepository implements UserRepository {
        final List<User> saved = new ArrayList<>();
        int findByIdCallCount  = 0;

        @Override public Optional<User> findById(int id) {
            findByIdCallCount++;
            return saved.stream().filter(u -> u.id() == id).findFirst();
        }
        @Override public void save(User user) { saved.add(user); }
    }

    /** Fake email service: records sent emails for assertion. */
    static class FakeEmailService implements EmailService {
        final List<String> sentTo = new ArrayList<>();
        @Override public void sendWelcome(String email) { sentTo.add(email); }
    }

    // ---- Test harness -------------------------------------------------------

    static int pass = 0, fail = 0;
    static void test(String name, Runnable r) {
        try { r.run(); System.out.printf("  PASS  %s%n", name); pass++; }
        catch (Throwable t) { System.out.printf("  FAIL  %s -- %s%n", name, t.getMessage()); fail++; }
    }
    static void assertEqual(Object e, Object a) {
        if (!Objects.equals(e, a)) throw new AssertionError("Expected " + e + " got " + a);
    }
    static void assertTrue(boolean c, String m) { if (!c) throw new AssertionError(m); }

    // ---- Tests using the fakes ----------------------------------------------

    static void runTests() {
        System.out.println("--- UserRegistrationService Tests ---");

        test("register_validInput_savesUser", () -> {
            FakeUserRepository repo  = new FakeUserRepository();
            FakeEmailService   email = new FakeEmailService();
            UserRegistrationService svc = new UserRegistrationService(repo, email);

            // Act
            svc.register("Alice", "alice@example.com");

            // Assert state in repo (BEHAVIOUR: was save() called with the right data?)
            assertEqual(1, repo.saved.size());
            assertEqual("Alice", repo.saved.get(0).name());
        });

        test("register_validInput_sendsWelcomeEmail", () -> {
            FakeUserRepository repo  = new FakeUserRepository();
            FakeEmailService   email = new FakeEmailService();
            UserRegistrationService svc = new UserRegistrationService(repo, email);

            svc.register("Bob", "bob@example.com");

            // Verify interaction: did we call sendWelcome with the right address?
            assertEqual(1,                   email.sentTo.size());
            assertEqual("bob@example.com",   email.sentTo.get(0));
        });

        test("register_blankName_throwsException", () -> {
            UserRegistrationService svc = new UserRegistrationService(
                new FakeUserRepository(), new FakeEmailService());
            try {
                svc.register("", "x@x.com");
                throw new AssertionError("Expected IllegalArgumentException");
            } catch (IllegalArgumentException e) {
                assertTrue(e.getMessage().contains("blank"), "message should mention blank");
            }
        });

        test("register_invalidEmail_throwsException", () -> {
            UserRegistrationService svc = new UserRegistrationService(
                new FakeUserRepository(), new FakeEmailService());
            try {
                svc.register("Carol", "not-an-email");
                throw new AssertionError("Expected IllegalArgumentException");
            } catch (IllegalArgumentException e) {
                assertTrue(e.getMessage().contains("email"), "message should mention email");
            }
        });
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 3.3: Mocking and Test Design ===\n");
        runTests();
        System.out.printf("%n%d passed, %d failed%n", pass, fail);
    }
}
'@

# ============================================================
# LESSON 3.4 - Logging and Configuration
# ============================================================
Write-Java "3.4" @'
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Lesson 3.4 - Logging and Configuration
 *
 * WHAT THIS DEMONSTRATES:
 *   Structured log output, log levels, environment-based configuration,
 *   and the SLF4J/Logback API pattern (simulated here without a dependency).
 *
 *   In your real project add:
 *     <dependency>
 *       <groupId>ch.qos.logback</groupId>
 *       <artifactId>logback-classic</artifactId>
 *       <version>1.4.14</version>
 *     </dependency>
 *   Then: private static final Logger log = LoggerFactory.getLogger(MyClass.class);
 *
 * KEY TERMS:
 *   log level    - severity rank: TRACE < DEBUG < INFO < WARN < ERROR.
 *   structured log - log entries as key=value or JSON for machine parsing.
 *   SLF4J        - Simple Logging Facade for Java; decouples code from impl.
 *   MDC          - Mapped Diagnostic Context: thread-local key/value pairs.
 *   appender     - a log destination (console, file, remote system).
 */
public class AnswerApp {

    // ---- Simulated logger (mirrors SLF4J API) --------------------------------

    enum Level { TRACE, DEBUG, INFO, WARN, ERROR }

    static class Logger {
        private final String name;
        private final Level  minLevel;

        private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("HH:mm:ss.SSS").withZone(ZoneOffset.UTC);

        Logger(String name, Level minLevel) {
            this.name     = name;
            this.minLevel = minLevel;
        }

        void trace(String msg, Object... args) { log(Level.TRACE, msg, args); }
        void debug(String msg, Object... args) { log(Level.DEBUG, msg, args); }
        void info (String msg, Object... args) { log(Level.INFO,  msg, args); }
        void warn (String msg, Object... args) { log(Level.WARN,  msg, args); }
        void error(String msg, Object... args) { log(Level.ERROR, msg, args); }

        private void log(Level level, String msg, Object... args) {
            if (level.ordinal() < minLevel.ordinal()) return;  // filter by level

            // Replace {} placeholders (SLF4J style)
            for (Object arg : args) msg = msg.replaceFirst("\\{}", String.valueOf(arg));

            // Structured format: timestamp level logger message
            System.out.printf("%s %-5s [%-20s] %s%n",
                FMT.format(Instant.now()), level, name, msg);
        }
    }

    // ---- Environment-based configuration ------------------------------------

    static class AppConfig {
        private final Map<String, String> props;

        /** Loads properties; falls back to defaults when key is missing. */
        AppConfig(Map<String, String> env) {
            this.props = new HashMap<>(env);
        }

        String get(String key, String defaultValue) {
            return props.getOrDefault(key, defaultValue);
        }
        int getInt(String key, int defaultValue) {
            try { return Integer.parseInt(props.getOrDefault(key, String.valueOf(defaultValue))); }
            catch (NumberFormatException e) { return defaultValue; }
        }
    }

    // ---- Service that uses the logger and config ----------------------------

    static class OrderService {
        private static final Logger log = new Logger("OrderService", Level.DEBUG);

        private final AppConfig config;

        OrderService(AppConfig config) { this.config = config; }

        public void processOrder(String orderId, double amount) {
            log.info("Processing order orderId={} amount={}", orderId, String.format("%.2f", amount));

            int maxRetries = config.getInt("order.maxRetries", 3);
            log.debug("Max retries configured as {}", maxRetries);

            if (amount <= 0) {
                log.warn("Invalid amount for orderId={}: amount={}", orderId, amount);
                return;
            }

            try {
                // Simulate processing
                if (orderId.startsWith("ERR")) throw new RuntimeException("Simulated payment error");

                log.info("Order {} completed successfully", orderId);

            } catch (RuntimeException e) {
                // Log exception with stack info
                log.error("Order {} failed: {}", orderId, e.getMessage());
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 3.4: Logging and Configuration ===\n");

        // Simulate different environments
        for (String env : new String[]{"dev", "prod"}) {
            System.out.println("--- Environment: " + env + " ---");

            Map<String, String> cfg = new HashMap<>();
            cfg.put("app.environment",  env);
            cfg.put("order.maxRetries", env.equals("prod") ? "5" : "1");

            OrderService svc = new OrderService(new AppConfig(cfg));
            svc.processOrder("ORD-001", 99.99);
            svc.processOrder("ORD-002", 0.00);     // warn path
            svc.processOrder("ERR-999", 50.00);    // error path
            System.out.println();
        }
    }
}
'@

# ============================================================
# LESSON 3.5 - Intro to HTTP and REST
# ============================================================
Write-Java "3.5" @'
import java.util.*;

/**
 * Lesson 3.5 - Intro to HTTP and REST
 *
 * WHAT THIS DEMONSTRATES:
 *   HTTP methods, status codes, headers, REST resource modeling,
 *   and an API contract definition - all simulated in plain Java.
 *
 * KEY TERMS:
 *   HTTP method    - verb indicating intent: GET, POST, PUT, PATCH, DELETE.
 *   status code    - 3-digit response code (2xx success, 4xx client, 5xx server).
 *   idempotent     - repeating the same request produces the same result.
 *   resource       - a noun in the URL representing a domain entity (/users, /orders).
 *   stateless      - each request carries all info needed; server holds no session.
 *   content type   - MIME type of the request/response body (application/json).
 */
public class AnswerApp {

    // ---- HTTP Method reference table ----------------------------------------
    static void printMethodTable() {
        System.out.println("--- HTTP Methods ---");
        Object[][] methods = {
            {"GET",    "Retrieve resource",         "Yes", "Yes", "Yes"},
            {"POST",   "Create resource / action",  "No",  "No",  "Maybe"},
            {"PUT",    "Replace full resource",      "Yes", "No",  "No"},
            {"PATCH",  "Partial update",             "No",  "No",  "No"},
            {"DELETE", "Remove resource",            "Yes", "No",  "No"}
        };
        System.out.printf("%-8s %-30s %-11s %-11s %-10s%n",
            "Method", "Purpose", "Idempotent", "Safe", "Cacheable");
        System.out.println("-".repeat(72));
        for (Object[] row : methods) {
            System.out.printf("%-8s %-30s %-11s %-11s %-10s%n",
                row[0], row[1], row[2], row[3], row[4]);
        }
        System.out.println();
    }

    // ---- Status code reference -----------------------------------------------
    static void printStatusCodes() {
        System.out.println("--- Key HTTP Status Codes ---");
        int[][] codes = {
            {200},{201},{204},{301},{304},{400},{401},{403},{404},{409},{422},{429},{500},{503}
        };
        Map<Integer,String> desc = new LinkedHashMap<>();
        desc.put(200, "OK - request succeeded, body contains result");
        desc.put(201, "Created - resource created, Location header set");
        desc.put(204, "No Content - success with no response body");
        desc.put(301, "Moved Permanently - URL has changed");
        desc.put(304, "Not Modified - use cached version");
        desc.put(400, "Bad Request - client sent malformed request");
        desc.put(401, "Unauthorized - authentication required");
        desc.put(403, "Forbidden - authenticated but not permitted");
        desc.put(404, "Not Found - resource does not exist");
        desc.put(409, "Conflict - state conflict (e.g. duplicate)");
        desc.put(422, "Unprocessable Entity - validation errors");
        desc.put(429, "Too Many Requests - rate limit exceeded");
        desc.put(500, "Internal Server Error - unexpected server failure");
        desc.put(503, "Service Unavailable - server temporarily down");
        desc.forEach((code, text) -> System.out.printf("  %3d  %s%n", code, text));
        System.out.println();
    }

    // ---- REST resource design ------------------------------------------------
    record ApiEndpoint(String method, String path, int successCode, String description) {}

    static void printApiContract() {
        System.out.println("--- REST API Contract: /api/v1/users ---");
        List<ApiEndpoint> endpoints = List.of(
            new ApiEndpoint("GET",    "/api/v1/users",          200, "List users (paginated)"),
            new ApiEndpoint("POST",   "/api/v1/users",          201, "Create user; returns Location header"),
            new ApiEndpoint("GET",    "/api/v1/users/{id}",     200, "Get single user by ID"),
            new ApiEndpoint("PUT",    "/api/v1/users/{id}",     200, "Replace full user resource"),
            new ApiEndpoint("PATCH",  "/api/v1/users/{id}",     200, "Partial update (e.g. email only)"),
            new ApiEndpoint("DELETE", "/api/v1/users/{id}",     204, "Delete user; no body in response"),
            new ApiEndpoint("GET",    "/api/v1/users/{id}/orders", 200, "Sub-resource: user's orders")
        );

        System.out.printf("%-7s %-40s %4s  %s%n", "METHOD", "PATH", "CODE", "DESCRIPTION");
        System.out.println("-".repeat(80));
        endpoints.forEach(e -> System.out.printf("%-7s %-40s %4d  %s%n",
            e.method(), e.path(), e.successCode(), e.description()));
        System.out.println();
    }

    // ---- Simulate request/response cycle -------------------------------------
    static void simulateRequests() {
        System.out.println("--- Simulated Request / Response ---");

        // Simulate GET /api/v1/users/42
        System.out.println("Request:  GET /api/v1/users/42");
        System.out.println("          Accept: application/json");
        System.out.println("Response: 200 OK");
        System.out.println("          Content-Type: application/json");
        System.out.println("          {\"id\":42,\"name\":\"Alice\",\"email\":\"alice@example.com\"}");
        System.out.println();

        // Simulate POST with validation error
        System.out.println("Request:  POST /api/v1/users");
        System.out.println("          Content-Type: application/json");
        System.out.println("          {\"name\":\"\",\"email\":\"not-an-email\"}");
        System.out.println("Response: 422 Unprocessable Entity");
        System.out.println("          {\"errors\":[");
        System.out.println("            {\"field\":\"name\",\"message\":\"must not be blank\"},");
        System.out.println("            {\"field\":\"email\",\"message\":\"must be a valid email\"}");
        System.out.println("          ]}");
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 3.5: Intro to HTTP and REST ===\n");
        printMethodTable();
        printStatusCodes();
        printApiContract();
        simulateRequests();
    }
}
'@

# ============================================================
# LESSON 4.1 - Spring Core Concepts (DI simulation)
# ============================================================
Write-Java "4.1" @'
import java.util.*;

/**
 * Lesson 4.1 - Spring Core Concepts
 *
 * WHAT THIS DEMONSTRATES:
 *   The three core ideas of Spring (IoC, DI, beans) by reimplementing
 *   them manually so you understand what Spring actually does for you.
 *
 *   In your real Spring Boot project:
 *     @Service
 *     public class UserService { ... }
 *
 *     @RestController
 *     public class UserController {
 *         private final UserService userService;
 *         public UserController(UserService userService) { // constructor injection
 *             this.userService = userService;
 *         }
 *     }
 *
 * KEY TERMS:
 *   IoC      - Inversion of Control: framework creates and wires objects.
 *   DI       - Dependency Injection: dependencies passed in, not created inside.
 *   bean     - a Spring-managed object instance.
 *   profile  - a named configuration group (dev, test, prod).
 *   @Autowired - annotation asking Spring to inject the right dependency.
 */
public class AnswerApp {

    // ---- Interfaces (contracts that Spring beans implement) ------------------
    interface UserRepository {
        Optional<String> findNameById(int id);
    }

    interface NotificationService {
        void notify(String message);
    }

    // ---- "Beans" - classes Spring would manage --------------------------------
    static class DatabaseUserRepository implements UserRepository {
        private final Map<Integer, String> db = Map.of(
            1, "Alice", 2, "Bob", 3, "Charlie");

        @Override public Optional<String> findNameById(int id) {
            return Optional.ofNullable(db.get(id));
        }
    }

    static class ConsoleNotificationService implements NotificationService {
        @Override public void notify(String message) {
            System.out.println("[NOTIFICATION] " + message);
        }
    }

    /** Service layer: depends on abstractions, not concretions. */
    static class UserService {
        private final UserRepository     repo;
        private final NotificationService notifier;

        // Constructor injection: dependencies come FROM outside (Spring injects them)
        UserService(UserRepository repo, NotificationService notifier) {
            this.repo     = repo;
            this.notifier = notifier;
        }

        public void greetUser(int id) {
            repo.findNameById(id).ifPresentOrElse(
                name -> {
                    String msg = "Welcome back, " + name + "!";
                    System.out.println(msg);
                    notifier.notify(msg);
                },
                () -> System.out.println("User " + id + " not found.")
            );
        }
    }

    // ---- Minimal IoC container (what Spring's ApplicationContext does) ------
    static class SimpleContainer {
        private final Map<Class<?>, Object> beans = new HashMap<>();

        /** Register a bean under its class type. */
        <T> void register(Class<T> type, T instance) {
            beans.put(type, instance);
        }

        /** Retrieve a bean; equivalent to applicationContext.getBean(type). */
        @SuppressWarnings("unchecked")
        <T> T get(Class<T> type) {
            Object bean = beans.get(type);
            if (bean == null) throw new RuntimeException("No bean of type: " + type.getSimpleName());
            return (T) bean;
        }
    }

    // ---- Profile-based wiring ------------------------------------------------
    static UserService createServiceForProfile(String profile) {
        // In Spring: @Profile("dev") and @Profile("prod")
        if ("dev".equals(profile)) {
            // Dev: use real DB repo but log-only notifier
            return new UserService(
                new DatabaseUserRepository(),
                msg -> System.out.println("[DEV-LOG] " + msg)
            );
        } else {
            // Prod: use real DB repo and real notification service
            return new UserService(
                new DatabaseUserRepository(),
                new ConsoleNotificationService()
            );
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 4.1: Spring Core - IoC and Dependency Injection ===\n");

        // --- Manual container wiring (mirrors what Spring Boot auto-configures) ---
        System.out.println("--- Manual IoC Container ---");
        SimpleContainer container = new SimpleContainer();
        container.register(UserRepository.class,      new DatabaseUserRepository());
        container.register(NotificationService.class, new ConsoleNotificationService());
        container.register(UserService.class,
            new UserService(
                container.get(UserRepository.class),
                container.get(NotificationService.class)));

        UserService service = container.get(UserService.class);
        service.greetUser(1);
        service.greetUser(99);  // not found

        // --- Profile-based wiring ---
        System.out.println("\n--- Profile: dev ---");
        createServiceForProfile("dev").greetUser(2);

        System.out.println("\n--- Profile: prod ---");
        createServiceForProfile("prod").greetUser(3);
    }
}
'@

# ============================================================
# LESSON 4.2 - Building REST APIs with Spring Boot
# ============================================================
Write-Java "4.2" @'
import java.util.*;

/**
 * Lesson 4.2 - Building REST APIs with Spring Boot
 *
 * WHAT THIS DEMONSTRATES:
 *   Controller / DTO / validation / exception-handler architecture.
 *   Simulated here in plain Java; see sample-project/pom.xml for
 *   the real Spring Boot setup.
 *
 *   Real Spring Boot snippet:
 *     @RestController
 *     @RequestMapping("/api/v1/products")
 *     public class ProductController {
 *
 *       @GetMapping("/{id}")
 *       public ResponseEntity<ProductResponse> get(@PathVariable int id) { ... }
 *
 *       @PostMapping
 *       public ResponseEntity<ProductResponse> create(
 *           @Valid @RequestBody CreateProductRequest req) { ... }
 *     }
 *
 * KEY TERMS:
 *   DTO    - Data Transfer Object: the shape exposed by the API.
 *   @Valid - triggers Bean Validation on the annotated parameter.
 *   ResponseEntity - carries status code + headers + body.
 *   @ControllerAdvice - global exception handler for all controllers.
 *   pagination - splitting large result sets into pages.
 */
public class AnswerApp {

    // ---- DTOs (what the API sends and receives) --------------------------------

    record CreateProductRequest(String name, String category, double price) {
        /** Manual validation (mirrors @NotBlank, @Min from Bean Validation). */
        List<String> validate() {
            List<String> errors = new ArrayList<>();
            if (name == null || name.isBlank())  errors.add("name: must not be blank");
            if (price <= 0)                       errors.add("price: must be positive");
            if (category == null || category.isBlank()) errors.add("category: must not be blank");
            return errors;
        }
    }

    record ProductResponse(int id, String name, String category, double price) {}

    record ApiError(int status, String error, List<String> details) {}

    record Page<T>(List<T> content, int pageNumber, int pageSize, long totalElements) {}

    // ---- In-memory repository  -----------------------------------------------
    static class ProductRepository {
        private final Map<Integer, ProductResponse> store = new LinkedHashMap<>();
        private int nextId = 1;

        public ProductResponse save(CreateProductRequest req) {
            ProductResponse p = new ProductResponse(nextId++, req.name(), req.category(), req.price());
            store.put(p.id(), p);
            return p;
        }
        public Optional<ProductResponse> findById(int id) {
            return Optional.ofNullable(store.get(id));
        }
        public Page<ProductResponse> findAll(int page, int size) {
            List<ProductResponse> all = new ArrayList<>(store.values());
            int from = Math.min(page * size, all.size());
            int to   = Math.min(from + size, all.size());
            return new Page<>(all.subList(from, to), page, size, all.size());
        }
        public boolean deleteById(int id) { return store.remove(id) != null; }
    }

    // ---- Controller simulation  -----------------------------------------------
    static class ProductController {
        private final ProductRepository repo;
        ProductController(ProductRepository repo) { this.repo = repo; }

        /** POST /api/v1/products */
        void create(CreateProductRequest req) {
            List<String> errors = req.validate();
            if (!errors.isEmpty()) {
                handleValidationErrors(errors);
                return;
            }
            ProductResponse p = repo.save(req);
            System.out.println("201 Created: " + toJson(p));
            System.out.println("Location: /api/v1/products/" + p.id());
        }

        /** GET /api/v1/products/{id} */
        void getById(int id) {
            repo.findById(id).ifPresentOrElse(
                p -> System.out.println("200 OK: " + toJson(p)),
                () -> System.out.println("404 Not Found: {\"error\":\"Product " + id + " not found\"}")
            );
        }

        /** GET /api/v1/products?page=0&size=2 */
        void list(int page, int size) {
            Page<ProductResponse> result = repo.findAll(page, size);
            System.out.printf("200 OK  page=%d  size=%d  total=%d%n",
                result.pageNumber(), result.pageSize(), result.totalElements());
            result.content().forEach(p -> System.out.println("  " + toJson(p)));
        }

        /** DELETE /api/v1/products/{id} */
        void delete(int id) {
            if (repo.deleteById(id)) System.out.println("204 No Content");
            else System.out.println("404 Not Found");
        }

        private void handleValidationErrors(List<String> errors) {
            System.out.println("422 Unprocessable Entity:");
            errors.forEach(e -> System.out.println("  - " + e));
        }

        private String toJson(ProductResponse p) {
            return String.format("{\"id\":%d,\"name\":\"%s\",\"category\":\"%s\",\"price\":%.2f}",
                p.id(), p.name(), p.category(), p.price());
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 4.2: Building REST APIs with Spring Boot ===\n");

        ProductController ctrl = new ProductController(new ProductRepository());

        System.out.println("--- Create products ---");
        ctrl.create(new CreateProductRequest("Clean Code",    "Books",   49.99));
        ctrl.create(new CreateProductRequest("Keyboard Pro",  "Hardware",129.99));
        ctrl.create(new CreateProductRequest("Mouse Pad XL",  "Hardware", 24.99));

        System.out.println("\n--- Validation errors ---");
        ctrl.create(new CreateProductRequest("", "Books", -5.00));

        System.out.println("\n--- Get by ID ---");
        ctrl.getById(1);
        ctrl.getById(99);

        System.out.println("\n--- Pagination (page 0, size 2) ---");
        ctrl.list(0, 2);
        System.out.println("\n--- Pagination (page 1, size 2) ---");
        ctrl.list(1, 2);

        System.out.println("\n--- Delete ---");
        ctrl.delete(2);
        ctrl.delete(2);  // already deleted
    }
}
'@

# ============================================================
# LESSON 4.3 - Persistence with Spring Data JPA
# ============================================================
Write-Java "4.3" @'
import java.util.*;
import java.time.LocalDateTime;

/**
 * Lesson 4.3 - Persistence with Spring Data JPA
 *
 * WHAT THIS DEMONSTRATES:
 *   JPA entity design, relationships, repository pattern,
 *   and transaction boundaries -- modelled in plain Java with an
 *   in-memory store to show the structural patterns without a DB.
 *
 *   Real Spring + JPA snippet:
 *     @Entity @Table(name = "orders")
 *     public class Order {
 *       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 *       private Long id;
 *
 *       @ManyToOne(fetch = FetchType.LAZY)
 *       @JoinColumn(name = "customer_id")
 *       private Customer customer;
 *
 *       @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
 *       private List<OrderItem> items = new ArrayList<>();
 *     }
 *
 * KEY TERMS:
 *   entity        - a persistent domain object mapped to a DB table.
 *   @Id           - marks the primary key field.
 *   @ManyToOne    - many records reference one parent record.
 *   @OneToMany    - one record has many child records.
 *   cascade       - propagate operations (persist, delete) to child entities.
 *   lazy loading  - load associations only when accessed, not upfront.
 *   N+1 problem   - one query per entity in a collection = performance killer.
 *   transaction   - a unit of work that is committed or rolled back atomically.
 */
public class AnswerApp {

    // ---- Entity classes --------------------------------------------------------

    static class Customer {
        private final int    id;
        private final String name;
        private final String email;

        Customer(int id, String name, String email) {
            this.id = id; this.name = name; this.email = email;
        }
        int    id()    { return id; }
        String name()  { return name; }
        String email() { return email; }
        @Override public String toString() {
            return String.format("Customer{id=%d, name='%s'}", id, name);
        }
    }

    static class OrderItem {
        private final String productName;
        private final int    quantity;
        private final double unitPrice;

        OrderItem(String productName, int quantity, double unitPrice) {
            this.productName = productName;
            this.quantity    = quantity;
            this.unitPrice   = unitPrice;
        }
        double lineTotal()  { return quantity * unitPrice; }
        @Override public String toString() {
            return String.format("  %dx %-20s $%.2f", quantity, productName, lineTotal());
        }
    }

    static class Order {
        private final int              id;
        private final Customer         customer;    // @ManyToOne
        private final List<OrderItem>  items;       // @OneToMany
        private final LocalDateTime    placedAt;
        private       String           status;

        Order(int id, Customer customer) {
            this.id       = id;
            this.customer = customer;
            this.items    = new ArrayList<>();
            this.placedAt = LocalDateTime.now();
            this.status   = "PENDING";
        }

        void addItem(OrderItem item) { items.add(item); }

        double total() { return items.stream().mapToDouble(OrderItem::lineTotal).sum(); }

        @Override public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("Order #%d  customer=%s  status=%s  placed=%s%n",
                id, customer.name(), status, placedAt.toLocalDate()));
            items.forEach(i -> sb.append(i).append("%n".formatted()));
            sb.append(String.format("  TOTAL: $%.2f", total()));
            return sb.toString();
        }
    }

    // ---- Repository pattern ---------------------------------------------------

    static class OrderRepository {
        private final Map<Integer, Order> store = new LinkedHashMap<>();
        private int nextId = 1;

        /** Simulate @Transactional: all-or-nothing save. */
        public Order save(Order order) {
            store.put(order.id, order);
            return order;
        }

        public Optional<Order> findById(int id) {
            return Optional.ofNullable(store.get(id));
        }

        /** JPQL equivalent: SELECT o FROM Order o WHERE o.customer.id = :customerId */
        public List<Order> findByCustomerId(int customerId) {
            return store.values().stream()
                .filter(o -> o.customer.id() == customerId)
                .toList();
        }

        /** Demonstrates avoiding N+1: load all orders with items in one pass. */
        public List<Order> findAllWithItems() {
            return new ArrayList<>(store.values());  // in real JPA: JOIN FETCH o.items
        }

        int nextId() { return nextId++; }
    }

    // ---- Service layer (transaction boundary) ---------------------------------

    static class OrderService {
        private final OrderRepository repo;

        OrderService(OrderRepository repo) { this.repo = repo; }

        /** @Transactional - commit on success, rollback on exception. */
        public Order placeOrder(Customer customer, Map<String, double[]> items) {
            Order order = new Order(repo.nextId(), customer);
            for (var entry : items.entrySet()) {
                String product = entry.getKey();
                int    qty     = (int) entry.getValue()[0];
                double price   = entry.getValue()[1];
                order.addItem(new OrderItem(product, qty, price));
            }
            order.status = "CONFIRMED";
            return repo.save(order);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 4.3: Persistence with Spring Data JPA ===\n");

        OrderRepository repo    = new OrderRepository();
        OrderService    service = new OrderService(repo);

        Customer alice = new Customer(1, "Alice", "alice@example.com");
        Customer bob   = new Customer(2, "Bob",   "bob@example.com");

        Map<String, double[]> aliceItems = new LinkedHashMap<>();
        aliceItems.put("Clean Code",   new double[]{1, 49.99});
        aliceItems.put("Keyboard Pro", new double[]{1, 129.99});

        Map<String, double[]> bobItems = new LinkedHashMap<>();
        bobItems.put("Mouse Pad XL",   new double[]{2, 24.99});

        Order o1 = service.placeOrder(alice, aliceItems);
        Order o2 = service.placeOrder(bob,   bobItems);
        Order o3 = service.placeOrder(alice, bobItems);  // Alice second order

        System.out.println("--- All Orders ---");
        repo.findAllWithItems().forEach(o -> System.out.println(o + "\n"));

        System.out.println("--- Alice's Orders ---");
        repo.findByCustomerId(1).forEach(o -> System.out.println(o + "\n"));
    }
}
'@

# ============================================================
# LESSON 5.2 - Redis and Caching Patterns
# ============================================================
Write-Java "5.2" @'
import java.util.*;
import java.time.Instant;

/**
 * Lesson 5.2 - Redis and Caching Patterns
 *
 * WHAT THIS DEMONSTRATES:
 *   Cache-aside pattern, TTL (time-to-live), eviction, and
 *   hit-rate metrics -- implemented as an in-memory simulation.
 *
 *   Real Spring Boot + Redis:
 *     @Cacheable(value = "users", key = "#id")
 *     public UserDto getUser(int id) { return repo.findById(id); }
 *
 * KEY TERMS:
 *   cache-aside  - application checks cache first; on miss, load from DB and populate cache.
 *   TTL          - time a cached entry lives before expiry.
 *   cache hit    - requested key found in cache.
 *   cache miss   - key not in cache; must load from origin.
 *   eviction     - removing entries when cache is full (LRU, LFU, TTL).
 *   cache stampede - many concurrent misses hitting the DB simultaneously.
 */
public class AnswerApp {

    // ---- TTL Cache entry -----------------------------------------------------
    static class CacheEntry<V> {
        final V       value;
        final Instant expiresAt;

        CacheEntry(V value, long ttlSeconds) {
            this.value     = value;
            this.expiresAt = Instant.now().plusSeconds(ttlSeconds);
        }
        boolean isExpired() { return Instant.now().isAfter(expiresAt); }
    }

    // ---- Generic TTL Cache (mirrors Redis behaviour) -----------------------
    static class SimpleCache<K, V> {
        private final Map<K, CacheEntry<V>> store   = new LinkedHashMap<>();
        private final int                   maxSize;
        private       long                  hits    = 0;
        private       long                  misses  = 0;

        SimpleCache(int maxSize) { this.maxSize = maxSize; }

        public Optional<V> get(K key) {
            CacheEntry<V> entry = store.get(key);
            if (entry == null || entry.isExpired()) {
                store.remove(key);  // clean up expired
                misses++;
                return Optional.empty();
            }
            hits++;
            return Optional.of(entry.value);
        }

        public void put(K key, V value, long ttlSeconds) {
            if (store.size() >= maxSize) evictOldest();  // simple LRU eviction
            store.put(key, new CacheEntry<>(value, ttlSeconds));
        }

        public void invalidate(K key)   { store.remove(key); }
        public void invalidateAll()     { store.clear(); }

        private void evictOldest() {
            store.keySet().stream().findFirst().ifPresent(store::remove);
        }

        public void printStats() {
            long total = hits + misses;
            double hitRate = total == 0 ? 0 : (hits * 100.0 / total);
            System.out.printf("Cache stats: hits=%d  misses=%d  hit-rate=%.1f%%%n",
                hits, misses, hitRate);
        }
    }

    // ---- Simulated database (the "origin" behind the cache) ------------------
    static class UserDatabase {
        private final Map<Integer, String> table = Map.of(
            1, "Alice", 2, "Bob", 3, "Charlie", 4, "Dave");
        int queryCount = 0;

        public Optional<String> findById(int id) {
            queryCount++;
            System.out.println("  [DB QUERY #" + queryCount + "] SELECT * FROM users WHERE id=" + id);
            return Optional.ofNullable(table.get(id));
        }
    }

    // ---- Cache-aside service -------------------------------------------------
    static class UserService {
        private final SimpleCache<Integer, String> cache = new SimpleCache<>(100);
        private final UserDatabase                 db    = new UserDatabase();

        private static final long TTL_SECONDS = 30;  // cache entries live for 30 seconds

        /** Cache-aside pattern: check cache, miss -> load from DB -> populate cache. */
        public Optional<String> getUser(int id) {
            Optional<String> cached = cache.get(id);
            if (cached.isPresent()) {
                System.out.println("  [CACHE HIT] id=" + id + " -> " + cached.get());
                return cached;
            }

            // Cache miss: load from database
            Optional<String> fromDb = db.findById(id);
            fromDb.ifPresent(name -> {
                cache.put(id, name, TTL_SECONDS);  // populate cache
                System.out.println("  [CACHE SET] id=" + id + " ttl=" + TTL_SECONDS + "s");
            });
            return fromDb;
        }

        /** Invalidate cache entry when user data changes. */
        public void updateUser(int id, String newName) {
            // In a real system, update DB first, then invalidate
            System.out.println("  [CACHE INVALIDATE] id=" + id);
            cache.invalidate(id);
        }

        void printStats() { cache.printStats(); }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 5.2: Redis and Caching Patterns ===\n");

        UserService svc = new UserService();

        System.out.println("--- First access (all misses) ---");
        svc.getUser(1);
        svc.getUser(2);
        svc.getUser(3);

        System.out.println("\n--- Second access (all hits from cache) ---");
        svc.getUser(1);
        svc.getUser(2);
        svc.getUser(3);

        System.out.println("\n--- Update invalidates cache ---");
        svc.updateUser(1, "Alice-Updated");
        svc.getUser(1);  // miss again after invalidation

        System.out.println("\n--- Non-existent ID ---");
        svc.getUser(99);

        System.out.println();
        svc.printStats();
        System.out.println("DB queries issued: " + svc.db.queryCount);
    }
}
'@

# ============================================================
# LESSON 5.4 - Event-Driven Architecture Basics
# ============================================================
Write-Java "5.4" @'
import java.util.*;
import java.time.Instant;

/**
 * Lesson 5.4 - Event-Driven Architecture Basics
 *
 * WHAT THIS DEMONSTRATES:
 *   In-process event bus, producer/consumer pattern, dead-letter queue,
 *   and retry logic -- simulating what Kafka/RabbitMQ provides.
 *
 *   Real Kafka producer:
 *     kafkaTemplate.send("order-placed", new OrderPlacedEvent(orderId));
 *
 * KEY TERMS:
 *   event      - an immutable record of something that happened.
 *   producer   - the component that publishes events.
 *   consumer   - the component that processes events.
 *   topic      - a named channel events are published to.
 *   DLQ        - Dead Letter Queue: receives events that failed all retries.
 *   at-least-once - events may be delivered more than once; consumers must handle duplicates.
 *   idempotency - processing the same event twice produces the same outcome.
 */
public class AnswerApp {

    // ---- Event types ----------------------------------------------------------
    record OrderPlacedEvent (String eventId, String orderId, double amount, Instant at) {}
    record PaymentEvent      (String eventId, String orderId, boolean success, Instant at) {}

    // ---- Simple in-process event bus (mirrors a message broker) --------------
    static class EventBus {
        // topic -> list of subscribers
        private final Map<String, List<Consumer<Object>>> subscribers = new HashMap<>();
        // Dead-letter queue for failed events
        private final Queue<Object> dlq = new LinkedList<>();

        @SuppressWarnings("unchecked")
        <T> void subscribe(String topic, Consumer<T> handler) {
            subscribers.computeIfAbsent(topic, k -> new ArrayList<>())
                       .add(evt -> handler.accept((T) evt));
        }

        void publish(String topic, Object event) {
            System.out.println("[BUS] Published to " + topic + ": " + event.getClass().getSimpleName());
            List<Consumer<Object>> handlers = subscribers.getOrDefault(topic, List.of());
            for (Consumer<Object> h : handlers) {
                try {
                    h.accept(event);
                } catch (Exception e) {
                    System.out.println("[BUS] Handler failed, sending to DLQ: " + e.getMessage());
                    dlq.offer(event);
                }
            }
        }

        void drainDlq() {
            System.out.println("\n--- DLQ contents (" + dlq.size() + " events) ---");
            Object evt;
            while ((evt = dlq.poll()) != null) {
                System.out.println("  DLQ: " + evt);
            }
        }
    }

    // Functional interface for type-safe consumers
    @FunctionalInterface interface Consumer<T> { void accept(T t); }

    // ---- Producers -----------------------------------------------------------
    static class OrderService {
        private final EventBus bus;
        private int nextId = 100;

        OrderService(EventBus bus) { this.bus = bus; }

        public void placeOrder(double amount) {
            String orderId  = "ORD-" + nextId++;
            String eventId  = UUID.randomUUID().toString().substring(0, 8);
            OrderPlacedEvent event = new OrderPlacedEvent(eventId, orderId, amount, Instant.now());
            bus.publish("order.placed", event);
        }
    }

    // ---- Consumers -----------------------------------------------------------
    static class InventoryConsumer {
        void handle(OrderPlacedEvent e) {
            System.out.println("  [INVENTORY] Reserving stock for order " + e.orderId());
        }
    }

    static class PaymentConsumer {
        private final EventBus bus;
        PaymentConsumer(EventBus bus) { this.bus = bus; }

        void handle(OrderPlacedEvent e) {
            System.out.printf("  [PAYMENT] Charging $%.2f for order %s%n",
                e.amount(), e.orderId());

            // Simulate occasional failure
            boolean success = e.amount() < 200;
            if (!success) throw new RuntimeException("Payment gateway timeout");

            bus.publish("payment.processed",
                new PaymentEvent(UUID.randomUUID().toString().substring(0, 8),
                    e.orderId(), true, Instant.now()));
        }
    }

    static class NotificationConsumer {
        void handle(PaymentEvent e) {
            System.out.printf("  [NOTIFY] Payment %s for order %s%n",
                e.success() ? "CONFIRMED" : "FAILED", e.orderId());
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 5.4: Event-Driven Architecture ===\n");

        EventBus bus = new EventBus();

        // Wire consumers to topics
        InventoryConsumer  inv  = new InventoryConsumer();
        PaymentConsumer    pay  = new PaymentConsumer(bus);
        NotificationConsumer notif = new NotificationConsumer();

        bus.subscribe("order.placed",       inv::handle);
        bus.subscribe("order.placed",       pay::handle);  // two consumers on same topic
        bus.subscribe("payment.processed",  notif::handle);

        OrderService orderSvc = new OrderService(bus);

        System.out.println("--- Place orders ---");
        orderSvc.placeOrder(99.99);   // success
        System.out.println();
        orderSvc.placeOrder(250.00);  // triggers payment failure -> DLQ

        bus.drainDlq();
    }
}
'@

# ============================================================
# LESSON 6.2 - JWT and OAuth2/OIDC
# ============================================================
Write-Java "6.2" @'
import java.util.*;
import java.time.Instant;

/**
 * Lesson 6.2 - JWT and OAuth2/OIDC
 *
 * WHAT THIS DEMONSTRATES:
 *   JWT structure, claims, token lifecycle (issue/validate/refresh),
 *   and OAuth2 Authorization Code flow -- all simulated in plain Java.
 *
 *   Real Spring Security + JWT:
 *     @Bean
 *     public JwtDecoder jwtDecoder() {
 *         return NimbusJwtDecoder.withPublicKey(publicKey).build();
 *     }
 *
 * KEY TERMS:
 *   JWT       - JSON Web Token: header.payload.signature (base64-encoded).
 *   claim     - a key-value assertion in the JWT payload (sub, iss, exp, roles).
 *   signature - HMAC or RSA hash proving the token was issued by a trusted party.
 *   access token  - short-lived token used to access APIs (usually 15-60 minutes).
 *   refresh token - long-lived token used to obtain a new access token.
 *   OAuth2    - authorization framework; the "app" gets permission to act on a user's behalf.
 *   OIDC      - adds identity (who you are) on top of OAuth2 (what you can do).
 */
public class AnswerApp {

    // ---- Simulated JWT (real JWTs are Base64URL-encoded JSON) ----------------
    record JwtToken(
        String subject,         // sub: who the token is about (user ID)
        String issuer,          // iss: who issued it
        List<String> roles,     // custom claim
        Instant issuedAt,       // iat
        Instant expiresAt       // exp
    ) {
        boolean isExpired() { return Instant.now().isAfter(expiresAt); }

        /** Print as a human-readable representation of the three JWT parts. */
        void print() {
            System.out.println("  Header  : {\"alg\":\"HS256\",\"typ\":\"JWT\"}");
            System.out.printf ("  Payload : {\"sub\":\"%s\",\"iss\":\"%s\",\"roles\":%s," +
                               "\"iat\":%d,\"exp\":%d}%n",
                subject, issuer, roles, issuedAt.getEpochSecond(), expiresAt.getEpochSecond());
            System.out.println("  Signature: <HMAC-SHA256 of header.payload using secret>");
        }
    }

    // ---- Token service -------------------------------------------------------
    static class TokenService {
        private static final String ISSUER        = "https://auth.example.com";
        private static final long   ACCESS_TTL    = 15 * 60;      // 15 minutes
        private static final long   REFRESH_TTL   = 7 * 86400;    // 7 days

        // Simulate a revocation list (real systems use Redis)
        private final Set<String> revokedSubjects = new HashSet<>();

        public JwtToken issueAccessToken(String userId, List<String> roles) {
            return new JwtToken(
                userId, ISSUER, roles,
                Instant.now(), Instant.now().plusSeconds(ACCESS_TTL));
        }

        public JwtToken issueRefreshToken(String userId) {
            return new JwtToken(
                userId, ISSUER, List.of(),
                Instant.now(), Instant.now().plusSeconds(REFRESH_TTL));
        }

        public ValidationResult validate(JwtToken token) {
            if (token.isExpired())
                return new ValidationResult(false, "Token expired");
            if (revokedSubjects.contains(token.subject()))
                return new ValidationResult(false, "Token revoked");
            if (!ISSUER.equals(token.issuer()))
                return new ValidationResult(false, "Unknown issuer");
            return new ValidationResult(true, "OK");
        }

        public void revoke(String userId) { revokedSubjects.add(userId); }
    }

    record ValidationResult(boolean valid, String reason) {}

    // ---- OAuth2 Authorization Code Flow simulation ---------------------------
    static void simulateOAuth2Flow() {
        System.out.println("--- OAuth2 Authorization Code Flow ---");

        // Step 1: User clicks "Login with Google"
        System.out.println("1. Browser: GET https://accounts.google.com/o/oauth2/auth");
        System.out.println("   ?response_type=code&client_id=myapp&redirect_uri=https://app.com/callback");
        System.out.println("   &scope=openid%20email%20profile&state=random-csrf-token");

        // Step 2: User authenticates and consents
        System.out.println("\n2. User authenticates at Google and approves scopes.");
        System.out.println("   Google redirects to: https://app.com/callback?code=AUTH_CODE&state=token");

        // Step 3: Backend exchanges code for tokens
        System.out.println("\n3. Backend: POST https://oauth2.googleapis.com/token");
        System.out.println("   code=AUTH_CODE&grant_type=authorization_code&client_secret=SECRET");
        System.out.println("   <-- {\"access_token\":\"...\",\"id_token\":\"...\",\"refresh_token\":\"...\"}");

        // Step 4: Backend validates id_token (OIDC)
        System.out.println("\n4. Backend validates the id_token JWT.");
        System.out.println("   Checks: signature, issuer, audience, expiry.");
        System.out.println("   Extracts: sub (user ID), email, name.");

        // Step 5: Issue own session token
        System.out.println("\n5. Backend issues its own JWT and sets it as HttpOnly cookie.");
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 6.2: JWT and OAuth2/OIDC ===\n");

        TokenService tokenService = new TokenService();

        System.out.println("--- Issue tokens for user 'user-42' ---");
        JwtToken access  = tokenService.issueAccessToken ("user-42", List.of("ROLE_USER", "ROLE_ADMIN"));
        JwtToken refresh = tokenService.issueRefreshToken("user-42");

        System.out.println("Access token:");
        access.print();
        System.out.println("\nRefresh token:");
        refresh.print();

        System.out.println("\n--- Validate access token ---");
        ValidationResult r = tokenService.validate(access);
        System.out.println("Valid: " + r.valid() + " | Reason: " + r.reason());

        System.out.println("\n--- Revoke user and revalidate ---");
        tokenService.revoke("user-42");
        ValidationResult r2 = tokenService.validate(access);
        System.out.println("Valid: " + r2.valid() + " | Reason: " + r2.reason());

        System.out.println();
        simulateOAuth2Flow();
    }
}
'@

# ============================================================
# Write all remaining lessons with topic-specific bodies
# ============================================================
$remaining = @{
  "4.4" = @("Database Migration and Seed Data",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    /** Simulates Flyway migration versioning. */\n    record Migration(String version, String description, String sql) {}\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 4.4: Database Migration and Seed Data ===\n`");\n\n        List<Migration> migrations = List.of(\n            new Migration(`"V1__create_users_table`",\n                `"Create users`",\n                `"CREATE TABLE users (id BIGINT PRIMARY KEY, name VARCHAR(200), email VARCHAR(200) UNIQUE, created_at TIMESTAMP)`"),\n            new Migration(`"V2__create_orders_table`",\n                `"Create orders`",\n                `"CREATE TABLE orders (id BIGINT PRIMARY KEY, user_id BIGINT REFERENCES users(id), total DECIMAL(10,2), status VARCHAR(50))`"),\n            new Migration(`"V3__add_index_user_email`",\n                `"Email index`",\n                `"CREATE INDEX idx_users_email ON users(email)`"),\n            new Migration(`"V4__seed_test_data`",\n                `"Seed data`",\n                `"INSERT INTO users VALUES (1,'Alice','alice@example.com',NOW())`")\n        );\n\n        System.out.println(`"--- Flyway migration execution ---`");\n        for (Migration m : migrations) {\n            System.out.printf(`"[OK] %s  %s%n  SQL: %s%n%n`", m.version(), m.description(), m.sql());\n        }\n\n        System.out.println(`"--- Best practices ---`");\n        System.out.println(`"  - Never modify an applied migration file`");\n        System.out.println(`"  - Use V<number>__description.sql naming`");\n        System.out.println(`"  - Seed data goes in separate R__seed.sql (repeatable) files`");\n        System.out.println(`"  - Run migrations before starting application (fail-fast)`");\n    }\n}")
  "4.5" = @("Advanced Querying and Performance",
    "import java.util.*;\nimport java.util.stream.*;\n\npublic class AnswerApp {\n\n    record Order(int id, int userId, double total, String status) {}\n    record OrderItem(int orderId, String product, int qty) {}\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 4.5: Advanced Querying and Performance ===\n`");\n\n        List<Order> orders = List.of(\n            new Order(1,1,100.0,`"COMPLETED`"), new Order(2,1,200.0,`"PENDING`"),\n            new Order(3,2,50.0,`"COMPLETED`"),  new Order(4,2,75.0,`"CANCELLED`"),\n            new Order(5,3,300.0,`"COMPLETED`"));\n\n        List<OrderItem> items = List.of(\n            new OrderItem(1,`"Book`",2), new OrderItem(1,`"Pen`",5),\n            new OrderItem(2,`"Laptop`",1), new OrderItem(3,`"Book`",1),\n            new OrderItem(5,`"Monitor`",1), new OrderItem(5,`"Keyboard`",1));\n\n        System.out.println(`"--- JPQL: SELECT o FROM Order o WHERE o.status='COMPLETED' ---`");\n        orders.stream()\n            .filter(o -> `"COMPLETED`".equals(o.status()))\n            .forEach(o -> System.out.printf(`"  Order#%d user=%d $%.2f%n`", o.id(), o.userId(), o.total()));\n\n        System.out.println(`"\n--- Projection: only id+total (avoid loading full entity) ---`");\n        orders.stream()\n            .map(o -> Map.of(`"id`", o.id(), `"total`", o.total()))\n            .forEach(m -> System.out.println(`"  `" + m));\n\n        System.out.println(`"\n--- N+1 FIX: JOIN FETCH simulation (load items with orders in one query) ---`");\n        Map<Integer, List<OrderItem>> itemsByOrder = items.stream()\n            .collect(Collectors.groupingBy(OrderItem::orderId));\n        orders.forEach(o -> {\n            List<OrderItem> oi = itemsByOrder.getOrDefault(o.id(), List.of());\n            System.out.printf(`"  Order#%d has %d items%n`", o.id(), oi.size());\n        });\n\n        System.out.println(`"\n--- Aggregate: total revenue per user ---`");\n        orders.stream()\n            .filter(o -> `"COMPLETED`".equals(o.status()))\n            .collect(Collectors.groupingBy(Order::userId, Collectors.summingDouble(Order::total)))\n            .forEach((uid, rev) -> System.out.printf(`"  User#%d revenue=$%.2f%n`", uid, rev));\n    }\n}")
  "5.1" = @("SQL Mastery for Developers",
    "import java.util.*;\nimport java.util.stream.*;\n\npublic class AnswerApp {\n\n    record User(int id, String name, String dept, double salary) {}\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 5.1: SQL Mastery for Developers ===\n`");\n\n        List<User> users = List.of(\n            new User(1,`"Alice`",`"Eng`",110000),new User(2,`"Bob`",`"Eng`",95000),\n            new User(3,`"Carol`",`"Mkt`",82000),new User(4,`"Dave`",`"Mkt`",78000),\n            new User(5,`"Eve`",`"Eng`",125000));\n\n        System.out.println(`"--- SELECT WHERE ---`");\n        users.stream().filter(u -> u.salary() > 90000)\n            .forEach(u -> System.out.printf(`"  %-8s $%,.0f%n`", u.name(), u.salary()));\n\n        System.out.println(`"\n--- GROUP BY dept + AVG salary ---`");\n        users.stream().collect(Collectors.groupingBy(User::dept,\n            Collectors.averagingDouble(User::salary)))\n            .forEach((d,a) -> System.out.printf(`"  %-6s avg=$%,.0f%n`", d, a));\n\n        System.out.println(`"\n--- ORDER BY salary DESC LIMIT 3 ---`");\n        users.stream().sorted(Comparator.comparingDouble(User::salary).reversed())\n            .limit(3)\n            .forEach(u -> System.out.printf(`"  %-8s $%,.0f%n`", u.name(), u.salary()));\n\n        System.out.println(`"\n--- Index hint: use index on high-cardinality columns ---`");\n        System.out.println(`"  CREATE INDEX idx_users_dept ON users(dept);`");\n        System.out.println(`"  EXPLAIN SELECT * FROM users WHERE dept = 'Eng';`");\n        System.out.println(`"  -- Expected: Index Scan instead of Seq Scan`");\n    }\n}")
  "5.3" = @("NoSQL MongoDB",
    "import java.util.*;\nimport java.util.stream.*;\n\npublic class AnswerApp {\n\n    // Document model (MongoDB stores JSON-like BSON documents)\n    static class Document {\n        final String id;\n        final Map<String, Object> fields = new LinkedHashMap<>();\n        Document(String id) { this.id = id; }\n        Document set(String k, Object v) { fields.put(k, v); return this; }\n        @Override public String toString() { return `"{ _id:`"+id+`"`" + fields.entrySet().stream()\n            .map(e -> `", `"+e.getKey()+`":`"+e.getValue()).collect(Collectors.joining()) + `" }`"; }\n    }\n\n    static class Collection {\n        private final Map<String, Document> store = new LinkedHashMap<>();\n        void insertOne(Document d)  { store.put(d.id, d); }\n        Optional<Document> findById(String id) { return Optional.ofNullable(store.get(id)); }\n        List<Document> find(String field, Object value) {\n            return store.values().stream()\n                .filter(d -> value.equals(d.fields.get(field))).toList();\n        }\n        int count() { return store.size(); }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 5.3: NoSQL (MongoDB) ===\n`");\n\n        Collection users = new Collection();\n        users.insertOne(new Document(`"u1`").set(`"name`",`"Alice`").set(`"role`",`"admin`").set(`"score`",95));\n        users.insertOne(new Document(`"u2`").set(`"name`",`"Bob`").set(`"role`",`"user`").set(`"score`",72));\n        users.insertOne(new Document(`"u3`").set(`"name`",`"Carol`").set(`"role`",`"admin`").set(`"score`",88));\n\n        System.out.println(`"--- findById ---`");\n        users.findById(`"u1`").ifPresent(System.out::println);\n\n        System.out.println(`"\n--- find by role='admin' ---`");\n        users.find(`"role`", `"admin`").forEach(System.out::println);\n\n        System.out.println(`"\n--- MongoDB vs SQL trade-off ---`");\n        System.out.println(`"  Use MongoDB when: schema changes frequently, embedded sub-docs are natural`");\n        System.out.println(`"  Use SQL when: strong relational integrity, complex joins are needed`");\n    }\n}")
  "6.1" = @("Spring Security Fundamentals",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    enum Role { ROLE_USER, ROLE_ADMIN, ROLE_GUEST }\n\n    record Principal(String username, String passwordHash, List<Role> roles) {}\n\n    static class SecurityFilter {\n        private final Map<String, Principal> users = new Map.Entry[]{}; // init below\n        // Store for demonstration\n        private final Map<String, Principal> store;\n\n        SecurityFilter() {\n            store = new HashMap<>();\n            store.put(`"alice`", new Principal(`"alice`", hash(`"pass1`"), List.of(Role.ROLE_ADMIN, Role.ROLE_USER)));\n            store.put(`"bob`",   new Principal(`"bob`",   hash(`"pass2`"), List.of(Role.ROLE_USER)));\n        }\n\n        public boolean authenticate(String username, String password) {\n            Principal p = store.get(username);\n            if (p == null) return false;\n            return p.passwordHash().equals(hash(password));\n        }\n\n        public boolean authorize(String username, Role required) {\n            Principal p = store.get(username);\n            return p != null && p.roles().contains(required);\n        }\n\n        private static String hash(String s) { return `"HASHED:`" + s.hashCode(); }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 6.1: Spring Security Fundamentals ===\n`");\n        SecurityFilter sec = new SecurityFilter();\n\n        System.out.println(`"--- Authentication ---`");\n        System.out.println(`"alice/pass1 : `" + sec.authenticate(`"alice`", `"pass1`"));\n        System.out.println(`"alice/wrong : `" + sec.authenticate(`"alice`", `"wrong`"));\n        System.out.println(`"unknown     : `" + sec.authenticate(`"unknown`", `"x`"));\n\n        System.out.println(`"\n--- Authorization ---`");\n        System.out.println(`"alice ADMIN : `" + sec.authorize(`"alice`", Role.ROLE_ADMIN));\n        System.out.println(`"bob   ADMIN : `" + sec.authorize(`"bob`",   Role.ROLE_ADMIN));\n        System.out.println(`"bob   USER  : `" + sec.authorize(`"bob`",   Role.ROLE_USER));\n\n        System.out.println(`"\n--- Spring Security filter chain order ---`");\n        String[] chain = {`"CorsFilter`",`"CsrfFilter`",`"UsernamePasswordAuthFilter`",\n            `"BasicAuthFilter`",`"BearerTokenAuthFilter`",`"AuthorizationFilter`"};\n        for (int i = 0; i < chain.length; i++)\n            System.out.printf(`"  %d. %s%n`", i+1, chain[i]);\n    }\n}")
  "6.3" = @("API Security Best Practices",
    "import java.util.*;\nimport java.util.regex.*;\n\npublic class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 6.3: API Security Best Practices (OWASP Top 10) ===\n`");\n        printOwaspTop10();\n        demonstrateInputSanitization();\n        demonstrateCors();\n    }\n\n    static void printOwaspTop10() {\n        System.out.println(`"--- OWASP API Security Top 10 ---`");\n        String[][] items = {\n            {`"A1`",`"Broken Object Level Auth`",`"Always validate: can THIS user access THIS resource ID`"},\n            {`"A2`",`"Broken Authentication`",     `"Use short-lived JWTs, MFA, brute-force protection`"},\n            {`"A3`",`"Broken Object Property Auth`",`"Return only fields the user is allowed to see`"},\n            {`"A4`",`"Unrestricted Resource Consumption`",`"Rate-limit all endpoints`"},\n            {`"A5`",`"Broken Function Level Auth`", `"Separate admin and user APIs with explicit role checks`"},\n            {`"A6`",`"Unrestricted Access to Sensitive Flows`",`"Add CAPTCHA/rate-limit on auth, reset, pay flows`"},\n            {`"A7`",`"Server-Side Request Forgery`", `"Validate and allowlist URLs before fetching them`"},\n            {`"A8`",`"Security Misconfiguration`",  `"Disable debug, use strict CORS, set security headers`"},\n            {`"A9`",`"Improper Inventory Management`",`"Document and retire all old API versions`"},\n            {`"A10`",`"Unsafe Consumption of APIs`", `"Validate third-party API responses before using them`"}\n        };\n        for (String[] r : items)\n            System.out.printf(`"  %-5s %-40s %s%n`", r[0], r[1], r[2]);\n        System.out.println();\n    }\n\n    static void demonstrateInputSanitization() {\n        System.out.println(`"--- Input Sanitization ---`");\n        String[] inputs = {`"alice@example.com`", `"<script>alert(1)</script>`",`"SELECT * FROM users; DROP TABLE users`",`"valid-user-name_123`"};\n        Pattern safe = Pattern.compile(`"^[a-zA-Z0-9@._\\-]{1,200}$`");\n        for (String s : inputs) {\n            boolean ok = safe.matcher(s).matches();\n            System.out.printf(`"  %-45s -> %s%n`", s, ok ? `"ALLOWED`" : `"REJECTED (invalid chars)`");\n        }\n        System.out.println();\n    }\n\n    static void demonstrateCors() {\n        System.out.println(`"--- CORS Configuration (Spring Security) ---`");\n        System.out.println(`"  @Bean public CorsConfigurationSource corsConfig() {`");\n        System.out.println(`"    CorsConfiguration cfg = new CorsConfiguration();`");\n        System.out.println(`"    cfg.setAllowedOrigins(List.of(\\\"https://app.example.com\\\"));`");\n        System.out.println(`"    cfg.setAllowedMethods(List.of(\\\"GET\\\",\\\"POST\\\",\\\"PUT\\\",\\\"DELETE\\\"));`");\n        System.out.println(`"    cfg.setAllowedHeaders(List.of(\\\"Authorization\\\",\\\"Content-Type\\\"));`");\n        System.out.println(`"    cfg.setAllowCredentials(true);`");\n        System.out.println(`"  }`");\n    }\n}")
  "6.4" = @("Secure Coding and Compliance",
    "import java.util.*;\nimport java.util.stream.*;\n\npublic class AnswerApp {\n\n    record AuditLog(String user, String action, String resource, String result, long ts) {}\n\n    static class AuditService {\n        private final List<AuditLog> log = new ArrayList<>();\n        public void record(String user, String action, String resource, String result) {\n            log.add(new AuditLog(user, action, resource, result, System.currentTimeMillis()));\n        }\n        public void print() {\n            System.out.println(`"--- Audit Log ---`");\n            log.forEach(e -> System.out.printf(`"  [%s] %-10s %-10s %-20s %s%n`",\n                e.ts(), e.user(), e.action(), e.resource(), e.result()));\n        }\n    }\n\n    static String maskPii(String email) {\n        int at = email.indexOf('@');\n        if (at < 2) return `"***`" + email.substring(at);\n        return email.charAt(0) + `"***`" + email.substring(at);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 6.4: Secure Coding and Compliance ===\n`");\n\n        // Audit logging\n        AuditService audit = new AuditService();\n        audit.record(`"alice`",`"READ`",  `"order/ORD-001`",`"SUCCESS`");\n        audit.record(`"bob`",  `"DELETE`",`"user/42`",       `"DENIED`");\n        audit.record(`"alice`",`"UPDATE`",`"profile/alice`", `"SUCCESS`");\n        audit.print();\n\n        // PII masking\n        System.out.println(`"\n--- PII Masking ---`");\n        String[] emails = {`"alice@example.com`",`"bob@test.org`",`"x@y.io`"};\n        for (String e : emails)\n            System.out.printf(`"  %-25s -> %s%n`", e, maskPii(e));\n\n        // Secrets management reminder\n        System.out.println(`"\n--- Secrets Management Rules ---`");\n        System.out.println(`"  NEVER hardcode secrets in source code`");\n        System.out.println(`"  Use environment variables or a vault (AWS Secrets Manager, HashiCorp Vault)`");\n        System.out.println(`"  Rotate secrets regularly and on any suspected exposure`");\n        System.out.println(`"  Encrypt sensitive DB columns at rest (AES-256)`");\n    }\n}")
  "7.1" = @("TypeScript Fundamentals",
    "/**\n * Lesson 7.1 - TypeScript Fundamentals for Frontend\n *\n * TypeScript is a superset of JavaScript; it adds STATIC TYPES.\n * This Java file demonstrates the analogous concepts so you can\n * connect them when you write actual TypeScript.\n *\n * KEY TERMS:\n *   interface  - a type contract (same idea as Java interface).\n *   type alias - a name for a type expression (type UserId = string).\n *   union type - a value that can be one of several types (string | null).\n *   generics   - same concept as Java generics (<T>).\n *   utility types - Partial<T>, Readonly<T>, Pick<T,K> etc.\n */\npublic class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 7.1: TypeScript Fundamentals ===\n`");\n        printTypeScriptToJavaMapping();\n        printInterfaceExample();\n        printGenericExample();\n    }\n\n    static void printTypeScriptToJavaMapping() {\n        System.out.println(`"--- TypeScript <-> Java Concept Map ---`");\n        String[][] map = {\n            {`"string`",           `"String`"},\n            {`"number`",           `"int / double`"},\n            {`"boolean`",          `"boolean`"},\n            {`"any`",              `"Object (avoid)`"},\n            {`"unknown`",          `"Object (safer)`"},\n            {`"void`",             `"void`"},\n            {`"T | null`",         `"Optional<T>`"},\n            {`"T[]`",              `"List<T>`"},\n            {`"interface Foo {}`", `"interface Foo {}`"},\n            {`"type Alias = ...`",  `"typedef / record`"},\n            {`"Partial<T>`",       `"fields all Optional`"},\n            {`"Readonly<T>`",      `"final fields / record`"},\n            {`"Record<K,V>`",      `"Map<K,V>`"}\n        };\n        System.out.printf(`"%-30s  %s%n`",`"TypeScript`",`"Java equivalent`");\n        System.out.println(`"-`".repeat(55));\n        for (String[] r : map)\n            System.out.printf(`"%-30s  %s%n`", r[0], r[1]);\n        System.out.println();\n    }\n\n    static void printInterfaceExample() {\n        System.out.println(`"--- TypeScript interface example ---`");\n        System.out.println(`"  // TypeScript:`");\n        System.out.println(`"  interface User { id: number; name: string; email?: string; }`");\n        System.out.println(`"  function greet(user: User): string {`");\n        System.out.println(`"    return `Hello, ${user.name}`;\n  }`");\n        System.out.println(`"\n  // Java equivalent:`");\n        System.out.println(`"  record User(int id, String name, Optional<String> email) {}`");\n    }\n\n    static void printGenericExample() {\n        System.out.println(`"\n--- TypeScript generic example ---`");\n        System.out.println(`"  // TypeScript:`");\n        System.out.println(`"  function identity<T>(value: T): T { return value; }`");\n        System.out.println(`"\n  // Java:`");\n        System.out.println(`"  static <T> T identity(T value) { return value; }`");\n    }\n}")
  "7.2" = @("React Fundamentals",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 7.2: React Fundamentals ===\n`");\n        printComponentModel();\n        printHookPatterns();\n        printStateFlow();\n    }\n\n    static void printComponentModel() {\n        System.out.println(`"--- React Component Model (in Java terms) ---`");\n        System.out.println(`"  // TypeScript React:`");\n        System.out.println(`"  interface ButtonProps { label: string; onClick: () => void; disabled?: boolean; }`");\n        System.out.println(`"  const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => (`");\n        System.out.println(`"    <button onClick={onClick} disabled={disabled}>{label}</button>`");\n        System.out.println(`"  );`");\n        System.out.println(`"\n  // Java analogy: a method that takes Props and returns rendered output`");\n        System.out.println(`"  // Props     = method parameters`");\n        System.out.println(`"  // State     = instance variables that trigger re-render`");\n        System.out.println(`"  // Rendering = return value of the component function`");\n    }\n\n    static void printHookPatterns() {\n        System.out.println(`"\n--- React Hooks reference ---`");\n        String[][] hooks = {\n            {`"useState`",   `"Store mutable state; triggers re-render on change`"},\n            {`"useEffect`",  `"Side-effects after render (fetch, subscriptions, timers)`"},\n            {`"useContext`", `"Read a shared value from a context provider`"},\n            {`"useMemo`",    `"Memoize expensive computations`"},\n            {`"useCallback`",`"Memoize event handler references (perf opt)`"},\n            {`"useRef`",     `"Mutable ref that does not trigger re-render`"}\n        };\n        for (String[] h : hooks)\n            System.out.printf(`"  %-14s  %s%n`", h[0], h[1]);\n    }\n\n    static void printStateFlow() {\n        System.out.println(`"\n--- One-way data flow diagram ---`");\n        System.out.println(`"  Parent state`");\n        System.out.println(`"      |-- props --> Child A`");\n        System.out.println(`"      |-- props --> Child B`");\n        System.out.println(`"                       |-- event (callback) --> Parent`");\n        System.out.println(`"  State updates trigger re-render from parent downward.`");\n    }\n}")
  "7.3" = @("API Integration with Java Backend",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 7.3: API Integration with Java Backend ===\n`");\n        printAxiosPattern();\n        printAuthPattern();\n        printErrorHandling();\n    }\n\n    static void printAxiosPattern() {\n        System.out.println(`"--- Axios / Fetch pattern ---`");\n        System.out.println(`"  // apiClient.ts`");\n        System.out.println(`"  const api = axios.create({ baseURL: '/api/v1', timeout: 5000 });`");\n        System.out.println(`"\n  // Add auth header to every request`");\n        System.out.println(`"  api.interceptors.request.use(cfg => {`");\n        System.out.println(`"    cfg.headers.Authorization = `Bearer ${getToken()}`;`");\n        System.out.println(`"    return cfg;`");\n        System.out.println(`"  });`");\n        System.out.println(`"\n  // Usage: const user = await api.get<User>('/users/42');`");\n    }\n\n    static void printAuthPattern() {\n        System.out.println(`"\n--- Auth token lifecycle ---`");\n        System.out.println(`"  1. Login  : POST /auth/login  -> { accessToken, refreshToken }`");\n        System.out.println(`"  2. Store  : access in memory (NOT localStorage), refresh in HttpOnly cookie`");\n        System.out.println(`"  3. Use    : Authorization: Bearer <accessToken>`");\n        System.out.println(`"  4. Refresh: on 401 response, call POST /auth/refresh then retry`");\n        System.out.println(`"  5. Logout : DELETE /auth/session  + clear tokens`");\n    }\n\n    static void printErrorHandling() {\n        System.out.println(`"\n--- Error handling pattern ---`");\n        System.out.println(`"  api.interceptors.response.use(`");\n        System.out.println(`"    response => response,`");\n        System.out.println(`"    async error => {`");\n        System.out.println(`"      if (error.response?.status === 401) await refreshTokens();`");\n        System.out.println(`"      if (error.response?.status === 429) await sleep(1000); // backoff`");\n        System.out.println(`"      return Promise.reject(error);`");\n        System.out.println(`"    }`");\n        System.out.println(`"  );`");\n    }\n}")
  "7.4" = @("UI Quality and Frontend Testing",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 7.4: UI Quality and Frontend Testing ===\n`");\n        printTestTypes();\n        printAccessibilityChecks();\n        printRTLPattern();\n    }\n\n    static void printTestTypes() {\n        System.out.println(`"--- Frontend Testing Pyramid ---`");\n        System.out.println(`"  Unit tests    (Vitest/Jest)   -- component logic in isolation`");\n        System.out.println(`"  Integration   (React Testing Library) -- component renders and interactions`");\n        System.out.println(`"  E2E tests     (Playwright/Cypress)    -- full user flows in real browser`");\n    }\n\n    static void printAccessibilityChecks() {\n        System.out.println(`"\n--- Accessibility (a11y) Checklist ---`");\n        String[] checks = {\n            `"All images have descriptive alt text`",\n            `"Form inputs have associated <label> elements`",\n            `"Color contrast ratio >= 4.5:1 for normal text`",\n            `"Keyboard navigation works without mouse`",\n            `"Focus indicator is visible`",\n            `"ARIA roles used only when semantic HTML is insufficient`"\n        };\n        for (String c : checks) System.out.println(`"  [ ] `" + c);\n    }\n\n    static void printRTLPattern() {\n        System.out.println(`"\n--- React Testing Library pattern ---`");\n        System.out.println(`"  // Good: query by what the user sees`");\n        System.out.println(`"  const btn = screen.getByRole('button', { name: /submit/i });`");\n        System.out.println(`"  await userEvent.click(btn);`");\n        System.out.println(`"  expect(screen.getByText('Success')).toBeInTheDocument();`");\n        System.out.println(`"\n  // Avoid: querying by implementation details (CSS class, id)`");\n        System.out.println(`"  // Bad: document.querySelector('.submit-btn')`");\n    }\n}")
  "8.1" = @("Docker for Java and Frontend",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 8.1: Docker for Java and Frontend ===\n`");\n        printDockerfile();\n        printComposeFile();\n        printBestPractices();\n    }\n\n    static void printDockerfile() {\n        System.out.println(`"--- Multi-stage Java Dockerfile ---`");\n        System.out.println(`"  FROM eclipse-temurin:21-jdk AS build`");\n        System.out.println(`"  WORKDIR /app`");\n        System.out.println(`"  COPY pom.xml .`");\n        System.out.println(`"  RUN mvn dependency:go-offline       # cache dependencies layer`");\n        System.out.println(`"  COPY src ./src`");\n        System.out.println(`"  RUN mvn -q -DskipTests package`");\n\n        System.out.println(`"\n  FROM eclipse-temurin:21-jre AS runtime  # smaller final image`");\n        System.out.println(`"  WORKDIR /app`");\n        System.out.println(`"  COPY --from=build /app/target/*.jar app.jar`");\n        System.out.println(`"  EXPOSE 8080`");\n        System.out.println(`"  ENTRYPOINT [\\\"java\\\", \\\"-jar\\\", \\\"app.jar\\\"]`");\n    }\n\n    static void printComposeFile() {\n        System.out.println(`"\n--- docker-compose.yml (full stack) ---`");\n        System.out.println(`"  services:`");\n        System.out.println(`"    backend:`");\n        System.out.println(`"      build: ./backend`");\n        System.out.println(`"      ports: ['8080:8080']`");\n        System.out.println(`"      environment: SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/app`");\n        System.out.println(`"      depends_on: [db, redis]`");\n        System.out.println(`"    frontend:`");\n        System.out.println(`"      build: ./frontend`");\n        System.out.println(`"      ports: ['3000:80']`");\n        System.out.println(`"    db:`");\n        System.out.println(`"      image: postgres:16-alpine`");\n        System.out.println(`"      environment: POSTGRES_DB=app POSTGRES_PASSWORD=secret`");\n        System.out.println(`"    redis:`");\n        System.out.println(`"      image: redis:7-alpine`");\n    }\n\n    static void printBestPractices() {\n        System.out.println(`"\n--- Image optimization tips ---`");\n        System.out.println(`"  Use multi-stage builds to keep runtime image small`");\n        System.out.println(`"  Use -alpine or -slim base images`");\n        System.out.println(`"  Copy dependency layer before source layer (cache efficiency)`");\n        System.out.println(`"  Never store secrets in images; use env vars or secrets`");\n    }\n}")
  "8.2" = @("CI/CD Pipelines",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 8.2: CI/CD Pipelines ===\n`");\n        printGitHubActionsWorkflow();\n        printQualityGates();\n    }\n\n    static void printGitHubActionsWorkflow() {\n        System.out.println(`"--- GitHub Actions workflow (.github/workflows/ci.yml) ---`");\n        System.out.println(`"  on: [push, pull_request]`");\n        System.out.println(`"  jobs:`");\n        System.out.println(`"    build:`");\n        System.out.println(`"      runs-on: ubuntu-latest`");\n        System.out.println(`"      steps:`");\n        System.out.println(`"        - uses: actions/checkout@v4`");\n        System.out.println(`"        - uses: actions/setup-java@v4`");\n        System.out.println(`"          with: { java-version: '21', distribution: 'temurin' }`");\n        System.out.println(`"        - run: mvn -B verify              # build + test`");\n        System.out.println(`"        - run: mvn checkstyle:check       # code style`");\n        System.out.println(`"        - run: mvn spotbugs:check         # static analysis`");\n        System.out.println(`"        - uses: actions/upload-artifact@v4`");\n        System.out.println(`"          with: { name: jar, path: target/*.jar }`");\n    }\n\n    static void printQualityGates() {\n        System.out.println(`"\n--- Quality gates ---`");\n        System.out.println(`"  All tests pass (unit + integration)`");\n        System.out.println(`"  Code coverage >= 80%`");\n        System.out.println(`"  No critical SpotBugs / OWASP dependency-check findings`");\n        System.out.println(`"  Docker image builds successfully`");\n        System.out.println(`"  Deployed to staging and smoke test passes`");\n    }\n}")
  "8.3" = @("Kubernetes Fundamentals",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 8.3: Kubernetes Fundamentals ===\n`");\n        printDeployment();\n        printService();\n        printProbes();\n        printRollingUpdate();\n    }\n\n    static void printDeployment() {\n        System.out.println(`"--- deployment.yaml ---`");\n        System.out.println(`"  apiVersion: apps/v1`");\n        System.out.println(`"  kind: Deployment`");\n        System.out.println(`"  metadata: { name: backend, labels: { app: backend } }`");\n        System.out.println(`"  spec:`");\n        System.out.println(`"    replicas: 3`");\n        System.out.println(`"    selector: { matchLabels: { app: backend } }`");\n        System.out.println(`"    template:`");\n        System.out.println(`"      spec:`");\n        System.out.println(`"        containers:`");\n        System.out.println(`"          - name: backend`");\n        System.out.println(`"            image: myregistry/backend:v1.2.3`");\n        System.out.println(`"            ports: [ containerPort: 8080 ]`");\n        System.out.println(`"            resources:`");\n        System.out.println(`"              requests: { cpu: 250m, memory: 256Mi }`");\n        System.out.println(`"              limits:   { cpu: 500m, memory: 512Mi }`");\n    }\n\n    static void printService() {\n        System.out.println(`"\n--- service.yaml ---`");\n        System.out.println(`"  apiVersion: v1`");\n        System.out.println(`"  kind: Service`");\n        System.out.println(`"  metadata: { name: backend-svc }`");\n        System.out.println(`"  spec:`");\n        System.out.println(`"    selector: { app: backend }`");\n        System.out.println(`"    ports: [ port: 80, targetPort: 8080 ]`");\n        System.out.println(`"    type: ClusterIP`");\n    }\n\n    static void printProbes() {\n        System.out.println(`"\n--- Health probes ---`");\n        System.out.println(`"  livenessProbe:   httpGet /actuator/health  (restart if fails)`");\n        System.out.println(`"  readinessProbe:  httpGet /actuator/health/readiness (remove from LB if fails)`");\n        System.out.println(`"  startupProbe:    httpGet /actuator/health  (prevent restart during startup)`");\n    }\n\n    static void printRollingUpdate() {\n        System.out.println(`"\n--- Rolling update strategy ---`");\n        System.out.println(`"  strategy:`");\n        System.out.println(`"    type: RollingUpdate`");\n        System.out.println(`"    rollingUpdate:`");\n        System.out.println(`"      maxUnavailable: 0   # never reduce below desired replicas`");\n        System.out.println(`"      maxSurge: 1         # allow one extra pod during update`");\n        System.out.println(`"\n  kubectl rollout status deploy/backend`");\n        System.out.println(`"  kubectl rollout undo   deploy/backend    # instant rollback`");\n    }\n}")
  "8.4" = @("Observability and SRE Basics",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 8.4: Observability and SRE Basics ===\n`");\n        printThreePillars();\n        printSloExample();\n        printAlertRules();\n    }\n\n    static void printThreePillars() {\n        System.out.println(`"--- Three Pillars of Observability ---`");\n        System.out.println(`"  METRICS  (Prometheus)`");\n        System.out.println(`"    - Numeric time-series: request rate, error rate, latency, saturation`");\n        System.out.println(`"    - Spring Boot Actuator + Micrometer exposes /actuator/prometheus`");\n        System.out.println(`"    - Example metric: http_server_requests_seconds{status=\\'200\\'}`");\n        System.out.println(`"\n  LOGS     (Logback + Loki / ELK)`");\n        System.out.println(`"    - Structured JSON logs with traceId field for correlation`");\n        System.out.println(`"    - LOG: {level:INFO, traceId:abc, message:'Order placed', orderId:'123'}`");\n        System.out.println(`"\n  TRACES   (OpenTelemetry + Jaeger / Zipkin)`");\n        System.out.println(`"    - Distributed trace: follows a request across service boundaries`");\n        System.out.println(`"    - Span: one unit of work; Trace: tree of spans`");\n    }\n\n    static void printSloExample() {\n        System.out.println(`"\n--- SLI / SLO example ---`");\n        System.out.println(`"  SLI: % of requests that complete < 200 ms`");\n        System.out.println(`"  SLO: >= 99.9% of requests complete < 200 ms over 30 days`");\n        System.out.println(`"  Error budget: 0.1% of requests may fail = ~43 minutes/month`");\n        System.out.println(`"  Burn rate: how fast you are consuming the error budget`");\n    }\n\n    static void printAlertRules() {\n        System.out.println(`"\n--- Prometheus alert rules (PromQL) ---`");\n        System.out.println(`"  # High error rate`");\n        System.out.println(`"  rate(http_requests_total{status=~\\'5..\\'`}[5m]) > 0.05`");\n        System.out.println(`"\n  # Slow p99 latency`");\n        System.out.println(`"  histogram_quantile(0.99, rate(http_duration_bucket[5m])) > 1`");\n        System.out.println(`"\n  # Low JVM heap remaining`");\n        System.out.println(`"  jvm_memory_used_bytes / jvm_memory_max_bytes > 0.85`");\n    }\n}")
  "8.5" = @("Performance and Capacity Planning",
    "import java.util.*;\nimport java.util.stream.*;\n\npublic class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 8.5: Performance and Capacity Planning ===\n`");\n        benchmarkStringOps();\n        printJvmTuningNotes();\n        printCapacityModel();\n    }\n\n    static void benchmarkStringOps() {\n        int N = 100_000;\n        System.out.println(`"--- Micro-benchmark: String + vs StringBuilder ---`");\n\n        long t1 = System.nanoTime();\n        String s = `"`";\n        for (int i = 0; i < N; i++) s += `"x`";\n        long concatTime = System.nanoTime() - t1;\n\n        long t2 = System.nanoTime();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < N; i++) sb.append(`"x`");\n        long sbTime = System.nanoTime() - t2;\n\n        System.out.printf(`"  String +       : %6d ms%n`", concatTime / 1_000_000);\n        System.out.printf(`"  StringBuilder  : %6d ms%n`", sbTime / 1_000_000);\n        System.out.printf(`"  Speedup        : %.0fx%n`", (double) concatTime / sbTime);\n    }\n\n    static void printJvmTuningNotes() {\n        System.out.println(`"\n--- JVM Tuning Quick Reference ---`");\n        String[][] opts = {\n            {`"-Xms512m -Xmx2g`",              `"Set initial and max heap`"},\n            {`"-XX:+UseG1GC`",                 `"Use G1 GC (default Java 9+)`"},\n            {`"-XX:MaxGCPauseMillis=200`",      `"Target GC pause goal`"},\n            {`"-XX:+HeapDumpOnOutOfMemoryError`",`"Capture OOM heap dump`"},\n            {`"-Xlog:gc*:gc.log`",              `"Log all GC events to file`"}\n        };\n        for (String[] r : opts)\n            System.out.printf(`"  %-38s  %s%n`", r[0], r[1]);\n    }\n\n    static void printCapacityModel() {\n        System.out.println(`"\n--- Back-of-envelope capacity model ---`");\n        int rps = 1000;       // requests per second\n        int avgMs = 50;        // avg latency\n        int threads = (rps * avgMs) / 1000 + 10; // Little's Law + buffer\n        System.out.printf(`"  Target RPS  : %,d%n`", rps);\n        System.out.printf(`"  Avg latency : %d ms%n`", avgMs);\n        System.out.printf(`"  Threads needed (Little\\'s Law + 20%%): %d%n`", threads);\n        System.out.printf(`"  Replicas needed (1 pod = 200 rps): %.0f%n`", Math.ceil(rps / 200.0));\n    }\n}")
  "9.1" = @("Microservices Design",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 9.1: Microservices Design ===\n`");\n        printServiceDecomposition();\n        printCommunicationPatterns();\n        printTradeoffs();\n    }\n\n    static void printServiceDecomposition() {\n        System.out.println(`"--- Domain-based decomposition (DDD Bounded Contexts) ---`");\n        String[][] services = {\n            {`"user-service`",     `"User identity, profiles, auth delegation`"},\n            {`"order-service`",    `"Order lifecycle, status, history`"},\n            {`"product-service`",  `"Product catalogue, pricing, stock`"},\n            {`"payment-service`",  `"Payment processing, refunds`"},\n            {`"notification-svc`", `"Email, SMS, push alerts`"},\n            {`"api-gateway`",      `"Auth, routing, rate-limit, BFF`"}\n        };\n        for (String[] s : services)\n            System.out.printf(`"  %-18s  %s%n`", s[0], s[1]);\n    }\n\n    static void printCommunicationPatterns() {\n        System.out.println(`"\n--- Communication patterns ---`");\n        System.out.println(`"  Synchronous  (REST/gRPC):`");\n        System.out.println(`"    + Simple to reason about; immediate response`");\n        System.out.println(`"    - Tight coupling; caller blocked; cascade failures`");\n        System.out.println(`"\n  Asynchronous (Kafka/RabbitMQ):`");\n        System.out.println(`"    + Loose coupling; resilient; load buffering`");\n        System.out.println(`"    - Eventual consistency; harder to debug`");\n        System.out.println(`"\n  Rule: async for cross-domain writes; sync for reads`");\n    }\n\n    static void printTradeoffs() {\n        System.out.println(`"\n--- Monolith vs Microservices ---`");\n        System.out.println(`"  Monolith:      easy to run, test, and debug; hard to scale independently`");\n        System.out.println(`"  Microservices: independent scale/deploy; complexity in ops and data`");\n        System.out.println(`"  Guideline:     start with a modular monolith; extract services when pain is real`");\n    }\n}")
  "9.2" = @("Spring Cloud Patterns",
    "import java.util.*;\nimport java.util.concurrent.atomic.*;\n\npublic class AnswerApp {\n\n    // Simulate circuit breaker states\n    enum State { CLOSED, OPEN, HALF_OPEN }\n\n    static class CircuitBreaker {\n        private State state = State.CLOSED;\n        private int   failures = 0;\n        private final int threshold = 3;\n\n        public String call(String name, java.util.function.Supplier<String> action) {\n            if (state == State.OPEN) {\n                System.out.println(`"  [CB] OPEN - fallback for `" + name);\n                return `"Fallback response`";\n            }\n            try {\n                String result = action.get();\n                failures = 0;\n                if (state == State.HALF_OPEN) { state = State.CLOSED; System.out.println(`"  [CB] -> CLOSED`"); }\n                return result;\n            } catch (Exception e) {\n                failures++;\n                System.out.println(`"  [CB] Failure `" + failures + `" for `" + name);\n                if (failures >= threshold) { state = State.OPEN; System.out.println(`"  [CB] -> OPEN`"); }\n                return `"Error: `" + e.getMessage();\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 9.2: Spring Cloud Patterns ===\n`");\n\n        CircuitBreaker cb = new CircuitBreaker();\n        AtomicInteger calls = new AtomicInteger();\n\n        System.out.println(`"--- Circuit breaker demo (threshold=3) ---`");\n        for (int i = 0; i < 7; i++) {\n            int n = calls.incrementAndGet();\n            String result = cb.call(`"payment-service`", () -> {\n                if (n <= 5) throw new RuntimeException(`"Connection refused`");\n                return `"OK`";\n            });\n            System.out.printf(`"  Call %d: %s%n`", n, result);\n        }\n\n        System.out.println(`"\n--- Spring Cloud components ---`");\n        String[][] components = {\n            {`"Config Server`",      `"Centralised configuration from Git`"},\n            {`"Eureka`",            `"Service discovery and registry`"},\n            {`"Spring Cloud Gateway`",`"API gateway with routing and filters`"},\n            {`"Resilience4j`",       `"Circuit breaker, retry, rate limiter, bulkhead`"},\n            {`"Sleuth / Micrometer Tracing`",`"Distributed trace context propagation`"}\n        };\n        for (String[] c : components)\n            System.out.printf(`"  %-30s  %s%n`", c[0], c[1]);\n    }\n}")
  "9.3" = @("Distributed Data and Consistency",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    record SagaStep(String name, String action, String compensation) {}\n\n    static class SagaOrchestrator {\n        private final List<SagaStep> steps;\n        private final List<SagaStep> executed = new ArrayList<>();\n\n        SagaOrchestrator(List<SagaStep> steps) { this.steps = steps; }\n\n        public boolean execute() {\n            for (SagaStep step : steps) {\n                System.out.printf(`"  [SAGA] Execute: %s -> %s%n`", step.name(), step.action());\n                boolean success = !step.name().equals(`"Payment`"); // simulate failure at Payment\n                if (!success) {\n                    System.out.println(`"  [SAGA] Failure at `" + step.name() + `" - rolling back`");\n                    rollback();\n                    return false;\n                }\n                executed.add(step);\n            }\n            return true;\n        }\n\n        private void rollback() {\n            List<SagaStep> reversed = new ArrayList<>(executed);\n            Collections.reverse(reversed);\n            reversed.forEach(s -> System.out.printf(`"  [SAGA] Compensate: %s -> %s%n`", s.name(), s.compensation()));\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 9.3: Distributed Data and Consistency ===\n`");\n\n        List<SagaStep> orderSaga = List.of(\n            new SagaStep(`"ReserveInventory`", `"lock stock`",         `"release stock`"),\n            new SagaStep(`"Payment`",          `"charge credit card`", `"refund charge`"),\n            new SagaStep(`"CreateShipment`",   `"schedule delivery`",  `"cancel shipment`")\n        );\n\n        System.out.println(`"--- Order Saga (simulate payment failure) ---`");\n        boolean ok = new SagaOrchestrator(orderSaga).execute();\n        System.out.println(`"Saga outcome: `" + (ok ? `"COMMITTED`" : `"ROLLED BACK`"));\n\n        System.out.println(`"\n--- Outbox pattern ---`");\n        System.out.println(`"  1. Save entity + event in outbox table in SAME DB transaction`");\n        System.out.println(`"  2. Outbox poller reads unpublished events and sends to Kafka`");\n        System.out.println(`"  3. Mark events as published`");\n        System.out.println(`"  Result: guaranteed event delivery even if Kafka is temporarily down`");\n\n        System.out.println(`"\n--- Idempotency key pattern ---`");\n        System.out.println(`"  Client sends unique idempotency-key header with every POST`");\n        System.out.println(`"  Server stores key+result in DB; re-delivers same result on retry`");\n        System.out.println(`"  Prevents duplicate charges / orders on network retry`");\n    }\n}")
  "9.4" = @("API Gateway and BFF",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 9.4: API Gateway and BFF ===\n`");\n        printGatewayResponsibilities();\n        printBffPattern();\n        printRateLimitSimulation();\n    }\n\n    static void printGatewayResponsibilities() {\n        System.out.println(`"--- API Gateway responsibilities ---`");\n        String[] resp = {\n            `"TLS termination`",`"Authentication (validate JWT)`",`"Authorization (check scopes)`",\n            `"Rate limiting (per user/IP/tenant)`",`"Request routing to services`",\n            `"Request/response transformation`",`"Load balancing`",`"Circuit breaking`",\n            `"Observability (logs, traces)`",`"Caching GET responses`"\n        };\n        for (String r : resp) System.out.println(`"  - `" + r);\n    }\n\n    static void printBffPattern() {\n        System.out.println(`"\n--- Backend for Frontend (BFF) ---`");\n        System.out.println(`"  Problem: mobile app needs a compact API; web app needs a richer one.`");\n        System.out.println(`"  Solution: separate BFF per client type, each aggregating micro-APIs.`");\n        System.out.println(`"\n  mobile-bff  --> user-service`");\n        System.out.println(`"              --> order-service`");\n        System.out.println(`"\n  web-bff     --> user-service`");\n        System.out.println(`"              --> order-service`");\n        System.out.println(`"              --> analytics-service`");\n    }\n\n    static void printRateLimitSimulation() {\n        System.out.println(`"\n--- Token bucket rate limiter simulation ---`");\n        int capacity = 5, tokens = 5, refillPerSec = 2;\n        System.out.printf(`"  Bucket capacity: %d  Refill: %d/sec%n`", capacity, refillPerSec);\n        for (int i = 1; i <= 9; i++) {\n            if (tokens > 0) {\n                tokens--;\n                System.out.printf(`"  Request %d: ALLOWED (tokens left: %d)%n`", i, tokens);\n            } else {\n                System.out.printf(`"  Request %d: THROTTLED (429)%n`", i);\n            }\n            if (i % 3 == 0) { tokens = Math.min(capacity, tokens + refillPerSec); System.out.printf(`"  [+%d tokens refilled, now: %d]%n`", refillPerSec, tokens); }\n        }\n    }\n}")
  "9.5" = @("System Design in Practice",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 9.5: System Design in Practice ===\n`");\n        caseStudyUrlShortener();\n    }\n\n    static void caseStudyUrlShortener() {\n        System.out.println(`"--- Case Study: URL Shortener (bit.ly style) ---`");\n        System.out.println(`"\n1. Requirements clarification`");\n        System.out.println(`"   Functional: shorten URL, redirect, analytics`");\n        System.out.println(`"   Non-functional: 100K writes/day, 10M reads/day, p99 redirect < 50ms, 5yr retention`");\n        System.out.println(`"\n2. Capacity estimation`");\n        System.out.println(`"   Writes: 100K/day = ~1/sec`");\n        System.out.println(`"   Reads:  10M/day  = ~115/sec (read-heavy: 100:1 ratio)`");\n        System.out.println(`"   Storage: 100K/day * 365 * 5 = ~180M URLs`");\n        System.out.println(`"   Each URL row ~500 bytes -> 90GB over 5 years`");\n        System.out.println(`"\n3. High-level design`");\n        System.out.println(`"   POST /shorten  -> shortening service -> DB write`");\n        System.out.println(`"   GET  /{code}   -> redirect service  -> cache lookup -> 301 redirect`");\n        System.out.println(`"\n4. Key decisions`");\n        System.out.println(`"   Short code: base62(auto-increment ID) - simple, no collision`");\n        System.out.println(`"   Cache: Redis TTL cache on hot URLs (80/20 rule)`");\n        System.out.println(`"   DB: PostgreSQL (ACID, simple schema)`");\n        System.out.println(`"   CDN: cache 301 redirects at edge for lowest latency`");\n        System.out.println(`"\n5. Trade-offs`");\n        System.out.println(`"   301 vs 302: 301 cached by browser (fewer hits); 302 always hits server (better analytics)`");\n        System.out.println(`"   Consistency: eventual OK for analytics; strong for URL resolution`");\n    }\n}")
  "10.1"= @("Architecture Decision Records",
    "import java.util.*;\nimport java.time.LocalDate;\n\npublic class AnswerApp {\n\n    record Adr(int number, String title, String status, String context, String decision, String consequences) {}\n\n    static Adr buildAdr001() {\n        return new Adr(\n            1,\n            `"Use PostgreSQL as primary datastore`",\n            `"Accepted`",\n            `"We need a relational DB for order and user data with strong ACID guarantees.`",\n            `"Use PostgreSQL 16. Justification: mature, excellent JSON support, strong ecosystem.`",\n            `"Pro: ACID, jsonb, pg_partman. Con: requires DBA expertise for tuning at scale.`");\n    }\n\n    static void printAdr(Adr adr) {\n        System.out.printf(`"# ADR-%03d: %s%n`", adr.number(), adr.title());\n        System.out.printf(`"Status : %s%n`", adr.status());\n        System.out.printf(`"Date   : %s%n`", LocalDate.now());\n        System.out.println(`"Context:`");\n        System.out.println(`"  `" + adr.context());\n        System.out.println(`"Decision:`");\n        System.out.println(`"  `" + adr.decision());\n        System.out.println(`"Consequences:`");\n        System.out.println(`"  `" + adr.consequences());\n    }\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 10.1: Architecture Decision Records ===\n`");\n        printAdr(buildAdr001());\n        System.out.println(`"\n--- ADR lifecycle ---`");\n        System.out.println(`"  Proposed -> Accepted -> Deprecated -> Superseded`");\n        System.out.println(`"\n--- File naming convention ---`");\n        System.out.println(`"  docs/adr/0001-use-postgresql.md`");\n        System.out.println(`"  docs/adr/0002-use-kafka-for-events.md`");\n    }\n}")
  "10.2"= @("Technical Communication",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 10.2: Technical Communication ===\n`");\n        printDesignDocTemplate();\n        printStakeholderUpdate();\n    }\n\n    static void printDesignDocTemplate() {\n        System.out.println(`"--- Design Document Template ---`");\n        System.out.println(`"  1. Problem Statement     - What are we solving and why now?`");\n        System.out.println(`"  2. Goals / Non-Goals     - Explicit scope boundaries`");\n        System.out.println(`"  3. Proposed Solution     - High-level approach`");\n        System.out.println(`"  4. Alternatives          - What else was considered and why rejected`");\n        System.out.println(`"  5. Architecture Diagram  - Key components and data flows`");\n        System.out.println(`"  6. Data Model            - Schema or document structure`");\n        System.out.println(`"  7. API Contract          - Endpoints, payloads, error codes`");\n        System.out.println(`"  8. Security Considerations`");\n        System.out.println(`"  9. Operational Plan      - Rollout, monitoring, rollback`");\n        System.out.println(`"  10. Open Questions`");\n    }\n\n    static void printStakeholderUpdate() {\n        System.out.println(`"\n--- Weekly stakeholder update format ---`");\n        System.out.println(`"  STATUS: On track / At risk / Blocked`");\n        System.out.println(`"  DONE:   What was completed this week`");\n        System.out.println(`"  NEXT:   What is planned for next week`");\n        System.out.println(`"  RISKS:  Current blockers and mitigation`");\n        System.out.println(`"  ASKS:   What do we need from stakeholders`");\n    }\n}")
  "10.3"= @("Code Review Mastery",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    enum Severity { BLOCKING, SUGGESTION, NIT }\n    record ReviewComment(Severity severity, String file, int line, String comment) {}\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 10.3: Code Review Mastery ===\n`");\n\n        List<ReviewComment> comments = List.of(\n            new ReviewComment(Severity.BLOCKING,    `"OrderService.java`", 42,\n                `"Potential NPE: findById() result not checked before .get(). Use Optional.orElseThrow().`"),\n            new ReviewComment(Severity.SUGGESTION,  `"UserController.java`", 18,\n                `"Consider adding @Valid to @RequestBody to enable Bean Validation automatically.`"),\n            new ReviewComment(Severity.NIT,          `"StringUtils.java`", 5,\n                `"Rename 'str' to 'input' for clarity.`")\n        );\n\n        System.out.println(`"--- Review comments ---`");\n        for (ReviewComment c : comments)\n            System.out.printf(`"  [%-10s] %s:%d  %s%n`", c.severity(), c.file(), c.line(), c.comment());\n\n        System.out.println(`"\n--- Review checklist ---`");\n        String[] checks = {\n            `"Correctness: does it do what the spec says?`",\n            `"Edge cases: null, empty, overflow, concurrent access`",\n            `"Security: no SQL injection, no exposed secrets`",\n            `"Performance: no N+1, no blocking calls on hot path`",\n            `"Testability: is it covered by tests?`",\n            `"Readability: would a new team member understand it in 5 min?`"\n        };\n        for (String c : checks) System.out.println(`"  [ ] `" + c);\n    }\n}")
  "10.4"= @("Mentoring and Team Practices",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    record GrowthPlan(String engineer, String goal, String action, String measure, String timeline) {}\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 10.4: Mentoring and Team Practices ===\n`");\n\n        List<GrowthPlan> plans = List.of(\n            new GrowthPlan(`"Junior Bob`",   `"Ship independently`",\n                `"Own one feature end-to-end with light guidance`",\n                `"PR merged without structural changes`",`"8 weeks`"),\n            new GrowthPlan(`"Mid Carol`",    `"Lead a design`",\n                `"Write design doc for next feature; present to team`",\n                `"Team aligned in review, ADR accepted`", `"4 weeks`")\n        );\n\n        System.out.println(`"--- Individual Growth Plans ---`");\n        for (GrowthPlan p : plans) {\n            System.out.printf(`"  %s%n`", p.engineer());\n            System.out.printf(`"    Goal    : %s%n`", p.goal());\n            System.out.printf(`"    Action  : %s%n`", p.action());\n            System.out.printf(`"    Measure : %s%n`", p.measure());\n            System.out.printf(`"    Timeline: %s%n%n`", p.timeline());\n        }\n\n        System.out.println(`"--- Team practices cadence ---`");\n        System.out.println(`"  Daily standup     : 15 min, async-first, blockers only`");\n        System.out.println(`"  Sprint planning   : 2 hr every 2 weeks`");\n        System.out.println(`"  Retrospective     : 1 hr every sprint`");\n        System.out.println(`"  Pair programming  : 20% of sprint capacity for knowledge sharing`");\n        System.out.println(`"  Tech talks        : bi-weekly 30-min team knowledge session`");\n    }\n}")
  "11.1"= @("Capstone Planning",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    record Milestone(String name, String deliverable, String week) {}\n    record Risk(String description, String impact, String mitigation) {}\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 11.1: Capstone Planning ===\n`");\n\n        System.out.println(`"Project: Library Management Platform (full-stack Java)`");\n        System.out.println(`"\n--- Milestones ---`");\n        List<Milestone> ms = List.of(\n            new Milestone(`"M1: Core backend`",   `"Users API, Books API, auth`",         `"Week 31 Day 1-2`"),\n            new Milestone(`"M2: Persistence`",    `"PostgreSQL, migrations, JPA`",         `"Week 31 Day 3`"),\n            new Milestone(`"M3: Frontend`",       `"React SPA, API integration`",          `"Week 31 Day 4-5`"),\n            new Milestone(`"M4: DevOps`",         `"Docker, CI/CD, k8s manifests`",        `"Week 32 Day 1-2`"),\n            new Milestone(`"M5: Observability`",  `"Prometheus, Grafana, traces`",         `"Week 32 Day 3`"),\n            new Milestone(`"M6: Hardening`",      `"Security, load test, ADRs`",           `"Week 32 Day 4-5`")\n        );\n        ms.forEach(m -> System.out.printf(`"  %-20s %-40s %s%n`", m.name(), m.deliverable(), m.week()));\n\n        System.out.println(`"\n--- Risk Register ---`");\n        List<Risk> risks = List.of(\n            new Risk(`"Scope creep`",       `"HIGH`", `"Freeze feature list after M1`"),\n            new Risk(`"Infra setup time`",  `"MED`",  `"Use docker-compose first, k8s second`"),\n            new Risk(`"Performance issues`",`"LOW`",  `"Load test early; set SLOs in M5`")\n        );\n        risks.forEach(r -> System.out.printf(`"  [%-6s] %-25s %s%n`", r.impact(), r.description(), r.mitigation()));\n    }\n}")
  "11.2"= @("Capstone Sprint 1",
    "import java.util.*;\n\npublic class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 11.2: Capstone Sprint 1 - Backend + DB + Auth ===\n`");\n\n        System.out.println(`"--- Sprint 1 acceptance criteria ---`");\n        String[] criteria = {\n            `"POST /api/auth/login returns JWT`",\n            `"GET  /api/books returns paginated list (requires valid JWT)`",\n            `"POST /api/books creates a book (ADMIN role only)`",\n            `"All endpoints return structured error responses`",\n            `"PostgreSQL schema applied via Flyway migrations`",\n            `"80%+ unit test coverage on service layer`",\n            `"Docker compose starts backend + DB successfully`"\n        };\n        for (String c : criteria) System.out.println(`"  [ ] `" + c);\n\n        System.out.println(`"\n--- Key Spring Boot annotations used ---`");\n        System.out.println(`"  @RestController @RequestMapping @GetMapping @PostMapping`");\n        System.out.println(`"  @Entity @Id @GeneratedValue @Column @ManyToOne`");\n        System.out.println(`"  @Service @Transactional @Repository`");\n        System.out.println(`"  @PreAuthorize(\\\"hasRole('ADMIN')\\\")`");\n    }\n}")
  "11.3"= @("Capstone Sprint 2",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 11.3: Capstone Sprint 2 - Frontend + Integration + Observability ===\n`");\n\n        System.out.println(`"--- Sprint 2 acceptance criteria ---`");\n        String[] criteria = {\n            `"React SPA with login, book list, and book detail pages`",\n            `"API client uses Axios with JWT auth header interceptor`",\n            `"401 triggers token refresh then retries the request`",\n            `"Spring Boot Actuator + Micrometer + Prometheus metrics endpoint`",\n            `"Grafana dashboard shows request rate, error rate, latency p99`",\n            `"Structured JSON logs with traceId field`",\n            `"Integration test: end-to-end happy path with Testcontainers`"\n        };\n        for (String c : criteria) System.out.println(`"  [ ] `" + c);\n\n        System.out.println(`"\n--- Observability stack ---`");\n        System.out.println(`"  Prometheus: scrapes /actuator/prometheus every 15s`");\n        System.out.println(`"  Grafana   : JVM dashboard + custom request dashboard`");\n        System.out.println(`"  Loki      : receives log events via Logback appender`");\n    }\n}")
  "11.4"= @("Capstone Sprint 3",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 11.4: Capstone Sprint 3 - Deployment + Load Test + Hardening ===\n`");\n\n        System.out.println(`"--- Sprint 3 acceptance criteria ---`");\n        String[] criteria = {\n            `"Kubernetes manifests deploy full stack to local cluster`",\n            `"Horizontal Pod Autoscaler scales backend 2-5 replicas`",\n            `"k6 load test: 200 RPS for 2 min, p99 < 200ms`",\n            `"OWASP dependency-check passes (no critical CVEs)`",\n            `"TLS enabled on Ingress`",\n            `"ADR documents: DB choice, auth strategy, observability stack`",\n            `"Runbook written: startup, health check, rollback procedure`"\n        };\n        for (String c : criteria) System.out.println(`"  [ ] `" + c);\n    }\n}")
  "11.5"= @("Interview and Portfolio",
    "public class AnswerApp {\n\n    public static void main(String[] args) {\n        System.out.println(`"=== Lesson 11.5: Interview and Portfolio Package ===\n`");\n        printStarStories();\n        printSystemDesignTips();\n        printPortfolioChecklist();\n    }\n\n    static void printStarStories() {\n        System.out.println(`"--- STAR Story Template ---`");\n        System.out.println(`"  Situation : What was the context and challenge?`");\n        System.out.println(`"  Task      : What was your specific responsibility?`");\n        System.out.println(`"  Action    : What steps did YOU take? (use 'I', not 'we')`");\n        System.out.println(`"  Result    : What measurable outcome did you produce?`");\n        System.out.println(`"\n  Example:`");\n        System.out.println(`"  S: Our checkout API was failing 3% of requests under load`");\n        System.out.println(`"  T: I owned the performance investigation and fix`");\n        System.out.println(`"  A: Profiled with async-profiler, found N+1 query, added JOIN FETCH`");\n        System.out.println(`"  R: Reduced error rate to 0.1% and p99 latency from 800ms to 120ms`");\n    }\n\n    static void printSystemDesignTips() {\n        System.out.println(`"\n--- System Design Interview Framework ---`");\n        System.out.println(`"  1. Clarify requirements (2-3 min)`");\n        System.out.println(`"  2. Estimate scale (writes, reads, storage)`");\n        System.out.println(`"  3. High-level design (boxes + arrows)`");\n        System.out.println(`"  4. Deep dive on 2 components the interviewer picks`");\n        System.out.println(`"  5. Trade-offs and bottlenecks`");\n    }\n\n    static void printPortfolioChecklist() {\n        System.out.println(`"\n--- Portfolio README checklist ---`");\n        String[] items = {\n            `"Problem statement in 2 sentences`",\n            `"Architecture diagram`",\n            `"Tech stack with justifications`",\n            `"How to run locally (one command)`",\n            `"Link to live demo or screenshots`",\n            `"Key engineering decisions (link to ADRs)`",\n            `"Metrics: test coverage, load test results`",\n            `"What you would improve next`"\n        };\n        for (String i : items) System.out.println(`"  [ ] `" + i);\n    }\n}")
}

foreach ($id in $remaining.Keys) {
  $title = $remaining[$id][0]
  # Build the Java code - the value contains the code body
  $body = $remaining[$id][1] -replace '`"', '"' -replace '`\$', '$'

  $javaCode = $body
  Write-Java $id $javaCode
  $written++
}

Write-Host ""
Write-Host "Done. Total solutions written this pass."
