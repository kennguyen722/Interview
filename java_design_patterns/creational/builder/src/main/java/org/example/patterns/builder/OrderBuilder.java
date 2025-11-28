package org.example.patterns.builder;

import java.util.ArrayList;
import java.util.List;

public class OrderBuilder {
    private String id;
    private final List<String> items = new ArrayList<>();
    private double discount;

    public static OrderBuilder create() { return new OrderBuilder(); }
    public OrderBuilder id(String id) { this.id = id; return this; }
    public OrderBuilder addItem(String item) { this.items.add(item); return this; }
    public OrderBuilder discount(double percent) { this.discount = percent; return this; }
    public Order build() {
        double total = items.size() * 10.0; // placeholder pricing
        double discountAmt = total * (discount/100.0);
        return new Order(id, items, total, discountAmt);
    }
}
