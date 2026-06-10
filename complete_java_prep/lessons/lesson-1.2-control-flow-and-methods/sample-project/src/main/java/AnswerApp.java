import java.util.Scanner;

/**
 * Lesson 1.2 â€“ Control Flow and Methods
 *
 * WHAT THIS DEMONSTRATES:
 *   if/else, switch expressions, for/while/do-while loops,
 *   method parameters and return values, and building a menu-driven app.
 *
 * KEY TERMS:
 *   control flow â€“ the order in which statements execute.
 *   method       â€“ a named block of code that can be called by name.
 *   parameter    â€“ a variable declared inside a method signature.
 *   return type  â€“ the type of value a method sends back to its caller.
 *   loop         â€“ a construct that repeats a block of code.
 */
public class AnswerApp {

    // The main menu options as a constant array.
    // Using a constant avoids repeating the strings in multiple places.
    private static final String[] MENU_OPTIONS = {
        "Check if a number is even or odd",
        "Print a multiplication table",
        "Compute factorial of N",
        "Classify BMI",
        "Exit"
    };

    public static void main(String[] args) {
        System.out.println("=== Lesson 1.2: Control Flow and Methods ===\n");

        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        // do-while: execute the body at least once before checking condition.
        // This is the right loop when you always want to show the menu first.
        do {
            printMenu();
            System.out.print("Your choice: ");

            int choice = readInt(scanner);  // delegate input to a helper method

            // switch statement dispatches to a case based on the value
            switch (choice) {
                case 1 -> evenOrOdd(scanner);
                case 2 -> multiplicationTable(scanner);
                case 3 -> factorialMenu(scanner);
                case 4 -> bmiMenu(scanner);
                case 5 -> {
                    System.out.println("Goodbye!");
                    running = false;   // exit the do-while loop
                }
                default -> System.out.println("Invalid choice. Please enter 1-5.\n");
            }
        } while (running);
    }

    // â”€â”€ Menu helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /** Prints the numbered menu to the console. */
    private static void printMenu() {
        System.out.println("â”€".repeat(40));
        System.out.println("  MENU");
        System.out.println("â”€".repeat(40));
        // Enhanced for-loop: iterate without an explicit index
        for (int i = 0; i < MENU_OPTIONS.length; i++) {
            System.out.printf("  %d. %s%n", i + 1, MENU_OPTIONS[i]);
        }
        System.out.println("â”€".repeat(40));
    }

    // â”€â”€ Feature methods â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /** Uses the modulo operator to determine even/odd. */
    private static void evenOrOdd(Scanner sc) {
        System.out.print("Enter an integer: ");
        int n = readInt(sc);
        // n % 2 == 0 means n divides evenly by 2 â†’ even
        String result = (n % 2 == 0) ? "even" : "odd";
        System.out.printf("%d is %s.%n%n", n, result);
    }

    /** Prints a multiplication table using a nested for-loop. */
    private static void multiplicationTable(Scanner sc) {
        System.out.print("Enter table size (e.g. 5): ");
        int size = readInt(sc);
        System.out.println();

        // Outer loop: rows. Inner loop: columns.
        for (int row = 1; row <= size; row++) {
            for (int col = 1; col <= size; col++) {
                System.out.printf("%4d", row * col);  // right-align in 4 chars
            }
            System.out.println();  // newline after each row
        }
        System.out.println();
    }

    /** Reads N and prints N! using an iterative while-loop. */
    private static void factorialMenu(Scanner sc) {
        System.out.print("Enter N (0-12): ");
        int n = readInt(sc);
        if (n < 0 || n > 12) {
            System.out.println("N must be between 0 and 12.\n");
            return;
        }
        System.out.printf("%d! = %d%n%n", n, factorial(n));
    }

    /**
     * Computes factorial iteratively.
     * factorial(0) = 1  (by convention)
     * factorial(n) = n * (n-1) * ... * 1
     *
     * @param n non-negative integer, max 12 to stay within int range
     * @return n factorial
     */
    private static int factorial(int n) {
        int result = 1;
        // while-loop: keep multiplying while the counter is positive
        while (n > 1) {
            result *= n;  // shorthand for result = result * n
            n--;          // decrement counter
        }
        return result;
    }

    /** Reads height and weight and classifies BMI using if/else-if chain. */
    private static void bmiMenu(Scanner sc) {
        System.out.print("Height in metres (e.g. 1.75): ");
        double height = sc.nextDouble();
        System.out.print("Weight in kg     (e.g. 70)  : ");
        double weight = sc.nextDouble();

        if (height <= 0 || weight <= 0) {
            System.out.println("Height and weight must be positive.\n");
            return;
        }

        double bmi = weight / (height * height);  // standard BMI formula

        // if / else-if / else: checked top-to-bottom; first true branch runs
        String category;
        if      (bmi < 18.5) category = "Underweight";
        else if (bmi < 25.0) category = "Normal weight";
        else if (bmi < 30.0) category = "Overweight";
        else                 category = "Obese";

        System.out.printf("BMI = %.1f â€” %s%n%n", bmi, category);
    }

    // â”€â”€ Utility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Safely reads an integer from the scanner.
     * If the user types non-numeric input, prompts again.
     *
     * @param sc the Scanner to read from
     * @return the integer value entered
     */
    private static int readInt(Scanner sc) {
        while (!sc.hasNextInt()) {
            System.out.print("Please enter a whole number: ");
            sc.next();  // discard the invalid token
        }
        int value = sc.nextInt();
        sc.nextLine();  // consume trailing newline left by nextInt()
        return value;
    }
}
