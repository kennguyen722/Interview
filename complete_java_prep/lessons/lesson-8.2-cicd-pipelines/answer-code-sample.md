# Answer Code Sample - Lesson 8.2: CI/CD Pipelines

## Java Answer (Complete Runnable)

~~~java
/**
 * Lesson 8.2 - CI/CD Pipelines
 *
 * KEY TERMS:
 *   CI  - Continuous Integration: build and test every commit automatically.
 *   CD  - Continuous Delivery/Deployment: automate the path to production.
 *   pipeline - ordered stages (build, test, scan, package, deploy).
 *   quality gate - a condition that must pass before moving to the next stage.
 *   artifact  - the versioned build output (Docker image, JAR).
 *   canary    - route a small percentage of traffic to the new version first.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 8.2: CI/CD Pipelines ===\n");

        System.out.println("--- GitHub Actions workflow (.github/workflows/ci.yml) ---");
        System.out.println("  on: [push, pull_request]");
        System.out.println("  jobs:");
        System.out.println("    ci:");
        System.out.println("      runs-on: ubuntu-latest");
        System.out.println("      steps:");
        System.out.println("        - uses: actions/checkout@v4");
        System.out.println("        - uses: actions/setup-java@v4");
        System.out.println("          with: { java-version: '21', distribution: 'temurin' }");
        System.out.println("        - run: mvn -B verify                   # unit + integration tests");
        System.out.println("        - run: mvn checkstyle:check            # code style");
        System.out.println("        - run: mvn org.owasp:dependency-check-maven:check  # CVE scan");
        System.out.println("        - uses: docker/build-push-action@v5    # build + push image");
        System.out.println("          with:");
        System.out.println("            context: .");
        System.out.println("            tags: myregistry/backend:${{ github.sha }}");

        System.out.println("\n--- Quality gates (all must pass before merge) ---");
        String[] gates = {
            "All unit tests pass",
            "All integration tests pass (Testcontainers)",
            "Code coverage >= 80%",
            "No critical SpotBugs / PMD findings",
            "No critical OWASP dependency CVEs",
            "Docker image builds successfully",
            "Smoke test passes against staging deploy"
        };
        for (String g : gates) System.out.println("  [ ] " + g);

        System.out.println("\n--- Deployment strategies ---");
        System.out.println("  Rolling update  - gradually replace old pods; zero downtime.");
        System.out.println("  Blue-green      - two identical envs; flip traffic atomically.");
        System.out.println("  Canary          - route 5-10% traffic to new version; monitor errors.");
        System.out.println("  Feature flags   - deploy code inactive; enable via config.");
    }
}
~~~
