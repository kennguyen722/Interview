/**
 * Prompt 101: Generic Classes and Methods - Type Safety and Reusability
 * 
 * Key Points:
 * - Generics provide compile-time type safety
 * - Enable creation of reusable code that works with different types
 * - Type parameters are specified with angle brackets <T>
 * - Common naming conventions: T (Type), E (Element), K (Key), V (Value)
 * - Generic methods can have their own type parameters
 */

import java.util.*;

// Generic class with single type parameter
class Box<T> {
    private T item;
    
    public Box() {}
    
    public Box(T item) {
        this.item = item;
    }
    
    public void setItem(T item) {
        this.item = item;
    }
    
    public T getItem() {
        return item;
    }
    
    public boolean isEmpty() {
        return item == null;
    }
    
    @Override
    public String toString() {
        return "Box{item=" + item + "}";
    }
}

// Generic class with multiple type parameters
class Pair<K, V> {
    private K key;
    private V value;
    
    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
    
    public K getKey() { return key; }
    public V getValue() { return value; }
    
    public void setKey(K key) { this.key = key; }
    public void setValue(V value) { this.value = value; }
    
    @Override
    public String toString() {
        return String.format("Pair{%s=%s}", key, value);
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Pair<?, ?> pair = (Pair<?, ?>) obj;
        return Objects.equals(key, pair.key) && Objects.equals(value, pair.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(key, value);
    }
}

// Generic interface
interface Repository<T, ID> {
    void save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
}

// Implementation of generic interface
class InMemoryRepository<T, ID> implements Repository<T, ID> {
    private final Map<ID, T> storage = new HashMap<>();
    
    @Override
    public void save(T entity) {
        // For this example, we'll use toString() as ID - not recommended in real code
        @SuppressWarnings("unchecked")
        ID id = (ID) entity.toString();
        storage.put(id, entity);
    }
    
    @Override
    public Optional<T> findById(ID id) {
        return Optional.ofNullable(storage.get(id));
    }
    
    @Override
    public List<T> findAll() {
        return new ArrayList<>(storage.values());
    }
    
    @Override
    public void deleteById(ID id) {
        storage.remove(id);
    }
    
    public int size() {
        return storage.size();
    }
}

// Entity classes for repository example
class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() { return name; }
    public int getAge() { return age; }
    
    @Override
    public String toString() {
        return name; // Used as ID in this example
    }
}

class Product {
    private String name;
    private double price;
    
    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }
    
    public String getName() { return name; }
    public double getPrice() { return price; }
    
    @Override
    public String toString() {
        return name; // Used as ID in this example
    }
}

// Utility class with generic methods
class GenericUtils {
    
    // Generic method with single type parameter
    public static <T> void swap(T[] array, int i, int j) {
        if (i >= 0 && i < array.length && j >= 0 && j < array.length) {
            T temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    
    // Generic method with multiple type parameters
    public static <T, U> Pair<T, U> makePair(T first, U second) {
        return new Pair<>(first, second);
    }
    
    // Generic method with bounded type parameter
    public static <T extends Comparable<T>> T findMax(List<T> list) {
        if (list.isEmpty()) {
            throw new IllegalArgumentException("List cannot be empty");
        }
        
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) {
                max = item;
            }
        }
        return max;
    }
    
    // Generic method that returns generic type
    public static <T> List<T> createListWith(T... elements) {
        List<T> list = new ArrayList<>();
        for (T element : elements) {
            list.add(element);
        }
        return list;
    }
    
    // Generic method with multiple bounds
    public static <T extends Comparable<T> & Cloneable> T cloneMax(T first, T second) throws CloneNotSupportedException {
        T max = first.compareTo(second) >= 0 ? first : second;
        return (T) max.getClass().getMethod("clone").invoke(max);
    }
}

public class Example_Prompt101_GenericBasics {
    public static void main(String[] args) {
        System.out.println("=== Generic Classes and Methods - Type Safety and Reusability ===\n");
        
        // 1. BASIC GENERIC CLASSES
        System.out.println("1. Basic Generic Classes:");
        basicGenericClasses();
        
        // 2. MULTIPLE TYPE PARAMETERS
        System.out.println("\n2. Multiple Type Parameters:");
        multipleTypeParameters();
        
        // 3. GENERIC INTERFACES AND IMPLEMENTATIONS
        System.out.println("\n3. Generic Interfaces and Implementations:");
        genericInterfaces();
        
        // 4. GENERIC METHODS
        System.out.println("\n4. Generic Methods:");
        genericMethods();
        
        // 5. TYPE SAFETY DEMONSTRATION
        System.out.println("\n5. Type Safety Demonstration:");
        typeSafetyDemo();
        
        // 6. REAL-WORLD EXAMPLES
        System.out.println("\n6. Real-world Examples:");
        realWorldExamples();
    }
    
