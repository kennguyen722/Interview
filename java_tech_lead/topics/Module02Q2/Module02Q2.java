import java.util.concurrent.*;

public class Module02Q2 {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService svc = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 6; i++) {
            final int id = i;
            svc.submit(() -> {
                System.out.println("Task " + id + " running on " + Thread.currentThread().getName());
                sleep(200);
            });
        }
        svc.shutdown();
        svc.awaitTermination(1, TimeUnit.SECONDS);
    }

    private static void sleep(long ms){ try{ Thread.sleep(ms);}catch(InterruptedException ignored){} }
}
