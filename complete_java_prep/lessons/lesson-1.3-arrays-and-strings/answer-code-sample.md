# Answer Code Sample - Lesson 1.3: Arrays and Strings

## Java Answer (Complete Runnable)

~~~java
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Lesson 1.3 â€“ Arrays and Strings
 *
 * WHAT THIS DEMONSTRATES:
 *   Array declaration and traversal, String immutability,
 *   StringBuilder for efficient concatenation, and a text-analysis utility.
 *
 * KEY TERMS:
 *   array        â€“ a fixed-size, indexed container of same-type elements.
 *   index        â€“ the zero-based position of an element in an array.
 *   immutable    â€“ cannot be changed after creation (Strings are immutable).
 *   StringBuilder â€“ a mutable sequence of characters; efficient for building strings.
 *   char          â€“ a primitive representing a single Unicode character.
 */
public class AnswerApp {

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.3: Arrays and Strings ===\n");

        demonstrateArrays();
        demonstrateStringImmutability();
        demonstrateStringBuilder();

        // The full text-analysis utility
        String sample = "The quick brown fox jumps over the lazy dog. " +
                         "Pack my box with five dozen liquor jugs.";
        analyzeText(sample);
    }

    // â”€â”€ Arrays â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private static void demonstrateArrays() {
        System.out.println("--- Arrays ---");

        // Declaration: type[] name = new type[size];
        int[] scores = new int[5];   // all elements default to 0

        // Assign values using index (zero-based)
        scores[0] = 85;
        scores[1] = 92;
        scores[2] = 78;
        scores[3] = 96;
        scores[4] = 88;

        // Array initializer shorthand
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

        // Traverse with enhanced for-loop (no index needed)
        System.out.print("Days: ");
        for (String day : days) System.out.print(day + " ");
        System.out.println();

        // Traverse with classic for-loop when index matters
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        double average = (double) sum / scores.length;  // cast to get decimal result
        System.out.printf("Scores: %s%n", Arrays.toString(scores));
        System.out.printf("Average: %.1f%n%n", average);
    }

    // â”€â”€ String Immutability â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private static void demonstrateStringImmutability() {
        System.out.println("--- String Immutability ---");

        String original = "hello";
        // toUpperCase() does NOT modify original; it returns a NEW String object.
        String upper    = original.toUpperCase();

        System.out.println("original after toUpperCase() call: " + original); // still "hello"
        System.out.println("new string from toUpperCase()     : " + upper);   // "HELLO"

        // == compares references (memory addresses), not content
        String a = "hello";
        String b = "hello";
        String c = new String("hello");   // forces a new object on the heap

        System.out.println("a == b (string pool)  : " + (a == b));      // true (pool optimization)
        System.out.println("a == c (new object)   : " + (a == c));      // false!
        System.out.println("a.equals(c)           : " + a.equals(c));   // true (content equal)
        System.out.println("â†’ Always use .equals() to compare String content!\n");
    }

    // â”€â”€ StringBuilder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private static void demonstrateStringBuilder() {
        System.out.println("--- StringBuilder ---");

        // INEFFICIENT: each '+' creates a new String object in memory
        String inefficient = "";
        for (int i = 1; i <= 5; i++) {
            inefficient += "item" + i + ",";  // 5 temporary String objects created
        }
        System.out.println("String concatenation result : " + inefficient);

        // EFFICIENT: StringBuilder mutates a single internal buffer
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 5; i++) {
            sb.append("item").append(i);
            if (i < 5) sb.append(",");  // no trailing comma
        }
        System.out.println("StringBuilder result        : " + sb.toString());
        System.out.println("â†’ Use StringBuilder in loops and hot paths.\n");
    }

    // â”€â”€ Text Analysis Utility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Performs a multi-faceted analysis of a text string.
     * Counts characters, words, sentences, and letter frequencies.
     *
     * @param text the input text to analyse
     */
    private static void analyzeText(String text) {
        System.out.println("--- Text Analysis Utility ---");
        System.out.println("Input: \"" + text.substring(0, 40) + "...\"");
        System.out.println();

        // Character and length stats
        int totalChars = text.length();
        long letters   = text.chars().filter(Character::isLetter).count();
        long spaces    = text.chars().filter(c -> c == ' ').count();
        long digits    = text.chars().filter(Character::isDigit).count();

        // Words: split on one or more whitespace characters
        String[] words    = text.trim().split("\\s+");
        int wordCount     = words.length;

        // Sentences: count sentence-ending punctuation
        long sentences    = text.chars()
                                .filter(c -> c == '.' || c == '!' || c == '?')
                                .count();

        // Unique words (case-insensitive)
        long uniqueWords  = Arrays.stream(words)
                                  .map(w -> w.replaceAll("[^a-zA-Z]", "").toLowerCase())
                                  .filter(w -> !w.isEmpty())
                                  .distinct()
                                  .count();

        System.out.printf("Total characters : %d%n", totalChars);
        System.out.printf("Letters          : %d%n", letters);
        System.out.printf("Spaces           : %d%n", spaces);
        System.out.printf("Digits           : %d%n", digits);
        System.out.printf("Words            : %d  (unique: %d)%n", wordCount, uniqueWords);
        System.out.printf("Sentences        : %d%n", sentences);
        System.out.printf("Avg word length  : %.1f chars%n",
            Arrays.stream(words)
                  .mapToInt(String::length)
                  .average()
                  .orElse(0));

        // Top-5 most frequent letters
        System.out.println("\nTop-5 letter frequencies:");
        Map<Character, Long> freq = new HashMap<>();
        for (char c : text.toLowerCase().toCharArray()) {
            if (Character.isLetter(c)) freq.merge(c, 1L, Long::sum);
        }
        freq.entrySet().stream()
            .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
            .limit(5)
            .forEach(e -> System.out.printf("  '%c' : %d%n", e.getKey(), e.getValue()));
    }
}

~~~
