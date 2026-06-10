package com.interview.module5.order;

import java.math.BigDecimal;

public record TopCustomerResponse(
    Long customerId,
    String customerName,
    String customerEmail,
    BigDecimal totalSpent,
    Long orderCount
) {
    public static TopCustomerResponse from(TopCustomerReport report) {
        return new TopCustomerResponse(
            report.getCustomerId(),
            report.getCustomerName(),
            report.getCustomerEmail(),
            report.getTotalSpent(),
            report.getOrderCount()
        );
    }
}
