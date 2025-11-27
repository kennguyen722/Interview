/**
 * Prompt 153: Optional Class - Avoiding Null Pointer Exceptions
 * 
 * Key Points:
 * - Optional is a container that may or may not hold a value
 * - Helps eliminate NullPointerException by making null-handling explicit
 * - Provides functional programming style methods for handling absence
 * - Should not be used for fields, method parameters, or collections
 * - Best used as return types for methods that might not have a result
 */

import java.util.*;
import java.util.function.*;
import java.util.stream.*;

class User {
    private String name;
    private String email;
    private Address address;
    private List<String> hobbies;
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
        this.hobbies = new ArrayList<>();
    }
    
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Optional<Address> getAddress() { return Optional.ofNullable(address); }
    public List<String> getHobbies() { return hobbies; }
    
    public void setAddress(Address address) { this.address = address; }
    public void addHobby(String hobby) { hobbies.add(hobby); }
    
    @Override
    public String toString() {
        return String.format("User{name='%s', email='%s', hasAddress=%s}", 
            name, email, address != null);
    }
}

class Address {
    private String street;
    private String city;
    private String country;
    
    public Address(String street, String city, String country) {
        this.street = street;
        this.city = city;
        this.country = country;
    }
    
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getCountry() { return country; }
    
    @Override
    public String toString() {
        return String.format("%s, %s, %s", street, city, country);
    }
}

class UserRepository {
    private Map<String, User> users = new HashMap<>();
    
    public UserRepository() {
        // Initialize with sample data
        User user1 = new User("Alice", "alice@email.com");
        user1.setAddress(new Address("123 Main St", "New York", "USA"));
        user1.addHobby("Reading");
        user1.addHobby("Swimming");
        
        User user2 = new User("Bob", "bob@email.com");
        user2.addHobby("Gaming");
        
        User user3 = new User("Charlie", "charlie@email.com");
        user3.setAddress(new Address("456 Oak Ave", "London", "UK"));
        
        users.put("alice", user1);
        users.put("bob", user2);
        users.put("charlie", user3);
    }
    
    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(users.get(username));
    }
    
    public Optional<User> findByEmail(String email) {
        return users.values().stream()
            .filter(user -> email.equals(user.getEmail()))
            .findFirst();
    }
    
    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }
}

public class Example_Prompt153_OptionalClass {
    private static UserRepository repository = new UserRepository();
    
    public static void main(String[] args) {
        System.out.println("=== Optional Class - Avoiding Null Pointer Exceptions ===\n");
        
        // 1. CREATING OPTIONAL INSTANCES
        System.out.println("1. Creating Optional Instances:");
        creatingOptionals();
        
        // 2. CHECKING AND ACCESSING VALUES
        System.out.println("\n2. Checking and Accessing Values:");
        checkingAndAccessingValues();
        
        // 3. FUNCTIONAL OPERATIONS
        System.out.println("\n3. Functional Operations:");
        functionalOperations();
        
        // 4. CHAINING OPERATIONS
        System.out.println("\n4. Chaining Operations:");
        chainingOperations();
        
        // 5. AVOIDING COMMON PITFALLS
        System.out.println("\n5. Avoiding Common Pitfalls:");
        avoidingPitfalls();
        
        // 6. REAL-WORLD EXAMPLES
        System.out.println("\n6. Real-world Examples:");
        realWorldExamples();
        
        // 7. OPTIONAL WITH STREAMS
        System.out.println("\n7. Optional with Streams:");
        optionalWithStreams();
    }
    
    private static void creatingOptionals() {
        // Different ways to create Optional instances
        
        // 1. Optional.empty() - empty Optional
        Optional<String> emptyOptional = Optional.empty();
        System.out.println("Empty Optional: " + emptyOptional);
        
        // 2. Optional.of() - throws NPE if null
        Optional<String> nonNullOptional = Optional.of("Hello World");
        System.out.println("Non-null Optional: " + nonNullOptional);
        
        // This would throw NPE:
        // Optional<String> nullOptional = Optional.of(null); // DON'T DO THIS
        
        // 3. Optional.ofNullable() - handles null values safely
        String nullableString = null;
        Optional<String> nullableOptional = Optional.ofNullable(nullableString);
        System.out.println("Nullable Optional (null): " + nullableOptional);
        
        nullableString = "Not null";
        nullableOptional = Optional.ofNullable(nullableString);
        System.out.println("Nullable Optional (not null): " + nullableOptional);
        
        // Creating Optional from method return
        Optional<User> userOptional = repository.findByUsername("alice");
        System.out.println("User Optional: " + userOptional);
        
        Optional<User> nonExistentUser = repository.findByUsername("nonexistent");
        System.out.println("Non-existent user: " + nonExistentUser);
    }
    
