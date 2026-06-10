package com.interview.module9.api.dto;

import java.util.List;

public record CustomerOverviewResponse(
        long customerId,
        int totalOrders,
        int confirmedOrders,
        int failedOrders,
        List<OrderResponse> recentOrders
) {
}
