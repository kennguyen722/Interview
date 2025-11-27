/**
 * Prompt 103: Type Erasure and Runtime Behavior
 * 
 * Key Points:
 * - Type erasure removes generic type information at runtime
 * - Generic types become their raw types or bounds after compilation
 * - Bridge methods are generated for maintaining polymorphism
 * - Cannot create instances of type parameters
 * - Cannot use instanceof with parameterized types
 * - Arrays and generics don't mix well due to erasure
 */

import java.lang.reflect.*;
import java.util.*;

// Example classes for demonstrating type erasure
class GenericClass<T> {
    private T value;
    
    public GenericClass(T value) {
        this.value = value;
    }
    
    public T getValue() {
        return value;
    }
    
    public void setValue(T value) {
        this.value = value;
    }
    
    // This won't work due to type erasure
    // public T createInstance() {
    //     return new T(); // Compile error!
    // }
    
    // Workaround using Class<T>
    public static <T> T createInstance(Class<T> clazz) {
        try {
            return clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Cannot create instance", e);
        }
    }
    
    // Cannot check instance with parameterized types
    public boolean checkType(Object obj) {
        // return obj instanceof GenericClass<String>; // Compile error!
        return obj instanceof GenericClass<?>;  // This works
    }
    
    // Array creation issues
    // private T[] array = new T[10]; // Compile error!
    
    @SuppressWarnings("unchecked")
    private T[] createArray(int size) {
        // Unsafe but necessary workaround
        return (T[]) new Object[size];
    }
    
    // Safe array creation using reflection
    @SuppressWarnings("unchecked")
    public static <T> T[] createTypedArray(Class<T> componentType, int size) {
        return (T[]) Array.newInstance(componentType, size);
    }
}

// Demonstrating bridge methods
class GenericParent<T> {
    public T process(T input) {
        System.out.println("GenericParent.process called with: " + input);
        return input;
    }
    
    public void display(T value) {
        System.out.println("GenericParent.display: " + value);
    }
}

class StringChild extends GenericParent<String> {
    @Override
    public String process(String input) {
        System.out.println("StringChild.process called with: " + input);
        return input.toUpperCase();
    }
    
    @Override
    public void display(String value) {
        System.out.println("StringChild.display: " + value.toLowerCase());
    }
}

// Generic interface for bridge method demonstration
interface Processor<T> {
    T process(T input);
}

class StringProcessor implements Processor<String> {
    @Override
    public String process(String input) {
        return "Processed: " + input;
    }
}

// Bounded type parameters and erasure
class BoundedGeneric<T extends Number> {
    private T value;
    
    public BoundedGeneric(T value) {
        this.value = value;
    }
    
    public double getDoubleValue() {
        // Can call Number methods due to bound
        return value.doubleValue();
    }
    
    // After erasure, T becomes Number
    public Number getValue() {
        return value;
    }
}

// Multiple bounds and erasure
interface Drawable {
    void draw();
}

interface Movable {
    void move();
}

class MultipleBounds<T extends Number & Drawable & Movable> {
    private T item;
    
    public MultipleBounds(T item) {
        this.item = item;
    }
    
    public void processItem() {
        // Can call methods from all bounds
        double value = item.doubleValue(); // Number method
        item.draw();  // Drawable method
        item.move();  // Movable method
        
        System.out.println("Processed item with value: " + value);
    }
    
    // After erasure, T becomes Number (first bound)
}

public class Example_Prompt103_TypeErasure {
    public static void main(String[] args) {
        System.out.println("=== Type Erasure and Runtime Behavior ===\n");
        
        // 1. BASIC TYPE ERASURE DEMONSTRATION
        System.out.println("1. Basic Type Erasure:");
        basicTypeErasure();
        
        // 2. BRIDGE METHODS
        System.out.println("\n2. Bridge Methods:");
        bridgeMethods();
        
        // 3. RUNTIME TYPE INFORMATION LOSS
        System.out.println("\n3. Runtime Type Information Loss:");
        runtimeTypeInfo();
        
        // 4. WORKAROUNDS FOR TYPE ERASURE LIMITATIONS
        System.out.println("\n4. Workarounds for Limitations:");
        typeErasureWorkarounds();
        
        // 5. ARRAYS AND GENERICS
        System.out.println("\n5. Arrays and Generics:");
        arraysAndGenerics();
        
        // 6. REFLECTION AND GENERICS
        System.out.println("\n6. Reflection and Generics:");
        reflectionAndGenerics();
        
        // 7. PRACTICAL IMPLICATIONS
        System.out.println("\n7. Practical Implications:");
        practicalImplications();
    }
    
