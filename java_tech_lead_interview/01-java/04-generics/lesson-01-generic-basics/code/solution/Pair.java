public record Pair<T,U>(T first, U second) { public static <A,B> Pair<A,B> of(A a,B b){ return new Pair<>(a,b);} }
