# Module Project - Module 5: Data Layer and Messaging (Weeks 15-16)

This module now contains a production-grade backend baseline for lessons 5.1 through 5.4.

## Start Here

- Solution project: [solution/README.md](./solution/README.md)
- Evaluation rubric: [RUBRIC.md](./RUBRIC.md)

## What Is Implemented

- PostgreSQL relational schema and indexed reporting queries
- Redis cache-aside read optimization for order lookups
- MongoDB audit projection storage
- RabbitMQ event publishing and consumption with DLQ topology
- Validation, structured API error responses, and tests

## Intended Learning Flow

1. Lesson 5.1: inspect SQL schema, indexes, and native report query.
2. Lesson 5.2: validate Redis cache behavior on repeated order reads.
3. Lesson 5.3: inspect Mongo `order_audit` projection records.
4. Lesson 5.4: trace event flow producer -> queue -> consumer -> Mongo.
