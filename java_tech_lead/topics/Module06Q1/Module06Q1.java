public class Module06Q1 {
    public static void main(String[] args) {
        // naive heavy work
        long t1 = System.currentTimeMillis();
        long sum = 0;
        for (int i = 0; i < 10_000_000; i++) sum += i % 10;
        long t2 = System.currentTimeMillis();
        System.out.println("naive time=" + (t2-t1));

        // small optimization (avoid modulo in loop)
        t1 = System.currentTimeMillis();
        sum = 0;
        for (int i = 0; i < 10_000_000; i++) {
            int v = i - (i/10)*10; // equivalent but still example only
            sum += v;
        }
        t2 = System.currentTimeMillis();
        System.out.println("opt time=" + (t2-t1));
    }
}
