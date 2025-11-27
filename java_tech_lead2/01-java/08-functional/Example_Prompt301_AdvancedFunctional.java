/**
 * Prompt 301: Advanced Functional Programming - Higher-Order Functions and Patterns
 * 
 * Key Points:
 * - Higher-order functions take or return other functions
 * - Currying transforms multi-argument functions into single-argument chains
 * - Partial application fixes some function arguments
 * - Function composition creates new functions from existing ones
 * - Immutable data structures prevent side effects
 */

import java.util.*;
import java.util.function.*;
import java.util.stream.*;

// Immutable data structures
final class ImmutableList<T> {
    private final List<T> items;
    
    private ImmutableList(List<T> items) {
        this.items = Collections.unmodifiableList(new ArrayList<>(items));
    }
    
    public static <T> ImmutableList<T> of(T... items) {
        return new ImmutableList<>(Arrays.asList(items));
    }
    
    public static <T> ImmutableList<T> empty() {
        return new ImmutableList<>(Collections.emptyList());
    }
    
    public ImmutableList<T> add(T item) {
        List<T> newList = new ArrayList<>(items);
        newList.add(item);
        return new ImmutableList<>(newList);
    }
    
    public ImmutableList<T> remove(T item) {
        List<T> newList = new ArrayList<>(items);
        newList.remove(item);
        return new ImmutableList<>(newList);
    }
    
    public <U> ImmutableList<U> map(Function<T, U> mapper) {
        return new ImmutableList<>(items.stream().map(mapper).collect(Collectors.toList()));
    }
    
    public ImmutableList<T> filter(Predicate<T> predicate) {
        return new ImmutableList<>(items.stream().filter(predicate).collect(Collectors.toList()));
    }
    
    public <U> U fold(U identity, BinaryOperator<U> accumulator, Function<T, U> mapper) {
        return items.stream().map(mapper).reduce(identity, accumulator);
    }
    
    public Optional<T> find(Predicate<T> predicate) {
        return items.stream().filter(predicate).findFirst();
    }
    
    public int size() { return items.size(); }
    public boolean isEmpty() { return items.isEmpty(); }
    public T get(int index) { return items.get(index); }
    public Stream<T> stream() { return items.stream(); }
    
    @Override
    public String toString() { return items.toString(); }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        ImmutableList<?> that = (ImmutableList<?>) obj;
        return Objects.equals(items, that.items);
    }
    
    @Override
    public int hashCode() { return Objects.hash(items); }
}

// Currying utility class
class Currying {
    
    // Curry a two-parameter function
    public static <A, B, C> Function<A, Function<B, C>> curry(BiFunction<A, B, C> function) {
        return a -> b -> function.apply(a, b);
    }
    
    // Curry a three-parameter function
    public static <A, B, C, D> Function<A, Function<B, Function<C, D>>> curry(TriFunction<A, B, C, D> function) {
        return a -> b -> c -> function.apply(a, b, c);
    }
    
    // Uncurry a curried two-parameter function
    public static <A, B, C> BiFunction<A, B, C> uncurry(Function<A, Function<B, C>> function) {
        return (a, b) -> function.apply(a).apply(b);
    }
    
    // Partial application
    public static <A, B, C> Function<B, C> partial(BiFunction<A, B, C> function, A a) {
        return b -> function.apply(a, b);
    }
    
    public static <A, B, C, D> BiFunction<B, C, D> partial(TriFunction<A, B, C, D> function, A a) {
        return (b, c) -> function.apply(a, b, c);
    }
}

// Custom functional interfaces
@FunctionalInterface
interface TriFunction<A, B, C, D> {
    D apply(A a, B b, C c);
}

@FunctionalInterface
interface QuadFunction<A, B, C, D, E> {
    E apply(A a, B b, C c, D d);
}

// Function composition utilities
class FunctionComposition {
    
    // Compose multiple functions
    @SafeVarargs
    public static <T> Function<T, T> compose(Function<T, T>... functions) {
        return Arrays.stream(functions)
            .reduce(Function.identity(), Function::compose);
    }
    
    // Chain multiple functions
    @SafeVarargs
    public static <T> Function<T, T> chain(Function<T, T>... functions) {
        return Arrays.stream(functions)
            .reduce(Function.identity(), Function::andThen);
    }
    
    // Compose with different types
    public static <A, B, C> Function<A, C> compose(Function<B, C> f, Function<A, B> g) {
        return f.compose(g);
    }
}

// Memoization utility
class Memoization {
    
