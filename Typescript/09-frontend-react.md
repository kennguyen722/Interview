# Lesson 09: React with TypeScript

## Goals
- Type props, state, and events.
- Use generics with hooks and components.
- Model component states with discriminated unions.

## Props and state
```tsx
import { useState } from "react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export function Button({ label, onClick }: ButtonProps) {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => { setCount(c => c + 1); onClick?.(); }}>
      {label} ({count})
    </button>
  );
}
```

## Event types
```tsx
function InputExample() {
  const [value, setValue] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  return <input value={value} onChange={onChange} />;
}
```

## Generics with components
```tsx
type SelectProps<T> = {
  options: T[];
  renderLabel: (item: T) => string;
  onSelect: (item: T) => void;
};

function Select<T>({ options, renderLabel, onSelect }: SelectProps<T>) {
  return (
    <ul>
      {options.map((opt, idx) => (
        <li key={idx} onClick={() => onSelect(opt)}>{renderLabel(opt)}</li>
      ))}
    </ul>
  );
}
```

## Context typing
```tsx
type Theme = "light" | "dark";
const ThemeContext = React.createContext<Theme>("light");
```
Provide default and wrap with provider for safety.

## Discriminated UI states
```ts
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```
Use in components to render per-state UI.

## Forms and validation
- Prefer controlled components, type events.
- Pair with zod/yup for runtime validation and inferred types.

## Exercises
- Build a typed `Select` component for string options and ensure `onSelect` receives the right type.
- Model a fetch state with the `LoadState` union and render different UI branches.
- Add context for current user with `{ id: string; name: string }` and consume it in a child component.
