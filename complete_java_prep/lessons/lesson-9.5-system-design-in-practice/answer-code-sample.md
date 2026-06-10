# Answer Code Sample - Lesson 9.5: System Design in Practice

## Java Answer (Complete Runnable)

~~~java
/**
 * Lesson 9.5 - System Design in Practice
 *
 * Walks through the URL shortener case study using a structured framework.
 *
 * KEY TERMS:
 *   functional requirements  - what the system does.
 *   non-functional requirements - how well it does it (scale, latency, availability).
 *   back-of-envelope estimation - quick math to validate feasibility.
 *   sharding      - splitting data across multiple DB nodes by a partition key.
 *   base62 encoding - encoding integers using [0-9a-zA-Z] for short codes.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 9.5: System Design in Practice ===\n");

        System.out.println("Case study: URL Shortener (bit.ly scale)\n");

        System.out.println("1. Requirements Clarification");
        System.out.println("   Functional:");
        System.out.println("     POST /shorten  { url }  -> { shortCode }");
        System.out.println("     GET  /{code}             -> 302 Redirect to original URL");
        System.out.println("     GET  /{code}/stats        -> click count, referrers");
        System.out.println("   Non-functional:");
        System.out.println("     100K new URLs/day | 10M redirects/day | p99 < 50ms | 5yr retention");

        System.out.println("\n2. Capacity Estimation");
        long writes  = 100_000;
        long reads   = 10_000_000;
        System.out.printf("   Writes : %,d/day  = ~1 write/sec%n", writes);
        System.out.printf("   Reads  : %,d/day = ~116 reads/sec  (read:write ratio 100:1)%n", reads);
        System.out.printf("   Storage: %,d URLs/day * 365 * 5yr = %,d URLs%n",
            writes, writes * 365 * 5);
        System.out.println("   Per URL row ~500 bytes -> ~91 GB over 5 years");

        System.out.println("\n3. High-Level Design");
        System.out.println("   POST /shorten  -> Shortener Service -> DB write  -> return code");
        System.out.println("   GET  /{code}   -> Redirect Service  -> Redis cache lookup");
        System.out.println("                  -> (miss) PostgreSQL  -> 302 redirect");

        System.out.println("\n4. Key Decisions");
        System.out.println("   Short code generation : base62(auto-increment ID) -- simple, no collision");
        System.out.println("     e.g. 1234567 -> base62 -> 'B4Kz'  (7 chars for 62^7 = 3.5 trillion codes)");
        System.out.println("   Cache : Redis TTL 24h for hot URLs; 80/20 rule handles most traffic");
        System.out.println("   DB    : PostgreSQL (simple schema, ACID, pg_partman for time partitioning)");
        System.out.println("   CDN   : 301 cached at edge for near-zero latency on popular links");

        System.out.println("\n5. Trade-offs");
        System.out.println("   301 vs 302:");
        System.out.println("     301 = Moved Permanently; browsers cache it -> fewer hits, less analytics");
        System.out.println("     302 = Found; always hits server -> full analytics, more load");
        System.out.println("   Consistency:");
        System.out.println("     Eventual OK for click counts; strong needed for URL resolution");
        System.out.println("   Scale:");
        System.out.println("     Sharding by hash(shortCode) when single DB node saturates");

        // Demonstrate base62 encoding
        System.out.println("\n6. base62 encoding demo");
        for (long id : new long[]{1, 100, 999999, 1234567}) {
            System.out.printf("   %,10d -> '%s'%n", id, toBase62(id));
        }
    }

    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    static String toBase62(long n) {
        if (n == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (n > 0) { sb.insert(0, ALPHABET.charAt((int)(n % 62))); n /= 62; }
        return sb.toString();
    }
}
~~~
