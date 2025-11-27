/**
 * Prompt 102: Wildcards and Bounded Types - Flexibility and PECS Principle
 * 
 * Key Points:
 * - Wildcards (?) provide flexibility in generic type usage
 * - Upper bounds (? extends T) - can read but not write (Producer)
 * - Lower bounds (? super T) - can write but not safely read (Consumer)
 * - PECS: Producer Extends, Consumer Super
 * - Unbounded wildcards (?) for maximum flexibility when type doesn't matter
 */

import java.util.*;

// Base classes for demonstration
class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public String getName() { return name; }
    public void makeSound() { System.out.println(name + " makes a sound"); }
    
    @Override
    public String toString() { return name + " (Animal)"; }
}

class Mammal extends Animal {
    public Mammal(String name) { super(name); }
    public void giveMilk() { System.out.println(name + " gives milk"); }
    
    @Override
    public String toString() { return name + " (Mammal)"; }
}

class Dog extends Mammal {
    public Dog(String name) { super(name); }
    public void bark() { System.out.println(name + " barks: Woof!"); }
    
    @Override
    public void makeSound() { bark(); }
    
    @Override
    public String toString() { return name + " (Dog)"; }
}

class Cat extends Mammal {
    public Cat(String name) { super(name); }
    public void meow() { System.out.println(name + " meows: Meow!"); }
    
    @Override
    public void makeSound() { meow(); }
    
    @Override
    public String toString() { return name + " (Cat)"; }
}

class Bird extends Animal {
    public Bird(String name) { super(name); }
    public void fly() { System.out.println(name + " flies"); }
    
    @Override
    public void makeSound() { System.out.println(name + " chirps"); }
    
    @Override
    public String toString() { return name + " (Bird)"; }
}

// Generic container for demonstration
class Container<T> {
    private List<T> items = new ArrayList<>();
    
    public void add(T item) { items.add(item); }
    public T get(int index) { return items.get(index); }
    public List<T> getAll() { return new ArrayList<>(items); }
    public int size() { return items.size(); }
    
    @Override
    public String toString() {
        return "Container{items=" + items + "}";
    }
}

// Utility classes demonstrating wildcard usage
class WildcardUtils {
    
    // Upper bounded wildcard - Producer (can read, cannot write)
    public static void printAnimals(List<? extends Animal> animals) {
        System.out.println("=== Printing Animals (? extends Animal) ===");
        for (Animal animal : animals) {
            animal.makeSound(); // Can safely call Animal methods
        }
        // animals.add(new Dog("New Dog")); // Compile error! Cannot add
    }
    
    // Lower bounded wildcard - Consumer (can write, cannot safely read)
    public static void addDogs(List<? super Dog> dogs) {
        System.out.println("=== Adding Dogs (? super Dog) ===");
        dogs.add(new Dog("Added Dog 1"));
        dogs.add(new Dog("Added Dog 2"));
        
        // Object item = dogs.get(0); // Can only get as Object
        // Dog dog = dogs.get(0); // Compile error! Cannot safely read as Dog
        System.out.println("Added 2 dogs to the collection");
    }
    
    // Unbounded wildcard - maximum flexibility
    public static int countItems(List<?> items) {
        System.out.println("=== Counting Items (?) ===");
        // Can only call Object methods
        for (Object item : items) {
            System.out.println("Item: " + item.toString());
        }
        // items.add("something"); // Compile error! Cannot add anything except null
        return items.size();
    }
    
    // Multiple bounded wildcards
    public static <T extends Animal & Comparable<T>> void sortAnimals(List<T> animals) {
        // This method requires animals that are both Animal subclasses AND Comparable
        Collections.sort(animals);
        System.out.println("Sorted animals: " + animals);
    }
    
    // PECS demonstration - copy method
    public static <T> void copy(List<? extends T> source, List<? super T> destination) {
        // source is Producer (extends) - we read from it
        // destination is Consumer (super) - we write to it
        for (T item : source) {
            destination.add(item);
        }
    }
}

// Comparator for animals
class ComparableAnimal extends Animal implements Comparable<ComparableAnimal> {
    public ComparableAnimal(String name) { super(name); }
    
    @Override
    public int compareTo(ComparableAnimal other) {
        return this.name.compareTo(other.name);
    }
}

