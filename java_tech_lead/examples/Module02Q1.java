import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Module02Q1 {
    private static final Lock lockA = new ReentrantLock();
    private static final Lock lockB = new ReentrantLock();

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            lockA.lock();
            try {
                sleep(100);
                lockB.lock();
                try { System.out.println("t1 got both"); }
                finally { lockB.unlock(); }
            } finally { lockA.unlock(); }
        });

        Thread t2 = new Thread(() -> {
            // Acquire in same global order to avoid deadlock
            lockA.lock();
            try {
                lockB.lock();
                try { System.out.println("t2 got both"); }
                finally { lockB.unlock(); }
            } finally { lockA.unlock(); }
        });

        t1.start(); t2.start();
        t1.join(); t2.join();
    }

    private static void sleep(long ms){ try{ Thread.sleep(ms);}catch(InterruptedException ignored){} }
}
