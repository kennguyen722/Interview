# Answer Code Sample - Lesson 5.1: SQL Mastery for Developers

## Java Answer (Complete Runnable)

~~~java
import java.util.*;
import java.util.stream.*;

/**
 * Lesson 5.1 - SQL Mastery for Developers
 *
 * Core SQL patterns simulated with Java streams (the logic is identical).
 * Run these as actual SQL in your module project with PostgreSQL.
 *
 * KEY TERMS:
 *   SELECT / WHERE  - filter rows.
 *   JOIN            - combine rows from two tables on a matching key.
 *   GROUP BY        - aggregate rows sharing a common column value.
 *   HAVING          - filter aggregated groups (like WHERE for GROUP BY).
 *   INDEX           - data structure that speeds up column lookups.
 *   EXPLAIN         - show the query execution plan.
 */
public class AnswerApp {

    record Employee(int id, String name, String dept, double salary, int managerId) {}

    public static void main(String[] args) {
        System.out.println("=== Lesson 5.1: SQL Mastery for Developers ===\n");

        List<Employee> emps = List.of(
            new Employee(1, "Alice",   "Engineering", 110000, 0),
            new Employee(2, "Bob",     "Engineering",  95000, 1),
            new Employee(3, "Carol",   "Marketing",    82000, 0),
            new Employee(4, "Dave",    "Marketing",    78000, 3),
            new Employee(5, "Eve",     "Engineering", 125000, 1),
            new Employee(6, "Frank",   "HR",           70000, 0)
        );

        // SELECT name, salary FROM employees WHERE salary > 90000 ORDER BY salary DESC
        System.out.println("--- WHERE + ORDER BY ---");
        emps.stream().filter(e -> e.salary() > 90000)
            .sorted(Comparator.comparingDouble(Employee::salary).reversed())
            .forEach(e -> System.out.printf("  %-8s $%,.0f%n", e.name(), e.salary()));

        // SELECT dept, COUNT(*), AVG(salary) FROM employees GROUP BY dept
        System.out.println("\n--- GROUP BY dept ---");
        emps.stream().collect(Collectors.groupingBy(Employee::dept,
            Collectors.summarizingDouble(Employee::salary)))
            .entrySet().stream().sorted(Map.Entry.comparingByKey())
            .forEach(e -> {
                DoubleSummaryStatistics s = e.getValue();
                System.out.printf("  %-14s count=%d  avg=$%,.0f  max=$%,.0f%n",
                    e.getKey(), s.getCount(), s.getAverage(), s.getMax());
            });

        // Self-join: employee + manager name
        System.out.println("\n--- Self-join: employee + manager ---");
        Map<Integer, String> idToName = emps.stream()
            .collect(Collectors.toMap(Employee::id, Employee::name));
        emps.stream().filter(e -> e.managerId() != 0).forEach(e ->
            System.out.printf("  %-8s -> manager: %s%n",
                e.name(), idToName.getOrDefault(e.managerId(), "N/A")));

        // HAVING: departments with avg salary > 80000
        System.out.println("\n--- HAVING avg salary > 80000 ---");
        emps.stream().collect(Collectors.groupingBy(Employee::dept,
            Collectors.averagingDouble(Employee::salary)))
            .entrySet().stream().filter(e -> e.getValue() > 80000)
            .forEach(e -> System.out.printf("  %-14s avg=$%,.0f%n", e.getKey(), e.getValue()));

        System.out.println("\n--- Index design guidelines ---");
        System.out.println("  CREATE INDEX idx_emp_dept    ON employees(dept);        -- GROUP BY, WHERE dept");
        System.out.println("  CREATE INDEX idx_emp_salary  ON employees(salary DESC); -- ORDER BY salary DESC");
        System.out.println("  AVOID indexing columns with low cardinality (boolean, tiny enum)");
    }
}
~~~
