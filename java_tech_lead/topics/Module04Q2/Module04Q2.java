public class Module04Q2 {
    public static void main(String[] args) {
        int attempts = 0;
        while (attempts < 5) {
            try {
                attempts++;
                unreliable();
                System.out.println("Succeeded on attempt " + attempts);
                break;
            } catch (RuntimeException e) {
                System.out.println("Attempt " + attempts + " failed: " + e.getMessage());
                backoff(attempts);
            }
        }
    }

    static void unreliable() {
        if (Math.random() < 0.7) throw new RuntimeException("transient");
    }

    static void backoff(int attempts) {
        try { Thread.sleep(100L * attempts); } catch (InterruptedException ignored) {}
    }
}
