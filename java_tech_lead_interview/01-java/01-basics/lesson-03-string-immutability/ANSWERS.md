# Answers: String Immutability
1. Security (no tampering), pooling/caching, thread-safety, stable hashing.
2. `==` checks reference identity; `.equals` checks content.
3. Avoids creation of many temporary intermediate String objects.
4. Adds string to pool (or returns existing pooled instance).
5. Rare; only when thread-safe mutable builder required (legacy). Prefer `StringBuilder` otherwise.
