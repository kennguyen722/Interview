# Answer Code Sample - Lesson 8.1: Docker for Java and Frontend

## Java Answer (Complete Runnable)

~~~java
/**
 * Lesson 8.1 - Docker for Java and Frontend
 *
 * KEY TERMS:
 *   image       - a read-only snapshot of a container environment.
 *   container   - a running instance of an image; isolated process.
 *   Dockerfile  - instructions for building an image.
 *   layer       - each Dockerfile instruction adds a cached layer.
 *   volume      - persists data outside the container lifecycle.
 *   compose     - docker-compose.yml orchestrates multiple containers locally.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 8.1: Docker for Java and Frontend ===\n");

        System.out.println("--- Multi-stage Java Dockerfile ---");
        System.out.println("  # Stage 1: build (full JDK + Maven)");
        System.out.println("  FROM eclipse-temurin:21-jdk AS build");
        System.out.println("  WORKDIR /app");
        System.out.println("  COPY pom.xml .");
        System.out.println("  RUN mvn dependency:go-offline   # cache deps layer");
        System.out.println("  COPY src ./src");
        System.out.println("  RUN mvn -q -DskipTests package");
        System.out.println("\n  # Stage 2: runtime (lean JRE only)");
        System.out.println("  FROM eclipse-temurin:21-jre AS runtime");
        System.out.println("  WORKDIR /app");
        System.out.println("  COPY --from=build /app/target/*.jar app.jar");
        System.out.println("  EXPOSE 8080");
        System.out.println("  ENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]");

        System.out.println("\n--- docker-compose.yml (full stack) ---");
        System.out.println("  services:");
        System.out.println("    backend:");
        System.out.println("      build: ./backend");
        System.out.println("      ports: ['8080:8080']");
        System.out.println("      environment:");
        System.out.println("        SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/app");
        System.out.println("        SPRING_REDIS_HOST: redis");
        System.out.println("      depends_on: [db, redis]");
        System.out.println("    frontend:");
        System.out.println("      build: ./frontend");
        System.out.println("      ports: ['3000:80']");
        System.out.println("    db:");
        System.out.println("      image: postgres:16-alpine");
        System.out.println("      volumes: [pg_data:/var/lib/postgresql/data]");
        System.out.println("    redis:");
        System.out.println("      image: redis:7-alpine");
        System.out.println("  volumes:");
        System.out.println("    pg_data:");

        System.out.println("\n--- Image optimization rules ---");
        System.out.println("  Use multi-stage builds: build stage uses JDK, runtime uses slim JRE.");
        System.out.println("  Copy pom.xml and run dependency:go-offline BEFORE copying source.");
        System.out.println("    -> Docker caches the dependency layer; only invalidated when pom.xml changes.");
        System.out.println("  Use eclipse-temurin:21-jre (not jdk) in production: ~200MB vs ~400MB.");
        System.out.println("  NEVER store secrets in images; inject via environment variables.");
        System.out.println("  Add .dockerignore: exclude .git, target/, node_modules/, *.class.");
    }
}
~~~
