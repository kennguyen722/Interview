# Answer Code Sample - Lesson 1.4: Object-Oriented Programming I

## Java Answer (Complete Runnable)

~~~java
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Lesson 1.4 â€“ Object-Oriented Programming I
 *
 * WHAT THIS DEMONSTRATES:
 *   Classes, objects, constructors, encapsulation (private fields + getters/setters),
 *   access modifiers, and a simple library domain model.
 *
 * KEY TERMS:
 *   class        â€“ a blueprint describing data (fields) and behaviour (methods).
 *   object       â€“ a concrete instance created from a class blueprint.
 *   constructor  â€“ a special method called with 'new' to initialise an object.
 *   encapsulation â€“ hiding internal state; expose it only through controlled methods.
 *   access modifier â€“ public, private, protected, package-private.
 */
public class AnswerApp {

    // â”€â”€ Domain model: Book â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Represents a book in the library.
     * Fields are PRIVATE so they can only be read/written through methods,
     * ensuring the object always stays in a valid state.
     */
    static class Book {
        private final String isbn;    // immutable identifier
        private final String title;
        private final String author;
        private boolean checkedOut;   // mutable loan status

        /**
         * Constructor â€” called with 'new Book(...)'.
         * Validates that required fields are not empty.
         */
        public Book(String isbn, String title, String author) {
            if (isbn == null || isbn.isBlank())
                throw new IllegalArgumentException("ISBN must not be blank");
            if (title == null || title.isBlank())
                throw new IllegalArgumentException("Title must not be blank");
            if (author == null || author.isBlank())
                throw new IllegalArgumentException("Author must not be blank");

            // 'this.' refers to the instance field, distinguishing from the parameter
            this.isbn       = isbn.trim();
            this.title      = title.trim();
            this.author     = author.trim();
            this.checkedOut = false;   // default: book is available
        }

        // Getters â€“ read-only access to private fields
        public String  getIsbn()       { return isbn; }
        public String  getTitle()      { return title; }
        public String  getAuthor()     { return author; }
        public boolean isCheckedOut()  { return checkedOut; }

        // Setter â€“ changes state through a controlled method
        public void setCheckedOut(boolean status) {
            this.checkedOut = status;
        }

        @Override
        public String toString() {
            String status = checkedOut ? "[OUT]" : "[IN] ";
            return status + " \"" + title + "\" by " + author + " (ISBN: " + isbn + ")";
        }
    }

    // â”€â”€ Domain model: Library â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Manages a collection of books and provides checkout/return operations.
     * Only the Library class can modify book status â€” encapsulation at work.
     */
    static class Library {
        private final String name;
        private final List<Book> catalogue;   // List holds ordered book entries

        public Library(String name) {
            this.name      = name;
            this.catalogue = new ArrayList<>();
        }

        /** Adds a book to the catalogue. */
        public void addBook(Book book) {
            catalogue.add(book);
            System.out.println("Added: " + book.getTitle());
        }

        /**
         * Finds a book by ISBN and marks it checked out.
         * Returns true if successful, false if not found or already out.
         *
         * @param isbn the 13-character ISBN string
         */
        public boolean checkOut(String isbn) {
            Optional<Book> found = findByIsbn(isbn);

            if (found.isEmpty()) {
                System.out.println("Book " + isbn + " not found.");
                return false;
            }

            Book book = found.get();
            if (book.isCheckedOut()) {
                System.out.println("\"" + book.getTitle() + "\" is already checked out.");
                return false;
            }

            book.setCheckedOut(true);
            System.out.println("Checked out: \"" + book.getTitle() + "\"");
            return true;
        }

        /** Returns a book to the library. */
        public boolean returnBook(String isbn) {
            Optional<Book> found = findByIsbn(isbn);
            if (found.isEmpty()) return false;

            Book book = found.get();
            book.setCheckedOut(false);
            System.out.println("Returned: \"" + book.getTitle() + "\"");
            return true;
        }

        /** Prints the full catalogue with availability status. */
        public void printCatalogue() {
            System.out.println("\n=== " + name + " Catalogue ===");
            if (catalogue.isEmpty()) {
                System.out.println("  (empty)");
                return;
            }
            catalogue.forEach(b -> System.out.println("  " + b));
            long available = catalogue.stream().filter(b -> !b.isCheckedOut()).count();
            System.out.printf("  â€” %d of %d books available%n%n", available, catalogue.size());
        }

        // private helper: find a book by ISBN without exposing the list
        private Optional<Book> findByIsbn(String isbn) {
            return catalogue.stream()
                .filter(b -> b.getIsbn().equals(isbn))
                .findFirst();
        }
    }

    // â”€â”€ Entry point â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.4: OOP I â€“ Library Domain Model ===\n");

        Library lib = new Library("City Central Library");

        // Create book objects using the constructor
        lib.addBook(new Book("9780132350884", "Clean Code",              "Robert C. Martin"));
        lib.addBook(new Book("9780201633610", "Design Patterns",         "Gang of Four"));
        lib.addBook(new Book("9780321125217", "Domain-Driven Design",    "Eric Evans"));
        lib.addBook(new Book("9780134685991", "Effective Java",          "Joshua Bloch"));

        lib.printCatalogue();

        // Checkout and return operations
        System.out.println("--- Transactions ---");
        lib.checkOut("9780132350884");
        lib.checkOut("9780132350884");  // attempt duplicate checkout
        lib.checkOut("9999999999999");  // non-existent book

        lib.printCatalogue();

        lib.returnBook("9780132350884");
        lib.printCatalogue();
    }
}

~~~
