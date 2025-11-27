/**
 * Prompt 151: Java Stream API introduction and benefits
 * 
 * Key Points:
 * - Streams enable functional-style operations on collections
 * - Lazy evaluation - operations are not executed until terminal operation
 * - Immutable - original collection is not modified
 * - Can be parallelized easily
 * - More readable and concise than imperative loops
 */

import java.util.*;
import java.util.stream.*;

class Employee {
    private String name;
    private String department;
    private double salary;
    private int age;
    
    public Employee(String name, String department, double salary, int age) {
        this.name = name;
        this.department = department;
        this.salary = salary;
        this.age = age;
    }
    
    // Getters
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public double getSalary() { return salary; }
    public int getAge() { return age; }
    
    @Override
    public String toString() {
        return String.format("%s (%s, $%.0f, age %d)", name, department, salary, age);
    }
}

public class Example_Prompt151_StreamsIntro {
    public static void main(String[] args) {
        System.out.println("=== Java Streams API Introduction ===\n");
        
        // Sample data
        List<Employee> employees = createEmployeeList();
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        List<String> words = Arrays.asList("java", "stream", "api", "functional", "programming");
        
        // 1. BASIC STREAM OPERATIONS
        System.out.println("1. Basic Stream Operations:");
        basicStreamOperations(numbers, words);
        
        // 2. FILTERING AND MAPPING
        System.out.println("\n2. Filtering and Mapping:");
        filteringAndMapping(employees);
        
        // 3. SORTING AND LIMITING
        System.out.println("\n3. Sorting and Limiting:");
        sortingAndLimiting(employees);
        
        // 4. GROUPING AND COLLECTING
        System.out.println("\n4. Grouping and Collecting:");
        groupingAndCollecting(employees);
        
        // 5. PARALLEL STREAMS
        System.out.println("\n5. Parallel Streams:");
        parallelStreams(numbers);
        
        // 6. STREAM VS TRADITIONAL APPROACH
        System.out.println("\n6. Stream vs Traditional Approach:");
        compareApproaches(employees);
    }
    
    private static List<Employee> createEmployeeList() {
        return Arrays.asList(
            new Employee("Alice", "Engineering", 95000, 28),
            new Employee("Bob", "Engineering", 85000, 32),
            new Employee("Charlie", "Marketing", 70000, 29),
            new Employee("Diana", "Engineering", 105000, 35),
            new Employee("Eve", "Sales", 65000, 26),
            new Employee("Frank", "Marketing", 75000, 31),
            new Employee("Grace", "Engineering", 90000, 27),
            new Employee("Henry", "Sales", 60000, 24)
        );
    }
    
    private static void basicStreamOperations(List<Integer> numbers, List<String> words) {
        // Filter even numbers
        List<Integer> evenNumbers = numbers.stream()
            .filter(n -> n % 2 == 0)
            .collect(Collectors.toList());
        System.out.println("Even numbers: " + evenNumbers);
        
        // Transform to uppercase
        List<String> upperWords = words.stream()
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        System.out.println("Uppercase words: " + upperWords);
        
        // Find first element matching condition
        Optional<Integer> firstGreaterThanFive = numbers.stream()
            .filter(n -> n > 5)
            .findFirst();
        System.out.println("First number > 5: " + firstGreaterThanFive.orElse(-1));
        
        // Check if all elements match condition
        boolean allPositive = numbers.stream()
            .allMatch(n -> n > 0);
        System.out.println("All numbers positive: " + allPositive);
        
        // Count elements
        long count = words.stream()
            .filter(word -> word.length() > 4)
            .count();
        System.out.println("Words longer than 4 chars: " + count);
    }
    
    private static void filteringAndMapping(List<Employee> employees) {
        // Filter high-salary engineering employees and get their names
        List<String> highPaidEngineers = employees.stream()
            .filter(emp -> "Engineering".equals(emp.getDepartment()))
            .filter(emp -> emp.getSalary() > 90000)
            .map(Employee::getName)
            .collect(Collectors.toList());
        
        System.out.println("High-paid engineers: " + highPaidEngineers);
        
        // Transform salary values
        List<String> salaryDescriptions = employees.stream()
            .map(emp -> emp.getName() + ": $" + String.format("%.0f", emp.getSalary()))
            .collect(Collectors.toList());
        
        System.out.println("Salary descriptions:");
        salaryDescriptions.forEach(System.out::println);
    }
    
