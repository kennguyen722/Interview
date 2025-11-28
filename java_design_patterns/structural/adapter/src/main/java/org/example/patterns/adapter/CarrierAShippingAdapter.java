package org.example.patterns.adapter;

public class CarrierAShippingAdapter implements ShippingService {
    private final LegacyCarrierA adaptee = new LegacyCarrierA();
    @Override public String createShipment(String orderId) { return adaptee.makeLabel(orderId); }
}