    private static void basicTypeErasure() {
        // At compile time: List<String> and List<Integer>
        // At runtime: both become List (raw type)
        
        List<String> stringList = new ArrayList<>();
        List<Integer> integerList = new ArrayList<>();
        
        // Both have the same runtime class
        System.out.println("String list class: " + stringList.getClass());
        System.out.println("Integer list class: " + integerList.getClass());
        System.out.println("Classes equal: " + (stringList.getClass() == integerList.getClass()));
        
        // Generic type information is erased
        GenericClass<String> stringGeneric = new GenericClass<>("Hello");
        GenericClass<Integer> integerGeneric = new GenericClass<>(42);
        
        System.out.println("String generic class: " + stringGeneric.getClass());
        System.out.println("Integer generic class: " + integerGeneric.getClass());
        System.out.println("Generic classes equal: " + (stringGeneric.getClass() == integerGeneric.getClass()));
        
        // The bytecode only contains raw types
        System.out.println("\nAfter compilation, generics become raw types");
        System.out.println("List<String> becomes List");
        System.out.println("GenericClass<T> becomes GenericClass");
    }
    
    private static void bridgeMethods() {
        System.out.println("Bridge methods maintain polymorphism after type erasure:");
        
        StringChild child = new StringChild();
        GenericParent<String> parent = child;
        
        // Both calls work due to bridge methods
        String result1 = child.process("hello");     // Calls StringChild.process
        String result2 = parent.process("world");    // Calls StringChild.process via bridge method
        
        System.out.println("Direct call result: " + result1);
        System.out.println("Polymorphic call result: " + result2);
        
        // Display bridge methods using reflection
        System.out.println("\nBridge methods in StringChild:");
        Method[] methods = StringChild.class.getDeclaredMethods();
        for (Method method : methods) {
            if (method.isBridge()) {
                System.out.println("Bridge method: " + method);
            } else {
                System.out.println("Regular method: " + method);
            }
        }
        
        // Interface implementation bridge methods
        StringProcessor processor = new StringProcessor();
        Processor<String> processorInterface = processor;
        
        String processed = processorInterface.process("test");
        System.out.println("Interface bridge method result: " + processed);
    }
    
    private static void runtimeTypeInfo() {
        List<String> stringList = Arrays.asList("a", "b", "c");
        List<Integer> integerList = Arrays.asList(1, 2, 3);
        
        // Cannot distinguish between different parameterized types
        System.out.println("Cannot distinguish parameterized types at runtime:");
        
        // This won't work as expected
        if (stringList instanceof List) {  // Raw type check
            System.out.println("stringList is a List (raw type check)");
        }
        
        // Cannot check: if (stringList instanceof List<String>)
        // Cannot check: if (integerList instanceof List<Integer>)
        
        // Wildcard instanceof works
        if (stringList instanceof List<?>) {
            System.out.println("stringList is a List<?> (wildcard check)");
        }
        
        // Type checking workaround
        boolean isStringList = checkListType(stringList, String.class);
        boolean isIntegerList = checkListType(integerList, Integer.class);
        
        System.out.println("stringList contains Strings: " + isStringList);
        System.out.println("integerList contains Integers: " + isIntegerList);
        
        // Generic arrays issue
        // List<String>[] arrays = new List<String>[10]; // Compile error!
        @SuppressWarnings("unchecked")
        List<String>[] arrays = new List[10]; // Unchecked warning
        arrays[0] = Arrays.asList("hello");
        
        System.out.println("Generic array created with unchecked cast");
    }
    