    public static <T, R> Function<T, R> memoize(Function<T, R> function) {
        Map<T, R> cache = new ConcurrentHashMap<>();
        return input -> cache.computeIfAbsent(input, function);
    }
    
    public static <A, B, R> BiFunction<A, B, R> memoize(BiFunction<A, B, R> function) {
        Map<String, R> cache = new ConcurrentHashMap<>();
        return (a, b) -> {
            String key = a + "," + b;
            return cache.computeIfAbsent(key, k -> function.apply(a, b));
        };
    }
}

public class Example_Prompt301_AdvancedFunctional {
    public static void main(String[] args) {
        System.out.println("=== Advanced Functional Programming - Higher-Order Functions ===\n");
        
        // 1. HIGHER-ORDER FUNCTIONS
        System.out.println("1. Higher-Order Functions:");
        higherOrderFunctions();
        
        // 2. CURRYING AND PARTIAL APPLICATION
        System.out.println("\n2. Currying and Partial Application:");
        curryingDemo();
        
        // 3. FUNCTION COMPOSITION
        System.out.println("\n3. Function Composition:");
        functionCompositionDemo();
        
        // 4. IMMUTABLE DATA STRUCTURES
        System.out.println("\n4. Immutable Data Structures:");
        immutableDataStructures();
        
        // 5. MEMOIZATION
        System.out.println("\n5. Memoization:");
        memoizationDemo();
        
        // 6. ADVANCED FUNCTIONAL PATTERNS
        System.out.println("\n6. Advanced Functional Patterns:");
        advancedPatterns();
    }
    
    private static void higherOrderFunctions() {
        System.out.println("--- Functions that take functions as parameters ---");
        
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Custom higher-order function
        Function<List<Integer>, Function<Predicate<Integer>, List<Integer>>> filterNumbers = 
            list -> predicate -> list.stream().filter(predicate).collect(Collectors.toList());
        
        // Using the higher-order function
        List<Integer> evenNumbers = filterNumbers.apply(numbers).apply(n -> n % 2 == 0);
        List<Integer> largeNumbers = filterNumbers.apply(numbers).apply(n -> n > 5);
        
        System.out.println("Original: " + numbers);
        System.out.println("Even: " + evenNumbers);
        System.out.println("Large (>5): " + largeNumbers);
        
        // Function that returns functions
        Function<Integer, Function<Integer, Integer>> multiplier = 
            factor -> value -> value * factor;
        
        Function<Integer, Integer> doubler = multiplier.apply(2);
        Function<Integer, Integer> tripler = multiplier.apply(3);
        
        System.out.println("Double 5: " + doubler.apply(5));
        System.out.println("Triple 5: " + tripler.apply(5));
        
        // Higher-order function for transformation pipeline
        Function<List<Integer>, Function<Function<Integer, Integer>, List<Integer>>> transform =
            list -> transformer -> list.stream().map(transformer).collect(Collectors.toList());
        
        List<Integer> doubled = transform.apply(numbers).apply(doubler);
        List<Integer> tripled = transform.apply(numbers).apply(tripler);
        
        System.out.println("All doubled: " + doubled);
        System.out.println("All tripled: " + tripled);
    }
    
    private static void curryingDemo() {
        System.out.println("--- Currying Examples ---");
        
        // Original multi-parameter function
        BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
        TriFunction<Integer, Integer, Integer, Integer> add3 = (a, b, c) -> a + b + c;
        
        // Curry the functions
        Function<Integer, Function<Integer, Integer>> curriedAdd = Currying.curry(add);
        Function<Integer, Function<Integer, Function<Integer, Integer>>> curriedAdd3 = 
            Currying.curry(add3);
        
        // Using curried functions
        int result1 = curriedAdd.apply(5).apply(3);
        int result2 = curriedAdd3.apply(1).apply(2).apply(3);
        
        System.out.println("Curried add(5, 3): " + result1);
        System.out.println("Curried add3(1, 2, 3): " + result2);
        
        // Partial application
        System.out.println("\n--- Partial Application ---");
        
        BiFunction<String, String, String> concat = (prefix, suffix) -> prefix + suffix;
        Function<String, String> addHello = Currying.partial(concat, "Hello, ");
        Function<String, String> addGoodbye = Currying.partial(concat, "Goodbye, ");
        
        System.out.println(addHello.apply("World!"));
        System.out.println(addGoodbye.apply("World!"));
        
        // Practical example: validation pipeline
        TriFunction<String, Integer, Integer, String> validateUser = 
            (name, minAge, maxAge) -> {
                if (name == null || name.trim().isEmpty()) return "Name is required";
                if (minAge < 0) return "Age cannot be negative";
                if (minAge > maxAge) return "Invalid age range";
                return "Valid";
            };
        
        // Create specialized validators
        Function<String, Function<Integer, String>> adultValidator = 
            Currying.partial(validateUser, 18);
        Function<Integer, String> seniorValidator = adultValidator.apply("Senior");
        
        System.out.println("Validation result: " + seniorValidator.apply(65));
    }
    
