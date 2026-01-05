import React, { useState, createContext, useContext, ReactNode } from "react";

// Solution 1: Typed Select component
type SelectProps<T> = {
  options: T[];
  renderLabel: (item: T) => string;
  onSelect: (item: T) => void;
  selectedValue?: T;
};

function Select<T>({ options, renderLabel, onSelect, selectedValue }: SelectProps<T>) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {options.map((opt, idx) => (
        <li
          key={idx}
          onClick={() => onSelect(opt)}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: selectedValue === opt ? "#007bff" : "#f5f5f5",
            color: selectedValue === opt ? "white" : "black",
            marginBottom: "4px",
          }}
        >
          {renderLabel(opt)}
        </li>
      ))}
    </ul>
  );
}

// Test Select
interface Country {
  code: string;
  name: string;
}

function SelectExample() {
  const [selected, setSelected] = useState<Country | undefined>();
  const countries: Country[] = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "UK", name: "United Kingdom" },
  ];

  return (
    <div>
      <h3>Select a country:</h3>
      <Select<Country>
        options={countries}
        renderLabel={(c) => c.name}
        onSelect={setSelected}
        selectedValue={selected}
      />
      {selected && <p>Selected: {selected.name}</p>}
    </div>
  );
}

// Solution 2: LoadState union and rendering
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

interface Post {
  id: string;
  title: string;
  body: string;
}

function PostLoader() {
  const [state, setState] = useState<LoadState<Post>>({ status: "idle" });

  const loadPost = async (id: string) => {
    setState({ status: "loading" });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setState({
        status: "success",
        data: {
          id,
          title: "Understanding TypeScript",
          body: "TypeScript adds static typing to JavaScript...",
        },
      });
    } catch (err) {
      setState({
        status: "error",
        message: "Failed to load post",
      });
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", marginTop: "16px" }}>
      <h3>Post Loader</h3>
      <button onClick={() => loadPost("1")}>Load Post</button>

      {state.status === "idle" && <p>Click button to load...</p>}

      {state.status === "loading" && <p>⏳ Loading...</p>}

      {state.status === "success" && (
        <div style={{ backgroundColor: "#f0f0f0", padding: "12px" }}>
          <h4>{state.data.title}</h4>
          <p>{state.data.body}</p>
        </div>
      )}

      {state.status === "error" && <p style={{ color: "red" }}>❌ Error: {state.message}</p>}
    </div>
  );
}

// Solution 3: User context and hook
interface User {
  id: string;
  name: string;
}

const UserContext = createContext<User | null>(null);

function UserProvider({ children, user }: { children: ReactNode; user: User | null }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

function useUser(): User {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within UserProvider");
  }
  return user;
}

function UserProfile() {
  const user = useUser();
  return (
    <div style={{ border: "1px solid green", padding: "12px", marginTop: "16px" }}>
      <h3>User Profile</h3>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </div>
  );
}

function UserExample() {
  const currentUser: User = { id: "user-123", name: "Ada Lovelace" };

  return (
    <UserProvider user={currentUser}>
      <UserProfile />
    </UserProvider>
  );
}

export { Select, SelectExample, LoadState, PostLoader, UserProvider, useUser, UserProfile, UserExample };
