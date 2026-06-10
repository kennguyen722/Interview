package com.interview.module9.repository;

import com.interview.module9.domain.OrderAggregate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryOrderRepository {

    private final ConcurrentHashMap<UUID, OrderAggregate> orders = new ConcurrentHashMap<>();

    public void save(OrderAggregate order) {
        orders.put(order.getOrderId(), order);
    }

    public Optional<OrderAggregate> findById(UUID orderId) {
        return Optional.ofNullable(orders.get(orderId));
    }

    public List<OrderAggregate> findByCustomerId(long customerId) {
        List<OrderAggregate> list = new ArrayList<>();
        for (OrderAggregate order : orders.values()) {
            if (order.getCustomerId() == customerId) {
                list.add(order);
            }
        }
        list.sort(Comparator.comparing(OrderAggregate::getCreatedAt).reversed());
        return list;
    }
}