    private static void functionCompositionDemo() {
        System.out.println("--- Function Composition ---");
        
        // Basic functions
        Function<Integer, Integer> addOne = x -> x + 1;
        Function<Integer, Integer> multiply2 = x -> x * 2;
        Function<Integer, Integer> square = x -> x * x;
        
        // Compose functions
        Function<Integer, Integer> addThenMultiply = addOne.andThen(multiply2);
        Function<Integer, Integer> multiplyThenAdd = multiply2.andThen(addOne);
        Function<Integer, Integer> squareThenDouble = square.andThen(multiply2);
        
        int input = 5;
        System.out.printf("Input: %d%n", input);
        System.out.printf("(x + 1) * 2: %d%n", addThenMultiply.apply(input));
        System.out.printf("(x * 2) + 1: %d%n", multiplyThenAdd.apply(input));
        System.out.printf("(x²) * 2: %d%n", squareThenDouble.apply(input));
        
        // Complex composition
        Function<Integer, Integer> complexFunction = FunctionComposition.chain(
            addOne,           // x + 1
            multiply2,        // (x + 1) * 2
            square,           // ((x + 1) * 2)²
            x -> x - 10       // ((x + 1) * 2)² - 10
        );
        
        System.out.printf("Complex function f(%d): %d%n", input, complexFunction.apply(input));
        
        // String processing pipeline
        Function<String, String> toLowerCase = String::toLowerCase;
        Function<String, String> removeSpaces = s -> s.replace(" ", "");
        Function<String, String> reverse = s -> new StringBuilder(s).reverse().toString();
        
        Function<String, String> textProcessor = FunctionComposition.chain(
            toLowerCase,
            removeSpaces,
            reverse
        );
        
        String text = "Hello World";
        System.out.printf("Text processing '%s' -> '%s'%n", text, textProcessor.apply(text));
    }
    
    private static void immutableDataStructures() {
        System.out.println("--- Immutable Data Structures ---");
        
        ImmutableList<String> originalList = ImmutableList.of("apple", "banana", "cherry");
        System.out.println("Original list: " + originalList);
        
        // All operations return new instances
        ImmutableList<String> withOrange = originalList.add("orange");
        ImmutableList<String> withoutBanana = originalList.remove("banana");
        ImmutableList<String> upperCased = originalList.map(String::toUpperCase);
        ImmutableList<String> longWords = originalList.filter(s -> s.length() > 5);
        
        System.out.println("After add: " + withOrange);
        System.out.println("After remove: " + withoutBanana);
        System.out.println("Uppercase: " + upperCased);
        System.out.println("Long words: " + longWords);
        System.out.println("Original unchanged: " + originalList);
        
        // Functional operations
        ImmutableList<Integer> numbers = ImmutableList.of(1, 2, 3, 4, 5);
        
        Integer sum = numbers.fold(0, Integer::sum, Function.identity());
        Integer product = numbers.fold(1, (a, b) -> a * b, Function.identity());
        Integer sumOfSquares = numbers.fold(0, Integer::sum, x -> x * x);
        
        System.out.println("Numbers: " + numbers);
        System.out.println("Sum: " + sum);
        System.out.println("Product: " + product);
        System.out.println("Sum of squares: " + sumOfSquares);
        
        // Find operations
        Optional<Integer> evenNumber = numbers.find(n -> n % 2 == 0);
        Optional<Integer> largeNumber = numbers.find(n -> n > 10);
        
        System.out.println("First even: " + evenNumber.orElse(-1));
        System.out.println("First > 10: " + largeNumber.orElse(-1));
    }
    
