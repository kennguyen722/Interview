/**
 * Prompt 102: ArrayList vs LinkedList performance comparison
 * 
 * Key Points:
 * - ArrayList: Dynamic array, good for random access, poor for insertions/deletions in middle
 * - LinkedList: Doubly-linked list, good for insertions/deletions, poor for random access
 * - ArrayList is generally preferred unless frequent insertions/deletions at arbitrary positions
 */

import java.util.*;

public class Example_Prompt102_ArrayListVsLinkedList {
    private static final int SIZE = 100000;
    
    public static void main(String[] args) {
        System.out.println("=== ArrayList vs LinkedList Performance Comparison ===\n");
        
        List<Integer> arrayList = new ArrayList<>();
        List<Integer> linkedList = new LinkedList<>();
        
        // 1. ADDING ELEMENTS TO END
        System.out.println("1. Adding " + SIZE + " elements to end:");
        compareAddToEnd(arrayList, linkedList);
        
        // 2. RANDOM ACCESS
        System.out.println("\n2. Random access (get operations):");
        compareRandomAccess(arrayList, linkedList);
        
        // 3. INSERTIONS AT BEGINNING
        System.out.println("\n3. Insertions at beginning:");
        compareInsertionsAtBeginning();
        
        // 4. INSERTIONS IN MIDDLE
        System.out.println("\n4. Insertions in middle:");
        compareInsertionsInMiddle();
        
        // 5. MEMORY OVERHEAD
        System.out.println("\n5. Memory characteristics:");
        compareMemoryCharacteristics();
        
        // 6. ITERATION PERFORMANCE
        System.out.println("\n6. Iteration performance:");
        compareIteration(arrayList, linkedList);
    }
    
    private static void compareAddToEnd(List<Integer> arrayList, List<Integer> linkedList) {
        // ArrayList add to end
        long startTime = System.nanoTime();
        for (int i = 0; i < SIZE; i++) {
            arrayList.add(i);
        }
        long arrayListTime = System.nanoTime() - startTime;
        
        // LinkedList add to end
        startTime = System.nanoTime();
        for (int i = 0; i < SIZE; i++) {
            linkedList.add(i);
        }
        long linkedListTime = System.nanoTime() - startTime;
        
        System.out.printf("ArrayList: %.2f ms%n", arrayListTime / 1_000_000.0);
        System.out.printf("LinkedList: %.2f ms%n", linkedListTime / 1_000_000.0);
        
        if (arrayListTime < linkedListTime) {
            System.out.println("Winner: ArrayList (better for adding to end)");
        } else {
            System.out.println("Winner: LinkedList");
        }
    }
    
    private static void compareRandomAccess(List<Integer> arrayList, List<Integer> linkedList) {
        Random random = new Random();
        int accessCount = 10000;
        
        // ArrayList random access
        long startTime = System.nanoTime();
        for (int i = 0; i < accessCount; i++) {
            int index = random.nextInt(arrayList.size());
            arrayList.get(index);
        }
        long arrayListTime = System.nanoTime() - startTime;
        
        // LinkedList random access
        startTime = System.nanoTime();
        for (int i = 0; i < accessCount; i++) {
            int index = random.nextInt(linkedList.size());
            linkedList.get(index);
        }
        long linkedListTime = System.nanoTime() - startTime;
        
        System.out.printf("ArrayList (%d random gets): %.2f ms%n", accessCount, arrayListTime / 1_000_000.0);
        System.out.printf("LinkedList (%d random gets): %.2f ms%n", accessCount, linkedListTime / 1_000_000.0);
        System.out.println("Winner: ArrayList (O(1) vs O(n) for random access)");
    }
    
    private static void compareInsertionsAtBeginning() {
        List<Integer> arrayList = new ArrayList<>();
        List<Integer> linkedList = new LinkedList<>();
        int insertions = 10000;
        
        // ArrayList insertions at beginning
        long startTime = System.nanoTime();
        for (int i = 0; i < insertions; i++) {
            arrayList.add(0, i); // Insert at index 0
        }
        long arrayListTime = System.nanoTime() - startTime;
        
        // LinkedList insertions at beginning
        startTime = System.nanoTime();
        for (int i = 0; i < insertions; i++) {
            linkedList.add(0, i); // Insert at index 0
        }
        long linkedListTime = System.nanoTime() - startTime;
        
        System.out.printf("ArrayList (%d insertions at beginning): %.2f ms%n", insertions, arrayListTime / 1_000_000.0);
        System.out.printf("LinkedList (%d insertions at beginning): %.2f ms%n", insertions, linkedListTime / 1_000_000.0);
        System.out.println("Winner: LinkedList (no array shifting required)");
    }
    
