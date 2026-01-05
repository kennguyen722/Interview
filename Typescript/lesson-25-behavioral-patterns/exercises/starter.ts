// ============================================================================
// BEHAVIORAL DESIGN PATTERNS - EXERCISES
// ============================================================================

/**
 * EXERCISE 1: Strategy - Sorting Algorithms
 * 
 * Create sorting system with different algorithms:
 * - Algorithms: BubbleSort, QuickSort, MergeSort, HeapSort
 * - Support different data types with comparators
 * - Measure and compare performance
 * 
 * Requirements:
 * 1. Create SortStrategy interface
 * 2. Implement 4 sorting algorithms
 * 3. Create Sorter class that uses strategies
 * 4. Support custom comparators
 * 5. Add performance metrics
 * 6. Demonstrate with different array sizes
 * 7. Recommend best strategy based on data
 */

// TODO: Implement here

/**
 * EXERCISE 2: Observer - Stock Market System
 * 
 * Create real-time stock market monitoring system:
 * - Observers: MobileApp, WebDashboard, EmailAlerts, TradingBot
 * - Events: Price changes, volume changes, alerts triggered
 * - Support selective subscriptions (specific stocks)
 * 
 * Requirements:
 * 1. Create Stock (Subject) class
 * 2. Create 4 observer types
 * 3. Support subscribing to specific stocks
 * 4. Implement priority-based notifications
 * 5. Support observer unsubscription
 * 6. Handle observer errors gracefully
 * 7. Demonstrate real-time updates
 */

// TODO: Implement here

/**
 * EXERCISE 3: Command - Text Editor with Undo/Redo
 * 
 * Create text editor with command history:
 * - Commands: Insert, Delete, Replace, Format (bold, italic)
 * - Support unlimited undo/redo
 * - Support command macros (combine multiple commands)
 * - Save/load command history
 * 
 * Requirements:
 * 1. Create Command interface with execute/undo
 * 2. Implement 5+ text editing commands
 * 3. Create CommandHistory manager
 * 4. Implement undo/redo stacks
 * 5. Create macro commands
 * 6. Serialize/deserialize history
 * 7. Demonstrate complex editing workflows
 */

// TODO: Implement here

/**
 * EXERCISE 4: Chain of Responsibility - Request Processing Pipeline
 * 
 * Create HTTP request processing pipeline:
 * - Handlers: Authentication, Authorization, Validation, Rate Limiting, Logging, Compression
 * - Support short-circuiting on failure
 * - Support async handlers
 * - Collect metrics at each stage
 * 
 * Requirements:
 * 1. Create Handler interface with async handle()
 * 2. Implement 6 handlers
 * 3. Support handler chaining
 * 4. Allow handlers to modify request
 * 5. Support error responses
 * 6. Collect processing metrics
 * 7. Demonstrate various request scenarios
 */

// TODO: Implement here

/**
 * EXERCISE 5: State - Vending Machine
 * 
 * Create vending machine with complex states:
 * - States: Idle, HasCoin, Dispensing, OutOfStock, Maintenance
 * - Operations: insertCoin, selectProduct, dispense, refund, refill, maintenance
 * - Handle edge cases and invalid transitions
 * 
 * Requirements:
 * 1. Create State interface
 * 2. Implement 5 state classes
 * 3. Create VendingMachine context
 * 4. Manage product inventory
 * 5. Handle coin return
 * 6. Support maintenance mode
 * 7. Log all state transitions
 * 8. Reject invalid operations
 */

// TODO: Implement here

/**
 * EXERCISE 6: Mediator - Chat Room
 * 
 * Create chat application with mediator:
 * - Users can join/leave rooms
 * - Support private messages
 * - Support group messages
 * - Support user blocking
 * - Message history
 * 
 * Requirements:
 * 1. Create ChatMediator interface
 * 2. Implement ChatRoom mediator
 * 3. Create User class
 * 4. Support room operations (join, leave, send)
 * 5. Implement private messaging
 * 6. Support user blocking
 * 7. Maintain message history
 * 8. Demonstrate multi-room scenario
 */

// TODO: Implement here

