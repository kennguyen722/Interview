import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

/**
 * Lesson 2.4 â€“ File I/O and NIO
 *
 * WHAT THIS DEMONSTRATES:
 *   Reading and writing files with java.nio.file.Files,
 *   parsing CSV data, JSON-style serialisation,
 *   and building a CLI data import/export tool.
 *
 * KEY TERMS:
 *   Path       â€“ NIO representation of a filesystem location.
 *   Files      â€“ utility class with static read/write methods (NIO.2).
 *   BufferedReader â€“ wraps a Reader for line-by-line efficiency.
 *   Charset    â€“ character encoding scheme (use UTF-8 everywhere).
 *   CSV        â€“ Comma-Separated Values, a simple flat-file data format.
 */
public class AnswerApp {

    record Product(String sku, String name, double price, int stock) {
        /** Serialise to a CSV row. Quotes fields containing commas. */
        public String toCsv() {
            return String.join(",",
                sku, quote(name), String.valueOf(price), String.valueOf(stock));
        }

        /** Parse from a CSV row produced by toCsv(). */
        public static Product fromCsv(String line) {
            String[] parts = line.split(",", 4);  // max 4 tokens
            return new Product(
                parts[0],
                parts[1].replace("\"", ""),        // strip quotes
                Double.parseDouble(parts[2]),
                Integer.parseInt(parts[3]));
        }

        /** Serialise to a minimal JSON object string. */
        public String toJson() {
            return String.format(
                "{\"sku\":\"%s\",\"name\":\"%s\",\"price\":%.2f,\"stock\":%d}",
                sku, name, price, stock);
        }

        private static String quote(String s) {
            return s.contains(",") ? "\"" + s + "\"" : s;
        }
    }

    // â”€â”€ I/O helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Writes a list of products to a CSV file.
     * Files.newBufferedWriter handles charset and opens/closes the file.
     */
    static void exportCsv(List<Product> products, Path file) throws IOException {
        try (BufferedWriter writer = Files.newBufferedWriter(file)) {
            // Write header row
            writer.write("sku,name,price,stock");
            writer.newLine();
            for (Product p : products) {
                writer.write(p.toCsv());
                writer.newLine();
            }
        }
        System.out.printf("Exported %d products to %s%n", products.size(), file.getFileName());
    }

    /**
     * Reads a CSV file (with header) and returns parsed Products.
     * Files.lines() gives a Stream<String> â€” lazy, one-pass reading.
     */
    static List<Product> importCsv(Path file) throws IOException {
        try (Stream<String> lines = Files.lines(file)) {
            return lines
                .skip(1)                         // skip header row
                .filter(l -> !l.isBlank())       // skip empty lines
                .map(Product::fromCsv)
                .collect(Collectors.toList());
        }
    }

    /** Writes each product as a JSON object, one per line (JSON Lines format). */
    static void exportJsonLines(List<Product> products, Path file) throws IOException {
        List<String> lines = products.stream()
            .map(Product::toJson)
            .collect(Collectors.toList());
        Files.write(file, lines);   // writes UTF-8 by default
        System.out.printf("Exported %d products to %s%n", products.size(), file.getFileName());
    }

    /** Reads a directory listing and prints file names with sizes. */
    static void listDirectory(Path dir) throws IOException {
        System.out.println("\n--- Files in " + dir + " ---");
        try (Stream<Path> paths = Files.list(dir)) {
            paths.filter(Files::isRegularFile)
                 .forEach(p -> {
                     try {
                         System.out.printf("  %-30s  %6d bytes%n",
                             p.getFileName(), Files.size(p));
                     } catch (IOException ignored) {}
                 });
        }
    }

    // â”€â”€ Entry point â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public static void main(String[] args) throws Exception {
        System.out.println("=== Lesson 2.4: File I/O and NIO ===\n");

        // Use system temp directory so this runs anywhere
        Path tempDir = Files.createTempDirectory("lesson-2-4-");

        List<Product> catalog = List.of(
            new Product("A001", "Clean Code Book",          49.99, 20),
            new Product("A002", "Spring Boot, 3rd Ed",      54.99, 15),
            new Product("B001", "Mechanical Keyboard",     129.99,  8),
            new Product("B002", "USB-C Hub, 7-port",        34.99,  4)
        );

        // â”€â”€ Export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        Path csvPath  = tempDir.resolve("products.csv");
        Path jsonPath = tempDir.resolve("products.jsonl");

        exportCsv(catalog, csvPath);
        exportJsonLines(catalog, jsonPath);

        // â”€â”€ Import â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        System.out.println("\n--- Imported from CSV ---");
        List<Product> imported = importCsv(csvPath);
        imported.forEach(p ->
            System.out.printf("  %-8s %-25s $%6.2f  stock:%d%n",
                p.sku(), p.name(), p.price(), p.stock()));

        // â”€â”€ Read raw lines â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        System.out.println("\n--- Raw JSON lines file ---");
        Files.readAllLines(jsonPath).forEach(l -> System.out.println("  " + l));

        // â”€â”€ Directory listing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        listDirectory(tempDir);

        // â”€â”€ Cleanup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        Files.deleteIfExists(csvPath);
        Files.deleteIfExists(jsonPath);
        Files.deleteIfExists(tempDir);
        System.out.println("\nTemp files cleaned up.");
    }
}
