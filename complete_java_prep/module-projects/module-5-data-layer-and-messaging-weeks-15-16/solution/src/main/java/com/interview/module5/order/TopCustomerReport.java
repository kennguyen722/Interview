package com.interview.module5.order;

import java.math.BigDecimal;

public interface TopCustomerReport {
    Long getCustomerId();
    String getCustomerName();
    String getCustomerEmail();
    BigDecimal getTotalSpent();
    Long getOrderCount();
}
