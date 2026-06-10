package com.interview.module5.order;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderCreatedEvent(
    Long orderId,
    Long customerId,
    String referenceCode,
    String status,
    BigDecimal totalAmount,
    Instant eventAt
) {
}