    private static void checkingAndAccessingValues() {
        Optional<User> userOptional = repository.findByUsername("alice");
        Optional<User> emptyOptional = Optional.empty();
        
        // 1. isPresent() and isEmpty()
        System.out.println("User present: " + userOptional.isPresent());
        System.out.println("Empty present: " + emptyOptional.isPresent());
        System.out.println("Empty is empty: " + emptyOptional.isEmpty()); // Java 11+
        
        // 2. get() - unsafe, throws exception if empty
        if (userOptional.isPresent()) {
            User user = userOptional.get(); // Safe because we checked
            System.out.println("Got user: " + user.getName());
        }
        
        // DON'T DO THIS (antipattern):
        // User user = userOptional.get(); // Might throw NoSuchElementException
        
        // 3. orElse() - provide default value
        User defaultUser = new User("Default", "default@email.com");
        User user1 = userOptional.orElse(defaultUser);
        User user2 = emptyOptional.orElse(defaultUser);
        System.out.println("With orElse (present): " + user1.getName());
        System.out.println("With orElse (empty): " + user2.getName());
        
        // 4. orElseGet() - provide supplier for lazy evaluation
        User user3 = emptyOptional.orElseGet(() -> {
            System.out.println("Creating default user lazily");
            return new User("Lazy Default", "lazy@email.com");
        });
        System.out.println("With orElseGet: " + user3.getName());
        
        // 5. orElseThrow() - throw custom exception
        try {
            User user4 = emptyOptional.orElseThrow(() -> 
                new IllegalStateException("User not found"));
        } catch (IllegalStateException e) {
            System.out.println("Caught exception: " + e.getMessage());
        }
        
        // orElseThrow() without parameter (Java 10+)
        try {
            emptyOptional.orElseThrow(); // Throws NoSuchElementException
        } catch (NoSuchElementException e) {
            System.out.println("Caught NoSuchElementException");
        }
    }
    
    private static void functionalOperations() {
        Optional<User> userOptional = repository.findByUsername("alice");
        
        // 1. ifPresent() - execute action if value is present
        userOptional.ifPresent(user -> 
            System.out.println("Found user: " + user.getName()));
        
        Optional<User> emptyOptional = repository.findByUsername("nonexistent");
        emptyOptional.ifPresent(user -> 
            System.out.println("This won't print"));
        
        // 2. ifPresentOrElse() - execute action if present, else run alternative (Java 9+)
        userOptional.ifPresentOrElse(
            user -> System.out.println("User exists: " + user.getName()),
            () -> System.out.println("User not found")
        );
        
        emptyOptional.ifPresentOrElse(
            user -> System.out.println("This won't print"),
            () -> System.out.println("User not found (empty case)")
        );
        
        // 3. map() - transform the value if present
        Optional<String> userName = userOptional.map(User::getName);
        Optional<String> userEmail = userOptional.map(User::getEmail);
        Optional<Integer> nameLength = userOptional.map(User::getName).map(String::length);
        
        System.out.println("User name: " + userName.orElse("N/A"));
        System.out.println("User email: " + userEmail.orElse("N/A"));
        System.out.println("Name length: " + nameLength.orElse(0));
        
        // map() on empty Optional
        Optional<Integer> emptyNameLength = emptyOptional.map(User::getName).map(String::length);
        System.out.println("Empty name length: " + emptyNameLength.orElse(-1));
        
        // 4. filter() - filter based on predicate
        Optional<User> longNameUser = userOptional.filter(user -> user.getName().length() > 3);
        Optional<User> shortNameUser = userOptional.filter(user -> user.getName().length() <= 2);
        
        System.out.println("Long name user: " + longNameUser.isPresent());
        System.out.println("Short name user: " + shortNameUser.isPresent());
        
        // Chain filter and map
        Optional<String> processedEmail = userOptional
            .filter(user -> user.getName().startsWith("A"))
            .map(User::getEmail)
            .map(String::toUpperCase);
        
        System.out.println("Processed email: " + processedEmail.orElse("N/A"));
    }
    
