# Answer Code Sample - Lesson 2.3: Streams and Functional Programming

## Java Answer (Complete Runnable)

~~~java
import java.util.*;
import java.util.stream.*;

/**
 * Lesson 2.3 â€“ Streams and Functional Programming
 *
 * WHAT THIS DEMONSTRATES:
 *   Lambda expressions, method references, stream pipeline operations,
 *   collectors, and building a readable data-reporting pipeline.
 *
 * KEY TERMS:
 *   lambda         â€“ an anonymous function: (params) -> body.
 *   stream         â€“ a lazy, declarative sequence of operations on data.
 *   intermediate   â€“ lazy operation (filter, map, sorted) â€” returns a new Stream.
 *   terminal       â€“ triggers evaluation (collect, forEach, reduce, count).
 *   method reference â€“ shorthand for a lambda: ClassName::method.
 *   Optional       â€“ a container that may or may not hold a value; avoids null.
 */
public class AnswerApp {

    record Employee(String name, String dept, double salary, int yrsExp) {}

    public static void main(String[] args) {
        System.out.println("=== Lesson 2.3: Streams and Functional Programming ===\n");

        List<Employee> employees = List.of(
            new Employee("Alice",   "Engineering", 110_000, 7),
            new Employee("Bob",     "Engineering",  95_000, 4),
            new Employee("Carol",   "Marketing",    82_000, 6),
            new Employee("Dave",    "Marketing",    78_000, 3),
            new Employee("Eve",     "Engineering", 125_000, 9),
            new Employee("Frank",   "HR",           70_000, 2),
            new Employee("Grace",   "HR",           72_000, 5),
            new Employee("Heidi",   "Engineering",  99_000, 5)
        );

        basicOperations(employees);
        reportBySalaryBand(employees);
        groupByDepartment(employees);
        topEarners(employees, 3);
        averageSalaryPerDepartment(employees);
        methodReferences(employees);
    }

    /** filter + map + sorted + collect â€” the core stream pipeline. */
    private static void basicOperations(List<Employee> employees) {
        System.out.println("--- Senior Engineers (5+ yrs, sorted by salary desc) ---");

        List<String> result = employees.stream()
            // filter: keep only elements matching predicate
            .filter(e -> e.dept().equals("Engineering") && e.yrsExp() >= 5)
            // map: transform each Employee to a formatted String
            .map(e -> String.format("  %-10s $%,9.0f  %dy exp",
                e.name(), e.salary(), e.yrsExp()))
            // sorted: natural reverse order on salary
            .sorted(Comparator.comparingDouble(
                (String s) -> Double.parseDouble(s.replaceAll("[^0-9.]", ""))).reversed())
            // collect: materialise into a List
            .collect(Collectors.toList());

        result.forEach(System.out::println);
        System.out.println();
    }

    /** partition into two groups: >= 100k and < 100k. */
    private static void reportBySalaryBand(List<Employee> employees) {
        System.out.println("--- Salary Band Report ---");

        // partitioningBy splits into exactly two groups: true and false
        Map<Boolean, List<Employee>> bands = employees.stream()
            .collect(Collectors.partitioningBy(e -> e.salary() >= 100_000));

        System.out.println("  >= $100k: " +
            bands.get(true).stream().map(Employee::name).collect(Collectors.joining(", ")));
        System.out.println("  <  $100k: " +
            bands.get(false).stream().map(Employee::name).collect(Collectors.joining(", ")));
        System.out.println();
    }

    /** groupingBy department, then counting members and computing avg salary. */
    private static void groupByDepartment(List<Employee> employees) {
        System.out.println("--- Department Summary ---");

        // groupingBy produces Map<key, List<value>> by default
        Map<String, DoubleSummaryStatistics> stats = employees.stream()
            .collect(Collectors.groupingBy(
                Employee::dept,
                Collectors.summarizingDouble(Employee::salary)));

        stats.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(e -> {
                DoubleSummaryStatistics s = e.getValue();
                System.out.printf("  %-14s count=%d  avg=$%,.0f  max=$%,.0f%n",
                    e.getKey(), s.getCount(), s.getAverage(), s.getMax());
            });
        System.out.println();
    }

    /** limit: take only the top N after sorting. */
    private static void topEarners(List<Employee> employees, int n) {
        System.out.printf("--- Top %d Earners ---%n", n);
        employees.stream()
            .sorted(Comparator.comparingDouble(Employee::salary).reversed())
            .limit(n)   // short-circuit: stops consuming the stream after n elements
            .forEach(e -> System.out.printf("  %-10s $%,10.0f  (%s)%n",
                e.name(), e.salary(), e.dept()));
        System.out.println();
    }

    /** reduce: aggregate into a single value. */
    private static void averageSalaryPerDepartment(List<Employee> employees) {
        System.out.println("--- Average Salary per Dept (using reduce) ---");

        Map<String, Double> avgByDept = employees.stream()
            .collect(Collectors.groupingBy(
                Employee::dept,
                Collectors.averagingDouble(Employee::salary)));

        avgByDept.entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .forEach(e -> System.out.printf("  %-14s $%,.0f%n", e.getKey(), e.getValue()));
        System.out.println();
    }

    /** Method references: ClassName::method vs lambda. */
    private static void methodReferences(List<Employee> employees) {
        System.out.println("--- Method References vs Lambdas ---");

        // Lambda:          e -> System.out.println(e.name())
        // Method reference: same intent, less ceremony
        System.out.println("Names (method reference):");
        employees.stream()
            .map(Employee::name)           // equivalent to: e -> e.name()
            .forEach(System.out::println); // equivalent to: s -> System.out.println(s)
    }
}

~~~