    private static void memoizationDemo() {
        System.out.println("--- Memoization for Performance ---");
        
        // Expensive function (Fibonacci)
        Function<Integer, Long> fibonacci = new Function<Integer, Long>() {
            @Override
            public Long apply(Integer n) {
                System.out.println("Computing fib(" + n + ")");
                if (n <= 1) return (long) n;
                return apply(n - 1) + apply(n - 2);
            }
        };
        
        // Memoized version
        Function<Integer, Long> memoizedFibonacci = Memoization.memoize(fibonacci);
        
        System.out.println("--- Without Memoization ---");
        long start = System.currentTimeMillis();
        long result1 = fibonacci.apply(10);
        long time1 = System.currentTimeMillis() - start;
        System.out.printf("fib(10) = %d (took %d ms)%n", result1, time1);
        
        System.out.println("\n--- With Memoization (first call) ---");
        start = System.currentTimeMillis();
        long result2 = memoizedFibonacci.apply(10);
        long time2 = System.currentTimeMillis() - start;
        System.out.printf("fib(10) = %d (took %d ms)%n", result2, time2);
        
        System.out.println("\n--- With Memoization (cached call) ---");
        start = System.currentTimeMillis();
        long result3 = memoizedFibonacci.apply(10);
        long time3 = System.currentTimeMillis() - start;
        System.out.printf("fib(10) = %d (took %d ms)%n", result3, time3);
        
        // Expensive computation
        BiFunction<Integer, Integer, Double> expensiveCalculation = (a, b) -> {
            try {
                Thread.sleep(100); // Simulate expensive operation
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return Math.pow(a, b) + Math.sqrt(a + b);
        };
        
        BiFunction<Integer, Integer, Double> memoizedCalculation = 
            Memoization.memoize(expensiveCalculation);
        
        System.out.println("\n--- Memoized Expensive Calculation ---");
        start = System.currentTimeMillis();
        double calc1 = memoizedCalculation.apply(5, 3);
        long calcTime1 = System.currentTimeMillis() - start;
        
        start = System.currentTimeMillis();
        double calc2 = memoizedCalculation.apply(5, 3); // Cached
        long calcTime2 = System.currentTimeMillis() - start;
        
        System.out.printf("First call: %.2f (took %d ms)%n", calc1, calcTime1);
        System.out.printf("Second call: %.2f (took %d ms)%n", calc2, calcTime2);
    }
    
    private static void advancedPatterns() {
        System.out.println("--- Advanced Functional Patterns ---");
        
        // 1. Function factories
        System.out.println("1. Function Factories:");
        Function<String, Function<String, Boolean>> createValidator = pattern ->
            input -> input.matches(pattern);
        
        Function<String, Boolean> emailValidator = createValidator.apply(".*@.*\\..*");
        Function<String, Boolean> phoneValidator = createValidator.apply("\\d{3}-\\d{3}-\\d{4}");
        
        System.out.println("Email valid: " + emailValidator.apply("test@example.com"));
        System.out.println("Phone valid: " + phoneValidator.apply("123-456-7890"));
        
        // 2. Function pipelines
        System.out.println("\n2. Function Pipelines:");
        List<Function<String, String>> pipeline = Arrays.asList(
            String::trim,
            String::toLowerCase,
            s -> s.replace(" ", "-"),
            s -> s.replaceAll("[^a-z0-9-]", "")
        );
        
        Function<String, String> slugGenerator = pipeline.stream()
            .reduce(Function.identity(), Function::andThen);
        
        String input = "  Hello, World! 123  ";
        System.out.printf("Slug from '%s': '%s'%n", input, slugGenerator.apply(input));
        
        // 3. Conditional function application
        System.out.println("\n3. Conditional Function Application:");
        BiFunction<Predicate<Integer>, Function<Integer, Integer>, Function<Integer, Integer>> 
            conditionalApply = (condition, function) ->
                value -> condition.test(value) ? function.apply(value) : value;
        
        Function<Integer, Integer> doubleIfEven = conditionalApply.apply(
            n -> n % 2 == 0,
            n -> n * 2
        );
        
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
        List<Integer> processed = numbers.stream()
            .map(doubleIfEven)
            .collect(Collectors.toList());
        
        System.out.println("Original: " + numbers);
        System.out.println("Double if even: " + processed);
        
        // 4. Fluent interface with functions
        System.out.println("\n4. Fluent Interface Pattern:");
        FluentProcessor processor = new FluentProcessor("hello world")
            .transform(String::toUpperCase)
            .transform(s -> s.replace(" ", "_"))
            .conditionalTransform(s -> s.length() > 5, s -> "[" + s + "]");
        
        System.out.println("Fluent result: " + processor.get());
    }
    
    // Fluent interface helper class
    static class FluentProcessor {
        private String value;
        
        public FluentProcessor(String value) {
            this.value = value;
        }
        
        public FluentProcessor transform(Function<String, String> transformer) {
            this.value = transformer.apply(value);
            return this;
        }
        
        public FluentProcessor conditionalTransform(Predicate<String> condition, 
                                                  Function<String, String> transformer) {
            if (condition.test(value)) {
                this.value = transformer.apply(value);
            }
            return this;
        }
        
        public String get() {
            return value;
        }
    }
}