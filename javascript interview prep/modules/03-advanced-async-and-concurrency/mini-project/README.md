# Mini-Project: Resilient Ingestion Pipeline

## Scenario
You own a Node.js ingestion worker that reads newline-delimited events, processes them with bounded concurrency, and writes normalized JSONL output. The pipeline must honor backpressure and cancellation.

## Goals
- Practice Node streams basics.
- Implement backpressure-safe writing.
- Use abort signals for cancellation.
- Use concurrency controls for async processing.

## Tasks
1. Build line parser transform stream.
2. Build bounded async map runner.
3. Build abort-aware line ingestion function.
4. Build backpressure-safe JSONL writer.

## Files
- starter/index.js
- solution/index.js
- tests/mini-project-03.test.js
