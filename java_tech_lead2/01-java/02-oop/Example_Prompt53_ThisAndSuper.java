/**
 * Prompt 53: 'this' and 'super' keywords
 * 
 * Key Points:
 * - 'this' refers to current instance of the class
 * - 'super' refers to parent class members
 * - Constructor chaining: super() must be first statement in constructor
 * - Method chaining: this() must be first statement in constructor
 * - Used to resolve naming conflicts and access parent implementations
 */

class Animal {
    protected String name;
    protected int age;
    protected String species;
    
    // Default constructor
    public Animal() {
        this("Unknown", 0, "Generic Animal");
        System.out.println("Animal default constructor called");
    }
    
    // Parameterized constructor
    public Animal(String name, int age, String species) {
        this.name = name;      // 'this' disambiguates between parameter and field
        this.age = age;
        this.species = species;
        System.out.println("Animal parameterized constructor: " + name);
    }
    
    public void eat() {
        System.out.println(this.name + " is eating");
    }
    
    public void sleep() {
        System.out.println(name + " is sleeping"); // 'this' is optional when no ambiguity
    }
    
    public void makeSound() {
        System.out.println(this.name + " makes a generic sound");
    }
    
    public Animal setName(String name) {
        this.name = name;
        return this; // Method chaining using 'this'
    }
    
    public Animal setAge(int age) {
        this.age = age;
        return this;
    }
    
    protected void displayInfo() {
        System.out.println("Animal Info - Name: " + this.name + ", Age: " + this.age + ", Species: " + this.species);
    }
}

class Dog extends Animal {
    private String breed;
    private boolean isTrained;
    
    // Constructor chaining with super()
    public Dog() {
        super(); // Calls parent default constructor - must be first statement
        this.breed = "Mixed";
        this.isTrained = false;
        System.out.println("Dog default constructor called");
    }
    
    public Dog(String name, int age) {
        super(name, age, "Canine"); // Calls parent parameterized constructor
        this.breed = "Unknown";
        this.isTrained = false;
        System.out.println("Dog constructor with name and age");
    }
    
    public Dog(String name, int age, String breed) {
        this(name, age); // Calls another constructor in same class using 'this'
        this.breed = breed;
        System.out.println("Dog constructor with breed: " + breed);
    }
    
    public Dog(String name, int age, String breed, boolean isTrained) {
        super(name, age, "Canine");
        this.breed = breed;
        this.isTrained = isTrained;
        System.out.println("Dog full constructor");
    }
    
    @Override
    public void makeSound() {
        super.makeSound(); // Calls parent implementation first
        System.out.println(super.name + " barks: Woof! Woof!"); // 'super' accesses parent field
    }
    
    public void wagTail() {
        System.out.println(this.name + " is wagging tail");
    }
    
    @Override
    protected void displayInfo() {
        super.displayInfo(); // Calls parent method
        System.out.println("Dog specific - Breed: " + this.breed + ", Trained: " + this.isTrained);
    }
    
    // Method demonstrating 'this' usage for clarity
    public void setBreed(String breed) {
        if (breed != null && !breed.isEmpty()) {
            this.breed = breed; // 'this' required due to parameter name conflict
        } else {
            throw new IllegalArgumentException("Breed cannot be null or empty");
        }
    }
    
    // Method chaining example
    public Dog train() {
        this.isTrained = true;
        System.out.println(this.name + " has been trained!");
        return this; // Returns current instance for chaining
    }
    
    public Dog rename(String newName) {
        this.setName(newName); // Calls inherited method
        return this;
    }
}

public class Example_Prompt53_ThisAndSuper {
    public static void main(String[] args) {
        System.out.println("=== 'this' and 'super' Keywords Demo ===\n");
        
        System.out.println("1. CONSTRUCTOR CHAINING:");
        System.out.println("Creating Dog with default constructor:");
        Dog dog1 = new Dog();
        System.out.println();
        
        System.out.println("Creating Dog with name and age (calls super):");
        Dog dog2 = new Dog("Buddy", 3);
        System.out.println();
        
        System.out.println("Creating Dog with breed (calls this):");
        Dog dog3 = new Dog("Max", 5, "Golden Retriever");
        System.out.println();
        
        System.out.println("2. METHOD OVERRIDING with super:");
        dog2.makeSound(); // Calls both super and overridden implementation
        System.out.println();
        
        System.out.println("3. FIELD ACCESS with this and super:");
        dog3.displayInfo(); // Shows both parent and child info
        System.out.println();
        
        System.out.println("4. METHOD CHAINING with this:");
        Dog dog4 = new Dog("Charlie", 2, "Labrador")
                    .train()           // Returns 'this'
                    .rename("Charlie Brown"); // Chained call
        
        dog4.displayInfo();
        System.out.println();
        
        System.out.println("5. PARAMETER vs FIELD DISAMBIGUATION:");
        Dog dog5 = new Dog("Rex", 4, "German Shepherd");
        dog5.setBreed("German Shepherd Mix"); // 'this.breed' vs parameter 'breed'
        dog5.displayInfo();
        System.out.println();
        
        System.out.println("6. INHERITED METHOD CHAINING:");
        Animal animal = new Animal()
                        .setName("Generic Pet")  // Parent method returns 'this'
                        .setAge(1);              // Chained call
        animal.displayInfo();
        
        // Show that 'this' in parent refers to actual object type
        Dog dog6 = (Dog) new Dog("Fluffy", 1, "Poodle")
                         .setName("Fluffy the Great") // Parent method, but 'this' is Dog instance
                         .setAge(2);
        dog6.displayInfo(); // Shows dog info, not just animal info
    }
}