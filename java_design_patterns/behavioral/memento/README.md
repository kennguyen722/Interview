# Memento Pattern (Behavioral)

## Intent
- Capture and externalize an object’s internal state so that it can be restored later.

## Motivation
- `TextEditor` saves `TextSnapshot` mementos to restore previous content.

## Structure
- Originator: `TextEditor`
- Memento: `TextSnapshot`
- Caretaker: (client maintaining snapshots)

## Usage
- Create snapshots before changes; restore when needed.

## Example
```java
TextEditor editor = new TextEditor();
TextSnapshot snap = editor.save();
editor.type("Hello");
editor.restore(snap);
```

## Pros/Cons
- Pros: Encapsulates state; supports undo.
- Cons: Memory overhead for snapshots.

## When to Use
- Undo/redo, transactional state changes.
