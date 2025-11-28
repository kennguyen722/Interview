package org.example.patterns.visitor;

public class Service implements Element {
    public final String name;
    public final double hourlyRate;
    public Service(String name, double hourlyRate) { this.name = name; this.hourlyRate = hourlyRate; }
    @Override public void accept(Visitor visitor) { visitor.visit(this); }
}
