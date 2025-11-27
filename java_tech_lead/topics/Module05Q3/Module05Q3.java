import java.util.concurrent.*;

public class Module05Q3 {
    static class Worker implements Callable<String> { public String call(){ return "ok"; } }

    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        Future<String> f1 = pool.submit(new Worker());
        Future<String> f2 = pool.submit(new Worker());
        System.out.println(f1.get());
        System.out.println(f2.get());
        pool.shutdown();
    }
}