    private static void basicGenericClasses() {
        // Creating boxes for different types
        Box<String> stringBox = new Box<>("Hello Generics");
        Box<Integer> intBox = new Box<>(42);
        Box<Person> personBox = new Box<>(new Person("Alice", 30));
        
        System.out.println("String box: " + stringBox);
        System.out.println("Integer box: " + intBox);
        System.out.println("Person box: " + personBox);
        
        // Type safety - these won't compile:
        // stringBox.setItem(123); // Compile error!
        // intBox.setItem("text"); // Compile error!
        
        // Safe retrieval without casting
        String text = stringBox.getItem(); // No cast needed
        Integer number = intBox.getItem(); // No cast needed
        Person person = personBox.getItem(); // No cast needed
        
        System.out.println("Retrieved safely: " + text + ", " + number + ", " + person.getName());
        
        // Empty box handling
        Box<Double> emptyBox = new Box<>();
        System.out.println("Empty box: " + emptyBox.isEmpty());
        emptyBox.setItem(3.14);
        System.out.println("After setting: " + emptyBox.isEmpty() + ", value: " + emptyBox.getItem());
    }
    
    private static void multipleTypeParameters() {
        // Creating pairs with different type combinations
        Pair<String, Integer> nameAge = new Pair<>("Bob", 25);
        Pair<Integer, String> idName = new Pair<>(1001, "Charlie");
        Pair<String, Person> rolePerson = new Pair<>("Manager", new Person("Diana", 35));
        
        System.out.println("Name-Age pair: " + nameAge);
        System.out.println("ID-Name pair: " + idName);
        System.out.println("Role-Person pair: " + rolePerson);
        
        // Accessing individual components
        System.out.printf("Person %s is %d years old%n", 
            nameAge.getKey(), nameAge.getValue());
        
        // Modifying pairs
        nameAge.setValue(26); // Happy birthday!
        System.out.println("After birthday: " + nameAge);
        
        // Pair equality
        Pair<String, Integer> anotherNameAge = new Pair<>("Bob", 26);
        System.out.println("Pairs equal: " + nameAge.equals(anotherNameAge));
        
        // Complex nested generics
        Box<Pair<String, Integer>> boxOfPair = new Box<>(nameAge);
        System.out.println("Box containing pair: " + boxOfPair);
    }
    
    private static void genericInterfaces() {
        // Person repository
        Repository<Person, String> personRepo = new InMemoryRepository<>();
        
        Person alice = new Person("Alice", 30);
        Person bob = new Person("Bob", 25);
        
        personRepo.save(alice);
        personRepo.save(bob);
        
        System.out.println("Saved persons: " + personRepo.findAll().size());
        
        Optional<Person> foundPerson = personRepo.findById("Alice");
        foundPerson.ifPresent(p -> System.out.println("Found: " + p.getName() + ", age " + p.getAge()));
        
        // Product repository (same interface, different type)
        Repository<Product, String> productRepo = new InMemoryRepository<>();
        
        Product laptop = new Product("Laptop", 999.99);
        Product mouse = new Product("Mouse", 29.99);
        
        productRepo.save(laptop);
        productRepo.save(mouse);
        
        System.out.println("Products in repo: " + productRepo.findAll().size());
        
        // Type safety ensured by generics
        // personRepo.save(laptop); // Compile error!
        // productRepo.save(alice); // Compile error!
        
        System.out.println("Repository type safety enforced at compile time");
    }
    
    private static void genericMethods() {
        // Array swapping
        String[] names = {"Alice", "Bob", "Charlie", "Diana"};
        System.out.println("Before swap: " + Arrays.toString(names));
        GenericUtils.swap(names, 0, 2);
        System.out.println("After swap: " + Arrays.toString(names));
        
        Integer[] numbers = {1, 2, 3, 4, 5};
        System.out.println("Before swap: " + Arrays.toString(numbers));
        GenericUtils.swap(numbers, 1, 4);
        System.out.println("After swap: " + Arrays.toString(numbers));
        
        // Creating pairs with generic method
        Pair<String, Integer> stringIntPair = GenericUtils.makePair("Count", 42);
        Pair<Double, Boolean> doubleBoolean = GenericUtils.makePair(3.14, true);
        
        System.out.println("Created pair 1: " + stringIntPair);
        System.out.println("Created pair 2: " + doubleBoolean);
        
        // Finding maximum with bounded type parameter
        List<Integer> intList = Arrays.asList(3, 7, 1, 9, 4);
        List<String> stringList = Arrays.asList("apple", "banana", "cherry", "date");
        
        Integer maxInt = GenericUtils.findMax(intList);
        String maxString = GenericUtils.findMax(stringList);
        
        System.out.println("Max integer: " + maxInt);
        System.out.println("Max string: " + maxString);
        
        // Creating lists with varargs
        List<String> colors = GenericUtils.createListWith("red", "green", "blue");
        List<Integer> primes = GenericUtils.createListWith(2, 3, 5, 7, 11);
        
        System.out.println("Colors list: " + colors);
        System.out.println("Primes list: " + primes);
    }
    
