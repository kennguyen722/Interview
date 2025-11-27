# Module 3: System Design

## Table of Contents
1. [System Design Fundamentals](#system-design-fundamentals)
2. [Scalability](#scalability)
3. [High Availability](#high-availability)
4. [Design Examples](#design-examples)

---

## System Design Fundamentals

### Question 1: What are the key components to consider when designing a distributed system?

**Answer:**
Key components include:

1. **Load Balancers**: Distribute traffic across servers
2. **Application Servers**: Process business logic
3. **Databases**: Store and retrieve data
4. **Caching Layer**: Reduce database load
5. **Message Queues**: Handle asynchronous processing
6. **CDN**: Serve static content globally

**Detailed Code Example - Load Balancer Implementation:**

```java
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class LoadBalancerDemo {
    
    public static void main(String[] args) {
        // 1. Round Robin Load Balancer
        System.out.println("=== Round Robin ===");
        RoundRobinLoadBalancer rrLB = new RoundRobinLoadBalancer();
        rrLB.addServer(new Server("Server-1", 100));
        rrLB.addServer(new Server("Server-2", 100));
        rrLB.addServer(new Server("Server-3", 100));
        
        for (int i = 0; i < 6; i++) {
            Server server = rrLB.getServer();
            System.out.println("Request " + (i+1) + " -> " + server.getName());
        }
        
        // 2. Weighted Load Balancer
        System.out.println("\n=== Weighted ===");
        WeightedLoadBalancer wLB = new WeightedLoadBalancer();
        wLB.addServer(new Server("Server-A", 50), 1);
        wLB.addServer(new Server("Server-B", 100), 2);
        wLB.addServer(new Server("Server-C", 150), 3);
        
        Map<String, Integer> distribution = new HashMap<>();
        for (int i = 0; i < 600; i++) {
            Server server = wLB.getServer();
            distribution.merge(server.getName(), 1, Integer::sum);
        }
        distribution.forEach((k, v) -> System.out.println(k + ": " + v + " requests"));
        
        // 3. Least Connections Load Balancer
        System.out.println("\n=== Least Connections ===");
        LeastConnectionsLoadBalancer lcLB = new LeastConnectionsLoadBalancer();
        lcLB.addServer(new Server("Node-1", 100));
        lcLB.addServer(new Server("Node-2", 100));
        lcLB.addServer(new Server("Node-3", 100));
        
        // Simulate some connections
        lcLB.connect("Node-1");
        lcLB.connect("Node-1");
        lcLB.connect("Node-2");
        
        System.out.println("Next server: " + lcLB.getServer().getName());
    }
}

class Server {
    private String name;
    private int maxConnections;
    private AtomicInteger currentConnections = new AtomicInteger(0);
    
    public Server(String name, int maxConnections) {
        this.name = name;
        this.maxConnections = maxConnections;
    }
    
    public String getName() { return name; }
    public int getCurrentConnections() { return currentConnections.get(); }
    public void connect() { currentConnections.incrementAndGet(); }
    public void disconnect() { currentConnections.decrementAndGet(); }
}

// Round Robin Load Balancer
class RoundRobinLoadBalancer {
    private List<Server> servers = new CopyOnWriteArrayList<>();
    private AtomicInteger index = new AtomicInteger(0);
    
    public void addServer(Server server) {
        servers.add(server);
    }
    
    public Server getServer() {
        if (servers.isEmpty()) return null;
        int currentIndex = index.getAndIncrement() % servers.size();
        return servers.get(currentIndex);
    }
}

// Weighted Load Balancer
class WeightedLoadBalancer {
    private List<ServerWeight> servers = new ArrayList<>();
    private int totalWeight = 0;
    private Random random = new Random();
    
    public void addServer(Server server, int weight) {
        servers.add(new ServerWeight(server, weight));
        totalWeight += weight;
    }
    
    public Server getServer() {
        int rand = random.nextInt(totalWeight);
        int sum = 0;
        for (ServerWeight sw : servers) {
            sum += sw.weight;
            if (rand < sum) {
                return sw.server;
            }
        }
        return servers.get(servers.size() - 1).server;
    }
    
    private static class ServerWeight {
        Server server;
        int weight;
        
        ServerWeight(Server server, int weight) {
            this.server = server;
            this.weight = weight;
        }
    }
}

// Least Connections Load Balancer
class LeastConnectionsLoadBalancer {
    private Map<String, Server> servers = new ConcurrentHashMap<>();
    
    public void addServer(Server server) {
        servers.put(server.getName(), server);
    }
    
    public void connect(String serverName) {
        servers.get(serverName).connect();
    }
    
    public Server getServer() {
        return servers.values().stream()
            .min(Comparator.comparingInt(Server::getCurrentConnections))
            .orElse(null);
    }
}
```

### Question 2: How would you design a distributed caching system?

**Answer:**
A distributed caching system needs:

1. **Consistent Hashing**: For even distribution
2. **Replication**: For fault tolerance
3. **Expiration Policies**: TTL, LRU, LFU
4. **Cache-aside/Write-through/Write-behind patterns**

**Detailed Code Example:**

```java
import java.util.*;
import java.util.concurrent.*;
import java.security.*;

public class DistributedCacheDemo {
    
    public static void main(String[] args) {
        // 1. Consistent Hashing
        System.out.println("=== Consistent Hashing ===");
        ConsistentHash<CacheNode> consistentHash = new ConsistentHash<>(100);
        
        CacheNode node1 = new CacheNode("cache-1", "192.168.1.1");
        CacheNode node2 = new CacheNode("cache-2", "192.168.1.2");
        CacheNode node3 = new CacheNode("cache-3", "192.168.1.3");
        
        consistentHash.addNode(node1);
        consistentHash.addNode(node2);
        consistentHash.addNode(node3);
        
        // Distribute keys
        String[] keys = {"user:1", "user:2", "user:3", "product:100", "order:500"};
        for (String key : keys) {
            CacheNode node = consistentHash.getNode(key);
            System.out.println("Key '" + key + "' -> " + node.getName());
        }
        
        // 2. LRU Cache
        System.out.println("\n=== LRU Cache ===");
        LRUCache<String, String> lruCache = new LRUCache<>(3);
        lruCache.put("a", "Apple");
        lruCache.put("b", "Banana");
        lruCache.put("c", "Cherry");
        System.out.println("Cache: " + lruCache);
        
        lruCache.get("a"); // Access 'a'
        lruCache.put("d", "Date"); // 'b' should be evicted
        System.out.println("After adding 'd': " + lruCache);
        
        // 3. Cache with TTL
        System.out.println("\n=== Cache with TTL ===");
        TTLCache<String, String> ttlCache = new TTLCache<>();
        ttlCache.put("session:1", "data1", 2000); // 2 second TTL
        System.out.println("Before TTL: " + ttlCache.get("session:1"));
        
        try { Thread.sleep(2500); } catch (InterruptedException e) {}
        System.out.println("After TTL: " + ttlCache.get("session:1"));
    }
}

// Consistent Hashing Implementation
class ConsistentHash<T> {
    private final TreeMap<Long, T> ring = new TreeMap<>();
    private final int numberOfReplicas;
    private final MessageDigest md;
    
    public ConsistentHash(int numberOfReplicas) {
        this.numberOfReplicas = numberOfReplicas;
        try {
            this.md = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
    
    public void addNode(T node) {
        for (int i = 0; i < numberOfReplicas; i++) {
            long hash = hash(node.toString() + i);
            ring.put(hash, node);
        }
    }
    
    public void removeNode(T node) {
        for (int i = 0; i < numberOfReplicas; i++) {
            long hash = hash(node.toString() + i);
            ring.remove(hash);
        }
    }
    
    public T getNode(String key) {
        if (ring.isEmpty()) return null;
        
        long hash = hash(key);
        Map.Entry<Long, T> entry = ring.ceilingEntry(hash);
        
        if (entry == null) {
            entry = ring.firstEntry();
        }
        return entry.getValue();
    }
    
    private long hash(String key) {
        md.reset();
        md.update(key.getBytes());
        byte[] digest = md.digest();
        return ((long) (digest[3] & 0xFF) << 24) |
               ((long) (digest[2] & 0xFF) << 16) |
               ((long) (digest[1] & 0xFF) << 8) |
               ((long) (digest[0] & 0xFF));
    }
}

class CacheNode {
    private String name;
    private String address;
    
    public CacheNode(String name, String address) {
        this.name = name;
        this.address = address;
    }
    
    public String getName() { return name; }
    public String getAddress() { return address; }
    
    @Override
    public String toString() { return name; }
}

// LRU Cache Implementation
class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }
    
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}

// Cache with TTL
class TTLCache<K, V> {
    private final Map<K, CacheEntry<V>> cache = new ConcurrentHashMap<>();
    
    public void put(K key, V value, long ttlMillis) {
        long expiryTime = System.currentTimeMillis() + ttlMillis;
        cache.put(key, new CacheEntry<>(value, expiryTime));
    }
    
    public V get(K key) {
        CacheEntry<V> entry = cache.get(key);
        if (entry == null) return null;
        
        if (System.currentTimeMillis() > entry.expiryTime) {
            cache.remove(key);
            return null;
        }
        return entry.value;
    }
    
    private static class CacheEntry<V> {
        V value;
        long expiryTime;
        
        CacheEntry(V value, long expiryTime) {
            this.value = value;
            this.expiryTime = expiryTime;
        }
    }
}
```

---

## Scalability

### Question 3: Explain horizontal vs vertical scaling. When would you use each?

**Answer:**

| Aspect | Horizontal Scaling | Vertical Scaling |
|--------|-------------------|------------------|
| Method | Add more machines | Add more power to existing machine |
| Cost | Linear increase | Exponential increase |
| Complexity | Higher (distributed) | Lower (single machine) |
| Limit | Theoretically unlimited | Hardware limits |
| Downtime | No downtime | Usually requires downtime |
| Data | Needs sharding/replication | Simpler data management |

**Detailed Code Example - Database Sharding:**

```java
import java.util.*;

public class ShardingDemo {
    
    public static void main(String[] args) {
        // 1. Range-based Sharding
        System.out.println("=== Range-based Sharding ===");
        RangeShardManager rangeShardMgr = new RangeShardManager();
        rangeShardMgr.addShard(new Shard("shard-1"), 0, 1000);
        rangeShardMgr.addShard(new Shard("shard-2"), 1001, 2000);
        rangeShardMgr.addShard(new Shard("shard-3"), 2001, 3000);
        
        System.out.println("User 500 -> " + rangeShardMgr.getShard(500));
        System.out.println("User 1500 -> " + rangeShardMgr.getShard(1500));
        System.out.println("User 2500 -> " + rangeShardMgr.getShard(2500));
        
        // 2. Hash-based Sharding
        System.out.println("\n=== Hash-based Sharding ===");
        HashShardManager hashShardMgr = new HashShardManager(3);
        hashShardMgr.addShard(new Shard("shard-A"));
        hashShardMgr.addShard(new Shard("shard-B"));
        hashShardMgr.addShard(new Shard("shard-C"));
        
        for (int userId = 1; userId <= 10; userId++) {
            System.out.println("User " + userId + " -> " + hashShardMgr.getShard(userId));
        }
        
        // 3. Directory-based Sharding
        System.out.println("\n=== Directory-based Sharding ===");
        DirectoryShardManager dirShardMgr = new DirectoryShardManager();
        dirShardMgr.addMapping("US", new Shard("shard-US"));
        dirShardMgr.addMapping("EU", new Shard("shard-EU"));
        dirShardMgr.addMapping("ASIA", new Shard("shard-ASIA"));
        
        System.out.println("US Customer -> " + dirShardMgr.getShard("US"));
        System.out.println("EU Customer -> " + dirShardMgr.getShard("EU"));
    }
}

class Shard {
    private String name;
    private List<Object> data = new ArrayList<>();
    
    public Shard(String name) {
        this.name = name;
    }
    
    public String getName() { return name; }
    
    public void store(Object obj) { data.add(obj); }
    
    @Override
    public String toString() { return name; }
}

// Range-based Sharding
class RangeShardManager {
    private TreeMap<Integer, Shard> shards = new TreeMap<>();
    
    public void addShard(Shard shard, int minKey, int maxKey) {
        shards.put(minKey, shard);
    }
    
    public Shard getShard(int key) {
        Map.Entry<Integer, Shard> entry = shards.floorEntry(key);
        return entry != null ? entry.getValue() : null;
    }
}

// Hash-based Sharding
class HashShardManager {
    private List<Shard> shards = new ArrayList<>();
    private int numShards;
    
    public HashShardManager(int numShards) {
        this.numShards = numShards;
    }
    
    public void addShard(Shard shard) {
        shards.add(shard);
    }
    
    public Shard getShard(int key) {
        int index = Math.abs(key) % numShards;
        return shards.get(index);
    }
}

// Directory-based Sharding
class DirectoryShardManager {
    private Map<String, Shard> directory = new HashMap<>();
    
    public void addMapping(String key, Shard shard) {
        directory.put(key, shard);
    }
    
    public Shard getShard(String key) {
        return directory.get(key);
    }
}
```

### Question 4: Design a rate limiter for an API.

**Answer:**
Common algorithms:
1. **Token Bucket**: Smooth rate limiting
2. **Leaky Bucket**: Consistent output rate
3. **Fixed Window**: Simple but allows bursts
4. **Sliding Window**: More accurate

**Detailed Code Example:**

```java
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class RateLimiterDemo {
    
    public static void main(String[] args) throws InterruptedException {
        // 1. Token Bucket
        System.out.println("=== Token Bucket ===");
        TokenBucketRateLimiter tokenBucket = new TokenBucketRateLimiter(5, 1);
        
        for (int i = 0; i < 10; i++) {
            boolean allowed = tokenBucket.tryAcquire();
            System.out.println("Request " + (i+1) + ": " + (allowed ? "ALLOWED" : "DENIED"));
            Thread.sleep(100);
        }
        
        // 2. Sliding Window
        System.out.println("\n=== Sliding Window ===");
        SlidingWindowRateLimiter slidingWindow = new SlidingWindowRateLimiter(5, 1000);
        
        for (int i = 0; i < 10; i++) {
            boolean allowed = slidingWindow.tryAcquire("user-1");
            System.out.println("Request " + (i+1) + ": " + (allowed ? "ALLOWED" : "DENIED"));
            Thread.sleep(100);
        }
        
        // 3. Fixed Window Counter
        System.out.println("\n=== Fixed Window ===");
        FixedWindowRateLimiter fixedWindow = new FixedWindowRateLimiter(5, 1000);
        
        for (int i = 0; i < 10; i++) {
            boolean allowed = fixedWindow.tryAcquire("user-2");
            System.out.println("Request " + (i+1) + ": " + (allowed ? "ALLOWED" : "DENIED"));
            Thread.sleep(100);
        }
    }
}

// Token Bucket Rate Limiter
class TokenBucketRateLimiter {
    private final long capacity;
    private final double refillRate;
    private double tokens;
    private long lastRefillTime;
    
    public TokenBucketRateLimiter(long capacity, double refillRatePerSecond) {
        this.capacity = capacity;
        this.refillRate = refillRatePerSecond;
        this.tokens = capacity;
        this.lastRefillTime = System.nanoTime();
    }
    
    public synchronized boolean tryAcquire() {
        refill();
        
        if (tokens >= 1) {
            tokens--;
            return true;
        }
        return false;
    }
    
    private void refill() {
        long now = System.nanoTime();
        double elapsed = (now - lastRefillTime) / 1e9;
        tokens = Math.min(capacity, tokens + elapsed * refillRate);
        lastRefillTime = now;
    }
}

// Sliding Window Rate Limiter
class SlidingWindowRateLimiter {
    private final int maxRequests;
    private final long windowSizeMs;
    private final Map<String, Deque<Long>> userRequests = new ConcurrentHashMap<>();
    
    public SlidingWindowRateLimiter(int maxRequests, long windowSizeMs) {
        this.maxRequests = maxRequests;
        this.windowSizeMs = windowSizeMs;
    }
    
    public boolean tryAcquire(String userId) {
        long now = System.currentTimeMillis();
        long windowStart = now - windowSizeMs;
        
        userRequests.putIfAbsent(userId, new ConcurrentLinkedDeque<>());
        Deque<Long> requests = userRequests.get(userId);
        
        // Remove old requests
        while (!requests.isEmpty() && requests.peekFirst() < windowStart) {
            requests.pollFirst();
        }
        
        if (requests.size() < maxRequests) {
            requests.addLast(now);
            return true;
        }
        return false;
    }
}

// Fixed Window Rate Limiter
class FixedWindowRateLimiter {
    private final int maxRequests;
    private final long windowSizeMs;
    private final Map<String, WindowCounter> userCounters = new ConcurrentHashMap<>();
    
    public FixedWindowRateLimiter(int maxRequests, long windowSizeMs) {
        this.maxRequests = maxRequests;
        this.windowSizeMs = windowSizeMs;
    }
    
    public boolean tryAcquire(String userId) {
        long currentWindow = System.currentTimeMillis() / windowSizeMs;
        
        userCounters.putIfAbsent(userId, new WindowCounter());
        WindowCounter counter = userCounters.get(userId);
        
        synchronized (counter) {
            if (counter.windowId != currentWindow) {
                counter.windowId = currentWindow;
                counter.count = 0;
            }
            
            if (counter.count < maxRequests) {
                counter.count++;
                return true;
            }
            return false;
        }
    }
    
    private static class WindowCounter {
        long windowId;
        int count;
    }
}
```

---

## High Availability

### Question 5: How would you design a system for 99.99% availability?

**Answer:**
To achieve 99.99% availability (52 minutes downtime/year):

1. **Redundancy**: No single point of failure
2. **Replication**: Data replicated across nodes
3. **Health Checks**: Automatic failure detection
4. **Failover**: Automatic switch to backup
5. **Geographic Distribution**: Multiple data centers
6. **Circuit Breakers**: Prevent cascade failures

**Detailed Code Example - Circuit Breaker:**

```java
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.function.*;

public class CircuitBreakerDemo {
    
    public static void main(String[] args) throws Exception {
        // Create circuit breaker
        CircuitBreaker circuitBreaker = new CircuitBreaker(
            5,      // Failure threshold
            10000,  // Reset timeout (10 seconds)
            3       // Success threshold
        );
        
        // Simulated service that fails
        Supplier<String> unreliableService = () -> {
            if (Math.random() < 0.7) { // 70% failure rate
                throw new RuntimeException("Service unavailable");
            }
            return "Success";
        };
        
        // Make requests through circuit breaker
        for (int i = 0; i < 20; i++) {
            try {
                String result = circuitBreaker.execute(unreliableService);
                System.out.println("Request " + (i+1) + ": " + result + 
                    " [State: " + circuitBreaker.getState() + "]");
            } catch (CircuitBreakerOpenException e) {
                System.out.println("Request " + (i+1) + ": CIRCUIT OPEN - Fast fail");
            } catch (Exception e) {
                System.out.println("Request " + (i+1) + ": " + e.getMessage() + 
                    " [State: " + circuitBreaker.getState() + "]");
            }
            Thread.sleep(500);
        }
    }
}

class CircuitBreaker {
    private enum State { CLOSED, OPEN, HALF_OPEN }
    
    private final int failureThreshold;
    private final long resetTimeoutMs;
    private final int successThreshold;
    
    private State state = State.CLOSED;
    private AtomicInteger failureCount = new AtomicInteger(0);
    private AtomicInteger successCount = new AtomicInteger(0);
    private long lastFailureTime = 0;
    
    public CircuitBreaker(int failureThreshold, long resetTimeoutMs, int successThreshold) {
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMs = resetTimeoutMs;
        this.successThreshold = successThreshold;
    }
    
    public <T> T execute(Supplier<T> supplier) throws Exception {
        if (state == State.OPEN) {
            if (System.currentTimeMillis() - lastFailureTime > resetTimeoutMs) {
                state = State.HALF_OPEN;
                successCount.set(0);
            } else {
                throw new CircuitBreakerOpenException("Circuit breaker is OPEN");
            }
        }
        
        try {
            T result = supplier.get();
            onSuccess();
            return result;
        } catch (Exception e) {
            onFailure();
            throw e;
        }
    }
    
    private synchronized void onSuccess() {
        if (state == State.HALF_OPEN) {
            int successes = successCount.incrementAndGet();
            if (successes >= successThreshold) {
                state = State.CLOSED;
                failureCount.set(0);
            }
        } else {
            failureCount.set(0);
        }
    }
    
    private synchronized void onFailure() {
        lastFailureTime = System.currentTimeMillis();
        int failures = failureCount.incrementAndGet();
        
        if (failures >= failureThreshold || state == State.HALF_OPEN) {
            state = State.OPEN;
        }
    }
    
    public State getState() { return state; }
}

class CircuitBreakerOpenException extends RuntimeException {
    public CircuitBreakerOpenException(String message) {
        super(message);
    }
}
```

---

## Design Examples

### Question 6: Design a URL shortening service like bit.ly.

**Answer:**
Key considerations:
1. Short URL generation (base62 encoding)
2. Database storage (NoSQL for scale)
3. Caching for popular URLs
4. Analytics tracking

**Detailed Code Example:**

```java
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class URLShortenerDemo {
    
    public static void main(String[] args) {
        URLShortenerService service = new URLShortenerService();
        
        // Shorten URLs
        String short1 = service.shortenURL("https://www.example.com/very/long/url/path");
        String short2 = service.shortenURL("https://www.google.com/search?q=java");
        String short3 = service.shortenURL("https://github.com/user/repo");
        
        System.out.println("Shortened URLs:");
        System.out.println(short1);
        System.out.println(short2);
        System.out.println(short3);
        
        // Redirect
        System.out.println("\nRedirections:");
        System.out.println(short1 + " -> " + service.getOriginalURL(short1));
        System.out.println(short2 + " -> " + service.getOriginalURL(short2));
        
        // Analytics
        service.getOriginalURL(short1);
        service.getOriginalURL(short1);
        service.getOriginalURL(short2);
        
        System.out.println("\nAnalytics:");
        System.out.println(short1 + " clicks: " + service.getClickCount(short1));
        System.out.println(short2 + " clicks: " + service.getClickCount(short2));
    }
}

class URLShortenerService {
    private static final String BASE_URL = "https://short.url/";
    private static final String BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    
    private final AtomicLong counter = new AtomicLong(10000000);
    private final Map<String, URLMapping> shortToLong = new ConcurrentHashMap<>();
    private final Map<String, String> longToShort = new ConcurrentHashMap<>();
    private final Map<String, AtomicLong> analytics = new ConcurrentHashMap<>();
    
    public String shortenURL(String longURL) {
        // Check if already exists
        if (longToShort.containsKey(longURL)) {
            return BASE_URL + longToShort.get(longURL);
        }
        
        // Generate short code
        long id = counter.incrementAndGet();
        String shortCode = encodeBase62(id);
        
        // Store mappings
        shortToLong.put(shortCode, new URLMapping(longURL, System.currentTimeMillis()));
        longToShort.put(longURL, shortCode);
        analytics.put(shortCode, new AtomicLong(0));
        
        return BASE_URL + shortCode;
    }
    
    public String getOriginalURL(String shortURL) {
        String shortCode = shortURL.replace(BASE_URL, "");
        URLMapping mapping = shortToLong.get(shortCode);
        
        if (mapping != null) {
            analytics.get(shortCode).incrementAndGet();
            return mapping.getLongURL();
        }
        return null;
    }
    
    public long getClickCount(String shortURL) {
        String shortCode = shortURL.replace(BASE_URL, "");
        AtomicLong count = analytics.get(shortCode);
        return count != null ? count.get() : 0;
    }
    
    private String encodeBase62(long num) {
        StringBuilder sb = new StringBuilder();
        while (num > 0) {
            sb.insert(0, BASE62.charAt((int) (num % 62)));
            num /= 62;
        }
        return sb.toString();
    }
}

class URLMapping {
    private String longURL;
    private long createdAt;
    
    public URLMapping(String longURL, long createdAt) {
        this.longURL = longURL;
        this.createdAt = createdAt;
    }
    
    public String getLongURL() { return longURL; }
    public long getCreatedAt() { return createdAt; }
}
```

---

## Summary

System design is crucial for Tech Leads. Key areas:

1. **Load Balancing**: Distribute traffic effectively
2. **Caching**: Reduce latency and database load
3. **Sharding**: Scale databases horizontally
4. **Rate Limiting**: Protect services from overload
5. **Circuit Breakers**: Prevent cascade failures
6. **High Availability**: Design for 99.99%+ uptime

Continue to [Module 4: Concurrency](04-concurrency.md) →
