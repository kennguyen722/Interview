/**
 * Prompt 4: Wrapper classes and autoboxing/unboxing
 * 
 * Key Points:
 * - Each primitive has a wrapper class (int -> Integer, boolean -> Boolean, etc.)
 * - Autoboxing: automatic conversion from primitive to wrapper
 * - Unboxing: automatic conversion from wrapper to primitive
 * - Integer cache: -128 to 127 are cached for performance
 * - Be careful with null wrapper objects during unboxing
 */
public class Example_Prompt4_WrapperClasses {
    public static void main(String[] args) {
        // Autoboxing - primitive to wrapper
        Integer boxedInt = 100; // Equivalent to Integer.valueOf(100)
        Double boxedDouble = 3.14; // Equivalent to Double.valueOf(3.14)
        Boolean boxedBool = true; // Equivalent to Boolean.valueOf(true)
        
        // Unboxing - wrapper to primitive
        int primitiveInt = boxedInt; // Equivalent to boxedInt.intValue()
        double primitiveDouble = boxedDouble; // Equivalent to boxedDouble.doubleValue()
        boolean primitiveBool = boxedBool; // Equivalent to boxedBool.booleanValue()
        
        System.out.println("Autoboxing/Unboxing works seamlessly");
        
        // Integer cache demonstration (-128 to 127)
        Integer a = 100;
        Integer b = 100;
        Integer c = 200;
        Integer d = 200;
        
        System.out.println("a == b (100): " + (a == b)); // true (cached)
        System.out.println("c == d (200): " + (c == d)); // false (not cached)
        System.out.println("a.equals(b): " + a.equals(b)); // true
        System.out.println("c.equals(d): " + c.equals(d)); // true
        
        // Null pointer risk with unboxing
        Integer nullInteger = null;
        try {
            int risk = nullInteger; // This will throw NullPointerException
        } catch (NullPointerException e) {
            System.out.println("Caught NPE during unboxing of null Integer");
        }
        
        // Collections require wrapper classes
        java.util.List<Integer> numbers = java.util.Arrays.asList(1, 2, 3, 4, 5);
        System.out.println("List with autoboxing: " + numbers);
        
        // Performance consideration
        Integer sum = 0;
        for (int i = 0; i < 1000; i++) {
            sum += i; // Inefficient: creates new Integer objects due to autoboxing
        }
        System.out.println("Sum (inefficient): " + sum);
        
        // Better approach for performance
        int efficientSum = 0;
        for (int i = 0; i < 1000; i++) {
            efficientSum += i; // Efficient: no boxing/unboxing
        }
        System.out.println("Sum (efficient): " + efficientSum);
    }
}