    private static void typeSafetyDemo() {
        System.out.println("Demonstrating type safety benefits:");
        
        // Before generics (raw types) - DON'T DO THIS
        @SuppressWarnings({"rawtypes", "unchecked"})
        Box rawBox = new Box();
        rawBox.setItem("String");
        rawBox.setItem(123); // No compile-time error, but dangerous!
        
        // This could cause ClassCastException at runtime:
        // String item = (String) rawBox.getItem(); // Runtime error if last item was Integer!
        
        System.out.println("Raw box item: " + rawBox.getItem());
        System.out.println("Raw types lose type safety!");
        
        // With generics - type safety guaranteed
        Box<String> safeBox = new Box<>();
        safeBox.setItem("Safe String");
        // safeBox.setItem(123); // Compile-time error - won't even compile!
        
        String safeItem = safeBox.getItem(); // No cast needed, guaranteed to be String
        System.out.println("Safe box item: " + safeItem);
        System.out.println("Generics provide compile-time type safety!");
        
        // Generic collections comparison
        List rawList = new ArrayList(); // Raw type - avoid!
        rawList.add("String");
        rawList.add(42);
        // String first = (String) rawList.get(1); // ClassCastException!
        
        List<String> safeList = new ArrayList<>();
        safeList.add("Only strings allowed");
        // safeList.add(42); // Compile error!
        String first = safeList.get(0); // Safe, no cast needed
        
        System.out.println("Type-safe list item: " + first);
    }
    
    private static void realWorldExamples() {
        // 1. Cache implementation
        System.out.println("--- Generic Cache Example ---");
        Map<String, Person> personCache = new HashMap<>();
        Map<Integer, Product> productCache = new HashMap<>();
        
        personCache.put("user1", new Person("Alice", 30));
        productCache.put(1001, new Product("Laptop", 999.99));
        
        Person cachedPerson = personCache.get("user1");
        Product cachedProduct = productCache.get(1001);
        
        System.out.println("Cached person: " + cachedPerson.getName());
        System.out.println("Cached product: " + cachedProduct.getName());
        
        // 2. Result wrapper
        System.out.println("\n--- Generic Result Wrapper ---");
        Result<String> successResult = Result.success("Operation completed");
        Result<String> errorResult = Result.error("Network timeout");
        
        processResult(successResult);
        processResult(errorResult);
        
        // 3. Generic builder pattern
        System.out.println("\n--- Generic Builder Pattern ---");
        ApiResponse<Person> personResponse = new ApiResponse.Builder<Person>()
            .data(new Person("Eve", 28))
            .status(200)
            .message("Success")
            .build();
        
        System.out.println("API Response: " + personResponse);
    }
    
    // Helper classes for real-world examples
    static class Result<T> {
        private final T data;
        private final String error;
        private final boolean success;
        
        private Result(T data, String error, boolean success) {
            this.data = data;
            this.error = error;
            this.success = success;
        }
        
        public static <T> Result<T> success(T data) {
            return new Result<>(data, null, true);
        }
        
        public static <T> Result<T> error(String error) {
            return new Result<>(null, error, false);
        }
        
        public boolean isSuccess() { return success; }
        public T getData() { return data; }
        public String getError() { return error; }
    }
    
    static class ApiResponse<T> {
        private final T data;
        private final int status;
        private final String message;
        
        private ApiResponse(T data, int status, String message) {
            this.data = data;
            this.status = status;
            this.message = message;
        }
        
        public T getData() { return data; }
        public int getStatus() { return status; }
        public String getMessage() { return message; }
        
        @Override
        public String toString() {
            return String.format("ApiResponse{status=%d, message='%s', data=%s}", 
                status, message, data);
        }
        
        static class Builder<T> {
            private T data;
            private int status;
            private String message;
            
            public Builder<T> data(T data) {
                this.data = data;
                return this;
            }
            
            public Builder<T> status(int status) {
                this.status = status;
                return this;
            }
            
            public Builder<T> message(String message) {
                this.message = message;
                return this;
            }
            
            public ApiResponse<T> build() {
                return new ApiResponse<>(data, status, message);
            }
        }
    }
    
    private static void processResult(Result<String> result) {
        if (result.isSuccess()) {
            System.out.println("Success: " + result.getData());
        } else {
            System.out.println("Error: " + result.getError());
        }
    }
}