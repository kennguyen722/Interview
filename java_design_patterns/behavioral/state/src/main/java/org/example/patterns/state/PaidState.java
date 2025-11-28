package org.example.patterns.state;

public class PaidState implements OrderState {
    @Override public void pay(OrderContext ctx) { /* already paid */ }
    @Override public void ship(OrderContext ctx) { ctx.setState(new ShippedState()); }
    @Override public void deliver(OrderContext ctx) { throw new IllegalStateException("Must ship first"); }
    @Override public String name() { return "PAID"; }
}
