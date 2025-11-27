/**
 * Prompt 3: String immutability and String pool
 * 
 * Key Points:
 * - Strings are immutable - cannot be changed after creation
 * - String literals are stored in String pool (interned)
 * - String operations create new objects
 * - == compares references, equals() compares content
 */
public class Example_Prompt3_StringImmutability {
    public static void main(String[] args) {
        // String literal - goes to string pool
        String s1 = "Hello";
        String s2 = "Hello";
        System.out.println("s1 == s2: " + (s1 == s2)); // true (same reference in pool)
        System.out.println("s1.equals(s2): " + s1.equals(s2)); // true
        
        // New String object - not in pool initially
        String s3 = new String("Hello");
        System.out.println("s1 == s3: " + (s1 == s3)); // false (different references)
        System.out.println("s1.equals(s3): " + s1.equals(s3)); // true
        
        // String operations create new objects
        String original = "Java";
        String modified = original.concat(" Programming");
        System.out.println("Original: " + original); // Still "Java"
        System.out.println("Modified: " + modified); // "Java Programming"
        System.out.println("Same reference? " + (original == modified)); // false
        
        // StringBuilder for mutable string operations
        StringBuilder sb = new StringBuilder("Mutable");
        sb.append(" String");
        System.out.println("StringBuilder result: " + sb.toString());
        
        // Intern example
        String s4 = new String("World").intern();
        String s5 = "World";
        System.out.println("s4 == s5 after intern: " + (s4 == s5)); // true
    }
}