import java.util.*;

/**
 * Lesson 3.3 - Mocking and Test Design
 *
 * Demonstrates hand-written fakes that mirror what Mockito provides.
 * In your real project:
 *   UserRepository mockRepo = Mockito.mock(UserRepository.class);
 *   Mockito.when(mockRepo.findById(1)).thenReturn(Optional.of(user));
 *
 * KEY TERMS:
 *   mock    - test double that records and verifies interactions.
 *   stub    - test double that returns pre-programmed responses.
 *   fake    - lightweight in-memory implementation used only in tests.
 *   verify  - assert that a collaborator was called as expected.
 */
public class AnswerApp {

    // ── Interfaces (boundaries we can mock) ────────────────────────
    interface UserRepository {
        Optional<String> findById(int id);
        void save(int id, String name);
    }

    interface AuditLogger {
        void log(String event);
    }

    // ── Production service ─────────────────────────────────────────
    static class UserService {
        private final UserRepository repo;
        private final AuditLogger    logger;

        UserService(UserRepository repo, AuditLogger logger) {
            // Constructor injection - easy to swap with fakes in tests
            this.repo   = repo;
            this.logger = logger;
        }

        public String getUser(int id) {
            return repo.findById(id).orElseThrow(
                () -> new NoSuchElementException("User " + id + " not found"));
        }

        public void createUser(int id, String name) {
            if (name == null || name.isBlank())
                throw new IllegalArgumentException("name must not be blank");
            repo.save(id, name);
            logger.log("USER_CREATED id=" + id);
        }
    }

    // ── Fake implementations ───────────────────────────────────────
    static class FakeUserRepository implements UserRepository {
        final Map<Integer, String> data = new HashMap<>();
        int saveCallCount = 0;

        @Override public Optional<String> findById(int id) {
            return Optional.ofNullable(data.get(id));
        }
        @Override public void save(int id, String name) {
            data.put(id, name);
            saveCallCount++;
        }
    }

    static class FakeAuditLogger implements AuditLogger {
        final List<String> events = new ArrayList<>();
        @Override public void log(String event) { events.add(event); }
    }

    // ── Test harness ──────────────────────────────────────────────
    static int pass = 0, fail = 0;
    static void test(String name, Runnable r) {
        try { r.run(); System.out.printf("  PASS  %s%n", name); pass++; }
        catch (Throwable t) { System.out.printf("  FAIL  %s -- %s%n", name, t.getMessage()); fail++; }
    }
    static void eq(Object e, Object a) {
        if (!Objects.equals(e, a)) throw new AssertionError("Expected " + e + " got " + a);
    }
    static void ok(boolean c, String m) { if (!c) throw new AssertionError(m); }

    static void runTests() {
        test("createUser - saves to repository", () -> {
            FakeUserRepository repo   = new FakeUserRepository();
            FakeAuditLogger    logger = new FakeAuditLogger();
            UserService svc = new UserService(repo, logger);

            svc.createUser(1, "Alice");

            eq(1,       repo.saveCallCount);
            eq("Alice", repo.data.get(1));
        });

        test("createUser - logs audit event", () -> {
            FakeUserRepository repo   = new FakeUserRepository();
            FakeAuditLogger    logger = new FakeAuditLogger();
            new UserService(repo, logger).createUser(42, "Bob");

            eq(1, logger.events.size());
            ok(logger.events.get(0).contains("USER_CREATED"), "event must contain USER_CREATED");
        });

        test("createUser - blank name throws exception", () -> {
            UserService svc = new UserService(new FakeUserRepository(), new FakeAuditLogger());
            try {
                svc.createUser(1, "  ");
                throw new AssertionError("Expected IllegalArgumentException");
            } catch (IllegalArgumentException e) {
                ok(e.getMessage().contains("blank"), "message mentions blank");
            }
        });

        test("getUser - existing user returned", () -> {
            FakeUserRepository repo = new FakeUserRepository();
            repo.data.put(5, "Carol");
            String name = new UserService(repo, new FakeAuditLogger()).getUser(5);
            eq("Carol", name);
        });

        test("getUser - missing user throws NoSuchElementException", () -> {
            UserService svc = new UserService(new FakeUserRepository(), new FakeAuditLogger());
            try {
                svc.getUser(999);
                throw new AssertionError("Expected NoSuchElementException");
            } catch (NoSuchElementException e) {
                ok(e.getMessage().contains("999"), "message mentions id");
            }
        });
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 3.3: Mocking and Test Design ===\n");
        runTests();
        System.out.printf("%n%d passed, %d failed%n", pass, fail);
    }
}