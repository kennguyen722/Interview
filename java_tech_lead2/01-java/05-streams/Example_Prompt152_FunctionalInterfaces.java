/**
 * Prompt 152: Functional Interfaces and Lambda Expressions
 * 
 * Key Points:
 * - Functional interface has exactly one abstract method (SAM - Single Abstract Method)
 * - @FunctionalInterface annotation ensures compile-time checking
 * - Lambda expressions provide concise way to implement functional interfaces
 * - Method references are even more concise for simple cases
 * - Built-in functional interfaces: Predicate, Function, Consumer, Supplier
 */

import java.util.*;
import java.util.function.*;
import java.util.stream.*;

// Custom functional interfaces
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
    
    // Default methods are allowed
    default void printResult(int a, int b) {
        System.out.printf("%d op %d = %d%n", a, b, calculate(a, b));
    }
}

@FunctionalInterface
interface StringProcessor {
    String process(String input);
}

@FunctionalInterface
interface TriFunction<T, U, V, R> {
    R apply(T t, U u, V v);
}

class Product {
    private String name;
    private double price;
    private String category;
    
    public Product(String name, double price, String category) {
        this.name = name;
        this.price = price;
        this.category = category;
    }
    
    public String getName() { return name; }
    public double getPrice() { return price; }
    public String getCategory() { return category; }
    
    @Override
    public String toString() {
        return String.format("%s ($%.2f, %s)", name, price, category);
    }
}

public class Example_Prompt152_FunctionalInterfaces {
    public static void main(String[] args) {
        System.out.println("=== Functional Interfaces and Lambda Expressions ===\n");
        
        // 1. CUSTOM FUNCTIONAL INTERFACES
        System.out.println("1. Custom Functional Interfaces:");
        customFunctionalInterfaces();
        
        // 2. BUILT-IN FUNCTIONAL INTERFACES
        System.out.println("\n2. Built-in Functional Interfaces:");
        builtInFunctionalInterfaces();
        
        // 3. METHOD REFERENCES
        System.out.println("\n3. Method References:");
        methodReferences();
        
        // 4. CLOSURE AND VARIABLE CAPTURE
        System.out.println("\n4. Closure and Variable Capture:");
        closureAndVariableCapture();
        
        // 5. FUNCTION COMPOSITION
        System.out.println("\n5. Function Composition:");
        functionComposition();
        
        // 6. PRACTICAL EXAMPLES
        System.out.println("\n6. Practical Examples:");
        practicalExamples();
    }
    
    private static void customFunctionalInterfaces() {
        // Lambda expressions for Calculator interface
        Calculator add = (a, b) -> a + b;
        Calculator multiply = (a, b) -> a * b;
        Calculator subtract = (a, b) -> a - b;
        
        // Using custom functional interface
        System.out.println("Addition: " + add.calculate(10, 5));
        System.out.println("Multiplication: " + multiply.calculate(10, 5));
        add.printResult(10, 5); // Using default method
        
        // Anonymous inner class vs Lambda comparison
        Calculator oldWay = new Calculator() {
            @Override
            public int calculate(int a, int b) {
                return a / b;
            }
        };
        Calculator newWay = (a, b) -> a / b;
        
        System.out.println("Old way (anonymous class): " + oldWay.calculate(20, 4));
        System.out.println("New way (lambda): " + newWay.calculate(20, 4));
        
        // StringProcessor examples
        StringProcessor uppercase = s -> s.toUpperCase();
        StringProcessor addPrefix = s -> "Processed: " + s;
        StringProcessor reverse = s -> new StringBuilder(s).reverse().toString();
        
        String input = "hello world";
        System.out.println("Original: " + input);
        System.out.println("Uppercase: " + uppercase.process(input));
        System.out.println("With prefix: " + addPrefix.process(input));
        System.out.println("Reversed: " + reverse.process(input));
    }
    