    private static void typeErasureWorkarounds() {
        System.out.println("Workarounds for type erasure limitations:");
        
        // 1. Pass Class<T> for type information
        String instance = GenericClass.createInstance(String.class);
        System.out.println("Created String instance: " + instance);
        
        // 2. Type tokens for complex types
        TypeToken<List<String>> listType = new TypeToken<List<String>>() {};
        System.out.println("Type token: " + listType.getType());
        
        // 3. Super type tokens
        TypeReference<Map<String, List<Integer>>> mapType = new TypeReference<Map<String, List<Integer>>>() {};
        System.out.println("Complex type reference: " + mapType.getType());
        
        // 4. Reified generics simulation
        ReifiedList<String> reifiedList = new ReifiedList<>(String.class);
        reifiedList.add("Hello");
        try {
            reifiedList.addUnsafe((Object) 123); // This will throw exception
        } catch (ClassCastException e) {
            System.out.println("Reified list caught type violation: " + e.getMessage());
        }
        
        // 5. Generic array creation
        String[] stringArray = GenericClass.createTypedArray(String.class, 5);
        stringArray[0] = "Array element";
        System.out.println("Created typed array: " + Arrays.toString(stringArray));
    }
    
    private static void arraysAndGenerics() {
        System.out.println("Arrays and generics don't mix well:");
        
        // Arrays are covariant, generics are invariant
        Object[] objectArray = new String[10]; // Legal - arrays are covariant
        // List<Object> objectList = new ArrayList<String>(); // Illegal - generics are invariant
        
        try {
            objectArray[0] = 42; // Runtime exception - ArrayStoreException
        } catch (ArrayStoreException e) {
            System.out.println("Array store exception: " + e.getMessage());
        }
        
        // Generic arrays are prohibited
        // List<String>[] genericArrays = new List<String>[10]; // Compile error
        
        // Workarounds
        @SuppressWarnings("unchecked")
        List<String>[] genericArrays = (List<String>[]) new List<?>[10];
        genericArrays[0] = Arrays.asList("Safe", "usage");
        
        // Better alternative: use collections
        List<List<String>> listOfLists = new ArrayList<>();
        listOfLists.add(Arrays.asList("Better", "approach"));
        
        System.out.println("Generic arrays workaround: " + Arrays.toString(genericArrays));
        System.out.println("List of lists: " + listOfLists);
        
        // Varargs with generics
        @SafeVarargs
        List<String> combinedList = combineVarargs(
            Arrays.asList("a", "b"),
            Arrays.asList("c", "d")
        );
        System.out.println("Combined varargs result: " + combinedList);
    }
    
    private static void reflectionAndGenerics() {
        System.out.println("Reflection with generics:");
        
        try {
            // Generic type information in method signatures
            Method method = Example_Prompt103_TypeErasure.class.getDeclaredMethod(
                "genericMethod", List.class);
            
            Type[] paramTypes = method.getGenericParameterTypes();
            Type returnType = method.getGenericReturnType();
            
            System.out.println("Method parameter type: " + paramTypes[0]);
            System.out.println("Method return type: " + returnType);
            
            // Field generic type information
            Field field = GenericFieldHolder.class.getDeclaredField("stringList");
            Type fieldType = field.getGenericType();
            System.out.println("Field generic type: " + fieldType);
            
            if (fieldType instanceof ParameterizedType) {
                ParameterizedType parameterizedType = (ParameterizedType) fieldType;
                Type[] actualTypes = parameterizedType.getActualTypeArguments();
                System.out.println("Actual type arguments: " + Arrays.toString(actualTypes));
            }
            
        } catch (Exception e) {
            System.out.println("Reflection error: " + e.getMessage());
        }
        
        // Class literals and generic types
        Class<String> stringClass = String.class;
        // Class<List<String>> listClass = List<String>.class; // Illegal
        Class<List> rawListClass = List.class;
        
        System.out.println("String class: " + stringClass);
        System.out.println("Raw List class: " + rawListClass);
    }
    
