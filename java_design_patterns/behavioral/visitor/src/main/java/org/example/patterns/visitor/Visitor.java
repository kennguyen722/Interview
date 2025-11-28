package org.example.patterns.visitor;

public interface Visitor {
    void visit(Product product);
    void visit(Service service);
}