/**
 * EXERCISE 7: Memento - Game Save System
 * 
 * Create game save/load system with memento:
 * - Save game state: player stats, inventory, position, quests
 * - Support multiple save slots
 * - Auto-save functionality
 * - Save compression
 * 
 * Requirements:
 * 1. Create GameState memento
 * 2. Create Game (originator)
 * 3. Create SaveManager (caretaker)
 * 4. Support multiple save slots
 * 5. Implement auto-save
 * 6. Compress save data
 * 7. Handle corrupted saves
 * 8. Demonstrate save/load/restore
 */

// TODO: Implement here

/**
 * EXERCISE 8: Iterator - Custom Collection with Multiple Iterators
 * 
 * Create playlist with different iteration strategies:
 * - Iterators: Sequential, Shuffle, Filter (by genre), Favorites only
 * - Support bidirectional iteration
 * - Support peek without advancing
 * 
 * Requirements:
 * 1. Create Iterator<T> interface
 * 2. Create Playlist collection
 * 3. Implement 4 iterator types
 * 4. Support bidirectional iteration
 * 5. Implement peek() method
 * 6. Support iterator reset
 * 7. Demonstrate different iteration patterns
 */

// TODO: Implement here

/**
 * EXERCISE 9: Template Method - Data Import Pipeline
 * 
 * Create data import system for different formats:
 * - Formats: CSV, JSON, XML, Excel
 * - Pipeline: Open → Validate → Transform → Import → Close
 * - Validation and transformation vary by format
 * 
 * Requirements:
 * 1. Create abstract DataImporter
 * 2. Define template method import()
 * 3. Implement 4 concrete importers
 * 4. Add hooks for optional steps
 * 5. Collect import statistics
 * 6. Handle errors at each step
 * 7. Demonstrate importing from all formats
 */

// TODO: Implement here

/**
 * EXERCISE 10: Visitor - Abstract Syntax Tree Evaluation
 * 
 * Create expression evaluator using visitor:
 * - Nodes: Number, Variable, Add, Subtract, Multiply, Divide
 * - Visitors: Evaluator, Printer, Optimizer, TypeChecker
 * 
 * Requirements:
 * 1. Create Expression interface with accept()
 * 2. Implement 6 expression types
 * 3. Create Visitor interface
 * 4. Implement 4 concrete visitors
 * 5. Build complex expression trees
 * 6. Evaluate expressions
 * 7. Pretty-print expressions
 * 8. Optimize constant expressions
 */

// TODO: Implement here

/**
 * BONUS EXERCISE 11: Combined Patterns - Event Sourcing System
 * 
 * Combine multiple behavioral patterns:
 * - Command: For operations
 * - Memento: For snapshots
 * - Observer: For event subscriptions
 * - Iterator: For event replay
 * 
 * Requirements:
 * 1. Store all changes as events (Command)
 * 2. Create snapshots periodically (Memento)
 * 3. Notify subscribers of events (Observer)
 * 4. Replay events from any point (Iterator)
 * 5. Reconstruct state from events
 * 6. Support time-travel debugging
 * 7. Demonstrate complete event sourcing workflow
 */

// TODO: Implement here

/**
 * BONUS EXERCISE 12: Strategy + State - Game AI System
 * 
 * Create game AI with states and strategies:
 * - States: Idle, Patrol, Chase, Attack, Flee
 * - Strategies: Aggressive, Defensive, Stealthy, Random
 * - Switch strategies based on state and conditions
 * 
 * Requirements:
 * 1. Implement State pattern for AI states
 * 2. Implement Strategy for behaviors within states
 * 3. Support state transitions
 * 4. Dynamic strategy selection
 * 5. Handle player detection
 * 6. Simulate AI decision-making
 */

// TODO: Implement here

// ============================================================================
// TESTING CHECKLIST
// ============================================================================

/*
For each exercise, verify:
✅ Pattern correctly implemented
✅ Behavior encapsulated properly
✅ Flexibility in algorithm/behavior selection
✅ Loose coupling between objects
✅ Open/Closed Principle followed
✅ Testability maintained
✅ Examples demonstrate value

Key checks:
- Strategy: Easy to swap algorithms
- Observer: Decoupled notification system
- Command: Undo/redo working correctly
- Chain of Responsibility: Request passed correctly
- State: Valid state transitions only
- Mediator: Centralized communication
- Memento: Encapsulation not violated
- Iterator: Multiple traversal methods
- Template Method: Common structure, varying steps
- Visitor: Adding operations without modifying classes
*/
