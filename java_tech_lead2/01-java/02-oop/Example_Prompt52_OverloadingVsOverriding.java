/**
 * Prompt 52: Method overloading vs method overriding
 * 
 * Key Points:
 * - Overloading: Same method name, different parameters (compile-time polymorphism)
 * - Overriding: Same method signature, different implementation in subclass (runtime polymorphism)
 * - Overloading is resolved at compile time
 * - Overriding is resolved at runtime through dynamic method dispatch
 */

class Calculator {
    // Method Overloading - same name, different parameters
    public int add(int a, int b) {
        System.out.println("Adding two integers: " + a + " + " + b);
        return a + b;
    }
    
    public double add(double a, double b) {
        System.out.println("Adding two doubles: " + a + " + " + b);
        return a + b;
    }
    
    public int add(int a, int b, int c) {
        System.out.println("Adding three integers: " + a + " + " + b + " + " + c);
        return a + b + c;
    }
    
    public String add(String a, String b) {
        System.out.println("Concatenating strings: " + a + " + " + b);
        return a + b;
    }
    
    // Method that can be overridden
    public String getCalculatorType() {
        return "Basic Calculator";
    }
    
    public void printResult(int result) {
        System.out.println("Result: " + result);
    }
}

class ScientificCalculator extends Calculator {
    // Method Overriding - same signature, different implementation
    @Override
    public String getCalculatorType() {
        return "Scientific Calculator";
    }
    
    // Additional overloaded methods
    public double add(double a, double b, double c) {
        System.out.println("Scientific calc adding three doubles: " + a + " + " + b + " + " + c);
        return a + b + c;
    }
    
    public double power(double base, double exponent) {
        System.out.println("Calculating " + base + "^" + exponent);
        return Math.pow(base, exponent);
    }
    
    // Overriding with different behavior
    @Override
    public void printResult(int result) {
        System.out.println("Scientific Result: " + result + " (calculated with precision)");
    }
}

class GraphingCalculator extends ScientificCalculator {
    @Override
    public String getCalculatorType() {
        return "Graphing Calculator";
    }
    
    // Method overloading in derived class
    public void plot(String function) {
        System.out.println("Plotting function: " + function);
    }
    
    public void plot(double[] xValues, double[] yValues) {
        System.out.println("Plotting points: " + xValues.length + " data points");
    }
}

public class Example_Prompt52_OverloadingVsOverriding {
    public static void main(String[] args) {
        System.out.println("=== Method Overloading vs Overriding Demo ===\n");
        
        Calculator basic = new Calculator();
        ScientificCalculator scientific = new ScientificCalculator();
        GraphingCalculator graphing = new GraphingCalculator();
        
        System.out.println("1. METHOD OVERLOADING (Compile-time polymorphism):");
        System.out.println("Same method name 'add' with different parameters:\n");
        
        // Different overloaded methods called based on parameters
        basic.add(5, 3);                    // int, int
        basic.add(5.5, 3.2);               // double, double  
        basic.add(1, 2, 3);                // int, int, int
        basic.add("Hello", " World");       // String, String
        
        System.out.println("\nScientific calculator additional overloads:");
        scientific.add(1.1, 2.2, 3.3);     // double, double, double
        scientific.power(2, 3);             // New method
        
        System.out.println("\n2. METHOD OVERRIDING (Runtime polymorphism):");
        System.out.println("Same method signature, different implementations:\n");
        
        // Method overriding - resolved at runtime
        Calculator[] calculators = {basic, scientific, graphing};
        
        for (Calculator calc : calculators) {
            // Same method call, different behavior based on actual object type
            System.out.println("Type: " + calc.getCalculatorType());
            int result = calc.add(10, 20);
            calc.printResult(result);
            System.out.println();
        }
        
        System.out.println("3. POLYMORPHISM IN ACTION:");
        System.out.println("Reference type vs Object type:\n");
        
        // Reference type is Calculator, but actual objects are different
        Calculator calc1 = new Calculator();
        Calculator calc2 = new ScientificCalculator();  // Upcasting
        Calculator calc3 = new GraphingCalculator();    // Upcasting
        
        // Method resolution happens at runtime
        demonstratePolymorphism(calc1);
        demonstratePolymorphism(calc2);
        demonstratePolymorphism(calc3);
        
        System.out.println("4. COMPILE-TIME vs RUNTIME BINDING:");
        System.out.println("Overloading resolved at compile-time, overriding at runtime\n");
        
        // This calls the right overloaded method at compile time
        scientific.add(1, 2);        // Calls inherited int add(int, int)
        scientific.add(1.0, 2.0);    // Calls inherited double add(double, double)
        
        // This calls the right overridden method at runtime
        Calculator polyCalc = new ScientificCalculator();
        System.out.println("Polymorphic call result: " + polyCalc.getCalculatorType());
    }
    
    private static void demonstratePolymorphism(Calculator calculator) {
        System.out.println("Calculator type (runtime binding): " + calculator.getCalculatorType());
    }
}