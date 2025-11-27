# Answers: Stack vs Heap
1. Method call frames: parameters, local primitives/references, return addresses.
2. When no live references from roots (stack, static, JNI) reach it.
3. Simple pointer movement; no headers; no GC bookkeeping.
4. JIT determines if object escapes its scope; if not, can allocate on stack or eliminate.
5. Convert recursion to iteration or increase stack size (only if safe); refactor algorithm.
