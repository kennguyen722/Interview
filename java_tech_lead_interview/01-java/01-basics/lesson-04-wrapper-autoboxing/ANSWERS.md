# Answers: Wrapper & Autoboxing
1. To allow primitives in generics/collections and provide nullability & utility methods.
2. Autoboxing: automatic primitive->wrapper conversion. Unboxing: wrapper->primitive extraction.
3. -128..127; historical performance benefit and common small numbers.
4. Each iteration may allocate wrapper objects & trigger GC; increases indirection.
5. Use null check `(x==null?default:x)` or `Optional.ofNullable(x).orElse(default)`.
