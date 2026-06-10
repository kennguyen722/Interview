package com.interview.module9.service;

import com.interview.module9.api.dto.CreateOrderRequest;
import com.interview.module9.domain.OrderAggregate;
import com.interview.module9.domain.OrderStatus;
import com.interview.module9.repository.InMemoryOrderRepository;
import com.interview.module9.repository.InMemoryOutboxRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SagaOrchestratorServiceTest {

    @Test
    void shouldConfirmOrderWhenDependenciesSucceed() {
        SagaOrchestratorService service = new SagaOrchestratorService(
                new InMemoryOrderRepository(),
                new InMemoryOutboxRepository(),
                new InventoryClient(),
                new PaymentClient()
        );

        OrderAggregate order = service.createOrder(new CreateOrderRequest(42L, "sku-1", 2, BigDecimal.valueOf(49.99)));

        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
    }

    @Test
    void shouldFailOrderWhenInventoryFails() {
        SagaOrchestratorService service = new SagaOrchestratorService(
                new InMemoryOrderRepository(),
                new InMemoryOutboxRepository(),
                new InventoryClient(),
                new PaymentClient()
        );

        OrderAggregate order = service.createOrder(new CreateOrderRequest(42L, "out-of-stock-1", 2, BigDecimal.valueOf(49.99)));

        assertEquals(OrderStatus.FAILED, order.getStatus());
    }
}
