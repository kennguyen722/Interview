import java.util.function.*;public class FunctionalDemo { public static void main(String[] a){ Supplier<String> s=()->"ok"; System.out.println(s.get()); }}
