package com.interview.module9.service;

import com.interview.module9.domain.OrderAggregate;
import com.interview.module9.exception.DomainException;
import com.interview.module9.repository.InMemoryOrderRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OrderQueryService {

    private final InMemoryOrderRepository orderRepository;

    public OrderQueryService(InMemoryOrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public OrderAggregate getOrder(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new DomainException("Order not found: " + orderId));
    }
}
