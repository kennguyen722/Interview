package com.interview.module5.order;

import com.interview.module5.common.error.ConflictException;
import com.interview.module5.common.error.NotFoundException;
import com.interview.module5.customer.Customer;
import com.interview.module5.customer.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class OrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CustomerRepository customerRepository;
    private final OrderEventPublisher orderEventPublisher;

    public OrderService(
        PurchaseOrderRepository purchaseOrderRepository,
        CustomerRepository customerRepository,
        OrderEventPublisher orderEventPublisher
    ) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.customerRepository = customerRepository;
        this.orderEventPublisher = orderEventPublisher;
    }

    @Transactional
    @CacheEvict(cacheNames = "orderById", key = "#result.id", condition = "#result != null")
    public OrderResponse create(OrderCreateRequest request) {
        if (purchaseOrderRepository.existsByReferenceCode(request.referenceCode())) {
            throw new ConflictException("Order reference already exists: " + request.referenceCode());
        }

        Customer customer = customerRepository.findById(request.customerId())
            .orElseThrow(() -> new NotFoundException("Customer not found: " + request.customerId()));

        PurchaseOrder order = new PurchaseOrder();
        order.setCustomer(customer);
        order.setReferenceCode(request.referenceCode());
        order.setStatus(OrderStatus.CREATED);
        order.setTotalAmount(request.totalAmount());
        order.setCreatedAt(Instant.now());

        PurchaseOrder saved = purchaseOrderRepository.save(order);

        orderEventPublisher.publishOrderCreated(new OrderCreatedEvent(
            saved.getId(),
            customer.getId(),
            saved.getReferenceCode(),
            saved.getStatus().name(),
            saved.getTotalAmount(),
            saved.getCreatedAt()
        ));

        return OrderResponse.from(saved);
    }

    @Cacheable(cacheNames = "orderById", key = "#id")
    public OrderResponse findById(Long id) {
        PurchaseOrder order = purchaseOrderRepository.findWithCustomerById(id)
            .orElseThrow(() -> new NotFoundException("Order not found: " + id));
        return OrderResponse.from(order);
    }

    public List<TopCustomerResponse> topCustomers(LocalDate from, LocalDate to, int limit) {
        Instant fromTime = from.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant toTime = to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        return purchaseOrderRepository.findTopCustomers(fromTime, toTime, limit).stream()
            .map(TopCustomerResponse::from)
            .toList();
    }
}
