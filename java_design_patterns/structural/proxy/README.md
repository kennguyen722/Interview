# Proxy Pattern (Structural)

## Intent
- Provide a surrogate or placeholder for another object to control access.

## Motivation
- `LoggingProxy` wraps `RealService` to add logging without changing service.

## Structure
- Subject: `Service`
- Real Subject: `RealService`
- Proxy: `LoggingProxy`

## Usage
- Clients use the proxy like the real object.

## Example
```java
Service svc = new LoggingProxy(new RealService());
String result = svc.execute("data");
```

## Pros/Cons
- Pros: Access control, lazy init, monitoring.
- Cons: Indirection overhead; need to mirror interface.

## When to Use
- Remote proxies, virtual proxies, protection proxies, or logging/metrics.