    private static void sortingAndLimiting(List<Employee> employees) {
        // Top 3 highest paid employees
        List<Employee> topEarners = employees.stream()
            .sorted((e1, e2) -> Double.compare(e2.getSalary(), e1.getSalary()))
            .limit(3)
            .collect(Collectors.toList());
        
        System.out.println("Top 3 earners:");
        topEarners.forEach(System.out::println);
        
        // Youngest employees in each department (skip duplicates)
        List<Employee> youngestByDept = employees.stream()
            .sorted(Comparator.comparingInt(Employee::getAge))
            .collect(Collectors.groupingBy(
                Employee::getDepartment,
                Collectors.collectingAndThen(
                    Collectors.toList(),
                    list -> list.get(0)
                )
            ))
            .values()
            .stream()
            .collect(Collectors.toList());
        
        System.out.println("Youngest in each department:");
        youngestByDept.forEach(System.out::println);
    }
    
    private static void groupingAndCollecting(List<Employee> employees) {
        // Group by department
        Map<String, List<Employee>> byDepartment = employees.stream()
            .collect(Collectors.groupingBy(Employee::getDepartment));
        
        System.out.println("Employees by department:");
        byDepartment.forEach((dept, empList) -> {
            System.out.println(dept + ": " + empList.size() + " employees");
        });
        
        // Average salary by department
        Map<String, Double> avgSalaryByDept = employees.stream()
            .collect(Collectors.groupingBy(
                Employee::getDepartment,
                Collectors.averagingDouble(Employee::getSalary)
            ));
        
        System.out.println("Average salary by department:");
        avgSalaryByDept.forEach((dept, avg) -> 
            System.out.printf("%s: $%.0f%n", dept, avg));
        
        // Partition by salary threshold
        Map<Boolean, List<Employee>> partitionedBySalary = employees.stream()
            .collect(Collectors.partitioningBy(emp -> emp.getSalary() > 80000));
        
        System.out.println("High earners (>$80k): " + partitionedBySalary.get(true).size());
        System.out.println("Regular earners (≤$80k): " + partitionedBySalary.get(false).size());
    }
    
    private static void parallelStreams(List<Integer> numbers) {
        // Create a larger list for demonstrating parallel processing
        List<Integer> largeList = IntStream.range(1, 1000000)
            .boxed()
            .collect(Collectors.toList());
        
        // Sequential processing
        long startTime = System.nanoTime();
        long sequentialSum = largeList.stream()
            .mapToLong(Integer::longValue)
            .sum();
        long sequentialTime = System.nanoTime() - startTime;
        
        // Parallel processing
        startTime = System.nanoTime();
        long parallelSum = largeList.parallelStream()
            .mapToLong(Integer::longValue)
            .sum();
        long parallelTime = System.nanoTime() - startTime;
        
        System.out.printf("Sequential sum: %d (%.2f ms)%n", sequentialSum, sequentialTime / 1_000_000.0);
        System.out.printf("Parallel sum: %d (%.2f ms)%n", parallelSum, parallelTime / 1_000_000.0);
        System.out.printf("Speedup: %.2fx%n", (double) sequentialTime / parallelTime);
        
        System.out.println("Note: Parallel streams use ForkJoinPool.commonPool()");
        System.out.println("Best for CPU-intensive operations, not I/O operations");
    }
    
    private static void compareApproaches(List<Employee> employees) {
        System.out.println("Traditional imperative approach vs Stream approach:");
        
        // TASK: Find names of engineering employees earning > $90k, sorted by name
        
        // Traditional approach
        List<String> traditionalResult = new ArrayList<>();
        for (Employee emp : employees) {
            if ("Engineering".equals(emp.getDepartment()) && emp.getSalary() > 90000) {
                traditionalResult.add(emp.getName());
            }
        }
        Collections.sort(traditionalResult);
        
        // Stream approach
        List<String> streamResult = employees.stream()
            .filter(emp -> "Engineering".equals(emp.getDepartment()))
            .filter(emp -> emp.getSalary() > 90000)
            .map(Employee::getName)
            .sorted()
            .collect(Collectors.toList());
        
        System.out.println("Traditional result: " + traditionalResult);
        System.out.println("Stream result: " + streamResult);
        System.out.println("Results equal: " + traditionalResult.equals(streamResult));
        
        System.out.println("\nBenefits of Stream approach:");
        System.out.println("- More declarative and readable");
        System.out.println("- Immutable operations (original list unchanged)");
        System.out.println("- Lazy evaluation (optimized execution)");
        System.out.println("- Easy to parallelize");
        System.out.println("- Chainable operations");
    }
}