    private static void chainingOperations() {
        // flatMap() - for chaining Optional-returning operations
        Optional<User> userOptional = repository.findByUsername("alice");
        
        // Without flatMap (nested Optionals)
        Optional<Optional<Address>> nestedAddress = userOptional.map(User::getAddress);
        System.out.println("Nested Optional: " + nestedAddress);
        
        // With flatMap (flattened)
        Optional<Address> address = userOptional.flatMap(User::getAddress);
        System.out.println("Flattened Optional: " + address);
        
        // Chain multiple flatMap operations
        Optional<String> city = userOptional
            .flatMap(User::getAddress)
            .map(Address::getCity);
        
        System.out.println("City: " + city.orElse("Unknown"));
        
        // Complex chaining example
        String result = repository.findByUsername("alice")
            .filter(user -> user.getName().length() > 3)
            .flatMap(User::getAddress)
            .filter(addr -> "USA".equals(addr.getCountry()))
            .map(Address::getCity)
            .map(String::toUpperCase)
            .orElse("NO CITY FOUND");
        
        System.out.println("Complex chain result: " + result);
        
        // Example with user that has no address
        String bobCity = repository.findByUsername("bob")
            .flatMap(User::getAddress)
            .map(Address::getCity)
            .orElse("No address");
        
        System.out.println("Bob's city: " + bobCity);
        
        // or() method for alternative Optional (Java 9+)
        Optional<User> primaryUser = repository.findByUsername("nonexistent");
        Optional<User> fallbackUser = repository.findByUsername("alice");
        
        Optional<User> resultUser = primaryUser.or(() -> fallbackUser);
        System.out.println("Result user: " + resultUser.map(User::getName).orElse("N/A"));
        
        // stream() method (Java 9+) - convert Optional to Stream
        List<String> userNames = repository.findByUsername("alice")
            .stream()
            .map(User::getName)
            .collect(Collectors.toList());
        
        System.out.println("User names from stream: " + userNames);
    }
    
    private static void avoidingPitfalls() {
        System.out.println("Common Optional antipatterns to avoid:");
        
        // 1. DON'T use Optional.get() without checking
        Optional<User> userOpt = repository.findByUsername("alice");
        
        // BAD:
        // User user = userOpt.get(); // Might throw exception
        
        // GOOD:
        User user = userOpt.orElse(new User("Default", "default@email.com"));
        
        // 2. DON'T use isPresent() + get() pattern
        // BAD:
        if (userOpt.isPresent()) {
            System.out.println("Bad pattern: " + userOpt.get().getName());
        }
        
        // GOOD:
        userOpt.ifPresent(u -> System.out.println("Good pattern: " + u.getName()));
        
        // 3. DON'T use Optional for fields
        // BAD: class BadClass { private Optional<String> name; }
        // GOOD: Use nullable fields and Optional return types
        
        // 4. DON'T use Optional in method parameters
        // BAD: public void method(Optional<String> param) { }
        // GOOD: Use overloaded methods or nullable parameters
        
        // 5. DON'T create Optional just to call orElse
        String input = null;
        // BAD:
        String result1 = Optional.ofNullable(input).orElse("default");
        // GOOD:
        String result2 = input != null ? input : "default";
        
        System.out.println("Avoiding pitfalls - results equal: " + result1.equals(result2));
        
        // 6. DO use Optional for return types that might be empty
        System.out.println("Good use of Optional in return types demonstrated in UserRepository");
        
        // 7. DON'T use Optional with collections
        // BAD: Optional<List<String>> optionalList
        // GOOD: Return empty list directly
        List<String> hobbies = user.getHobbies(); // Never null, might be empty
        System.out.println("User hobbies: " + hobbies.size());
    }
    
