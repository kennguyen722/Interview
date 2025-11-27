/**
 * Prompt 101: Java Collections Framework overview
 * 
 * Key Points:
 * - Core interfaces: Collection, List, Set, Queue, Map
 * - Key implementations: ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap
 * - Provides unified architecture for storing and manipulating collections
 * - Reduces programming effort and increases performance
 */

import java.util.*;

public class Example_Prompt101_CollectionsFramework {
    public static void main(String[] args) {
        System.out.println("=== Java Collections Framework Overview ===\n");
        
        // 1. LIST INTERFACE - Ordered collection, allows duplicates
        System.out.println("1. LIST Interface (ordered, allows duplicates):");
        demonstrateList();
        
        // 2. SET INTERFACE - No duplicates allowed
        System.out.println("\n2. SET Interface (no duplicates):");
        demonstrateSet();
        
        // 3. QUEUE INTERFACE - FIFO operations
        System.out.println("\n3. QUEUE Interface (FIFO operations):");
        demonstrateQueue();
        
        // 4. MAP INTERFACE - Key-value pairs
        System.out.println("\n4. MAP Interface (key-value pairs):");
        demonstrateMap();
        
        // 5. COLLECTION UTILITIES
        System.out.println("\n5. Collections Utility Methods:");
        demonstrateUtilities();
    }
    
    private static void demonstrateList() {
        // ArrayList - resizable array implementation
        List<String> arrayList = new ArrayList<>();
        arrayList.add("Apple");
        arrayList.add("Banana");
        arrayList.add("Apple"); // Duplicates allowed
        arrayList.add(1, "Orange"); // Insert at specific index
        
        System.out.println("ArrayList: " + arrayList);
        System.out.println("Element at index 1: " + arrayList.get(1));
        System.out.println("Size: " + arrayList.size());
        
        // LinkedList - doubly-linked list implementation
        List<Integer> linkedList = new LinkedList<>();
        linkedList.add(10);
        linkedList.add(20);
        linkedList.add(30);
        ((LinkedList<Integer>) linkedList).addFirst(5); // LinkedList specific method
        
        System.out.println("LinkedList: " + linkedList);
        
        // Vector - synchronized ArrayList (legacy, avoid in new code)
        List<String> vector = new Vector<>();
        vector.add("Thread");
        vector.add("Safe");
        System.out.println("Vector (synchronized): " + vector);
    }
    
    private static void demonstrateSet() {
        // HashSet - hash table implementation, no ordering
        Set<String> hashSet = new HashSet<>();
        hashSet.add("Java");
        hashSet.add("Python");
        hashSet.add("Java"); // Duplicate ignored
        hashSet.add("C++");
        
        System.out.println("HashSet (unordered): " + hashSet);
        
        // TreeSet - sorted set implementation
        Set<Integer> treeSet = new TreeSet<>();
        treeSet.add(30);
        treeSet.add(10);
        treeSet.add(20);
        treeSet.add(10); // Duplicate ignored
        
        System.out.println("TreeSet (sorted): " + treeSet);
        
        // LinkedHashSet - maintains insertion order
        Set<String> linkedHashSet = new LinkedHashSet<>();
        linkedHashSet.add("First");
        linkedHashSet.add("Second");
        linkedHashSet.add("Third");
        
        System.out.println("LinkedHashSet (insertion order): " + linkedHashSet);
    }
    
    private static void demonstrateQueue() {
        // LinkedList as Queue
        Queue<String> queue = new LinkedList<>();
        queue.offer("Task1"); // Add to rear
        queue.offer("Task2");
        queue.offer("Task3");
        
        System.out.println("Queue: " + queue);
        System.out.println("Peek (front element): " + queue.peek());
        System.out.println("Poll (remove front): " + queue.poll());
        System.out.println("After poll: " + queue);
        
        // PriorityQueue - heap-based priority queue
        Queue<Integer> priorityQueue = new PriorityQueue<>();
        priorityQueue.offer(30);
        priorityQueue.offer(10);
        priorityQueue.offer(20);
        
        System.out.println("PriorityQueue: " + priorityQueue);
        System.out.println("Poll order (natural): " + priorityQueue.poll() + ", " + 
                          priorityQueue.poll() + ", " + priorityQueue.poll());
        
        // Deque - double-ended queue
        Deque<String> deque = new ArrayDeque<>();
        deque.addFirst("Front");
        deque.addLast("Back");
        deque.addFirst("New Front");
        
        System.out.println("Deque: " + deque);
    }
    
    private static void demonstrateMap() {
        // HashMap - hash table implementation
        Map<String, Integer> hashMap = new HashMap<>();
        hashMap.put("Alice", 25);
        hashMap.put("Bob", 30);
        hashMap.put("Charlie", 35);
        
        System.out.println("HashMap: " + hashMap);
        System.out.println("Alice's age: " + hashMap.get("Alice"));
        System.out.println("Contains key 'Bob': " + hashMap.containsKey("Bob"));
        
        // TreeMap - sorted map implementation
        Map<String, String> treeMap = new TreeMap<>();
        treeMap.put("zebra", "Striped animal");
        treeMap.put("apple", "Fruit");
        treeMap.put("banana", "Yellow fruit");
        
        System.out.println("TreeMap (sorted by key): " + treeMap);
        
        // LinkedHashMap - maintains insertion order
        Map<Integer, String> linkedHashMap = new LinkedHashMap<>();
        linkedHashMap.put(3, "Third");
        linkedHashMap.put(1, "First");
        linkedHashMap.put(2, "Second");
        
        System.out.println("LinkedHashMap (insertion order): " + linkedHashMap);
    }
    
    private static void demonstrateUtilities() {
        List<Integer> numbers = new ArrayList<>(Arrays.asList(5, 2, 8, 1, 9));
        System.out.println("Original: " + numbers);
        
        // Sorting
        Collections.sort(numbers);
        System.out.println("Sorted: " + numbers);
        
        // Reverse
        Collections.reverse(numbers);
        System.out.println("Reversed: " + numbers);
        
        // Shuffle
        Collections.shuffle(numbers);
        System.out.println("Shuffled: " + numbers);
        
        // Binary search (requires sorted list)
        Collections.sort(numbers);
        int index = Collections.binarySearch(numbers, 5);
        System.out.println("Binary search for 5: index " + index);
        
        // Max/Min
        System.out.println("Max: " + Collections.max(numbers));
        System.out.println("Min: " + Collections.min(numbers));
        
        // Frequency
        numbers.addAll(Arrays.asList(5, 5, 2));
        System.out.println("List with duplicates: " + numbers);
        System.out.println("Frequency of 5: " + Collections.frequency(numbers, 5));
        
        // Unmodifiable collection
        List<Integer> unmodifiable = Collections.unmodifiableList(numbers);
        System.out.println("Unmodifiable list: " + unmodifiable);
        // unmodifiable.add(10); // Would throw UnsupportedOperationException
        
        // Synchronized collection
        List<String> synchronizedList = Collections.synchronizedList(new ArrayList<>());
        synchronizedList.add("Thread-safe");
        System.out.println("Synchronized list: " + synchronizedList);
    }
}