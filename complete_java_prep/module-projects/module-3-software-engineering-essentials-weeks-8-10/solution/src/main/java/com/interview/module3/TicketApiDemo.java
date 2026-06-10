package com.interview.module3;

public class TicketApiDemo {

    public static void main(String[] args) {
        TicketService service = new TicketService();
        service.create(new CreateTicketRequest(
                "Payment timeout in checkout",
                "Timeout occurs when payment provider latency spikes above threshold",
                "high"
        ));

        System.out.println("Open tickets: " + service.list().size());
    }
}
