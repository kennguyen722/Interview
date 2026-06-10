package com.interview.module9.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class OrderAggregate {

    private final UUID orderId;
    private final long customerId;
    private final String sku;
    private final int quantity;
    private final BigDecimal totalAmount;
    private final Instant createdAt;
    private OrderStatus status;
    private String failureReason;

    public OrderAggregate(UUID orderId, long customerId, String sku, int quantity, BigDecimal totalAmount) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.sku = sku;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.createdAt = Instant.now();
        this.status = OrderStatus.PENDING;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public long getCustomerId() {
        return customerId;
    }

    public String getSku() {
        return sku;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void confirm() {
        this.status = OrderStatus.CONFIRMED;
        this.failureReason = null;
    }

    public void fail(String reason) {
        this.status = OrderStatus.FAILED;
        this.failureReason = reason;
    }
}
