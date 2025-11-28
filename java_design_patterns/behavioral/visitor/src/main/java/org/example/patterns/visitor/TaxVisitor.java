package org.example.patterns.visitor;

public class TaxVisitor implements Visitor {
    @Override public void visit(Product product) {
        double tax = product.price * 0.1;
        System.out.println("Tax on product " + product.name + ": " + tax);
    }
    @Override public void visit(Service service) {
        double tax = service.hourlyRate * 0.15;
        System.out.println("Tax on service " + service.name + ": " + tax);
    }
}