public class Example_Prompt102_Wildcards {
    public static void main(String[] args) {
        System.out.println("=== Wildcards and Bounded Types - Flexibility and PECS ===\n");
        
        // 1. UPPER BOUNDED WILDCARDS (? extends T)
        System.out.println("1. Upper Bounded Wildcards (? extends T):");
        upperBoundedWildcards();
        
        // 2. LOWER BOUNDED WILDCARDS (? super T)
        System.out.println("\n2. Lower Bounded Wildcards (? super T):");
        lowerBoundedWildcards();
        
        // 3. UNBOUNDED WILDCARDS (?)
        System.out.println("\n3. Unbounded Wildcards (?):");
        unboundedWildcards();
        
        // 4. PECS PRINCIPLE DEMONSTRATION
        System.out.println("\n4. PECS Principle (Producer Extends, Consumer Super):");
        pecsDemo();
        
        // 5. WILDCARD CAPTURE
        System.out.println("\n5. Wildcard Capture:");
        wildcardCapture();
        
        // 6. PRACTICAL EXAMPLES
        System.out.println("\n6. Practical Examples:");
        practicalExamples();
    }
    
    private static void upperBoundedWildcards() {
        // Create lists of different animal types
        List<Dog> dogs = Arrays.asList(new Dog("Rex"), new Dog("Max"), new Dog("Buddy"));
        List<Cat> cats = Arrays.asList(new Cat("Whiskers"), new Cat("Mittens"));
        List<Mammal> mammals = Arrays.asList(new Dog("Rover"), new Cat("Felix"));
        List<Animal> animals = Arrays.asList(new Dog("Fido"), new Cat("Garfield"), new Bird("Tweety"));
        
        // Upper bounded wildcard accepts any subtype of Animal
        WildcardUtils.printAnimals(dogs);     // List<Dog> is List<? extends Animal>
        WildcardUtils.printAnimals(cats);     // List<Cat> is List<? extends Animal>
        WildcardUtils.printAnimals(mammals);  // List<Mammal> is List<? extends Animal>
        WildcardUtils.printAnimals(animals);  // List<Animal> is List<? extends Animal>
        
        // Demonstrate read-only nature of upper bounded wildcards
        List<? extends Animal> readOnlyAnimals = dogs;
        Animal firstAnimal = readOnlyAnimals.get(0); // Can read as Animal
        System.out.println("First animal: " + firstAnimal);
        
        // readOnlyAnimals.add(new Dog("Cannot add")); // Compile error!
        // readOnlyAnimals.add(new Animal("Cannot add")); // Compile error!
        
        System.out.println("Upper bounded wildcards are read-only for type safety");
        
        // Use case: finding maximum
        List<Integer> numbers = Arrays.asList(1, 5, 3, 9, 2);
        Integer max = findMax(numbers);
        System.out.println("Maximum number: " + max);
        
        List<String> words = Arrays.asList("apple", "zebra", "banana");
        String maxWord = findMax(words);
        System.out.println("Maximum word: " + maxWord);
    }
    
    private static void lowerBoundedWildcards() {
        // Create different types of lists
        List<Animal> animals = new ArrayList<>();
        List<Mammal> mammals = new ArrayList<>();
        List<Dog> dogs = new ArrayList<>();
        List<Object> objects = new ArrayList<>();
        
        // Lower bounded wildcard accepts Dog and its supertypes
        WildcardUtils.addDogs(animals);  // List<Animal> is List<? super Dog>
        WildcardUtils.addDogs(mammals);  // List<Mammal> is List<? super Dog>
        WildcardUtils.addDogs(objects);  // List<Object> is List<? super Dog>
        // WildcardUtils.addDogs(dogs); // This works too
        
        System.out.println("Animals after adding dogs: " + animals.size());
        System.out.println("Mammals after adding dogs: " + mammals.size());
        System.out.println("Objects after adding dogs: " + objects.size());
        
        // Demonstrate write-only nature
        List<? super Dog> writeOnlyDogs = animals;
        writeOnlyDogs.add(new Dog("Write-only dog")); // Can add Dogs
        
        // Object obj = writeOnlyDogs.get(0); // Can only read as Object
        // Dog dog = writeOnlyDogs.get(0); // Compile error!
        // Animal animal = writeOnlyDogs.get(0); // Compile error!
        
        System.out.println("Lower bounded wildcards allow writing but restrict reading");
        
        // Use case: Collections.addAll
        List<Number> numbers = new ArrayList<>();
        List<Integer> integers = Arrays.asList(1, 2, 3);
        addAllNumbers(numbers, integers); // integers is List<? extends Number>
        System.out.println("Numbers after adding integers: " + numbers);
    }
    
