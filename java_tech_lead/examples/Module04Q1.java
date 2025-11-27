import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class Module04Q1 {
    static ConcurrentHashMap<String, String> store = new ConcurrentHashMap<>();
    static AtomicLong seq = new AtomicLong(1);

    public static String shorten(String url) {
        String id = Long.toString(seq.getAndIncrement(), 36);
        store.put(id, url);
        return id;
    }

    public static String resolve(String id) { return store.get(id); }

    public static void main(String[] args) {
        String id = shorten("https://example.com/long/url");
        System.out.println("id=" + id + " url=" + resolve(id));
    }
}
