$files = @{
  'd:\GitHub_Src\Interview\complete_java_prep\lessons\lesson-4.1-spring-core-concepts\sample-project\src\main\java\AnswerApp.java' = @'
import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

public class AnswerApp {
    static final class MiniContainer {
        private final Map<Class<?>, Supplier<?>> providers = new HashMap<>();
        <T> void register(Class<T> type, Supplier<T> provider) { providers.put(type, provider); }
        <T> T resolve(Class<T> type) {
            Supplier<?> provider = providers.get(type);
            if (provider == null) {
                throw new IllegalStateException("No provider for type: " + type.getSimpleName());
            }
            return type.cast(provider.get());
        }
    }

    static final class UserRepository {
        String findDisplayNameById(String id) { return "user-" + id; }
    }

    static final class UserService {
        private final UserRepository repository;
        UserService(UserRepository repository) { this.repository = repository; }
        String greeting(String userId) { return "Hello, " + repository.findDisplayNameById(userId) + "!"; }
    }

    public static void main(String[] args) {
        MiniContainer container = new MiniContainer();
        container.register(UserRepository.class, UserRepository::new);
        container.register(UserService.class, () -> new UserService(container.resolve(UserRepository.class)));

        UserService service = container.resolve(UserService.class);
        System.out.println("Lesson 4.1 - IoC/DI simulation");
        System.out.println(service.greeting("42"));
    }
}
'@;

  'd:\GitHub_Src\Interview\complete_java_prep\lessons\lesson-4.2-building-rest-apis-with-spring-boot\sample-project\src\main\java\AnswerApp.java' = @'
import java.util.LinkedHashMap;
import java.util.Map;

public class AnswerApp {
    record Task(String id, String title, boolean done) {}

    static final class TaskApi {
        private final Map<String, Task> store = new LinkedHashMap<>();

        Task create(String id, String title) {
            validateId(id);
            validateTitle(title);
            if (store.containsKey(id)) {
                throw new IllegalArgumentException("409 CONFLICT: id already exists");
            }
            Task task = new Task(id, title.trim(), false);
            store.put(id, task);
            return task;
        }

        Task markDone(String id) {
            Task existing = store.get(id);
            if (existing == null) {
                throw new IllegalArgumentException("404 NOT FOUND: task not found");
            }
            Task updated = new Task(existing.id(), existing.title(), true);
            store.put(id, updated);
            return updated;
        }

        void validateId(String id) {
            if (id == null || id.isBlank()) {
                throw new IllegalArgumentException("400 BAD REQUEST: id is required");
            }
        }

        void validateTitle(String title) {
            if (title == null || title.isBlank()) {
                throw new IllegalArgumentException("400 BAD REQUEST: title is required");
            }
            if (title.length() > 120) {
                throw new IllegalArgumentException("400 BAD REQUEST: title too long");
            }
        }
    }

    public static void main(String[] args) {
        TaskApi api = new TaskApi();
        System.out.println("Lesson 4.2 - REST API behavior simulation");
        System.out.println("POST /tasks => " + api.create("t-1", "Write controller + DTO + validator"));
        System.out.println("PATCH /tasks/t-1/done => " + api.markDone("t-1"));
    }
}
'@;

  'd:\GitHub_Src\Interview\complete_java_prep\lessons\lesson-4.3-persistence-with-spring-data-jpa\sample-project\src\main\java\AnswerApp.java' = @'
import java.util.HashMap;
import java.util.Map;

public class AnswerApp {
    static final class Account {
        private final long id;
        private String owner;
        private long cents;

        Account(long id, String owner, long cents) {
            this.id = id;
            this.owner = owner;
            this.cents = cents;
        }

        long getId() { return id; }
        String getOwner() { return owner; }
        long getCents() { return cents; }
        void add(long amount) { cents += amount; }
    }

    static final class AccountRepository {
        private final Map<Long, Account> table = new HashMap<>();
        Account save(Account account) { table.put(account.getId(), account); return account; }
        Account findById(long id) { return table.get(id); }
    }

    static final class AccountService {
        private final AccountRepository repository;
        AccountService(AccountRepository repository) { this.repository = repository; }

        void transfer(long fromId, long toId, long amount) {
            Account from = repository.findById(fromId);
            Account to = repository.findById(toId);
            if (from == null || to == null) throw new IllegalArgumentException("Account missing");
            if (amount <= 0 || from.getCents() < amount) throw new IllegalArgumentException("Invalid amount");
            from.add(-amount);
            to.add(amount);
        }
    }

    public static void main(String[] args) {
        AccountRepository repository = new AccountRepository();
        repository.save(new Account(1, "Alice", 10_000));
        repository.save(new Account(2, "Bob", 2_000));

        AccountService service = new AccountService(repository);
        service.transfer(1, 2, 1_500);

        System.out.println("Lesson 4.3 - Persistence pattern simulation");
        System.out.println("Alice balance: " + repository.findById(1).getCents());
        System.out.println("Bob balance: " + repository.findById(2).getCents());
    }
}
'@;

  'd:\GitHub_Src\Interview\complete_java_prep\lessons\lesson-5.2-redis-and-caching-patterns\sample-project\src\main\java\AnswerApp.java' = @'
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class AnswerApp {
    record CacheValue(String value, Instant expiresAt) {}

    static final class CacheAsideService {
        private final Map<String, CacheValue> cache = new HashMap<>();

        String getUserProfile(String userId) {
            Instant now = Instant.now();
            CacheValue cached = cache.get(userId);
            if (cached != null && now.isBefore(cached.expiresAt())) {
                return "CACHE_HIT => " + cached.value();
            }

            String loaded = "profile-for-" + userId + "-at-" + now.getEpochSecond();
            cache.put(userId, new CacheValue(loaded, now.plusSeconds(5)));
            return "CACHE_MISS => " + loaded;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        CacheAsideService service = new CacheAsideService();
        System.out.println("Lesson 5.2 - Cache-aside + TTL simulation");
        System.out.println(service.getUserProfile("u1"));
        System.out.println(service.getUserProfile("u1"));
        Thread.sleep(5500);
        System.out.println(service.getUserProfile("u1"));
    }
}
'@;

  'd:\GitHub_Src\Interview\complete_java_prep\lessons\lesson-5.4-event-driven-architecture-basics\sample-project\src\main\java\AnswerApp.java' = @'
import java.util.ArrayDeque;
import java.util.Queue;

public class AnswerApp {
    record Event(String id, String type, int attempts) {}

    public static void main(String[] args) {
        Queue<Event> broker = new ArrayDeque<>();
        Queue<Event> dlq = new ArrayDeque<>();

        broker.add(new Event("e-1", "ORDER_CREATED", 0));
        broker.add(new Event("e-2", "PAYMENT_FAILED", 0));

        while (!broker.isEmpty()) {
            Event event = broker.poll();
            boolean handled = process(event);

            if (!handled) {
                Event retry = new Event(event.id(), event.type(), event.attempts() + 1);
                if (retry.attempts() >= 3) {
                    dlq.add(retry);
                } else {
                    broker.add(retry);
                }
            }
        }

        System.out.println("Lesson 5.4 - Event processing with retries + DLQ");
        System.out.println("DLQ size: " + dlq.size());
    }

    private static boolean process(Event event) {
        if ("PAYMENT_FAILED".equals(event.type())) {
            System.out.println("Transient failure on " + event.id() + " attempt=" + event.attempts());
            return false;
        }
        System.out.println("Handled event: " + event.id() + " type=" + event.type());
        return true;
    }
}
'@;

  'd:\GitHub_Src\Interview\complete_java_prep\lessons\lesson-6.2-jwt-and-oauth2-oidc\sample-project\src\main\java\AnswerApp.java' = @'
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class AnswerApp {
    private static final String SECRET = "lesson-6-2-secret";

    public static void main(String[] args) throws Exception {
        String token = issueToken("student-1", 60);
        System.out.println("Lesson 6.2 - JWT lifecycle simulation");
        System.out.println("Token: " + token);
        System.out.println("Valid now: " + validateToken(token));
    }

    static String issueToken(String subject, long expiresInSeconds) throws Exception {
        long exp = Instant.now().getEpochSecond() + expiresInSeconds;
        String payload = subject + ":" + exp;
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = hmacSha256(encodedPayload, SECRET);
        return encodedPayload + "." + signature;
    }

    static boolean validateToken(String token) throws Exception {
        String[] parts = token.split("\\.");
        if (parts.length != 2) return false;

        String expectedSig = hmacSha256(parts[0], SECRET);
        if (!expectedSig.equals(parts[1])) return false;

        String decoded = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
        String[] payload = decoded.split(":");
        long exp = Long.parseLong(payload[1]);
        return Instant.now().getEpochSecond() < exp;
    }

    static String hmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
    }
}
'@;

  'd:\GitHub_Src\Interview\complete_java_prep\lessons\lesson-6.2-jwt-and-oauth2oidc\sample-project\src\main\java\AnswerApp.java' = @'
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class AnswerApp {
    private static final String SECRET = "lesson-6-2-secret";

    public static void main(String[] args) throws Exception {
        String token = issueToken("student-1", 60);
        System.out.println("Lesson 6.2 - JWT lifecycle simulation");
        System.out.println("Token: " + token);
        System.out.println("Valid now: " + validateToken(token));
    }

    static String issueToken(String subject, long expiresInSeconds) throws Exception {
        long exp = Instant.now().getEpochSecond() + expiresInSeconds;
        String payload = subject + ":" + exp;
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = hmacSha256(encodedPayload, SECRET);
        return encodedPayload + "." + signature;
    }

    static boolean validateToken(String token) throws Exception {
        String[] parts = token.split("\\.");
        if (parts.length != 2) return false;

        String expectedSig = hmacSha256(parts[0], SECRET);
        if (!expectedSig.equals(parts[1])) return false;

        String decoded = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
        String[] payload = decoded.split(":");
        long exp = Long.parseLong(payload[1]);
        return Instant.now().getEpochSecond() < exp;
    }

    static String hmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
    }
}
'@;

  'd:\GitHub_Src\Interview\complete_java_prep\lessons\lesson-8.2-ci-cd-pipelines\sample-project\src\main\java\AnswerApp.java' = @'
import java.util.LinkedHashMap;
import java.util.Map;

public class AnswerApp {
    public static void main(String[] args) {
        Map<String, Boolean> stages = new LinkedHashMap<>();
        stages.put("lint", true);
        stages.put("unit-test", true);
        stages.put("security-scan", true);
        stages.put("package", true);
        stages.put("integration-test", false);
        stages.put("publish-artifact", true);

        System.out.println("Lesson 8.2 - CI/CD pipeline quality gates simulation");

        boolean canDeploy = true;
        for (Map.Entry<String, Boolean> stage : stages.entrySet()) {
            System.out.printf("%-18s => %s%n", stage.getKey(), stage.getValue() ? "PASS" : "FAIL");
            if (!stage.getValue()) {
                canDeploy = false;
                break;
            }
        }

        System.out.println("Deployment allowed: " + canDeploy);
    }
}
'@
}

foreach ($entry in $files.GetEnumerator()) {
  $path = $entry.Key
  $dir = Split-Path $path -Parent
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  Set-Content -Path $path -Value $entry.Value -Encoding UTF8
}

Write-Output "Upgraded conceptual AnswerApp.java files"
