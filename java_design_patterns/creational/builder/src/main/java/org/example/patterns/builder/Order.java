package org.example.patterns.builder;

import java.util.Collections;
import java.util.List;

public final class Order {
    private final String id;
    private final List<String> items;
    private final double total;
    private final double discount;

    Order(String id, List<String> items, double total, double discount) {
        this.id = id; this.items = List.copyOf(items); this.total = total; this.discount = discount;
    }
    public String id() { return id; }
    public List<String> items() { return Collections.unmodifiableList(items); }
    public double total() { return total; }
    public double discount() { return discount; }
}
