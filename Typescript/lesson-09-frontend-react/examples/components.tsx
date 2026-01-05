// Example 1: Typed React components with Props
import React, { useState, ReactNode } from "react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

function Button({ label, onClick, disabled = false, variant = "primary" }: ButtonProps) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1);
    onClick?.();
  };

  return (
    <button onClick={handleClick} disabled={disabled} className={variant}>
      {label} ({count})
    </button>
  );
}

// Example 2: Event typing
function InputExample() {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return <input value={value} onChange={handleChange} placeholder="Type here..." />;
}

// Example 3: Generic components
type SelectProps<T> = {
  options: T[];
  renderLabel: (item: T) => string;
  onSelect: (item: T) => void;
  selectedValue?: T;
};

function Select<T>({ options, renderLabel, onSelect, selectedValue }: SelectProps<T>) {
  return (
    <div>
      {options.map((opt, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(opt)}
          style={{
            padding: "8px",
            cursor: "pointer",
            backgroundColor: selectedValue === opt ? "lightblue" : "transparent",
          }}
        >
          {renderLabel(opt)}
        </div>
      ))}
    </div>
  );
}

// Example 4: Discriminated union state
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

type User = { id: string; name: string; email: string };

function UserLoader() {
  const [state, setState] = useState<LoadState<User>>({ status: "idle" });

  const fetchUser = async (id: string) => {
    setState({ status: "loading" });
    try {
      // Simulated fetch
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setState({
        status: "success",
        data: { id, name: "Ada Lovelace", email: "ada@example.com" },
      });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <div>
      <button onClick={() => fetchUser("123")}>Load User</button>
      {state.status === "idle" && <p>Click to load user</p>}
      {state.status === "loading" && <p>Loading...</p>}
      {state.status === "success" && (
        <div>
          <p>Name: {state.data.name}</p>
          <p>Email: {state.data.email}</p>
        </div>
      )}
      {state.status === "error" && <p>Error: {state.message}</p>}
    </div>
  );
}

// Example 5: Context with types
type Theme = "light" | "dark";

const ThemeContext = React.createContext<Theme>("light");

function ThemeProvider({ children, initialTheme = "light" }: { children: ReactNode; initialTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

function useTheme(): Theme {
  const theme = React.useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return theme;
}

// Example 6: Form with validation
type FormData = {
  name: string;
  email: string;
  age: number;
};

function FormExample() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", age: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) : value,
    }));
  };

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
      <input name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" />
    </form>
  );
}

export { Button, InputExample, Select, UserLoader, ThemeProvider, useTheme, FormExample, LoadState, User };
