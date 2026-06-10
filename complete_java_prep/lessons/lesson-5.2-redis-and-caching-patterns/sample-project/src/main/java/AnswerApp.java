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
