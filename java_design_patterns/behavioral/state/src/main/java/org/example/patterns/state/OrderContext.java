package org.example.patterns.state;

public class OrderContext {
    private OrderState state = new CreatedState();

    void setState(OrderState state) { this.state = state; }
    public String getState() { return state.name(); }

    public void pay() { state.pay(this); }
    public void ship() { state.ship(this); }
    public void deliver() { state.deliver(this); }
}
