# Answer Code Sample - Lesson 3.5: Intro to HTTP and REST

## Java Answer (Complete Runnable)

~~~java
import java.util.*;

/**
 * Lesson 3.5 - Intro to HTTP and REST
 *
 * Demonstrates HTTP methods, status codes, and REST resource modeling.
 *
 * KEY TERMS:
 *   HTTP method  - verb indicating intent: GET, POST, PUT, PATCH, DELETE.
 *   status code  - 3-digit response code (2xx=success, 4xx=client, 5xx=server).
 *   idempotent   - repeating the request produces the same result.
 *   resource     - a noun in the URL representing a domain entity.
 *   stateless    - each request carries all info; server holds no session.
 */
public class AnswerApp {

    record ApiEndpoint(String method, String path, int code, String notes) {}

    public static void main(String[] args) {
        System.out.println("=== Lesson 3.5: Intro to HTTP and REST ===\n");

        // ── HTTP Methods reference ─────────────────────────────────
        System.out.println("--- HTTP Methods ---");
        System.out.printf("%-8s %-12s %-12s %s%n", "Method", "Idempotent", "Safe", "Typical use");
        System.out.println("-".repeat(65));
        Object[][] methods = {
            {"GET",    "Yes", "Yes", "Read resource"},
            {"POST",   "No",  "No",  "Create or trigger action"},
            {"PUT",    "Yes", "No",  "Replace full resource"},
            {"PATCH",  "No",  "No",  "Partial update"},
            {"DELETE", "Yes", "No",  "Remove resource"}
        };
        for (Object[] r : methods)
            System.out.printf("%-8s %-12s %-12s %s%n", r[0], r[1], r[2], r[3]);

        // ── Status codes ───────────────────────────────────────────
        System.out.println("\n--- Key Status Codes ---");
        int[][] codes = {{200,201,204,400,401,403,404,409,422,429,500,503}};
        Map<Integer, String> desc = new LinkedHashMap<>();
        desc.put(200, "OK - succeeded, body contains result");
        desc.put(201, "Created - resource created, Location header set");
        desc.put(204, "No Content - success with no body");
        desc.put(400, "Bad Request - malformed request");
        desc.put(401, "Unauthorized - authentication required");
        desc.put(403, "Forbidden - authenticated but not permitted");
        desc.put(404, "Not Found - resource does not exist");
        desc.put(409, "Conflict - state conflict (e.g. duplicate)");
        desc.put(422, "Unprocessable Entity - validation failed");
        desc.put(429, "Too Many Requests - rate limit exceeded");
        desc.put(500, "Internal Server Error - unexpected failure");
        desc.put(503, "Service Unavailable - temporary degradation");
        desc.forEach((c, d) -> System.out.printf("  %3d  %s%n", c, d));

        // ── REST resource design ───────────────────────────────────
        System.out.println("\n--- REST Endpoint Contract: /api/v1/users ---");
        List<ApiEndpoint> endpoints = List.of(
            new ApiEndpoint("GET",    "/api/v1/users",       200, "Paginated list"),
            new ApiEndpoint("POST",   "/api/v1/users",       201, "Create; returns Location"),
            new ApiEndpoint("GET",    "/api/v1/users/{id}",  200, "Single user"),
            new ApiEndpoint("PUT",    "/api/v1/users/{id}",  200, "Full replace"),
            new ApiEndpoint("PATCH",  "/api/v1/users/{id}",  200, "Partial update"),
            new ApiEndpoint("DELETE", "/api/v1/users/{id}",  204, "Delete; no body")
        );
        System.out.printf("%-8s %-30s %4s  %s%n", "METHOD", "PATH", "CODE", "NOTES");
        System.out.println("-".repeat(70));
        endpoints.forEach(e -> System.out.printf("%-8s %-30s %4d  %s%n",
            e.method(), e.path(), e.code(), e.notes()));

        // ── Simulated interaction ──────────────────────────────────
        System.out.println("\n--- Simulated Request / Response ---");
        System.out.println("REQ : GET /api/v1/users/42  Accept: application/json");
        System.out.println("RESP: 200  Content-Type: application/json");
        System.out.println("      {\"id\":42,\"name\":\"Alice\",\"email\":\"alice@example.com\"}");

        System.out.println("\nREQ : POST /api/v1/users  {\"name\":\"\",\"email\":\"bad\"}");
        System.out.println("RESP: 422  {\"errors\":[{\"field\":\"name\",\"message\":\"must not be blank\"}]}");
    }
}
~~~
