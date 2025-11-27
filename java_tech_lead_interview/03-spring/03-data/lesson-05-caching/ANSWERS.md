## Q1 Answer
Use @PostConstruct/@PreDestroy for lifecycle hooks; @Bean initMethod also possible—pick clarity and testability.
## Q2 Answer
Inspect transaction boundaries + fetch strategy; likely lazy collection accessed outside transactional scope.
## Q3 Answer
Trim auto-config (exclude starters), enable lazy init selectively, profile classpath scanning.
## Q4 Answer
Field injection harms immutability/testability; prefer constructor injection for explicit dependencies.
## Q5 Answer
Raw passwords risk memory dump exposure; hash + salt immediately and minimize retention.
## Q6 Answer
Externalize secrets via config server / vault; never embed prod creds; use profile-specific properties.
## Q7 Answer
Circular reference comes from mutually dependent beans; break via interface, event, or refactor layering.
## Q8 Answer
Use batching with JdbcTemplate or saveAll; tune flush size and disable unnecessary listeners.