    private static void compareInsertionsInMiddle() {
        List<Integer> arrayList = new ArrayList<>();
        List<Integer> linkedList = new LinkedList<>();
        
        // Pre-populate lists
        for (int i = 0; i < 10000; i++) {
            arrayList.add(i);
            linkedList.add(i);
        }
        
        int insertions = 1000;
        
        // ArrayList insertions in middle
        long startTime = System.nanoTime();
        for (int i = 0; i < insertions; i++) {
            int index = arrayList.size() / 2;
            arrayList.add(index, -i);
        }
        long arrayListTime = System.nanoTime() - startTime;
        
        // LinkedList insertions in middle
        startTime = System.nanoTime();
        for (int i = 0; i < insertions; i++) {
            int index = linkedList.size() / 2;
            linkedList.add(index, -i);
        }
        long linkedListTime = System.nanoTime() - startTime;
        
        System.out.printf("ArrayList (%d middle insertions): %.2f ms%n", insertions, arrayListTime / 1_000_000.0);
        System.out.printf("LinkedList (%d middle insertions): %.2f ms%n", insertions, linkedListTime / 1_000_000.0);
        
        if (linkedListTime < arrayListTime) {
            System.out.println("Winner: LinkedList (but still O(n) due to index traversal)");
        } else {
            System.out.println("Result varies - both have O(n) complexity for middle insertions");
        }
    }
    
    private static void compareMemoryCharacteristics() {
        System.out.println("Memory Overhead Analysis:");
        System.out.println("ArrayList:");
        System.out.println("  - Stores elements in contiguous array");
        System.out.println("  - Memory overhead: ~50% (for growth room)");
        System.out.println("  - Better cache locality");
        System.out.println("  - Memory per element: just the reference/value");
        
        System.out.println("\nLinkedList:");
        System.out.println("  - Each element is a node with data + 2 pointers");
        System.out.println("  - Memory overhead: ~200% (prev/next pointers + object overhead)");
        System.out.println("  - Poor cache locality");
        System.out.println("  - Memory per element: data + 2 pointers + object header");
        
        // Demonstrate capacity management
        ArrayList<Integer> arrayWithCapacity = new ArrayList<>(SIZE);
        System.out.println("\nArrayList with initial capacity avoids resizing overhead");
    }
    
    private static void compareIteration(List<Integer> arrayList, List<Integer> linkedList) {
        // Enhanced for-loop (uses iterator internally)
        long startTime = System.nanoTime();
        for (Integer value : arrayList) {
            // Do nothing, just iterate
        }
        long arrayListIterTime = System.nanoTime() - startTime;
        
        startTime = System.nanoTime();
        for (Integer value : linkedList) {
            // Do nothing, just iterate
        }
        long linkedListIterTime = System.nanoTime() - startTime;
        
        System.out.printf("ArrayList iteration: %.2f ms%n", arrayListIterTime / 1_000_000.0);
        System.out.printf("LinkedList iteration: %.2f ms%n", linkedListIterTime / 1_000_000.0);
        
        // Index-based iteration (bad for LinkedList)
        startTime = System.nanoTime();
        for (int i = 0; i < Math.min(1000, arrayList.size()); i++) {
            arrayList.get(i);
        }
        long arrayListIndexTime = System.nanoTime() - startTime;
        
        System.out.printf("ArrayList index iteration (1000 elements): %.2f ms%n", arrayListIndexTime / 1_000_000.0);
        System.out.println("LinkedList index iteration: AVOID - O(n²) complexity!");
        
        System.out.println("\nRecommendation: Use iterator or enhanced for-loop for LinkedList");
    }
    
    // Static methods to demonstrate when to use each
    public static void usageGuidelines() {
        System.out.println("\n=== Usage Guidelines ===");
        System.out.println("Use ArrayList when:");
        System.out.println("  - Frequent random access (get/set by index)");
        System.out.println("  - More reads than writes");
        System.out.println("  - Memory efficiency is important");
        System.out.println("  - Cache performance matters");
        
        System.out.println("\nUse LinkedList when:");
        System.out.println("  - Frequent insertions/deletions at beginning/middle");
        System.out.println("  - Implementing stack/queue operations");
        System.out.println("  - Size varies significantly");
        System.out.println("  - Random access is rare");
        
        System.out.println("\nGeneral rule: ArrayList is usually the better choice");
    }
}