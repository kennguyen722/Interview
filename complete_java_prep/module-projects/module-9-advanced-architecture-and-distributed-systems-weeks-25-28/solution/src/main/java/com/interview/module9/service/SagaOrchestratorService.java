package com.interview.module9.service;

import com.interview.module9.api.dto.CreateOrderRequest;
import com.interview.module9.domain.OrderAggregate;
import com.interview.module9.domain.OutboxEvent;
import com.interview.module9.exception.DomainException;
import com.interview.module9.repository.InMemoryOrderRepository;
import com.interview.module9.repository.InMemoryOutboxRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class SagaOrchestratorService {

    private final InMemoryOrderRepository orderRepository;
    private final InMemoryOutboxRepository outboxRepository;
    private final InventoryClient inventoryClient;
    private final PaymentClient paymentClient;

    public SagaOrchestratorService(InMemoryOrderRepository orderRepository,
                                   InMemoryOutboxRepository outboxRepository,
                                   InventoryClient inventoryClient,
                                   PaymentClient paymentClient) {
        this.orderRepository = orderRepository;
        this.outboxRepository = outboxRepository;
        this.inventoryClient = inventoryClient;
        this.paymentClient = paymentClient;
    }

    public OrderAggregate createOrder(CreateOrderRequest request) {
        UUID orderId = UUID.randomUUID();
        OrderAggregate order = new OrderAggregate(orderId, request.customerId(), request.sku(), request.quantity(), request.totalAmount());
        orderRepository.save(order);

        String inventoryReservation = null;
        String paymentReference = null;

        try {
            inventoryReservation = inventoryClient.reserve(request.sku(), request.quantity());
            paymentReference = paymentClient.charge(request.customerId(), request.totalAmount());
            order.confirm();
            orderRepository.save(order);
            publishOutbox("ORDER_CONFIRMED", orderId, Map.of(
                    "inventoryReservation", inventoryReservation,
                    "paymentReference", paymentReference
            ));
            return order;
        } catch (DomainException ex) {
            if (paymentReference != null) {
                paymentClient.refund(paymentReference);
            }
            if (inventoryReservation != null) {
                inventoryClient.release(inventoryReservation);
            }
            order.fail(ex.getMessage());
            orderRepository.save(order);
            publishOutbox("ORDER_FAILED", orderId, Map.of("reason", ex.getMessage()));
            return order;
        }
    }

    private void publishOutbox(String eventType, UUID aggregateId, Map<String, Object> payload) {
        Map<String, Object> merged = new HashMap<>(payload);
        merged.put("aggregateId", aggregateId);
        outboxRepository.save(new OutboxEvent(UUID.randomUUID(), eventType, aggregateId, Instant.now(), merged));
    }
}
