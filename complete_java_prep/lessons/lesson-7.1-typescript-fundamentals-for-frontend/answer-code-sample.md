# Answer Code Sample - Lesson 7.1: TypeScript Fundamentals for Frontend

## Java Answer (Complete Runnable)

~~~java
/**
 * Lesson 7.1 - TypeScript Fundamentals for Frontend
 *
 * Maps TypeScript concepts to their Java equivalents so you can
 * connect what you already know to what TypeScript provides.
 *
 * KEY TERMS:
 *   interface   - a structural type contract (same term, same idea as Java).
 *   type alias  - a named type expression (type UserId = string).
 *   union type  - value that may be one of several types (string | null).
 *   generics    - same concept as Java generics, same <T> syntax.
 *   utility types - Partial<T>, Readonly<T>, Record<K,V>, Pick<T,K>.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 7.1: TypeScript Fundamentals ===\n");

        System.out.println("--- TypeScript <-> Java concept map ---");
        String[][] map = {
            {"string",               "String"},
            {"number",               "int / double"},
            {"boolean",              "boolean"},
            {"any",                  "Object (avoid in both languages)"},
            {"unknown",              "Object (with runtime checks)"},
            {"void",                 "void"},
            {"T | null",             "Optional<T>"},
            {"T[]",                  "List<T>"},
            {"interface Foo {}",     "interface Foo {}"},
            {"type Alias = ...",     "record / typedef"},
            {"Partial<T>",           "all fields Optional"},
            {"Readonly<T>",          "final fields / record"},
            {"Record<K,V>",          "Map<K,V>"},
            {"enum Direction {}",    "enum Direction {}"},
            {"as unknown as T",      "(T) cast -- both are escape hatches"}
        };
        System.out.printf("%-30s  %s%n", "TypeScript", "Java");
        System.out.println("-".repeat(60));
        for (String[] r : map) System.out.printf("%-30s  %s%n", r[0], r[1]);

        System.out.println("\n--- TypeScript interface example ---");
        System.out.println("  interface User { id: number; name: string; email?: string; }");
        System.out.println("  // Java equivalent:");
        System.out.println("  record User(int id, String name, Optional<String> email) {}");

        System.out.println("\n--- Union types ---");
        System.out.println("  type Status = 'active' | 'inactive' | 'suspended';");
        System.out.println("  // Java: enum Status { ACTIVE, INACTIVE, SUSPENDED }");

        System.out.println("\n--- Generic function ---");
        System.out.println("  function identity<T>(value: T): T { return value; }");
        System.out.println("  // Java: static <T> T identity(T value) { return value; }");
    }
}
~~~
