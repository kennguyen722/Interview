# Answer Code Sample - Lesson 7.2: React Fundamentals

## Java Answer (Complete Runnable)

~~~java
/**
 * Lesson 7.2 - React Fundamentals
 *
 * Explains React component model, hooks, and one-way data flow
 * using Java-friendly analogies and code snippets.
 *
 * KEY TERMS:
 *   component   - a function that takes props and returns JSX (rendered HTML).
 *   props       - immutable input data passed to a component (like method params).
 *   state       - mutable data inside a component; change triggers re-render.
 *   hooks       - functions that add stateful behaviour to function components.
 *   JSX         - HTML-like syntax compiled to React.createElement() calls.
 *   virtual DOM - React's in-memory representation; diffs with real DOM.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 7.2: React Fundamentals ===\n");

        System.out.println("--- Component model ---");
        System.out.println("  // TypeScript React functional component:");
        System.out.println("  interface ButtonProps { label: string; onClick: () => void; disabled?: boolean; }");
        System.out.println("  const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => (");
        System.out.println("    <button onClick={onClick} disabled={disabled}>{label}</button>");
        System.out.println("  );");
        System.out.println("\n  // Java analogy: props = method params, return = rendered output");

        System.out.println("\n--- Core Hooks reference ---");
        String[][] hooks = {
            {"useState",    "Local mutable state; triggers re-render on change"},
            {"useEffect",   "Side-effects after render (fetch, subscriptions, timers)"},
            {"useContext",  "Read value from a context provider (global-ish state)"},
            {"useMemo",     "Memoize expensive computed values"},
            {"useCallback", "Memoize callback references (prevent unnecessary re-renders)"},
            {"useRef",      "Mutable ref that does NOT trigger re-render (DOM access, timers)"}
        };
        System.out.printf("  %-15s  %s%n", "Hook", "Purpose");
        System.out.println("  " + "-".repeat(60));
        for (String[] h : hooks) System.out.printf("  %-15s  %s%n", h[0], h[1]);

        System.out.println("\n--- One-way data flow ---");
        System.out.println("  Parent component (holds state)");
        System.out.println("    |-- props --> ChildA");
        System.out.println("    |-- props --> ChildB");
        System.out.println("                   |-- event callback --> Parent updates state");
        System.out.println("  State change triggers re-render from parent downward.");

        System.out.println("\n--- useState example ---");
        System.out.println("  const [count, setCount] = useState(0);");
        System.out.println("  // Java analogy: int count = 0; void setCount(int v) { count = v; repaint(); }");

        System.out.println("\n--- useEffect example ---");
        System.out.println("  useEffect(() => {");
        System.out.println("    fetch('/api/users').then(r => r.json()).then(setUsers);");
        System.out.println("    return () => controller.abort(); // cleanup on unmount");
        System.out.println("  }, []);  // [] = run once after first render");
    }
}
~~~
