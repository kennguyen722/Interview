/**
 * Lesson 11.2 - Capstone Build Sprint 1 (Backend + DB + Auth)
 *
 * Sprint 1 acceptance criteria and key Spring Boot patterns.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 11.2: Capstone Sprint 1 - Backend + DB + Auth ===\n");

        System.out.println("--- Sprint 1 acceptance criteria ---");
        String[] criteria = {
            "POST /api/auth/login  returns { accessToken, expiresIn }",
            "GET  /api/books       returns paginated list (requires valid JWT)",
            "POST /api/books       creates a book (ADMIN role only)",
            "GET  /api/books/{id}  returns single book or 404",
            "All endpoints return structured error responses on failure",
            "PostgreSQL schema applied via Flyway V1 migration",
            "Unit test coverage >= 80% on service layer",
            "docker-compose up starts backend + PostgreSQL + Redis"
        };
        for (String c : criteria) System.out.println("  [ ] " + c);

        System.out.println("\n--- Key Spring Boot annotations ---");
        String[][] annos = {
            {"@RestController",       "Marks a class as REST controller"},
            {"@RequestMapping",       "Base path for all methods in the controller"},
            {"@GetMapping / @PostMapping", "HTTP method-specific route mappings"},
            {"@PathVariable",         "Binds URI template variable to method param"},
            {"@RequestBody + @Valid", "Deserialize + validate request JSON body"},
            {"@Entity + @Id",         "JPA entity and primary key mapping"},
            {"@ManyToOne / @OneToMany","JPA relationship annotations"},
            {"@Service",              "Marks business logic layer as Spring bean"},
            {"@Transactional",        "Wraps method in a DB transaction"},
            {"@PreAuthorize",         "Method-level access control (hasRole check)"}
        };
        System.out.printf("  %-35s  %s%n", "Annotation", "Purpose");
        System.out.println("  " + "-".repeat(70));
        for (String[] a : annos) System.out.printf("  %-35s  %s%n", a[0], a[1]);

        System.out.println("\n--- Minimal Spring Boot project structure ---");
        System.out.println("  src/main/java/com/example/");
        System.out.println("    LibraryApplication.java     -- @SpringBootApplication main class");
        System.out.println("    config/SecurityConfig.java  -- SecurityFilterChain bean");
        System.out.println("    controller/BookController.java");
        System.out.println("    controller/AuthController.java");
        System.out.println("    service/BookService.java");
        System.out.println("    service/JwtService.java");
        System.out.println("    repository/BookRepository.java  -- extends JpaRepository<Book, Long>");
        System.out.println("    entity/Book.java");
        System.out.println("    dto/BookRequest.java");
        System.out.println("    dto/BookResponse.java");
        System.out.println("  src/main/resources/");
        System.out.println("    application.yml");
        System.out.println("    db/migration/V1__create_books.sql");
    }
}