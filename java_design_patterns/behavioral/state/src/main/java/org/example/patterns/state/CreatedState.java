package org.example.patterns.state;

public class CreatedState implements OrderState {
    @Override public void pay(OrderContext ctx) { ctx.setState(new PaidState()); }
    @Override public void ship(OrderContext ctx) { throw new IllegalStateException("Must pay first"); }
    @Override public void deliver(OrderContext ctx) { throw new IllegalStateException("Must ship first"); }
    @Override public String name() { return "CREATED"; }
}
