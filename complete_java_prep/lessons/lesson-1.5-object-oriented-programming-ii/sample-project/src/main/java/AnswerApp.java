import java.util.ArrayList;
import java.util.List;

/**
 * Lesson 1.5 â€“ Object-Oriented Programming II
 *
 * WHAT THIS DEMONSTRATES:
 *   Inheritance, polymorphism, abstract classes, interfaces,
 *   and composition over inheritance â€” all on the library model.
 *
 * KEY TERMS:
 *   inheritance    â€“ a class inherits fields/methods from a parent class (extends).
 *   polymorphism   â€“ a variable of type A can hold any subtype of A.
 *   abstract class â€“ cannot be instantiated; may have abstract (unimplemented) methods.
 *   interface      â€“ a contract of method signatures; a class can implement many.
 *   composition    â€“ building behaviour by holding references to other objects.
 *   @Override      â€“ annotation confirming a method replaces the parent version.
 */
public class AnswerApp {

    // â”€â”€ Interface: Loanable â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // An interface defines WHAT something can do, not HOW.
    interface Loanable {
        boolean checkOut(String borrowerId);
        boolean returnItem();
        boolean isAvailable();
    }

    // â”€â”€ Interface: Searchable â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    interface Searchable {
        String getTitle();
        String getDescription();
    }

    // â”€â”€ Abstract class: LibraryItem â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // 'abstract' means you cannot do: new LibraryItem().
    // Subclasses MUST implement the abstract methods.
    static abstract class LibraryItem implements Loanable, Searchable {
        private final String id;
        private final String title;
        protected boolean checkedOut = false;  // 'protected' lets subclasses see it

        public LibraryItem(String id, String title) {
            this.id    = id;
            this.title = title;
        }

        public String getId()     { return id; }
        @Override public String getTitle() { return title; }

        // Concrete implementation shared by all subclasses
        @Override public boolean isAvailable()   { return !checkedOut; }
        @Override public boolean returnItem()    { checkedOut = false; return true; }

        // Each subclass must define its own description
        @Override public abstract String getDescription();

        @Override
        public String toString() {
            return String.format("[%s] %s â€” %s",
                checkedOut ? "OUT" : "IN ", getClass().getSimpleName(), title);
        }
    }

    // â”€â”€ Concrete: Book â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    static class Book extends LibraryItem {
        private final String author;

        public Book(String id, String title, String author) {
            super(id, title);    // call parent constructor
            this.author = author;
        }

        @Override public boolean checkOut(String borrowerId) {
            if (checkedOut) return false;
            checkedOut = true;
            System.out.println("Book borrowed by " + borrowerId);
            return true;
        }

        @Override public String getDescription() {
            return "Book by " + author;
        }
    }

    // â”€â”€ Concrete: DvdDisc â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    static class DvdDisc extends LibraryItem {
        private final int durationMinutes;

        public DvdDisc(String id, String title, int durationMinutes) {
            super(id, title);
            this.durationMinutes = durationMinutes;
        }

        @Override public boolean checkOut(String borrowerId) {
            if (checkedOut) return false;
            checkedOut = true;
            System.out.println("DVD borrowed by " + borrowerId + " (loan: 7 days)");
            return true;
        }

        @Override public String getDescription() {
            return "DVD, " + durationMinutes + " min";
        }
    }

    // â”€â”€ Concrete: EBook (composition example) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // EBook USES a DigitalLicense instead of extending it.
    // This is "composition over inheritance".
    static class EBook extends LibraryItem {
        private final DigitalLicense license;

        public EBook(String id, String title, DigitalLicense license) {
            super(id, title);
            this.license = license;
        }

        @Override public boolean checkOut(String borrowerId) {
            if (!license.hasCapacity()) {
                System.out.println("No digital license capacity available.");
                return false;
            }
            license.allocate(borrowerId);
            return true;
        }

        @Override public String getDescription() {
            return "eBook, " + license.getSeats() + " concurrent seats";
        }
    }

    // â”€â”€ Helper class for composition â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    static class DigitalLicense {
        private final int seats;
        private final List<String> holders = new ArrayList<>();

        public DigitalLicense(int seats) { this.seats = seats; }

        public boolean hasCapacity() { return holders.size() < seats; }
        public void allocate(String id) { holders.add(id); }
        public int getSeats() { return seats; }
    }

    // â”€â”€ Library using polymorphism â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    static class Library {
        // The list holds LibraryItem references â€” it works with ANY subtype.
        // This is polymorphism in practice.
        private final List<LibraryItem> items = new ArrayList<>();

        public void add(LibraryItem item) { items.add(item); }

        /** Searches by title substring (case-insensitive). */
        public void search(String query) {
            System.out.println("\nSearch results for: \"" + query + "\"");
            items.stream()
                 .filter(i -> i.getTitle().toLowerCase().contains(query.toLowerCase()))
                 .forEach(i -> System.out.println("  " + i + " â€” " + i.getDescription()));
        }

        /** Prints the full catalogue using the polymorphic toString(). */
        public void printAll() {
            System.out.println("\n=== Library Catalogue ===");
            items.forEach(i -> System.out.println("  " + i));
        }
    }

    // â”€â”€ Entry point â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.5: OOP II â€“ Inheritance, Polymorphism, Interfaces ===\n");

        Library lib = new Library();

        lib.add(new Book    ("B001", "Clean Code",         "Robert C. Martin"));
        lib.add(new Book    ("B002", "Effective Java",     "Joshua Bloch"));
        lib.add(new DvdDisc ("D001", "The Matrix",         136));
        lib.add(new EBook   ("E001", "Spring in Action",   new DigitalLicense(3)));

        lib.printAll();

        System.out.println("\n--- Checkout Transactions ---");
        // All calls go through the Loanable interface method â€” polymorphic dispatch
        lib.search("clean");
        lib.search("java");

        // Checkout via the base-type reference â€” actual behaviour depends on subtype
        LibraryItem[] toCheckout = {
            new Book("B001", "Clean Code", "Martin"),
            new DvdDisc("D001", "The Matrix", 136)
        };
        for (LibraryItem item : toCheckout) {
            item.checkOut("member-42");
        }
        lib.printAll();
    }
}
