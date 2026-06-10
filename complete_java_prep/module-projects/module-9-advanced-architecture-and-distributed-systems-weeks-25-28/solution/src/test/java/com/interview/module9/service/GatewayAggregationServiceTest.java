package com.interview.module9.service;

import com.interview.module9.api.dto.CreateOrderRequest;
import com.interview.module9.api.dto.CustomerOverviewResponse;
import com.interview.module9.repository.InMemoryOrderRepository;
import com.interview.module9.repository.InMemoryOutboxRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GatewayAggregationServiceTest {

    @Test
    void shouldAggregateCustomerOrderSummary() {
        InMemoryOrderRepository orderRepository = new InMemoryOrderRepository();
        SagaOrchestratorService saga = new SagaOrchestratorService(
                orderRepository,
                new InMemoryOutboxRepository(),
                new InventoryClient(),
                new PaymentClient()
        );
        GatewayAggregationService gateway = new GatewayAggregationService(orderRepository);

        saga.createOrder(new CreateOrderRequest(101L, "sku-1", 1, BigDecimal.valueOf(15)));
        saga.createOrder(new CreateOrderRequest(101L, "out-of-stock-2", 1, BigDecimal.valueOf(15)));

        CustomerOverviewResponse overview = gateway.buildCustomerOverview(101L);

        assertEquals(2, overview.totalOrders());
        assertEquals(1, overview.confirmedOrders());
        assertEquals(1, overview.failedOrders());
    }
}
