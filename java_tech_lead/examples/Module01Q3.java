public class Module01Q3 {
    static volatile boolean ready = false;
    static int number = 0;

    public static void main(String[] args) throws InterruptedException {
        Thread writer = new Thread(() -> {
            number = 42;
            ready = true; // volatile write
        });

        Thread reader = new Thread(() -> {
            if (ready) { // volatile read
                System.out.println("number=" + number);
            } else {
                System.out.println("not ready yet");
            }
        });

        writer.start();
        writer.join();
        reader.start();
        reader.join();
    }
}
