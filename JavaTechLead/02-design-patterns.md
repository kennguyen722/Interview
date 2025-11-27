# Module 2: Design Patterns

## Table of Contents
1. [Creational Patterns](#creational-patterns)
2. [Structural Patterns](#structural-patterns)
3. [Behavioral Patterns](#behavioral-patterns)

---

## Creational Patterns

### Question 1: Implement the Singleton pattern with thread safety.

**Answer:**
The Singleton pattern ensures a class has only one instance and provides a global point of access to it. There are several ways to implement it thread-safely:

1. **Eager Initialization**: Simple but may waste resources
2. **Lazy Initialization with synchronized**: Thread-safe but slow
3. **Double-Checked Locking**: Efficient and thread-safe
4. **Bill Pugh Singleton**: Uses inner static class
5. **Enum Singleton**: Best practice, handles serialization

**Detailed Code Example:**

```java
import java.io.*;

public class SingletonDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. Eager Initialization
        System.out.println("=== Eager Singleton ===");
        EagerSingleton eager1 = EagerSingleton.getInstance();
        EagerSingleton eager2 = EagerSingleton.getInstance();
        System.out.println("Same instance: " + (eager1 == eager2));
        
        // 2. Thread-safe Double-Checked Locking
        System.out.println("\n=== Double-Checked Locking ===");
        Thread t1 = new Thread(() -> System.out.println("T1: " + DCLSingleton.getInstance().hashCode()));
        Thread t2 = new Thread(() -> System.out.println("T2: " + DCLSingleton.getInstance().hashCode()));
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        
        // 3. Bill Pugh Singleton
        System.out.println("\n=== Bill Pugh Singleton ===");
        System.out.println("Instance: " + BillPughSingleton.getInstance());
        
        // 4. Enum Singleton (Best Practice)
        System.out.println("\n=== Enum Singleton ===");
        EnumSingleton.INSTANCE.doSomething();
        
        // 5. Serialization test
        System.out.println("\n=== Serialization Safe ===");
        SerializableSingleton instance = SerializableSingleton.getInstance();
        
        // Serialize
        ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("/tmp/singleton.ser"));
        out.writeObject(instance);
        out.close();
        
        // Deserialize
        ObjectInputStream in = new ObjectInputStream(new FileInputStream("/tmp/singleton.ser"));
        SerializableSingleton deserializedInstance = (SerializableSingleton) in.readObject();
        in.close();
        
        System.out.println("Same after deserialization: " + (instance == deserializedInstance));
    }
}

// 1. Eager Initialization Singleton
class EagerSingleton {
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    
    private EagerSingleton() {
        // Prevent reflection attack
        if (INSTANCE != null) {
            throw new IllegalStateException("Instance already exists");
        }
    }
    
    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
}

// 2. Double-Checked Locking Singleton
class DCLSingleton {
    private static volatile DCLSingleton instance;
    
    private DCLSingleton() {}
    
    public static DCLSingleton getInstance() {
        if (instance == null) {
            synchronized (DCLSingleton.class) {
                if (instance == null) {
                    instance = new DCLSingleton();
                }
            }
        }
        return instance;
    }
}

// 3. Bill Pugh Singleton (Initialization-on-demand holder idiom)
class BillPughSingleton {
    private BillPughSingleton() {}
    
    // Inner static class - loaded only when getInstance() is called
    private static class SingletonHolder {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }
    
    public static BillPughSingleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}

// 4. Enum Singleton (Best Practice - handles serialization automatically)
enum EnumSingleton {
    INSTANCE;
    
    public void doSomething() {
        System.out.println("Enum Singleton doing something");
    }
}

// 5. Serialization-safe Singleton
class SerializableSingleton implements Serializable {
    private static final long serialVersionUID = 1L;
    private static final SerializableSingleton INSTANCE = new SerializableSingleton();
    
    private SerializableSingleton() {}
    
    public static SerializableSingleton getInstance() {
        return INSTANCE;
    }
    
    // This method is called during deserialization
    protected Object readResolve() {
        return INSTANCE;
    }
}
```

### Question 2: Implement the Factory and Abstract Factory patterns.

**Answer:**
- **Factory Method**: Creates objects without specifying exact class
- **Abstract Factory**: Creates families of related objects

**Detailed Code Example:**

```java
public class FactoryPatternDemo {
    
    public static void main(String[] args) {
        // 1. Simple Factory
        System.out.println("=== Simple Factory ===");
        Vehicle car = VehicleFactory.createVehicle("car");
        Vehicle bike = VehicleFactory.createVehicle("bike");
        car.drive();
        bike.drive();
        
        // 2. Factory Method Pattern
        System.out.println("\n=== Factory Method ===");
        DocumentCreator pdfCreator = new PDFDocumentCreator();
        DocumentCreator wordCreator = new WordDocumentCreator();
        
        Document pdfDoc = pdfCreator.createDocument();
        Document wordDoc = wordCreator.createDocument();
        
        pdfDoc.open();
        wordDoc.open();
        
        // 3. Abstract Factory Pattern
        System.out.println("\n=== Abstract Factory ===");
        GUIFactory windowsFactory = new WindowsGUIFactory();
        GUIFactory macFactory = new MacGUIFactory();
        
        Application windowsApp = new Application(windowsFactory);
        Application macApp = new Application(macFactory);
        
        windowsApp.render();
        macApp.render();
    }
}

// === Simple Factory ===
interface Vehicle {
    void drive();
}

class Car implements Vehicle {
    @Override
    public void drive() {
        System.out.println("Driving a car");
    }
}

class Bike implements Vehicle {
    @Override
    public void drive() {
        System.out.println("Riding a bike");
    }
}

class VehicleFactory {
    public static Vehicle createVehicle(String type) {
        return switch (type.toLowerCase()) {
            case "car" -> new Car();
            case "bike" -> new Bike();
            default -> throw new IllegalArgumentException("Unknown vehicle type: " + type);
        };
    }
}

// === Factory Method Pattern ===
interface Document {
    void open();
    void save();
    void close();
}

class PDFDocument implements Document {
    @Override
    public void open() { System.out.println("Opening PDF document"); }
    @Override
    public void save() { System.out.println("Saving PDF document"); }
    @Override
    public void close() { System.out.println("Closing PDF document"); }
}

class WordDocument implements Document {
    @Override
    public void open() { System.out.println("Opening Word document"); }
    @Override
    public void save() { System.out.println("Saving Word document"); }
    @Override
    public void close() { System.out.println("Closing Word document"); }
}

// Factory Method
abstract class DocumentCreator {
    public abstract Document createDocument();
    
    // Template method using the factory method
    public void newDocument() {
        Document doc = createDocument();
        doc.open();
        doc.save();
    }
}

class PDFDocumentCreator extends DocumentCreator {
    @Override
    public Document createDocument() {
        return new PDFDocument();
    }
}

class WordDocumentCreator extends DocumentCreator {
    @Override
    public Document createDocument() {
        return new WordDocument();
    }
}

// === Abstract Factory Pattern ===
// Product interfaces
interface Button {
    void render();
    void onClick();
}

interface Checkbox {
    void render();
    void toggle();
}

// Concrete Windows products
class WindowsButton implements Button {
    @Override
    public void render() { System.out.println("Rendering Windows button"); }
    @Override
    public void onClick() { System.out.println("Windows button clicked"); }
}

class WindowsCheckbox implements Checkbox {
    @Override
    public void render() { System.out.println("Rendering Windows checkbox"); }
    @Override
    public void toggle() { System.out.println("Windows checkbox toggled"); }
}

// Concrete Mac products
class MacButton implements Button {
    @Override
    public void render() { System.out.println("Rendering Mac button"); }
    @Override
    public void onClick() { System.out.println("Mac button clicked"); }
}

class MacCheckbox implements Checkbox {
    @Override
    public void render() { System.out.println("Rendering Mac checkbox"); }
    @Override
    public void toggle() { System.out.println("Mac checkbox toggled"); }
}

// Abstract Factory interface
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// Concrete Factories
class WindowsGUIFactory implements GUIFactory {
    @Override
    public Button createButton() { return new WindowsButton(); }
    @Override
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}

class MacGUIFactory implements GUIFactory {
    @Override
    public Button createButton() { return new MacButton(); }
    @Override
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}

// Client
class Application {
    private Button button;
    private Checkbox checkbox;
    
    public Application(GUIFactory factory) {
        button = factory.createButton();
        checkbox = factory.createCheckbox();
    }
    
    public void render() {
        button.render();
        checkbox.render();
    }
}
```

### Question 3: Implement the Builder pattern.

**Answer:**
The Builder pattern separates object construction from its representation, allowing the same construction process to create different representations.

**Detailed Code Example:**

```java
import java.util.*;

public class BuilderPatternDemo {
    
    public static void main(String[] args) {
        // 1. Classic Builder Pattern
        System.out.println("=== Classic Builder ===");
        Computer gamingPC = new Computer.ComputerBuilder()
            .setCPU("Intel i9")
            .setRAM("32GB")
            .setStorage("1TB SSD")
            .setGPU("RTX 4090")
            .setHasWifi(true)
            .setHasBluetooth(true)
            .build();
        System.out.println(gamingPC);
        
        Computer officePC = new Computer.ComputerBuilder()
            .setCPU("Intel i5")
            .setRAM("16GB")
            .setStorage("512GB SSD")
            .build();
        System.out.println(officePC);
        
        // 2. Director with Builder
        System.out.println("\n=== Director with Builder ===");
        HouseBuilder concreteBuilder = new ConcreteHouseBuilder();
        HouseBuilder woodenBuilder = new WoodenHouseBuilder();
        
        Director director = new Director();
        
        House concreteHouse = director.constructHouse(concreteBuilder);
        House woodenHouse = director.constructHouse(woodenBuilder);
        
        System.out.println("Concrete House: " + concreteHouse);
        System.out.println("Wooden House: " + woodenHouse);
        
        // 3. Fluent Builder with Validation
        System.out.println("\n=== Fluent Builder with Validation ===");
        try {
            User validUser = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .age(30)
                .build();
            System.out.println("Valid User: " + validUser);
            
            // This will throw exception
            User invalidUser = User.builder()
                .firstName("Jane")
                .email("invalid-email")
                .build();
        } catch (IllegalStateException e) {
            System.out.println("Validation Error: " + e.getMessage());
        }
        
        // 4. Builder with Required and Optional Parameters
        System.out.println("\n=== Required vs Optional Parameters ===");
        Order order = Order.builder("ORD-001", "CUST-001")
            .addItem("Item 1", 10.0)
            .addItem("Item 2", 20.0)
            .setDiscount(5.0)
            .setShippingAddress("123 Main St")
            .build();
        System.out.println(order);
    }
}

// 1. Classic Builder Pattern
class Computer {
    // Required parameters
    private final String CPU;
    private final String RAM;
    
    // Optional parameters
    private final String storage;
    private final String GPU;
    private final boolean hasWifi;
    private final boolean hasBluetooth;
    
    private Computer(ComputerBuilder builder) {
        this.CPU = builder.CPU;
        this.RAM = builder.RAM;
        this.storage = builder.storage;
        this.GPU = builder.GPU;
        this.hasWifi = builder.hasWifi;
        this.hasBluetooth = builder.hasBluetooth;
    }
    
    // Getters
    public String getCPU() { return CPU; }
    public String getRAM() { return RAM; }
    public String getStorage() { return storage; }
    public String getGPU() { return GPU; }
    public boolean hasWifi() { return hasWifi; }
    public boolean hasBluetooth() { return hasBluetooth; }
    
    @Override
    public String toString() {
        return "Computer{CPU='" + CPU + "', RAM='" + RAM + "', storage='" + storage + 
               "', GPU='" + GPU + "', wifi=" + hasWifi + ", bluetooth=" + hasBluetooth + "}";
    }
    
    // Static Builder class
    public static class ComputerBuilder {
        private String CPU = "Generic CPU";
        private String RAM = "8GB";
        private String storage = "256GB";
        private String GPU = "Integrated";
        private boolean hasWifi = false;
        private boolean hasBluetooth = false;
        
        public ComputerBuilder setCPU(String CPU) {
            this.CPU = CPU;
            return this;
        }
        
        public ComputerBuilder setRAM(String RAM) {
            this.RAM = RAM;
            return this;
        }
        
        public ComputerBuilder setStorage(String storage) {
            this.storage = storage;
            return this;
        }
        
        public ComputerBuilder setGPU(String GPU) {
            this.GPU = GPU;
            return this;
        }
        
        public ComputerBuilder setHasWifi(boolean hasWifi) {
            this.hasWifi = hasWifi;
            return this;
        }
        
        public ComputerBuilder setHasBluetooth(boolean hasBluetooth) {
            this.hasBluetooth = hasBluetooth;
            return this;
        }
        
        public Computer build() {
            return new Computer(this);
        }
    }
}

// 2. Director with Builder Pattern
class House {
    private String foundation;
    private String structure;
    private String roof;
    private String interior;
    
    public void setFoundation(String foundation) { this.foundation = foundation; }
    public void setStructure(String structure) { this.structure = structure; }
    public void setRoof(String roof) { this.roof = roof; }
    public void setInterior(String interior) { this.interior = interior; }
    
    @Override
    public String toString() {
        return "House{foundation='" + foundation + "', structure='" + structure + 
               "', roof='" + roof + "', interior='" + interior + "'}";
    }
}

interface HouseBuilder {
    void buildFoundation();
    void buildStructure();
    void buildRoof();
    void buildInterior();
    House getResult();
}

class ConcreteHouseBuilder implements HouseBuilder {
    private House house = new House();
    
    @Override
    public void buildFoundation() { house.setFoundation("Concrete Foundation"); }
    @Override
    public void buildStructure() { house.setStructure("Concrete Walls"); }
    @Override
    public void buildRoof() { house.setRoof("Concrete Roof"); }
    @Override
    public void buildInterior() { house.setInterior("Modern Interior"); }
    @Override
    public House getResult() { return house; }
}

class WoodenHouseBuilder implements HouseBuilder {
    private House house = new House();
    
    @Override
    public void buildFoundation() { house.setFoundation("Wooden Foundation"); }
    @Override
    public void buildStructure() { house.setStructure("Wooden Frame"); }
    @Override
    public void buildRoof() { house.setRoof("Wooden Shingles"); }
    @Override
    public void buildInterior() { house.setInterior("Rustic Interior"); }
    @Override
    public House getResult() { return house; }
}

class Director {
    public House constructHouse(HouseBuilder builder) {
        builder.buildFoundation();
        builder.buildStructure();
        builder.buildRoof();
        builder.buildInterior();
        return builder.getResult();
    }
}

// 3. Fluent Builder with Validation
class User {
    private final String firstName;
    private final String lastName;
    private final String email;
    private final int age;
    
    private User(Builder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.email = builder.email;
        this.age = builder.age;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    @Override
    public String toString() {
        return "User{firstName='" + firstName + "', lastName='" + lastName + 
               "', email='" + email + "', age=" + age + "}";
    }
    
    public static class Builder {
        private String firstName;
        private String lastName;
        private String email;
        private int age;
        
        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder age(int age) {
            this.age = age;
            return this;
        }
        
        public User build() {
            validate();
            return new User(this);
        }
        
        private void validate() {
            List<String> errors = new ArrayList<>();
            
            if (firstName == null || firstName.isEmpty()) {
                errors.add("First name is required");
            }
            if (email == null || !email.contains("@")) {
                errors.add("Valid email is required");
            }
            if (age < 0 || age > 150) {
                errors.add("Age must be between 0 and 150");
            }
            
            if (!errors.isEmpty()) {
                throw new IllegalStateException("Validation failed: " + String.join(", ", errors));
            }
        }
    }
}

// 4. Builder with Required and Optional Parameters
class Order {
    private final String orderId;
    private final String customerId;
    private final List<OrderItem> items;
    private final double discount;
    private final String shippingAddress;
    
    private Order(Builder builder) {
        this.orderId = builder.orderId;
        this.customerId = builder.customerId;
        this.items = builder.items;
        this.discount = builder.discount;
        this.shippingAddress = builder.shippingAddress;
    }
    
    // Required parameters in factory method
    public static Builder builder(String orderId, String customerId) {
        return new Builder(orderId, customerId);
    }
    
    @Override
    public String toString() {
        double total = items.stream().mapToDouble(i -> i.price).sum();
        return "Order{orderId='" + orderId + "', customerId='" + customerId + 
               "', items=" + items.size() + ", total=" + (total - discount) + 
               ", shippingAddress='" + shippingAddress + "'}";
    }
    
    public static class Builder {
        private final String orderId;
        private final String customerId;
        private List<OrderItem> items = new ArrayList<>();
        private double discount = 0;
        private String shippingAddress = "";
        
        private Builder(String orderId, String customerId) {
            this.orderId = orderId;
            this.customerId = customerId;
        }
        
        public Builder addItem(String name, double price) {
            items.add(new OrderItem(name, price));
            return this;
        }
        
        public Builder setDiscount(double discount) {
            this.discount = discount;
            return this;
        }
        
        public Builder setShippingAddress(String address) {
            this.shippingAddress = address;
            return this;
        }
        
        public Order build() {
            return new Order(this);
        }
    }
    
    private static class OrderItem {
        String name;
        double price;
        
        OrderItem(String name, double price) {
            this.name = name;
            this.price = price;
        }
    }
}
```

---

## Structural Patterns

### Question 4: Implement the Adapter and Facade patterns.

**Answer:**
- **Adapter**: Converts interface of one class to another interface clients expect
- **Facade**: Provides simplified interface to a complex subsystem

**Detailed Code Example:**

```java
public class StructuralPatternsDemo {
    
    public static void main(String[] args) {
        // 1. Adapter Pattern
        System.out.println("=== Adapter Pattern ===");
        
        // Old system uses XML
        XMLDataProvider xmlProvider = new XMLDataProviderImpl();
        
        // New system expects JSON
        JSONDataConsumer consumer = new JSONDataConsumer();
        
        // Adapter converts XML to JSON
        JSONDataProvider adapter = new XMLToJSONAdapter(xmlProvider);
        consumer.processData(adapter);
        
        // 2. Object Adapter vs Class Adapter
        System.out.println("\n=== Object Adapter ===");
        OldPrinter oldPrinter = new OldPrinter();
        ModernPrinter modernAdapter = new PrinterAdapter(oldPrinter);
        modernAdapter.print("Hello from adapter!");
        
        // 3. Facade Pattern
        System.out.println("\n=== Facade Pattern ===");
        HomeTheaterFacade homeTheater = new HomeTheaterFacade();
        homeTheater.watchMovie("Inception");
        System.out.println();
        homeTheater.endMovie();
        
        // 4. Computer Startup Facade
        System.out.println("\n=== Computer Startup Facade ===");
        ComputerFacade computer = new ComputerFacade();
        computer.start();
        System.out.println();
        computer.shutdown();
    }
}

// === Adapter Pattern ===

// Target interface (what client expects)
interface JSONDataProvider {
    String getJSONData();
}

// Adaptee (existing interface)
interface XMLDataProvider {
    String getXMLData();
}

class XMLDataProviderImpl implements XMLDataProvider {
    @Override
    public String getXMLData() {
        return "<data><name>John</name><age>30</age></data>";
    }
}

// Adapter
class XMLToJSONAdapter implements JSONDataProvider {
    private XMLDataProvider xmlProvider;
    
    public XMLToJSONAdapter(XMLDataProvider xmlProvider) {
        this.xmlProvider = xmlProvider;
    }
    
    @Override
    public String getJSONData() {
        String xml = xmlProvider.getXMLData();
        // Simplified conversion (in real world, use proper XML/JSON libraries)
        return "{\"name\":\"John\",\"age\":30}";
    }
}

// Client
class JSONDataConsumer {
    public void processData(JSONDataProvider provider) {
        String json = provider.getJSONData();
        System.out.println("Processing JSON: " + json);
    }
}

// Object Adapter Example
class OldPrinter {
    public void printOldWay(String text) {
        System.out.println("Old Printer: " + text);
    }
}

interface ModernPrinter {
    void print(String text);
}

class PrinterAdapter implements ModernPrinter {
    private OldPrinter oldPrinter;
    
    public PrinterAdapter(OldPrinter oldPrinter) {
        this.oldPrinter = oldPrinter;
    }
    
    @Override
    public void print(String text) {
        oldPrinter.printOldWay(text);
    }
}

// === Facade Pattern ===

// Complex subsystem classes
class Amplifier {
    public void on() { System.out.println("Amplifier on"); }
    public void off() { System.out.println("Amplifier off"); }
    public void setVolume(int level) { System.out.println("Amplifier volume set to " + level); }
}

class DVDPlayer {
    public void on() { System.out.println("DVD Player on"); }
    public void off() { System.out.println("DVD Player off"); }
    public void play(String movie) { System.out.println("Playing movie: " + movie); }
    public void stop() { System.out.println("DVD Player stopped"); }
}

class Projector {
    public void on() { System.out.println("Projector on"); }
    public void off() { System.out.println("Projector off"); }
    public void wideScreenMode() { System.out.println("Projector in widescreen mode"); }
}

class Screen {
    public void down() { System.out.println("Screen going down"); }
    public void up() { System.out.println("Screen going up"); }
}

class Lights {
    public void dim(int level) { System.out.println("Lights dimmed to " + level + "%"); }
    public void on() { System.out.println("Lights on"); }
}

// Facade
class HomeTheaterFacade {
    private Amplifier amp;
    private DVDPlayer dvd;
    private Projector projector;
    private Screen screen;
    private Lights lights;
    
    public HomeTheaterFacade() {
        this.amp = new Amplifier();
        this.dvd = new DVDPlayer();
        this.projector = new Projector();
        this.screen = new Screen();
        this.lights = new Lights();
    }
    
    public void watchMovie(String movie) {
        System.out.println("Get ready to watch a movie...");
        lights.dim(10);
        screen.down();
        projector.on();
        projector.wideScreenMode();
        amp.on();
        amp.setVolume(5);
        dvd.on();
        dvd.play(movie);
    }
    
    public void endMovie() {
        System.out.println("Shutting movie theater down...");
        dvd.stop();
        dvd.off();
        amp.off();
        projector.off();
        screen.up();
        lights.on();
    }
}

// Computer Startup Facade Example
class CPU {
    public void freeze() { System.out.println("CPU: Freezing"); }
    public void jump(long position) { System.out.println("CPU: Jumping to " + position); }
    public void execute() { System.out.println("CPU: Executing"); }
}

class Memory {
    public void load(long position, byte[] data) { 
        System.out.println("Memory: Loading data at " + position); 
    }
}

class HardDrive {
    public byte[] read(long lba, int size) { 
        System.out.println("HardDrive: Reading " + size + " bytes from " + lba);
        return new byte[size]; 
    }
}

class ComputerFacade {
    private CPU cpu;
    private Memory memory;
    private HardDrive hardDrive;
    
    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }
    
    public void start() {
        System.out.println("Starting computer...");
        cpu.freeze();
        memory.load(0, hardDrive.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
        System.out.println("Computer started successfully!");
    }
    
    public void shutdown() {
        System.out.println("Shutting down computer...");
        // Shutdown logic
        System.out.println("Computer shut down.");
    }
}
```

### Question 5: Implement the Decorator and Proxy patterns.

**Answer:**
- **Decorator**: Adds responsibilities to objects dynamically
- **Proxy**: Provides a placeholder for another object to control access

**Detailed Code Example:**

```java
import java.util.*;

public class DecoratorProxyDemo {
    
    public static void main(String[] args) {
        // 1. Decorator Pattern - Coffee Shop
        System.out.println("=== Decorator Pattern ===");
        
        Coffee simpleCoffee = new SimpleCoffee();
        System.out.println(simpleCoffee.getDescription() + " $" + simpleCoffee.getCost());
        
        Coffee milkCoffee = new MilkDecorator(simpleCoffee);
        System.out.println(milkCoffee.getDescription() + " $" + milkCoffee.getCost());
        
        Coffee fancyCoffee = new WhipDecorator(new MilkDecorator(new SimpleCoffee()));
        System.out.println(fancyCoffee.getDescription() + " $" + fancyCoffee.getCost());
        
        // 2. Decorator Pattern - Data Stream
        System.out.println("\n=== Stream Decorator ===");
        DataSource source = new FileDataSource("test.txt");
        source = new EncryptionDecorator(source);
        source = new CompressionDecorator(source);
        
        source.writeData("Hello, World!");
        System.out.println("Read data: " + source.readData());
        
        // 3. Proxy Pattern - Virtual Proxy (Lazy Loading)
        System.out.println("\n=== Virtual Proxy ===");
        Image image1 = new ProxyImage("photo1.jpg");
        Image image2 = new ProxyImage("photo2.jpg");
        
        // Image is loaded only when displayed
        image1.display();  // Loading happens here
        image1.display();  // No loading, already loaded
        
        // 4. Proxy Pattern - Protection Proxy
        System.out.println("\n=== Protection Proxy ===");
        BankAccount adminAccount = new BankAccountProxy("admin", new RealBankAccount(10000));
        BankAccount userAccount = new BankAccountProxy("user", new RealBankAccount(5000));
        
        try {
            System.out.println("Admin balance: " + adminAccount.getBalance());
            adminAccount.withdraw(1000);
            
            System.out.println("User balance: " + userAccount.getBalance());
            userAccount.withdraw(6000); // Should fail
        } catch (SecurityException e) {
            System.out.println("Security Exception: " + e.getMessage());
        }
        
        // 5. Proxy Pattern - Caching Proxy
        System.out.println("\n=== Caching Proxy ===");
        DatabaseService service = new CachingDatabaseProxy(new RealDatabaseService());
        
        System.out.println("Query 1: " + service.query("SELECT * FROM users"));
        System.out.println("Query 1 (cached): " + service.query("SELECT * FROM users"));
        System.out.println("Query 2: " + service.query("SELECT * FROM orders"));
    }
}

// === Decorator Pattern ===

// Component interface
interface Coffee {
    double getCost();
    String getDescription();
}

// Concrete Component
class SimpleCoffee implements Coffee {
    @Override
    public double getCost() { return 2.0; }
    @Override
    public String getDescription() { return "Simple Coffee"; }
}

// Base Decorator
abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }
    
    @Override
    public double getCost() { return decoratedCoffee.getCost(); }
    @Override
    public String getDescription() { return decoratedCoffee.getDescription(); }
}

// Concrete Decorators
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) { super(coffee); }
    
    @Override
    public double getCost() { return super.getCost() + 0.5; }
    @Override
    public String getDescription() { return super.getDescription() + " + Milk"; }
}

class WhipDecorator extends CoffeeDecorator {
    public WhipDecorator(Coffee coffee) { super(coffee); }
    
    @Override
    public double getCost() { return super.getCost() + 0.7; }
    @Override
    public String getDescription() { return super.getDescription() + " + Whip"; }
}

// Data Stream Decorator Example
interface DataSource {
    void writeData(String data);
    String readData();
}

class FileDataSource implements DataSource {
    private String filename;
    private String storedData = "";
    
    public FileDataSource(String filename) {
        this.filename = filename;
    }
    
    @Override
    public void writeData(String data) {
        storedData = data;
        System.out.println("Writing to " + filename + ": " + data);
    }
    
    @Override
    public String readData() {
        return storedData;
    }
}

abstract class DataSourceDecorator implements DataSource {
    protected DataSource wrappee;
    
    DataSourceDecorator(DataSource source) {
        this.wrappee = source;
    }
}

class EncryptionDecorator extends DataSourceDecorator {
    EncryptionDecorator(DataSource source) { super(source); }
    
    @Override
    public void writeData(String data) {
        String encrypted = encrypt(data);
        System.out.println("Encrypting: " + data + " -> " + encrypted);
        wrappee.writeData(encrypted);
    }
    
    @Override
    public String readData() {
        String encrypted = wrappee.readData();
        return decrypt(encrypted);
    }
    
    private String encrypt(String data) {
        // Simple Caesar cipher for demo
        StringBuilder result = new StringBuilder();
        for (char c : data.toCharArray()) {
            result.append((char)(c + 1));
        }
        return result.toString();
    }
    
    private String decrypt(String data) {
        StringBuilder result = new StringBuilder();
        for (char c : data.toCharArray()) {
            result.append((char)(c - 1));
        }
        return result.toString();
    }
}

class CompressionDecorator extends DataSourceDecorator {
    CompressionDecorator(DataSource source) { super(source); }
    
    @Override
    public void writeData(String data) {
        String compressed = compress(data);
        System.out.println("Compressing: " + data + " -> " + compressed);
        wrappee.writeData(compressed);
    }
    
    @Override
    public String readData() {
        String compressed = wrappee.readData();
        return decompress(compressed);
    }
    
    private String compress(String data) {
        return "[COMPRESSED:" + data + "]";
    }
    
    private String decompress(String data) {
        return data.replace("[COMPRESSED:", "").replace("]", "");
    }
}

// === Proxy Pattern ===

// Virtual Proxy (Lazy Loading)
interface Image {
    void display();
}

class RealImage implements Image {
    private String filename;
    
    public RealImage(String filename) {
        this.filename = filename;
        loadFromDisk();
    }
    
    private void loadFromDisk() {
        System.out.println("Loading image: " + filename);
    }
    
    @Override
    public void display() {
        System.out.println("Displaying image: " + filename);
    }
}

class ProxyImage implements Image {
    private String filename;
    private RealImage realImage;
    
    public ProxyImage(String filename) {
        this.filename = filename;
    }
    
    @Override
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}

// Protection Proxy
interface BankAccount {
    double getBalance();
    void withdraw(double amount);
}

class RealBankAccount implements BankAccount {
    private double balance;
    
    public RealBankAccount(double balance) {
        this.balance = balance;
    }
    
    @Override
    public double getBalance() { return balance; }
    
    @Override
    public void withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
            System.out.println("Withdrew: " + amount + ", New balance: " + balance);
        } else {
            System.out.println("Insufficient funds");
        }
    }
}

class BankAccountProxy implements BankAccount {
    private String userRole;
    private BankAccount realAccount;
    
    public BankAccountProxy(String userRole, BankAccount realAccount) {
        this.userRole = userRole;
        this.realAccount = realAccount;
    }
    
    @Override
    public double getBalance() {
        return realAccount.getBalance();
    }
    
    @Override
    public void withdraw(double amount) {
        if (!"admin".equals(userRole) && amount > realAccount.getBalance()) {
            throw new SecurityException("Users cannot overdraw accounts");
        }
        realAccount.withdraw(amount);
    }
}

// Caching Proxy
interface DatabaseService {
    String query(String sql);
}

class RealDatabaseService implements DatabaseService {
    @Override
    public String query(String sql) {
        System.out.println("Executing query on database: " + sql);
        return "Result for: " + sql;
    }
}

class CachingDatabaseProxy implements DatabaseService {
    private DatabaseService realService;
    private Map<String, String> cache = new HashMap<>();
    
    public CachingDatabaseProxy(DatabaseService realService) {
        this.realService = realService;
    }
    
    @Override
    public String query(String sql) {
        if (cache.containsKey(sql)) {
            System.out.println("Cache hit for: " + sql);
            return cache.get(sql);
        }
        String result = realService.query(sql);
        cache.put(sql, result);
        return result;
    }
}
```

---

## Behavioral Patterns

### Question 6: Implement the Strategy and Observer patterns.

**Answer:**
- **Strategy**: Defines family of algorithms, encapsulates each, makes them interchangeable
- **Observer**: One-to-many dependency where dependents are notified of state changes

**Detailed Code Example:**

```java
import java.util.*;

public class BehavioralPatternsDemo {
    
    public static void main(String[] args) {
        // 1. Strategy Pattern - Payment Processing
        System.out.println("=== Strategy Pattern ===");
        
        ShoppingCart cart = new ShoppingCart();
        cart.addItem("Book", 50);
        cart.addItem("Phone", 500);
        
        // Pay with credit card
        cart.setPaymentStrategy(new CreditCardPayment("1234-5678-9012-3456", "John Doe"));
        cart.checkout();
        
        // Pay with PayPal
        cart.setPaymentStrategy(new PayPalPayment("john@example.com"));
        cart.checkout();
        
        // 2. Strategy Pattern with Lambda
        System.out.println("\n=== Strategy with Lambda ===");
        List<Integer> numbers = Arrays.asList(5, 2, 8, 1, 9, 3);
        
        Sorter sorter = new Sorter();
        
        // Ascending
        sorter.setStrategy((a, b) -> a - b);
        System.out.println("Ascending: " + sorter.sort(new ArrayList<>(numbers)));
        
        // Descending
        sorter.setStrategy((a, b) -> b - a);
        System.out.println("Descending: " + sorter.sort(new ArrayList<>(numbers)));
        
        // 3. Observer Pattern - Event System
        System.out.println("\n=== Observer Pattern ===");
        
        NewsAgency newsAgency = new NewsAgency();
        
        NewsSubscriber subscriber1 = new NewsSubscriber("John");
        NewsSubscriber subscriber2 = new NewsSubscriber("Jane");
        EmailSubscriber emailSub = new EmailSubscriber("admin@example.com");
        
        newsAgency.subscribe(subscriber1);
        newsAgency.subscribe(subscriber2);
        newsAgency.subscribe(emailSub);
        
        newsAgency.publishNews("Breaking: Design Patterns are awesome!");
        
        newsAgency.unsubscribe(subscriber1);
        newsAgency.publishNews("Update: Observer pattern in action!");
        
        // 4. Observer Pattern - Stock Price
        System.out.println("\n=== Stock Price Observer ===");
        
        StockMarket stockMarket = new StockMarket();
        
        StockDisplay mobileApp = new StockDisplay("Mobile App");
        StockDisplay webApp = new StockDisplay("Web App");
        StockAlert alertSystem = new StockAlert(150.0);
        
        stockMarket.addObserver(mobileApp);
        stockMarket.addObserver(webApp);
        stockMarket.addObserver(alertSystem);
        
        stockMarket.setStockPrice("AAPL", 145.0);
        stockMarket.setStockPrice("AAPL", 155.0);
    }
}

// === Strategy Pattern ===

// Strategy interface
interface PaymentStrategy {
    void pay(double amount);
}

// Concrete strategies
class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    private String name;
    
    public CreditCardPayment(String cardNumber, String name) {
        this.cardNumber = cardNumber;
        this.name = name;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " using Credit Card (" + 
                          cardNumber.substring(cardNumber.length() - 4) + ")");
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;
    
    public PayPalPayment(String email) {
        this.email = email;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " using PayPal (" + email + ")");
    }
}

// Context
class ShoppingCart {
    private List<Item> items = new ArrayList<>();
    private PaymentStrategy paymentStrategy;
    
    public void addItem(String name, double price) {
        items.add(new Item(name, price));
    }
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public void checkout() {
        double total = items.stream().mapToDouble(i -> i.price).sum();
        paymentStrategy.pay(total);
    }
    
    private static class Item {
        String name;
        double price;
        
        Item(String name, double price) {
            this.name = name;
            this.price = price;
        }
    }
}

// Strategy with Lambda
class Sorter {
    private Comparator<Integer> strategy;
    
    public void setStrategy(Comparator<Integer> strategy) {
        this.strategy = strategy;
    }
    
    public List<Integer> sort(List<Integer> list) {
        list.sort(strategy);
        return list;
    }
}

// === Observer Pattern ===

// Observer interface
interface Observer {
    void update(String message);
}

// Subject interface
interface Subject {
    void subscribe(Observer observer);
    void unsubscribe(Observer observer);
    void notifyObservers(String message);
}

// Concrete Subject
class NewsAgency implements Subject {
    private List<Observer> observers = new ArrayList<>();
    
    @Override
    public void subscribe(Observer observer) {
        observers.add(observer);
    }
    
    @Override
    public void unsubscribe(Observer observer) {
        observers.remove(observer);
    }
    
    @Override
    public void notifyObservers(String message) {
        for (Observer observer : observers) {
            observer.update(message);
        }
    }
    
    public void publishNews(String news) {
        System.out.println("Publishing: " + news);
        notifyObservers(news);
    }
}

// Concrete Observers
class NewsSubscriber implements Observer {
    private String name;
    
    public NewsSubscriber(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String message) {
        System.out.println(name + " received: " + message);
    }
}

class EmailSubscriber implements Observer {
    private String email;
    
    public EmailSubscriber(String email) {
        this.email = email;
    }
    
    @Override
    public void update(String message) {
        System.out.println("Email sent to " + email + ": " + message);
    }
}

// Stock Market Observer Example
interface StockObserver {
    void update(String stockSymbol, double price);
}

class StockMarket {
    private List<StockObserver> observers = new ArrayList<>();
    private Map<String, Double> stocks = new HashMap<>();
    
    public void addObserver(StockObserver observer) {
        observers.add(observer);
    }
    
    public void removeObserver(StockObserver observer) {
        observers.remove(observer);
    }
    
    public void setStockPrice(String symbol, double price) {
        stocks.put(symbol, price);
        notifyObservers(symbol, price);
    }
    
    private void notifyObservers(String symbol, double price) {
        for (StockObserver observer : observers) {
            observer.update(symbol, price);
        }
    }
}

class StockDisplay implements StockObserver {
    private String displayName;
    
    public StockDisplay(String displayName) {
        this.displayName = displayName;
    }
    
    @Override
    public void update(String stockSymbol, double price) {
        System.out.println(displayName + " - " + stockSymbol + ": $" + price);
    }
}

class StockAlert implements StockObserver {
    private double threshold;
    
    public StockAlert(double threshold) {
        this.threshold = threshold;
    }
    
    @Override
    public void update(String stockSymbol, double price) {
        if (price > threshold) {
            System.out.println("ALERT! " + stockSymbol + " exceeded $" + threshold + " (current: $" + price + ")");
        }
    }
}
```

### Question 7: Implement the Template Method and Command patterns.

**Answer:**
- **Template Method**: Defines skeleton of algorithm, letting subclasses redefine steps
- **Command**: Encapsulates a request as an object

**Detailed Code Example:**

```java
import java.util.*;

public class TemplateCommandDemo {
    
    public static void main(String[] args) {
        // 1. Template Method Pattern
        System.out.println("=== Template Method Pattern ===");
        
        DataProcessor csvProcessor = new CSVDataProcessor();
        DataProcessor jsonProcessor = new JSONDataProcessor();
        
        System.out.println("Processing CSV:");
        csvProcessor.process();
        
        System.out.println("\nProcessing JSON:");
        jsonProcessor.process();
        
        // 2. Template Method with Hook
        System.out.println("\n=== Template with Hook ===");
        
        Beverage coffee = new Coffee();
        Beverage tea = new Tea();
        
        System.out.println("Making coffee:");
        coffee.prepareRecipe();
        
        System.out.println("\nMaking tea:");
        tea.prepareRecipe();
        
        // 3. Command Pattern - Basic
        System.out.println("\n=== Command Pattern ===");
        
        Light livingRoomLight = new Light("Living Room");
        Light kitchenLight = new Light("Kitchen");
        
        Command lightOn = new LightOnCommand(livingRoomLight);
        Command lightOff = new LightOffCommand(livingRoomLight);
        
        RemoteControl remote = new RemoteControl();
        
        remote.setCommand(lightOn);
        remote.pressButton();
        
        remote.setCommand(lightOff);
        remote.pressButton();
        
        // 4. Command Pattern with Undo
        System.out.println("\n=== Command with Undo ===");
        
        CommandHistory history = new CommandHistory();
        
        TextEditor editor = new TextEditor();
        
        UndoableCommand typeHello = new TypeCommand(editor, "Hello ");
        UndoableCommand typeWorld = new TypeCommand(editor, "World!");
        
        history.executeCommand(typeHello);
        System.out.println("After typing 'Hello ': " + editor.getText());
        
        history.executeCommand(typeWorld);
        System.out.println("After typing 'World!': " + editor.getText());
        
        history.undo();
        System.out.println("After undo: " + editor.getText());
        
        history.undo();
        System.out.println("After undo: " + editor.getText());
        
        // 5. Command Pattern - Macro Command
        System.out.println("\n=== Macro Command ===");
        
        Light light = new Light("Bedroom");
        Fan fan = new Fan("Bedroom");
        
        Command[] partyOnCommands = {
            new LightOnCommand(light),
            new FanOnCommand(fan)
        };
        
        Command[] partyOffCommands = {
            new LightOffCommand(light),
            new FanOffCommand(fan)
        };
        
        MacroCommand partyOn = new MacroCommand(partyOnCommands);
        MacroCommand partyOff = new MacroCommand(partyOffCommands);
        
        System.out.println("Party Mode ON:");
        partyOn.execute();
        
        System.out.println("\nParty Mode OFF:");
        partyOff.execute();
    }
}

// === Template Method Pattern ===

abstract class DataProcessor {
    // Template method - defines the algorithm skeleton
    public final void process() {
        readData();
        processData();
        writeData();
        
        // Hook method
        if (shouldLog()) {
            log();
        }
    }
    
    // Abstract methods to be implemented by subclasses
    protected abstract void readData();
    protected abstract void processData();
    protected abstract void writeData();
    
    // Hook method with default implementation
    protected boolean shouldLog() {
        return true;
    }
    
    // Common implementation
    protected void log() {
        System.out.println("Processing completed successfully");
    }
}

class CSVDataProcessor extends DataProcessor {
    @Override
    protected void readData() {
        System.out.println("Reading CSV file...");
    }
    
    @Override
    protected void processData() {
        System.out.println("Processing CSV data...");
    }
    
    @Override
    protected void writeData() {
        System.out.println("Writing processed CSV...");
    }
}

class JSONDataProcessor extends DataProcessor {
    @Override
    protected void readData() {
        System.out.println("Reading JSON file...");
    }
    
    @Override
    protected void processData() {
        System.out.println("Processing JSON data...");
    }
    
    @Override
    protected void writeData() {
        System.out.println("Writing processed JSON...");
    }
    
    @Override
    protected boolean shouldLog() {
        return false; // No logging for JSON
    }
}

// Beverage Template
abstract class Beverage {
    public final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        if (customerWantsCondiments()) {
            addCondiments();
        }
    }
    
    private void boilWater() {
        System.out.println("Boiling water");
    }
    
    private void pourInCup() {
        System.out.println("Pouring into cup");
    }
    
    protected abstract void brew();
    protected abstract void addCondiments();
    
    // Hook method
    protected boolean customerWantsCondiments() {
        return true;
    }
}

class Coffee extends Beverage {
    @Override
    protected void brew() {
        System.out.println("Dripping coffee through filter");
    }
    
    @Override
    protected void addCondiments() {
        System.out.println("Adding sugar and milk");
    }
}

class Tea extends Beverage {
    @Override
    protected void brew() {
        System.out.println("Steeping the tea");
    }
    
    @Override
    protected void addCondiments() {
        System.out.println("Adding lemon");
    }
    
    @Override
    protected boolean customerWantsCondiments() {
        return false; // No condiments for this tea
    }
}

// === Command Pattern ===

// Command interface
interface Command {
    void execute();
}

// Receiver
class Light {
    private String location;
    
    public Light(String location) {
        this.location = location;
    }
    
    public void on() {
        System.out.println(location + " light is ON");
    }
    
    public void off() {
        System.out.println(location + " light is OFF");
    }
}

// Concrete Commands
class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.on();
    }
}

class LightOffCommand implements Command {
    private Light light;
    
    public LightOffCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.off();
    }
}

// Invoker
class RemoteControl {
    private Command command;
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void pressButton() {
        command.execute();
    }
}

// Undoable Command
interface UndoableCommand extends Command {
    void undo();
}

class TextEditor {
    private StringBuilder text = new StringBuilder();
    
    public void append(String str) {
        text.append(str);
    }
    
    public void delete(int length) {
        if (length <= text.length()) {
            text.delete(text.length() - length, text.length());
        }
    }
    
    public String getText() {
        return text.toString();
    }
}

class TypeCommand implements UndoableCommand {
    private TextEditor editor;
    private String text;
    
    public TypeCommand(TextEditor editor, String text) {
        this.editor = editor;
        this.text = text;
    }
    
    @Override
    public void execute() {
        editor.append(text);
    }
    
    @Override
    public void undo() {
        editor.delete(text.length());
    }
}

class CommandHistory {
    private Stack<UndoableCommand> history = new Stack<>();
    
    public void executeCommand(UndoableCommand command) {
        command.execute();
        history.push(command);
    }
    
    public void undo() {
        if (!history.isEmpty()) {
            UndoableCommand command = history.pop();
            command.undo();
        }
    }
}

// Additional receivers for Macro Command
class Fan {
    private String location;
    
    public Fan(String location) {
        this.location = location;
    }
    
    public void on() {
        System.out.println(location + " fan is ON");
    }
    
    public void off() {
        System.out.println(location + " fan is OFF");
    }
}

class FanOnCommand implements Command {
    private Fan fan;
    
    public FanOnCommand(Fan fan) {
        this.fan = fan;
    }
    
    @Override
    public void execute() {
        fan.on();
    }
}

class FanOffCommand implements Command {
    private Fan fan;
    
    public FanOffCommand(Fan fan) {
        this.fan = fan;
    }
    
    @Override
    public void execute() {
        fan.off();
    }
}

// Macro Command
class MacroCommand implements Command {
    private Command[] commands;
    
    public MacroCommand(Command[] commands) {
        this.commands = commands;
    }
    
    @Override
    public void execute() {
        for (Command command : commands) {
            command.execute();
        }
    }
}
```

---

## Summary

Design patterns are essential tools for any Java Tech Lead. Key patterns to master:

1. **Creational Patterns**: Singleton, Factory, Builder - control object creation
2. **Structural Patterns**: Adapter, Facade, Decorator, Proxy - compose objects
3. **Behavioral Patterns**: Strategy, Observer, Template Method, Command - object interaction

### When to Use Each Pattern

| Pattern | Use When |
|---------|----------|
| Singleton | Exactly one instance needed |
| Factory | Object creation should be delegated |
| Builder | Complex objects with many options |
| Adapter | Incompatible interfaces need to work together |
| Facade | Simple interface to complex subsystem |
| Decorator | Add behavior dynamically |
| Proxy | Control access or add functionality |
| Strategy | Multiple algorithms interchangeable |
| Observer | Objects need to be notified of changes |
| Template Method | Algorithm skeleton with varying steps |
| Command | Encapsulate requests as objects |

Continue to [Module 3: System Design](03-system-design.md) →
