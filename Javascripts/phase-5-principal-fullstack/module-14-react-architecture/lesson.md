# Module 14: React Architecture & Internals

## Why This Matters for Principal Interviews

Senior/principal engineers are expected to understand React *under the hood*, not just use hooks. Interviewers commonly ask:
- "How does React reconciliation work?"
- "When does React batch state updates?"
- "Why does `useEffect` run after paint? What runs synchronously?"
- "How would you implement a virtual DOM differ?"

## Topics

### 1. Virtual DOM & `createElement`
React's `createElement` returns a plain JS object called a Virtual DOM node (vnode).
```js
{ type: 'div', props: { className: 'box', children: [...] } }
```
Understanding this lets you reason about keys, reconciliation, and component trees.

### 2. Reconciliation: The Diff Algorithm
When state changes, React compares the old and new vnode trees. It applies three rules:
1. If types differ, unmount old + mount new
2. If types match, update props (DOM diffing)
3. Match children by `key` to preserve identity across reorders

### 3. `useState` / `useReducer` Pattern
Hooks maintain a per-component fiber-local state linked list. Understanding this explains:
- Why hooks can't be called conditionally
- How stale closures form in `useEffect`
- The relationship between renders and state queue

### 4. `useMemo` / `useCallback` / `React.memo`
Memoization prevents unnecessary recalculation or re-renders. Key tradeoff: memoization has overhead — only useful when the computation is significantly more expensive than the shallow-equality check.

### 5. `useEffect` Scheduling & Cleanup
- Runs *after* the browser has painted
- `useLayoutEffect` runs synchronously after DOM mutations (before paint)
- Cleanup function runs before next effect and on unmount — prevents memory leaks

### 6. Component Composition Patterns
- **Render Props**: Pass a function as a prop, called with shared data
- **HOC (Higher-Order Component)**: Wrap a component to inject props/behavior
- **Compound Components**: Parent shares state with child components via React Context

## Interview Drill Questions

- "Explain the React reconciliation algorithm and how keys are used."
- "What happens if you call `setState` inside `useEffect` without a dependency array?"
- "When would `useLayoutEffect` be preferable over `useEffect`?"
- "How would you prevent a child component from re-rendering when a parent updates?"
- "Explain the rules of hooks and why they exist."
- "What is concurrent mode and how does it differ from legacy rendering?"

## Assignment

Implement each concept in `starter/index.js`. Run with:
```powershell
node phase-5-principal-fullstack/module-14-react-architecture/solution/index.js
```
