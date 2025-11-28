# Command Pattern (Behavioral)

## Intent
- Encapsulate a request as an object, thereby letting you parameterize clients with queues, requests, and operations.

## Motivation
- `InsertTextCommand` operates on a `Document` and supports undo via `CommandHistory`.

## Structure
- Command: `Command`
- Concrete Command: `InsertTextCommand`
- Receiver: `Document`
- Invoker: (client using `CommandHistory`)

## Usage
- Create commands with receiver references; execute and record for undo/redo.

## Example
```java
Command cmd = new InsertTextCommand(doc, 0, "Hello");
cmd.execute();
history.push(cmd);
```

## Pros/Cons
- Pros: Decouples sender from receiver; supports undo/redo and macro.
- Cons: More classes; can add indirection.

## When to Use
- Menu actions, transactional operations, job queues.