# Microservices Design Patterns

Core patterns for building scalable and maintainable microservices architecture.

## Examples Included

### Service Decomposition Strategies
- **File**: `Example_MicroservicesPatterns.java`
- **Topics**: Domain boundaries, service sizing, decomposition strategies

### Communication Patterns
- **File**: `Example_CommunicationPatterns.java`  
- **Topics**: Synchronous vs asynchronous, event-driven architecture

### Data Management Patterns
- **File**: `Example_DataPatterns.java`
- **Topics**: Database per service, eventual consistency, CQRS

### Cross-Cutting Concerns
- **File**: `Example_CrossCuttingConcerns.java`
- **Topics**: Configuration management, distributed logging, security

## Key Patterns

- **Database Per Service**: Independent data storage and schema evolution
- **API Gateway**: Single entry point for client requests
- **Circuit Breaker**: Preventing cascade failures in distributed systems
- **Event Sourcing**: Storing state changes as sequence of events
- **CQRS**: Separating read and write operations for scalability
- **Saga Pattern**: Managing distributed transactions across services