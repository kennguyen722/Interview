package com.interview.module5.order;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderResponse(
    Long id,
    Long customerId,
    String customerName,
    String referenceCode,
    OrderStatus status,
    BigDecimal totalAmount,
    Instant createdAt
) {
    public static OrderResponse from(PurchaseOrder order) {
        return new OrderResponse(
            order.getId(),
            order.getCustomer().getId(),
            order.getCustomer().getName(),
            order.getReferenceCode(),
            order.getStatus(),
            order.getTotalAmount(),
            order.getCreatedAt()
        );
    }
}
