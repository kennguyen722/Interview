import java.util.stream.*;
import java.util.*;

/**
 * Lesson 8.5 - Performance and Capacity Planning
 *
 * Includes a runnable micro-benchmark and capacity estimation formulas.
 *
 * KEY TERMS:
 *   throughput   - requests per second a system can handle.
 *   latency      - time from request to response.
 *   p99 latency  - 99th percentile: 99% of requests are faster than this.
 *   Little's Law - Throughput = Concurrency / Latency.
 *   JVM tuning   - GC settings, heap size, thread pool config.
 */
public class AnswerApp {

    public static void main(String[] args) {
        System.out.println("=== Lesson 8.5: Performance and Capacity Planning ===\n");

        benchmarkStringConcat(50_000);
        benchmarkStreamVsLoop(1_000_000);
        printCapacityModel();
        printJvmTips();
    }

    static void benchmarkStringConcat(int n) {
        System.out.println("--- Benchmark: String + vs StringBuilder (" + n + " iterations) ---");

        long t1 = System.nanoTime();
        String s = "";
        for (int i = 0; i < n; i++) s += "x";
        long concatMs = (System.nanoTime() - t1) / 1_000_000;

        long t2 = System.nanoTime();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append("x");
        long sbMs = (System.nanoTime() - t2) / 1_000_000;

        System.out.printf("  String +       : %4d ms%n", concatMs);
        System.out.printf("  StringBuilder  : %4d ms%n", sbMs);
        System.out.printf("  Speedup        : ~%.0fx%n%n", (double) concatMs / Math.max(1, sbMs));
    }

    static void benchmarkStreamVsLoop(int n) {
        System.out.println("--- Benchmark: Stream vs for-loop sum (" + n + " elements) ---");
        List<Integer> data = IntStream.range(0, n).boxed().collect(Collectors.toList());

        long t1 = System.nanoTime();
        long sumLoop = 0;
        for (int v : data) sumLoop += v;
        long loopMs = (System.nanoTime() - t1) / 1_000_000;

        long t2 = System.nanoTime();
        long sumStream = data.stream().mapToLong(Integer::longValue).sum();
        long streamMs = (System.nanoTime() - t2) / 1_000_000;

        System.out.printf("  for-loop : %4d ms  sum=%d%n", loopMs, sumLoop);
        System.out.printf("  stream   : %4d ms  sum=%d%n", streamMs, sumStream);
        System.out.println("  -> For simple aggregations, difference is small; streams add clarity.");
        System.out.println();
    }

    static void printCapacityModel() {
        System.out.println("--- Back-of-envelope capacity model ---");
        int targetRps = 1_000;
        int avgLatencyMs = 50;
        // Little's Law: concurrency = throughput * latency
        int concurrency = (targetRps * avgLatencyMs) / 1_000;
        int threads = (int)(concurrency * 1.25);  // 25% headroom
        int replicas = (int) Math.ceil(targetRps / 200.0);  // 200 RPS per pod

        System.out.printf("  Target RPS      : %,d%n", targetRps);
        System.out.printf("  Avg latency     : %d ms%n", avgLatencyMs);
        System.out.printf("  Concurrency     : %d (Little's Law: rps * latency_sec)%n", concurrency);
        System.out.printf("  Thread pool     : %d (25%% headroom)%n", threads);
        System.out.printf("  Pods needed     : %d (200 RPS/pod estimate)%n%n", replicas);
    }

    static void printJvmTips() {
        System.out.println("--- JVM tuning quick reference ---");
        String[][] tips = {
            {"-Xms1g -Xmx2g",               "Initial and max heap; set equal in containers"},
            {"-XX:+UseG1GC",                 "G1 GC (default Java 9+); good for low-latency"},
            {"-XX:MaxGCPauseMillis=200",      "Target GC pause budget"},
            {"-XX:+HeapDumpOnOutOfMemoryError","Capture heap on OOM for analysis"},
            {"-Xlog:gc*:file=gc.log",         "Log GC events to file"},
            {"spring.threads.virtual=true",   "Enable virtual threads (Java 21) for high I/O RPS"}
        };
        System.out.printf("  %-40s  %s%n", "Flag / Setting", "Purpose");
        System.out.println("  " + "-".repeat(75));
        for (String[] t : tips) System.out.printf("  %-40s  %s%n", t[0], t[1]);
    }
}