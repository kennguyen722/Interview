/**
 * Prompt 51: Four pillars of OOP - Encapsulation, Abstraction, Inheritance, Polymorphism
 */

// Abstraction - hiding implementation details through interfaces/abstract classes
interface Vehicle {
    void start();
    void stop();
    int getMaxSpeed();
}

// Encapsulation - data hiding and controlled access
class Car implements Vehicle {
    private String brand;  // Private field - encapsulated
    private int speed;
    private boolean isRunning;
    
    public Car(String brand) {
        this.brand = brand;
        this.speed = 0;
        this.isRunning = false;
    }
    
    // Public methods provide controlled access to private data
    public String getBrand() { return brand; }
    public int getSpeed() { return speed; }
    public boolean isRunning() { return isRunning; }
    
    // Implementation of abstract methods
    public void start() {
        isRunning = true;
        System.out.println(brand + " car started");
    }
    
    public void stop() {
        isRunning = false;
        speed = 0;
        System.out.println(brand + " car stopped");
    }
    
    public void accelerate(int increment) {
        if (isRunning && speed + increment <= getMaxSpeed()) {
            speed += increment;
            System.out.println(brand + " accelerated to " + speed + " mph");
        }
    }
    
    public int getMaxSpeed() { return 120; }
}

// Inheritance - SportsCar inherits from Car
class SportsCar extends Car {
    private boolean turboEnabled;
    
    public SportsCar(String brand) {
        super(brand); // Calling parent constructor
        this.turboEnabled = false;
    }
    
    // Method overriding - different implementation of parent method
    @Override
    public int getMaxSpeed() {
        return turboEnabled ? 200 : 160;
    }
    
    public void enableTurbo() {
        turboEnabled = true;
        System.out.println("Turbo enabled! Max speed increased to " + getMaxSpeed());
    }
}

class Truck extends Car {
    private int loadCapacity;
    
    public Truck(String brand, int loadCapacity) {
        super(brand);
        this.loadCapacity = loadCapacity;
    }
    
    @Override
    public int getMaxSpeed() { return 80; }
    
    public int getLoadCapacity() { return loadCapacity; }
}

public class Example_Prompt51_FourPillars {
    public static void main(String[] args) {
        System.out.println("=== Four Pillars of OOP Demo ===\n");
        
        // Polymorphism - same interface, different behaviors
        Vehicle[] vehicles = {
            new Car("Toyota"),
            new SportsCar("Ferrari"),
            new Truck("Ford", 5000)
        };
        
        System.out.println("1. POLYMORPHISM - Same method calls, different behaviors:");
        for (Vehicle vehicle : vehicles) {
            vehicle.start();
            System.out.println("Max speed: " + vehicle.getMaxSpeed() + " mph");
            vehicle.stop();
            System.out.println();
        }
        
        System.out.println("2. ENCAPSULATION - Controlled access to data:");
        Car car = new Car("Honda");
        System.out.println("Brand: " + car.getBrand()); // Public getter
        System.out.println("Speed: " + car.getSpeed()); // Cannot directly access private speed
        // car.speed = 100; // This would cause compilation error - field is private
        car.start();
        car.accelerate(50);
        System.out.println("Current speed: " + car.getSpeed());
        System.out.println();
        
        System.out.println("3. INHERITANCE - SportsCar inherits from Car:");
        SportsCar sportsCar = new SportsCar("Lamborghini");
        sportsCar.start(); // Inherited method
        System.out.println("Initial max speed: " + sportsCar.getMaxSpeed());
        sportsCar.enableTurbo(); // SportsCar specific method
        System.out.println("After turbo: " + sportsCar.getMaxSpeed());
        System.out.println();
        
        System.out.println("4. ABSTRACTION - Implementation hidden behind interface:");
        demonstrateVehicle(new Car("BMW"));
        demonstrateVehicle(new SportsCar("Porsche"));
        demonstrateVehicle(new Truck("Volvo", 10000));
    }
    
    // Method works with any Vehicle implementation - abstraction in action
    private static void demonstrateVehicle(Vehicle vehicle) {
        System.out.println("Testing vehicle (implementation abstracted):");
        vehicle.start();
        System.out.println("This vehicle's max speed: " + vehicle.getMaxSpeed());
        vehicle.stop();
        System.out.println();
    }
}