    private static void realWorldExamples() {
        // Example 1: Configuration parsing
        Optional<String> configValue = getConfigurationValue("database.url");
        String dbUrl = configValue
            .filter(url -> url.startsWith("jdbc:"))
            .orElseThrow(() -> new IllegalStateException("Invalid database URL"));
        System.out.println("Database URL: " + dbUrl);
        
        // Example 2: User profile completion
        Optional<User> userOpt = repository.findByUsername("bob");
        double completionPercentage = userOpt
            .map(this::calculateProfileCompletion)
            .orElse(0.0);
        System.out.println("Profile completion: " + completionPercentage + "%");
        
        // Example 3: Safe navigation through object graph
        String userCountry = repository.findByUsername("charlie")
            .flatMap(User::getAddress)
            .map(Address::getCountry)
            .orElse("Unknown");
        System.out.println("Charlie's country: " + userCountry);
        
        // Example 4: Conditional processing
        repository.findByUsername("alice")
            .filter(user -> user.getHobbies().size() > 1)
            .ifPresentOrElse(
                user -> System.out.println(user.getName() + " has multiple hobbies"),
                () -> System.out.println("User not found or has few hobbies")
            );
        
        // Example 5: Optional in business logic
        Optional<Double> discount = calculateDiscount("PREMIUM_CUSTOMER");
        double finalPrice = 100.0;
        finalPrice = discount
            .filter(d -> d > 0 && d <= 0.5) // Valid discount range
            .map(d -> finalPrice * (1 - d))
            .orElse(finalPrice);
        System.out.printf("Final price after discount: $%.2f%n", finalPrice);
    }
    
    private static void optionalWithStreams() {
        List<String> usernames = Arrays.asList("alice", "bob", "nonexistent", "charlie", "another_nonexistent");
        
        // Find all existing users
        List<User> existingUsers = usernames.stream()
            .map(repository::findByUsername)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
        
        System.out.println("Existing users: " + existingUsers.size());
        
        // Better approach using flatMap (Java 9+)
        List<User> existingUsersFlat = usernames.stream()
            .map(repository::findByUsername)
            .flatMap(Optional::stream) // Converts Optional to Stream
            .collect(Collectors.toList());
        
        System.out.println("Existing users (flatMap): " + existingUsersFlat.size());
        
        // Find first user with address
        Optional<User> firstUserWithAddress = repository.getAllUsers().stream()
            .filter(user -> user.getAddress().isPresent())
            .findFirst();
        
        firstUserWithAddress.ifPresentOrElse(
            user -> System.out.println("First user with address: " + user.getName()),
            () -> System.out.println("No user with address found")
        );
        
        // Collect all cities where users live
        List<String> cities = repository.getAllUsers().stream()
            .map(User::getAddress)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(Address::getCity)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
        
        System.out.println("Cities: " + cities);
        
        // More elegant with flatMap
        List<String> citiesFlat = repository.getAllUsers().stream()
            .flatMap(user -> user.getAddress().stream())
            .map(Address::getCity)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
        
        System.out.println("Cities (flatMap): " + citiesFlat);
    }
    
    // Helper methods
    private static Optional<String> getConfigurationValue(String key) {
        // Simulate configuration lookup
        Map<String, String> config = Map.of(
            "database.url", "jdbc:postgresql://localhost:5432/mydb",
            "server.port", "8080"
        );
        return Optional.ofNullable(config.get(key));
    }
    
    private double calculateProfileCompletion(User user) {
        double score = 0.0;
        
        if (user.getName() != null && !user.getName().isEmpty()) score += 25;
        if (user.getEmail() != null && !user.getEmail().isEmpty()) score += 25;
        if (user.getAddress().isPresent()) score += 25;
        if (!user.getHobbies().isEmpty()) score += 25;
        
        return score;
    }
    
    private static Optional<Double> calculateDiscount(String customerType) {
        Map<String, Double> discounts = Map.of(
            "PREMIUM_CUSTOMER", 0.15,
            "REGULAR_CUSTOMER", 0.05,
            "NEW_CUSTOMER", 0.10
        );
        return Optional.ofNullable(discounts.get(customerType));
    }
}