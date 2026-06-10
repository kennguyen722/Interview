# Answer Code Sample - Lesson 5.4: Event-Driven Architecture Basics

## Java Answer (Complete Runnable)

~~~java
import java.util.ArrayDeque;
import java.util.Queue;

public class AnswerApp {
    record Event(String id, String type, int attempts) {}

    public static void main(String[] args) {
        Queue<Event> broker = new ArrayDeque<>();
        Queue<Event> dlq = new ArrayDeque<>();

        broker.add(new Event("e-1", "ORDER_CREATED", 0));
        broker.add(new Event("e-2", "PAYMENT_FAILED", 0));

        while (!broker.isEmpty()) {
            Event event = broker.poll();
            boolean handled = process(event);

            if (!handled) {
                Event retry = new Event(event.id(), event.type(), event.attempts() + 1);
                if (retry.attempts() >= 3) {
                    dlq.add(retry);
                } else {
                    broker.add(retry);
                }
            }
        }

        System.out.println("Lesson 5.4 - Event processing with retries + DLQ");
        System.out.println("DLQ size: " + dlq.size());
    }

    private static boolean process(Event event) {
        if ("PAYMENT_FAILED".equals(event.type())) {
            System.out.println("Transient failure on " + event.id() + " attempt=" + event.attempts());
            return false;
        }
        System.out.println("Handled event: " + event.id() + " type=" + event.type());
        return true;
    }
}

~~~