    private static void builtInFunctionalInterfaces() {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Predicate<T> - represents a boolean-valued function
        System.out.println("--- Predicate<T> ---");
        Predicate<Integer> isEven = n -> n % 2 == 0;
        Predicate<Integer> isGreaterThanFive = n -> n > 5;
        Predicate<Integer> isEvenAndGreaterThanFive = isEven.and(isGreaterThanFive);
        
        System.out.println("Even numbers: " + 
            numbers.stream().filter(isEven).collect(Collectors.toList()));
        System.out.println("Numbers > 5: " + 
            numbers.stream().filter(isGreaterThanFive).collect(Collectors.toList()));
        System.out.println("Even AND > 5: " + 
            numbers.stream().filter(isEvenAndGreaterThanFive).collect(Collectors.toList()));
        
        // Function<T, R> - represents a function that takes T and returns R
        System.out.println("\n--- Function<T, R> ---");
        Function<Integer, String> numberToString = n -> "Number: " + n;
        Function<Integer, Integer> square = n -> n * n;
        Function<Integer, String> numberToSquareString = numberToString.compose(square);
        
        System.out.println("Number to string: " + numberToString.apply(5));
        System.out.println("Square: " + square.apply(5));
        System.out.println("Compose (string of square): " + numberToSquareString.apply(5));
        
        // Consumer<T> - represents an operation that takes T and returns void
        System.out.println("\n--- Consumer<T> ---");
        Consumer<String> print = System.out::println;
        Consumer<String> printUppercase = s -> System.out.println(s.toUpperCase());
        Consumer<String> printBoth = print.andThen(printUppercase);
        
        System.out.println("Consumer examples:");
        printBoth.accept("hello consumer");
        
        // Supplier<T> - represents a supplier of results
        System.out.println("\n--- Supplier<T> ---");
        Supplier<Double> randomValue = Math::random;
        Supplier<String> currentTime = () -> new Date().toString();
        Supplier<List<Integer>> emptyList = ArrayList::new;
        
        System.out.println("Random value: " + randomValue.get());
        System.out.println("Current time: " + currentTime.get());
        System.out.println("Empty list: " + emptyList.get());
        
        // BiFunction, BiPredicate, BiConsumer examples
        System.out.println("\n--- Bi-Functions ---");
        BiFunction<Integer, Integer, Integer> sum = (a, b) -> a + b;
        BiPredicate<String, String> startsWith = (s1, s2) -> s1.startsWith(s2);
        BiConsumer<String, Integer> printWithIndex = (s, i) -> 
            System.out.printf("[%d] %s%n", i, s);
        
        System.out.println("Sum of 3 and 7: " + sum.apply(3, 7));
        System.out.println("'hello' starts with 'he': " + startsWith.test("hello", "he"));
        printWithIndex.accept("indexed string", 42);
    }
    
    private static void methodReferences() {
        List<String> words = Arrays.asList("java", "stream", "lambda", "functional");
        List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6);
        
        System.out.println("Original words: " + words);
        System.out.println("Original numbers: " + numbers);
        
        // Static method reference
        List<Integer> parsed = words.stream()
            .filter(s -> s.matches("\\d+")) // No numbers in our list, but shows the pattern
            .map(Integer::parseInt) // Static method reference
            .collect(Collectors.toList());
        
        // Instance method reference on arbitrary object
        List<String> upperWords = words.stream()
            .map(String::toUpperCase) // Instance method reference
            .collect(Collectors.toList());
        System.out.println("Uppercase: " + upperWords);
        
        // Instance method reference on specific object
        String prefix = "PREFIX_";
        List<String> prefixedWords = words.stream()
            .map(prefix::concat) // Instance method on specific object
            .collect(Collectors.toList());
        System.out.println("Prefixed: " + prefixedWords);
        
        // Constructor reference
        List<StringBuilder> stringBuilders = words.stream()
            .map(StringBuilder::new) // Constructor reference
            .collect(Collectors.toList());
        System.out.println("StringBuilders created: " + stringBuilders.size());
        
        // Comparison: Lambda vs Method Reference
        System.out.println("\nLambda vs Method Reference comparison:");
        
        // Lambda expression
        words.stream()
            .map(s -> s.length())
            .forEach(len -> System.out.print(len + " "));
        System.out.println("(using lambda)");
        
