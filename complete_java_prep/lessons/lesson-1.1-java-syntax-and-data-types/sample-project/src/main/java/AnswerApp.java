import java.util.Scanner;

/**
 * Lesson 1.1 â€“ Java Syntax and Data Types
 *
 * WHAT THIS DEMONSTRATES:
 *   Variables, the eight primitive types, reference types, operators,
 *   implicit/explicit type conversion, and input validation.
 *
 * KEY TERMS:
 *   variable    â€“ a named slot in memory that stores a value.
 *   primitive   â€“ a built-in value type: byte, short, int, long,
 *                 float, double, char, boolean.
 *   reference   â€“ a variable that points to an object on the heap.
 *   casting     â€“ explicitly converting between compatible types.
 *   operator    â€“ a symbol that performs arithmetic, comparison, or logic.
 */
public class AnswerApp {

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.1: Java Syntax and Data Types ===\n");

        // --- Part 1: Primitive types in action ---
        demonstratePrimitives();

        // --- Part 2: Type conversion (widening and narrowing) ---
        demonstrateTypeConversion();

        // --- Part 3: Interactive calculator with input validation ---
        runCalculator(new Scanner(System.in));
    }

    /** Shows each primitive type with a concrete usage example. */
    private static void demonstratePrimitives() {
        System.out.println("--- Primitive Types ---");

        byte  age       = 25;          // 8-bit integer: -128 to 127
        short year      = 2026;        // 16-bit integer: good for years
        int   count     = 1_000_000;   // 32-bit integer: most common whole-number type
        long  population = 8_000_000_000L; // 64-bit integer: needs 'L' suffix
        float price     = 19.99f;      // 32-bit decimal: needs 'f' suffix
        double pi       = 3.141592653589793; // 64-bit decimal: default decimal type
        char  grade     = 'A';         // single Unicode character in single quotes
        boolean active  = true;        // only true or false

        System.out.printf("byte    age       = %d%n",   age);
        System.out.printf("short   year      = %d%n",   year);
        System.out.printf("int     count     = %,d%n",  count);      // comma formatting
        System.out.printf("long    population = %,d%n", population);
        System.out.printf("float   price     = %.2f%n", price);
        System.out.printf("double  pi        = %.15f%n", pi);
        System.out.printf("char    grade     = %c%n",   grade);
        System.out.printf("boolean active    = %b%n",   active);
        System.out.println();
    }

    /** Illustrates widening (safe, automatic) vs narrowing (manual, may lose data). */
    private static void demonstrateTypeConversion() {
        System.out.println("--- Type Conversion ---");

        // WIDENING: smaller â†’ larger type. Java does this automatically.
        int    intVal    = 42;
        long   longVal   = intVal;   // int widened to long â€” no data loss
        double doubleVal = intVal;   // int widened to double â€” becomes 42.0

        System.out.printf("int %d  widened to long   -> %d%n",   intVal, longVal);
        System.out.printf("int %d  widened to double -> %.1f%n", intVal, doubleVal);

        // NARROWING: larger â†’ smaller type. Requires explicit cast.
        // WARNING: decimal part is TRUNCATED (not rounded).
        double price    = 19.99;
        int    truncated = (int) price;   // 19, NOT 20

        System.out.printf("double %.2f  narrowed to int -> %d  (decimal truncated!)%n",
            price, truncated);

        // Integer arithmetic pitfall: 10/3 is 3, not 3.333
        int    intDiv    = 10 / 3;
        double doubleDiv = 10.0 / 3;   // force double division

        System.out.printf("int    10 / 3   = %d   (integer division â€” fraction lost)%n", intDiv);
        System.out.printf("double 10.0 / 3 = %.4f (correct decimal result)%n", doubleDiv);
        System.out.println();
    }

    /**
     * Reads two numbers and an operator from stdin, validates them,
     * and prints the result. Demonstrates operators and input guards.
     *
     * @param scanner connected to System.in
     */
    private static void runCalculator(Scanner scanner) {
        System.out.println("--- Interactive Calculator ---");
        System.out.print("Enter first number  : ");

        // nextDouble() reads the next token as a double;
        // throws InputMismatchException if input is not numeric.
        double a = scanner.nextDouble();

        System.out.print("Enter operator (+,-,*,/,%): ");
        String op = scanner.next().trim();

        System.out.print("Enter second number : ");
        double b = scanner.nextDouble();

        // Guard: division and modulo by zero are undefined
        if ((op.equals("/") || op.equals("%")) && b == 0) {
            System.out.println("Validation error: cannot divide by zero.");
            return;
        }

        // Switch expression (Java 14+): each arm is an expression, no fall-through
        double result = switch (op) {
            case "+"  -> a + b;
            case "-"  -> a - b;
            case "*"  -> a * b;
            case "/"  -> a / b;
            case "%"  -> a % b;   // modulo: remainder after division
            default   -> {
                System.out.println("Validation error: unsupported operator '" + op + "'.");
                yield Double.NaN; // NaN = Not a Number, signals invalid state
            }
        };

        if (!Double.isNaN(result)) {
            // %.6g formats as significant digits, handles large and small values
            System.out.printf("Result: %s %s %s = %.6g%n", a, op, b, result);
        }
    }
}
