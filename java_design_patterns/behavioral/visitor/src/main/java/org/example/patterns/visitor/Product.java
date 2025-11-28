package org.example.patterns.visitor;

public class Product implements Element {
    public final String name;
    public final double price;
    public Product(String name, double price) { this.name = name; this.price = price; }
    @Override public void accept(Visitor visitor) { visitor.visit(this); }
}
