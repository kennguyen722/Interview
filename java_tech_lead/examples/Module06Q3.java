public class Module06Q3 {
    public static void main(String[] args) {
        // warm-up
        for (int i = 0; i < 100_000; i++) doWork();
        long t = System.nanoTime();
        for (int i = 0; i < 1_000_000; i++) doWork();
        long dt = System.nanoTime() - t;
        System.out.println("avg ns/op=" + (dt / 1_000_000.0));
    }

    static int doWork() { return (int)(Math.random()*100); }
}
