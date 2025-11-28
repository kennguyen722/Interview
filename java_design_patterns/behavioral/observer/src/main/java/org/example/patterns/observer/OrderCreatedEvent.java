package org.example.patterns.observer;

public class OrderCreatedEvent implements Event {
    private final String orderId;
    public OrderCreatedEvent(String orderId) { this.orderId = orderId; }
    public String orderId() { return orderId; }
    @Override public String toString() { return "OrderCreated(" + orderId + ")"; }
}
