package com.interview.module9.api.dto;

import com.interview.module9.domain.OrderAggregate;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderResponse(
        UUID orderId,
        long customerId,
        String sku,
        int quantity,
        BigDecimal totalAmount,
        String status,
        String failureReason,
        Instant createdAt
) {
    public static OrderResponse from(OrderAggregate order) {
        return new OrderResponse(
                order.getOrderId(),
                order.getCustomerId(),
                order.getSku(),
                order.getQuantity(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getFailureReason(),
                order.getCreatedAt()
        );
    }
}