    private static void practicalImplications() {
        System.out.println("Practical implications of type erasure:");
        
        // 1. Generic singletons
        Cache<String> stringCache = Cache.getInstance();
        Cache<Integer> integerCache = Cache.getInstance();
        
        // Both return the same instance due to type erasure!
        System.out.println("Same cache instance: " + (stringCache == integerCache));
        
        // 2. Generic exceptions (not allowed)
        // class GenericException<T> extends Exception {} // Compile error
        
        // 3. Class casting implications
        List rawList = new ArrayList<String>();
        rawList.add("string");
        rawList.add(123); // No compile error, but dangerous!
        
        @SuppressWarnings("unchecked")
        List<String> stringList = (List<String>) rawList;
        // This won't fail immediately due to type erasure
        System.out.println("Raw list cast to generic: " + stringList.size());
        
        try {
            for (String s : stringList) {
                System.out.println("String: " + s); // ClassCastException on Integer
            }
        } catch (ClassCastException e) {
            System.out.println("Cast exception during iteration: " + e.getMessage());
        }
        
        // 4. Generic overloading issues
        OverloadExample example = new OverloadExample();
        example.process(Arrays.asList("string"));
        example.process(Arrays.asList(123));
        
        System.out.println("Method overloading works despite type erasure");
    }
    
    // Helper methods and classes
    @SuppressWarnings("unchecked")
    private static <T> boolean checkListType(List<?> list, Class<T> expectedType) {
        if (list.isEmpty()) return true;
        return expectedType.isInstance(list.get(0));
    }
    
    @SuppressWarnings("unused")
    private static <T> List<T> genericMethod(List<T> input) {
        return new ArrayList<>(input);
    }
    
    @SafeVarargs
    private static <T> List<T> combineVarargs(List<T>... lists) {
        List<T> result = new ArrayList<>();
        for (List<T> list : lists) {
            result.addAll(list);
        }
        return result;
    }
    
    // Helper classes
    static class TypeToken<T> {
        private final Type type;
        
        protected TypeToken() {
            Type superClass = getClass().getGenericSuperclass();
            if (superClass instanceof ParameterizedType) {
                this.type = ((ParameterizedType) superClass).getActualTypeArguments()[0];
            } else {
                throw new RuntimeException("TypeToken must be parameterized");
            }
        }
        
        public Type getType() {
            return type;
        }
    }
    
    static abstract class TypeReference<T> {
        private final Type type;
        
        protected TypeReference() {
            Type superClass = getClass().getGenericSuperclass();
            if (superClass instanceof ParameterizedType) {
                this.type = ((ParameterizedType) superClass).getActualTypeArguments()[0];
            } else {
                throw new RuntimeException("TypeReference must be parameterized");
            }
        }
        
        public Type getType() {
            return type;
        }
    }
    
    static class ReifiedList<T> {
        private final List<T> list = new ArrayList<>();
        private final Class<T> type;
        
        public ReifiedList(Class<T> type) {
            this.type = type;
        }
        
        public void add(T item) {
            if (!type.isInstance(item)) {
                throw new ClassCastException("Expected " + type + ", got " + item.getClass());
            }
            list.add(item);
        }
        
        @SuppressWarnings("unchecked")
        public void addUnsafe(Object item) {
            add((T) item); // This will check type at runtime
        }
        
        public List<T> getList() {
            return new ArrayList<>(list);
        }
    }
    
    static class GenericFieldHolder {
        @SuppressWarnings("unused")
        private List<String> stringList;
        @SuppressWarnings("unused")
        private Map<String, Integer> stringIntMap;
    }
    
    static class Cache<T> {
        @SuppressWarnings("rawtypes")
        private static final Cache INSTANCE = new Cache();
        
        @SuppressWarnings("unchecked")
        public static <T> Cache<T> getInstance() {
            return INSTANCE;
        }
        
        private Cache() {}
    }
    
    static class OverloadExample {
        public void process(List<String> strings) {
            System.out.println("Processing strings: " + strings.size());
        }
        
        public void process(List<Integer> integers) {
            System.out.println("Processing integers: " + integers.size());
        }
        
        // Note: Due to type erasure, both methods have the same signature at runtime
        // The compiler generates bridge methods to handle this
    }
}