package org.example.patterns.visitor;

public class DiscountVisitor implements Visitor {
    @Override public void visit(Product product) {
        double discount = product.price * 0.05;
        System.out.println("Discount on product " + product.name + ": " + discount);
    }
    @Override public void visit(Service service) {
        double discount = service.hourlyRate * 0.1;
        System.out.println("Discount on service " + service.name + ": " + discount);
    }
}
