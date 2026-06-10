package com.interview.module9.service;

import com.interview.module9.api.dto.CustomerOverviewResponse;
import com.interview.module9.api.dto.OrderResponse;
import com.interview.module9.domain.OrderAggregate;
import com.interview.module9.domain.OrderStatus;
import com.interview.module9.repository.InMemoryOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GatewayAggregationService {

    private final InMemoryOrderRepository orderRepository;

    public GatewayAggregationService(InMemoryOrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public CustomerOverviewResponse buildCustomerOverview(long customerId) {
        List<OrderAggregate> orders = orderRepository.findByCustomerId(customerId);
        int confirmed = (int) orders.stream().filter(order -> order.getStatus() == OrderStatus.CONFIRMED).count();
        int failed = (int) orders.stream().filter(order -> order.getStatus() == OrderStatus.FAILED).count();
        List<OrderResponse> recent = orders.stream().limit(5).map(OrderResponse::from).toList();
        return new CustomerOverviewResponse(customerId, orders.size(), confirmed, failed, recent);
    }
}
