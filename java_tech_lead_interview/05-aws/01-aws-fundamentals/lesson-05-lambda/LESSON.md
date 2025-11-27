# Lesson 05: Lambda

## 1. Learning Objectives
- Understand Lambda fundamentals
- Apply Lambda in aws scenarios
- Communicate trade-offs and best practices clearly

## 2. Why This Matters for a Java Tech Lead
A Tech Lead must evaluate, justify, and guide correct usage of Lambda ensuring reliability, performance, and maintainability across teams. Mastery enables mentoring and architectural judgment.

## 3. Core Theory
### 3.1 Key Concepts
This section presents the foundational concepts of lambda relevant to the aws domain.
- Managed service scope
- Cost and scaling levers
- Security and IAM integration points
- Operational best practices

### 3.2 Interview-Style Explanation
In interviews emphasize:
- Clarity of definition
- Production failure or success anecdote
- Trade-off awareness and when NOT to apply
- Performance or scalability angle

## 4. Code Examples
#### Example 1: S3 Upload (Java SDK v2)
```java
S3Client s3 = S3Client.builder().build();
s3.putObject(PutObjectRequest.builder()
    .bucket("my-bucket")
    .key("data.txt").build()
  , RequestBody.fromString("payload"));
```

#### Example 2: Minimal IAM Policy (JSON Fragment)
```json
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:PutObject"],"Resource":"arn:aws:s3:::my-bucket/*"}]}
```

#### Example 3: Terraform S3 Bucket
```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "my-logs-bucket"
  versioning { enabled = true }
}
```
Showcases infra as code repeatability.
Provide commentary explaining decisions, complexity, and alternatives.

## 5. Pitfalls and Best Practices
- Misunderstood concept boundary
- Common performance trap
- Incorrect assumption under load
- Testing oversight
- Security or reliability oversight
Guidance: Prefer measurable approaches, instrument early, document decisions.

## 6. Hands-On Exercises
### Exercise 1: S3 + IAM Setup
Define bucket, minimal write policy, upload object via SDK.
Acceptance: Object visible; least-privilege policy justification.

### Exercise 2: Terraform Module
Create reusable module for bucket with versioning toggle.
Acceptance: Plan/apply output shows controlled diff.

## 7. Interview Cheat Sheet
Definition: One-liner summarizing lambda.
When to Use: Ideal scenario conditions.
When to Avoid: Red flags and anti-pattern contexts.
Metrics: Observable indicators of success or failure.
Checklist: Design clarity, performance, testability, resilience.

## 8. Further Reading
- Official docs
- Authoritative spec or RFC
- High-quality blog deep dive
- Performance or scaling study
- Security considerations article
Select sources that reinforce depth beyond introductory tutorials.

