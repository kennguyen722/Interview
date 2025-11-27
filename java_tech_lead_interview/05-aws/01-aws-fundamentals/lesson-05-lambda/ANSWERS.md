## Q1 Answer
Lambda + S3 event or SQS triggers suit image processing elasticity.
## Q2 Answer
Break down by storage class, request type, data transfer, replication.
## Q3 Answer
Principle: grant minimal actions (CRUD narrow) to role; avoid wildcard resources.
## Q4 Answer
Track request latency or queue length besides CPU for scaling accuracy.
## Q5 Answer
Place public services in public subnets; private resources behind NAT & security groups.
## Q6 Answer
Use provisioned concurrency or keep warm strategy for critical Lambdas.
## Q7 Answer
Low utilization metrics indicate oversize; right-size or switch storage engine tier.
## Q8 Answer
Use CloudFront CDN + compression & appropriate caching headers.