    private static void unboundedWildcards() {
        List<String> strings = Arrays.asList("hello", "world");
        List<Integer> numbers = Arrays.asList(1, 2, 3);
        List<Dog> dogs = Arrays.asList(new Dog("Rex"), new Dog("Max"));
        
        // Unbounded wildcard works with any type
        int stringCount = WildcardUtils.countItems(strings);
        int numberCount = WildcardUtils.countItems(numbers);
        int dogCount = WildcardUtils.countItems(dogs);
        
        System.out.println("String count: " + stringCount);
        System.out.println("Number count: " + numberCount);
        System.out.println("Dog count: " + dogCount);
        
        // Use cases for unbounded wildcards
        System.out.println("\n--- Use cases for unbounded wildcards ---");
        
        // 1. When you only need Object methods
        printListSize(strings);
        printListSize(numbers);
        printListSize(dogs);
        
        // 2. When type doesn't matter for the operation
        clearAllLists(Arrays.asList(strings, numbers, dogs));
        
        // 3. Class<?> for reflection
        List<Class<?>> classes = Arrays.asList(String.class, Integer.class, Dog.class);
        for (Class<?> clazz : classes) {
            System.out.println("Class: " + clazz.getSimpleName());
        }
    }
    
    private static void pecsDemo() {
        System.out.println("PECS: Producer Extends, Consumer Super");
        
        // Setup collections
        List<Dog> dogs = new ArrayList<>(Arrays.asList(new Dog("Rex"), new Dog("Max")));
        List<Mammal> mammals = new ArrayList<>();
        List<Animal> animals = new ArrayList<>();
        List<Object> objects = new ArrayList<>();
        
        // Producer Extends: dogs produces Dog objects, can be read as Animals
        WildcardUtils.copy(dogs, mammals);  // dogs is producer, mammals is consumer
        WildcardUtils.copy(dogs, animals);  // dogs is producer, animals is consumer
        WildcardUtils.copy(dogs, objects);  // dogs is producer, objects is consumer
        
        System.out.println("Mammals after copy: " + mammals.size());
        System.out.println("Animals after copy: " + animals.size());
        System.out.println("Objects after copy: " + objects.size());
        
        // More PECS examples
        List<Cat> cats = Arrays.asList(new Cat("Whiskers"), new Cat("Mittens"));
        List<Animal> allAnimals = new ArrayList<>();
        
        // Copy cats to animals (cats is producer, allAnimals is consumer)
        WildcardUtils.copy(cats, allAnimals);
        WildcardUtils.copy(dogs, allAnimals); // Can add to the same consumer
        
        System.out.println("All animals: " + allAnimals.size());
        
        // Real-world example: Collections.copy
        List<Number> sourceNumbers = Arrays.asList(1, 2.5, 3);
        List<Object> destObjects = new ArrayList<>(Collections.nCopies(3, null));
        Collections.copy(destObjects, sourceNumbers); // PECS in action
        System.out.println("Copied numbers to objects: " + destObjects);
    }
    
    private static void wildcardCapture() {
        System.out.println("Wildcard capture and helper methods:");
        
        List<?> unknownList = Arrays.asList("a", "b", "c");
        
        // Cannot do this directly:
        // reverse(unknownList); // Compile error due to wildcard capture
        
        // Use helper method with capture
        reverseHelper(unknownList);
        
        // Another example
        List<String> strings = new ArrayList<>(Arrays.asList("one", "two", "three"));
        swap(strings, 0, 2);
        System.out.println("After swap: " + strings);
        
        List<Integer> integers = new ArrayList<>(Arrays.asList(1, 2, 3));
        swap(integers, 0, 2);
        System.out.println("After swap: " + integers);
    }
    
