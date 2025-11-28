package org.example.patterns.state;

public class ShippedState implements OrderState {
    @Override public void pay(OrderContext ctx) { /* already paid */ }
    @Override public void ship(OrderContext ctx) { /* already shipped */ }
    @Override public void deliver(OrderContext ctx) { ctx.setState(new DeliveredState()); }
    @Override public String name() { return "SHIPPED"; }
}
