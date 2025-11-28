package org.example.patterns.state;

public class DeliveredState implements OrderState {
    @Override public void pay(OrderContext ctx) { /* noop */ }
    @Override public void ship(OrderContext ctx) { /* noop */ }
    @Override public void deliver(OrderContext ctx) { /* noop */ }
    @Override public String name() { return "DELIVERED"; }
}