    private static void practicalExamples() {
        // 1. DAO pattern with wildcards
        System.out.println("--- DAO Pattern Example ---");
        AnimalDAO dao = new AnimalDAO();
        
        List<Dog> dogs = Arrays.asList(new Dog("Buddy"), new Dog("Charlie"));
        dao.saveAll(dogs);
        
        List<Cat> cats = Arrays.asList(new Cat("Whiskers"), new Cat("Shadow"));
        dao.saveAll(cats);
        
        List<? extends Animal> allSaved = dao.findAll();
        System.out.println("Total saved animals: " + allSaved.size());
        
        // 2. Event handling with wildcards
        System.out.println("\n--- Event Handling Example ---");
        EventBus eventBus = new EventBus();
        
        eventBus.register(String.class, event -> System.out.println("String event: " + event));
        eventBus.register(Integer.class, event -> System.out.println("Integer event: " + event));
        
        eventBus.post("Hello World");
        eventBus.post(42);
        
        // 3. Generic factory with bounds
        System.out.println("\n--- Generic Factory Example ---");
        AnimalFactory factory = new AnimalFactory();
        
        Dog dog = factory.create(Dog.class, "Factory Dog");
        Cat cat = factory.create(Cat.class, "Factory Cat");
        
        System.out.println("Created: " + dog);
        System.out.println("Created: " + cat);
    }
    
    // Helper methods
    private static <T extends Comparable<? super T>> T findMax(List<? extends T> list) {
        if (list.isEmpty()) throw new IllegalArgumentException("Empty list");
        
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) {
                max = item;
            }
        }
        return max;
    }
    
    private static <T extends Number> void addAllNumbers(List<? super T> dest, List<? extends T> src) {
        for (T number : src) {
            dest.add(number);
        }
    }
    
    private static void printListSize(List<?> list) {
        System.out.println("List size: " + list.size());
    }
    
    private static void clearAllLists(List<List<?>> lists) {
        for (List<?> list : lists) {
            // list.clear(); // Would modify original lists
            System.out.println("Would clear list of size: " + list.size());
        }
    }
    
    // Wildcard capture helper
    private static void reverseHelper(List<?> list) {
        reverseActual(list);
    }
    
    private static <T> void reverseActual(List<T> list) {
        Collections.reverse(list);
        System.out.println("Reversed list: " + list);
    }
    
    private static <T> void swap(List<T> list, int i, int j) {
        T temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
    
    // Practical example classes
    static class AnimalDAO {
        private List<Animal> storage = new ArrayList<>();
        
        public <T extends Animal> void save(T animal) {
            storage.add(animal);
        }
        
        public void saveAll(List<? extends Animal> animals) {
            storage.addAll(animals);
        }
        
        public List<? extends Animal> findAll() {
            return new ArrayList<>(storage);
        }
        
        @SuppressWarnings("unchecked")
        public <T extends Animal> List<T> findByType(Class<T> type) {
            return storage.stream()
                .filter(type::isInstance)
                .map(animal -> (T) animal)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
        }
    }
    
    static class EventBus {
        private Map<Class<?>, List<Object>> listeners = new HashMap<>();
        
        @SuppressWarnings("unchecked")
        public <T> void register(Class<T> eventType, EventListener<? super T> listener) {
            listeners.computeIfAbsent(eventType, k -> new ArrayList<>()).add(listener);
        }
        
        @SuppressWarnings("unchecked")
        public <T> void post(T event) {
            List<Object> eventListeners = listeners.get(event.getClass());
            if (eventListeners != null) {
                for (Object listener : eventListeners) {
                    ((EventListener<? super T>) listener).onEvent(event);
                }
            }
        }
    }
    
    @FunctionalInterface
    interface EventListener<T> {
        void onEvent(T event);
    }
    
    static class AnimalFactory {
        public <T extends Animal> T create(Class<T> type, String name) {
            try {
                if (type == Dog.class) {
                    return type.cast(new Dog(name));
                } else if (type == Cat.class) {
                    return type.cast(new Cat(name));
                } else {
                    return type.cast(new Animal(name));
                }
            } catch (Exception e) {
                throw new RuntimeException("Cannot create animal of type: " + type, e);
            }
        }
    }
}