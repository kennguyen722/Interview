import java.util.*;

/**
 * Lesson 4.4 - Database Migration and Seed Data
 *
 * Simulates Flyway versioned migration execution and best practices.
 *
 * KEY TERMS:
 *   Flyway     - tool that applies SQL migrations in version order.
 *   migration  - a versioned SQL script applied once to a schema.
 *   checksum   - hash Flyway uses to detect if an applied migration changed.
 *   baseline   - marks an existing schema so Flyway starts from there.
 *   idempotent migration - a script safe to re-run (CREATE IF NOT EXISTS).
 */
public class AnswerApp {

    record Migration(String version, String description, String type, String sql) {}

    static class FlywaySimulator {
        private final List<String> applied = new ArrayList<>();

        public void migrate(List<Migration> all) {
            System.out.println("Flyway: Starting migration");
            int count = 0;
            for (Migration m : all) {
                if (applied.contains(m.version())) {
                    System.out.printf("  SKIP  %s  (already applied)%n", m.version());
                    continue;
                }
                System.out.printf("  APPLY %s  %s%n", m.version(), m.description());
                System.out.printf("        SQL: %s%n", m.sql());
                applied.add(m.version());
                count++;
            }
            System.out.printf("Flyway: Applied %d migration(s). Schema is up to date.%n", count);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 4.4: Database Migration and Seed Data ===\n");

        List<Migration> migrations = List.of(
            new Migration("V1__create_users",
                "Create users table", "versioned",
                "CREATE TABLE users (id BIGSERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, email VARCHAR(200) UNIQUE, created_at TIMESTAMP DEFAULT NOW())"),
            new Migration("V2__create_orders",
                "Create orders table", "versioned",
                "CREATE TABLE orders (id BIGSERIAL PRIMARY KEY, user_id BIGINT REFERENCES users(id), total NUMERIC(10,2), status VARCHAR(50) DEFAULT 'PENDING')"),
            new Migration("V3__add_email_index",
                "Email lookup index", "versioned",
                "CREATE INDEX idx_users_email ON users(email)"),
            new Migration("R__seed_test_data",
                "Seed reference data", "repeatable",
                "INSERT INTO users (name, email) VALUES ('Admin', 'admin@example.com') ON CONFLICT DO NOTHING")
        );

        FlywaySimulator flyway = new FlywaySimulator();

        System.out.println("--- First run (fresh DB) ---");
        flyway.migrate(migrations);

        System.out.println("\n--- Second run (idempotent) ---");
        flyway.migrate(migrations);  // V1-V3 skipped; R__ re-applied

        System.out.println("\n--- Best practices ---");
        System.out.println("  NEVER modify an applied versioned migration (Flyway detects checksum change).");
        System.out.println("  Add new changes as a new version: V4__, V5__, ...");
        System.out.println("  Repeatable (R__) scripts re-run whenever their checksum changes.");
        System.out.println("  Always test migrations on a copy of production data before deploying.");
    }
}