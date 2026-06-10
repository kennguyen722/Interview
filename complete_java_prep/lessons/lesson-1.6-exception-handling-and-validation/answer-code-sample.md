# Answer Code Sample - Lesson 1.6: Exception Handling and Validation

## Java Answer (Complete Runnable)

~~~java
/**
 * Lesson 1.6 â€“ Exception Handling and Validation
 *
 * WHAT THIS DEMONSTRATES:
 *   Checked vs unchecked exceptions, try/catch/finally,
 *   custom exception hierarchy, early-validation pattern.
 *
 * KEY TERMS:
 *   exception        â€“ an event that disrupts normal program flow.
 *   checked exception â€“ must be declared (throws) or caught; extends Exception.
 *   unchecked exception â€“ extends RuntimeException; no forced handling.
 *   try/catch/finally â€“ structured error-handling blocks.
 *   custom exception  â€“ a domain-specific exception with extra context.
 *   validation        â€“ checking inputs at a system boundary before processing.
 */
public class AnswerApp {

    // â”€â”€ Custom exception hierarchy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Base domain exception â€” all library errors extend this.
     * Extends RuntimeException so callers aren't forced to catch it,
     * but they may choose to.
     */
    static class LibraryException extends RuntimeException {
        private final String code;

        public LibraryException(String code, String message) {
            super(message);
            this.code = code;
        }

        public String getCode() { return code; }
    }

    /** Thrown when a user submits invalid input data. */
    static class ValidationException extends LibraryException {
        private final String field;

        public ValidationException(String field, String message) {
            super("VALIDATION_ERROR", "Field '" + field + "': " + message);
            this.field = field;
        }

        public String getField() { return field; }
    }

    /** Thrown when a requested resource does not exist. */
    static class NotFoundException extends LibraryException {
        public NotFoundException(String resource, String id) {
            super("NOT_FOUND", resource + " with id '" + id + "' does not exist.");
        }
    }

    // â”€â”€ Domain object with validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static class BookRegistration {
        private final String isbn;
        private final String title;
        private final int    year;

        /**
         * Constructor-level validation â€” the object is NEVER in an invalid state.
         * Throw early rather than letting bad data propagate.
         */
        public BookRegistration(String isbn, String title, int year) {
            this.isbn  = validateIsbn(isbn);
            this.title = validateTitle(title);
            this.year  = validateYear(year);
        }

        private static String validateIsbn(String isbn) {
            if (isbn == null || isbn.isBlank())
                throw new ValidationException("isbn", "must not be blank");
            String digits = isbn.replaceAll("[^0-9]", "");
            if (digits.length() != 13)
                throw new ValidationException("isbn", "must contain exactly 13 digits, got " + digits.length());
            return isbn.trim();
        }

        private static String validateTitle(String title) {
            if (title == null || title.isBlank())
                throw new ValidationException("title", "must not be blank");
            if (title.length() > 200)
                throw new ValidationException("title", "exceeds 200 characters");
            return title.trim();
        }

        private static int validateYear(int year) {
            if (year < 1450 || year > 2100)
                throw new ValidationException("year",
                    "must be between 1450 and 2100, got " + year);
            return year;
        }

        @Override
        public String toString() {
            return String.format("BookRegistration{isbn='%s', title='%s', year=%d}",
                isbn, title, year);
        }
    }

    // â”€â”€ Service that uses exceptions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static class RegistrationService {
        /**
         * Wraps constructor call in try/catch to show proper handling.
         * In a real app this would also persist to a database.
         *
         * @param isbn  book ISBN
         * @param title book title
         * @param year  publication year
         */
        public void register(String isbn, String title, int year) {
            try {
                BookRegistration reg = new BookRegistration(isbn, title, year);
                System.out.println("  âœ“ Registered: " + reg);

            } catch (ValidationException e) {
                // Catch the specific subtype first; more specific before generic
                System.out.printf("  âœ— Validation [%s] field=%s : %s%n",
                    e.getCode(), e.getField(), e.getMessage());

            } catch (LibraryException e) {
                // Catch base domain exception for any other library error
                System.out.println("  âœ— Domain error [" + e.getCode() + "]: " + e.getMessage());

            } catch (Exception e) {
                // Catch-all for unexpected errors â€” log and surface without crashing
                System.out.println("  âœ— Unexpected error: " + e.getMessage());

            } finally {
                // finally always runs: ideal for closing resources
                System.out.println("  (registration attempt complete)");
            }
        }

        /** Demonstrates throwing and catching NotFoundException. */
        public void lookup(String id) {
            System.out.print("  Looking up book '" + id + "': ");
            try {
                if (!id.startsWith("B")) throw new NotFoundException("Book", id);
                System.out.println("Found.");
            } catch (NotFoundException e) {
                System.out.println(e.getMessage());
            }
        }
    }

    // â”€â”€ Entry point â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.6: Exception Handling and Validation ===\n");

        RegistrationService svc = new RegistrationService();

        System.out.println("--- Registration Attempts ---");
        // Valid
        svc.register("9780132350884", "Clean Code", 2008);
        // Blank ISBN
        svc.register("", "Clean Code", 2008);
        // Wrong digit count
        svc.register("978013235", "Clean Code", 2008);
        // Blank title
        svc.register("9780132350884", "  ", 2008);
        // Invalid year
        svc.register("9780132350884", "Future Book", 2200);

        System.out.println("\n--- Lookup Tests ---");
        svc.lookup("B001");
        svc.lookup("X999");
    }
}

~~~
