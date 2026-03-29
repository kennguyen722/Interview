# Mock 04: Interviewer Rubric (Hidden)

Total: 100 points

- Canonical modeling and normalization: 25
- Reconciliation and dedupe correctness: 35
- Conflict tracking and report accuracy: 20
- Complexity and senior tradeoff reasoning: 20

## Canonical modeling and normalization (25)

- Correct mapping from both schemas (12)
- Validation and clear error handling (8)
- Stable canonical type structure (5)

## Reconciliation and dedupe correctness (35)

- Correct business-key dedupe behavior (15)
- Correct handling of near-equal conversion values (8)
- Correct partner source aggregation (6)
- Correct suppression counting (6)

## Conflict tracking and report accuracy (20)

- Tracks schema errors and mismatch conflicts (8)
- Returns accurate campaign-level windowed metrics (8)
- Handles empty windows and no-data cases (4)

## Complexity and senior tradeoff reasoning (20)

- Data structures chosen intentionally (8)
- Explains eventual consistency/replay implications (6)
- Discusses quality scoring and governance path (6)

## Follow-up probes

1. How would you reconcile late-arriving events after report publication?
2. How would you reprocess one partner feed without duplicating data?
3. What controls prevent bad partner payloads from polluting reports?
