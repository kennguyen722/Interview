Module 9 — Security & Reliability

Q1: How do you secure a microservice API?
Answer: Use TLS, authenticate requests (OAuth/OIDC or mutual TLS), enforce authorization checks, validate inputs, use rate-limiting, and apply least privilege for secrets and access.

Example: `examples/Module09Q1.java` demonstrates input validation.

Q2: How to design for reliability and incident response?
Answer: Define SLOs/SLIs, monitoring and alerting, runbooks, automated health checks, canary/gradual rollouts, and chaos engineering to test resilience.

Example: `examples/Module09Q2.java` shows a basic health check pattern.

Q3: What is defense-in-depth in system design?
Answer: Multiple layers of controls — network segmentation, authentication, authorization, input sanitization, monitoring, and backup/restore strategies.

Example: `examples/Module09Q3.java` sketches layered checks.
