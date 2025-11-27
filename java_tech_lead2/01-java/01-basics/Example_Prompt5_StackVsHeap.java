/**
 * Prompt 5: Java memory areas (Stack vs Heap)
 * 
 * Key Points:
 * - Stack: stores method call frames, local variables, partial results
 * - Heap: stores objects and instance variables
 * - Stack is thread-specific, Heap is shared across threads
 * - Stack follows LIFO, Heap is managed by GC
 * - StackOverflowError occurs when stack space is exhausted
 * - OutOfMemoryError occurs when heap space is exhausted
 */
public class Example_Prompt5_StackVsHeap {
    
    // Instance variable stored in heap
    private String instanceVar = "I'm in the heap";
    
    // Static variable stored in method area (part of heap in modern JVMs)
    private static String staticVar = "I'm in method area";
    
    public static void main(String[] args) {
        // Local variables stored on stack
        int localInt = 42;
        String localString = "I'm a reference on stack, object in heap";
        
        System.out.println("=== Stack vs Heap Demo ===");
        
        // Create object - stored in heap
        Example_Prompt5_StackVsHeap instance = new Example_Prompt5_StackVsHeap();
        
        // Method call adds frame to stack
        instance.demonstrateStackFrame(localInt);
        
        // Demonstrate stack overflow (uncomment to test - will crash program)
        // causeStackOverflow(0);
        
        // Demonstrate memory allocation
        demonstrateMemoryAllocation();
    }
    
    /**
     * Each method call creates a new stack frame
     */
    public void demonstrateStackFrame(int parameter) {
        // Local variables in this method's stack frame
        int localVar = parameter * 2;
        String methodLocal = "Local to this method";
        
        System.out.println("Method parameter (stack): " + parameter);
        System.out.println("Local variable (stack): " + localVar);
        System.out.println("Instance variable (heap): " + instanceVar);
        System.out.println("Static variable (method area): " + staticVar);
        
        // Create array - array object stored in heap
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.println("Array reference (stack) pointing to array object (heap): " + java.util.Arrays.toString(numbers));
    }
    
    /**
     * Recursive method that can cause StackOverflowError
     * (Commented out to prevent crash)
     */
    public static void causeStackOverflow(int depth) {
        System.out.println("Recursion depth: " + depth);
        // Each call adds a frame to stack
        causeStackOverflow(depth + 1); // This will eventually cause StackOverflowError
    }
    
    /**
     * Demonstrates memory allocation patterns
     */
    public static void demonstrateMemoryAllocation() {
        System.out.println("\n=== Memory Allocation Patterns ===");
        
        // Primitives on stack (in method frame)
        int stackInt = 100;
        double stackDouble = 3.14;
        boolean stackBool = true;
        
        // Objects on heap, references on stack
        String heapString = new String("Heap allocated string");
        java.util.List<String> heapList = new java.util.ArrayList<>();
        heapList.add("Item 1");
        heapList.add("Item 2");
        
        System.out.println("Stack primitives: int=" + stackInt + ", double=" + stackDouble + ", boolean=" + stackBool);
        System.out.println("Heap objects via stack references: " + heapString + ", " + heapList);
        
        // When method ends, stack frame is popped
        // Heap objects become eligible for GC if no more references exist
    }
}