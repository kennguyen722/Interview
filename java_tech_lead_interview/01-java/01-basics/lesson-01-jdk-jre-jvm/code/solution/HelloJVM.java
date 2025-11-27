public class HelloJVM {
    public static void main(String[] args) {
        long start = System.nanoTime();
        System.out.println("Hello from solution - JDK/JRE/JVM demo");
        long elapsedMicros = (System.nanoTime() - start) / 1_000;
        System.out.println("Elapsed(us): " + elapsedMicros);
    }
}