        // Method reference (more concise)
        words.stream()
            .map(String::length)
            .forEach(System.out::print);
        System.out.println(" (using method reference)");
    }
    
    private static void closureAndVariableCapture() {
        int multiplier = 10; // Effectively final variable
        final int addend = 100; // Explicitly final variable
        
        // Lambda can capture effectively final variables
        Function<Integer, Integer> multiplyAndAdd = x -> x * multiplier + addend;
        
        System.out.println("5 * 10 + 100 = " + multiplyAndAdd.apply(5));
        
        // This would cause compilation error:
        // multiplier = 20; // Cannot modify captured variable
        
        // Demonstrating closure behavior
        List<Function<Integer, Integer>> functions = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            int factor = i; // Local variable (effectively final in loop)
            functions.add(x -> x * factor);
        }
        
        System.out.println("Closure examples:");
        for (int i = 0; i < functions.size(); i++) {
            Function<Integer, Integer> func = functions.get(i);
            System.out.printf("Function %d: f(5) = %d%n", i + 1, func.apply(5));
        }
        
        // Mutable object capture (the reference is final, not the object)
        List<String> capturedList = new ArrayList<>();
        capturedList.add("initial");
        
        Consumer<String> addToList = item -> capturedList.add(item);
        addToList.accept("lambda added");
        
        System.out.println("Captured list: " + capturedList);
    }
    
    private static void functionComposition() {
        // Function composition with andThen and compose
        Function<Integer, Integer> addTwo = x -> x + 2;
        Function<Integer, Integer> multiplyByThree = x -> x * 3;
        Function<Integer, String> toString = Object::toString;
        
        // andThen: f.andThen(g) means g(f(x))
        Function<Integer, Integer> addThenMultiply = addTwo.andThen(multiplyByThree);
        System.out.println("(5 + 2) * 3 = " + addThenMultiply.apply(5));
        
        // compose: f.compose(g) means f(g(x))
        Function<Integer, Integer> multiplyThenAdd = addTwo.compose(multiplyByThree);
        System.out.println("(5 * 3) + 2 = " + multiplyThenAdd.apply(5));
        
        // Chain multiple functions
        Function<Integer, String> complexFunction = addTwo
            .andThen(multiplyByThree)
            .andThen(toString)
            .andThen(s -> "Result: " + s);
        
        System.out.println("Complex function: " + complexFunction.apply(5));
        
        // Predicate composition
        Predicate<Integer> isPositive = x -> x > 0;
        Predicate<Integer> isEven = x -> x % 2 == 0;
        Predicate<Integer> isLessThanTen = x -> x < 10;
        
        Predicate<Integer> complexPredicate = isPositive
            .and(isEven)
            .and(isLessThanTen);
        
        List<Integer> numbers = Arrays.asList(-2, 0, 1, 2, 4, 6, 8, 10, 12);
        List<Integer> filtered = numbers.stream()
            .filter(complexPredicate)
            .collect(Collectors.toList());
        
        System.out.println("Positive, even, and < 10: " + filtered);
    }
    
    private static void practicalExamples() {
        List<Product> products = Arrays.asList(
            new Product("Laptop", 999.99, "Electronics"),
            new Product("Mouse", 25.50, "Electronics"),
            new Product("Desk", 299.00, "Furniture"),
            new Product("Chair", 199.99, "Furniture"),
            new Product("Book", 15.99, "Books"),
            new Product("Pen", 2.99, "Stationery")
        );
        
        System.out.println("Product inventory: " + products.size() + " items");
        
        // 1. Filter and transform using functional interfaces
        Predicate<Product> isExpensive = p -> p.getPrice() > 100;
        Function<Product, String> productDescription = p -> 
            String.format("%s: $%.2f", p.getName(), p.getPrice());
        
        List<String> expensiveProducts = products.stream()
            .filter(isExpensive)
            .map(productDescription)
            .sorted()
            .collect(Collectors.toList());
        
        System.out.println("Expensive products (>$100):");
        expensiveProducts.forEach(System.out::println);
        
        // 2. Custom validation using predicates
        Predicate<Product> isValidPrice = p -> p.getPrice() > 0 && p.getPrice() < 10000;
        Predicate<Product> hasValidName = p -> p.getName() != null && !p.getName().trim().isEmpty();
        Predicate<Product> isValidProduct = isValidPrice.and(hasValidName);
        
        long validProducts = products.stream()
            .filter(isValidProduct)
            .count();
        
        System.out.println("Valid products: " + validProducts + "/" + products.size());
        
        // 3. Grouping with custom functions
        Function<Product, String> priceCategory = p -> {
            if (p.getPrice() < 50) return "Budget";
            else if (p.getPrice() < 200) return "Mid-range";
            else return "Premium";
        };
        
        Map<String, List<Product>> productsByPriceCategory = products.stream()
            .collect(Collectors.groupingBy(priceCategory));
        
        System.out.println("Products by price category:");
        productsByPriceCategory.forEach((category, productList) -> {
            System.out.printf("%s: %d products%n", category, productList.size());
        });
        
        // 4. Custom tri-function example
        TriFunction<String, Double, String, Product> productFactory = Product::new;
        Product newProduct = productFactory.apply("Tablet", 499.99, "Electronics");
        System.out.println("Created product: " + newProduct);
        
        // 5. Function currying simulation
        Function<Double, Function<String, Product>> createProductWithPrice = price ->
            name -> category -> new Product(name, price, category);
        
        Function<String, Function<String, Product>> create500DollarProduct = 
            createProductWithPrice.apply(500.0);
        
        Product smartphone = create500DollarProduct.apply("Smartphone").apply("Electronics");
        System.out.println("Curried product creation: " + smartphone);
    }
}