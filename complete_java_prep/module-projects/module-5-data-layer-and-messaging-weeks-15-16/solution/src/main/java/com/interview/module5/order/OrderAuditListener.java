package com.interview.module5.order;

import com.interview.module5.audit.OrderAuditDocument;
import com.interview.module5.audit.OrderAuditRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class OrderAuditListener {

    private final OrderAuditRepository orderAuditRepository;

    public OrderAuditListener(OrderAuditRepository orderAuditRepository) {
        this.orderAuditRepository = orderAuditRepository;
    }

    @RabbitListener(queues = "${module5.messaging.queue}")
    public void consumeOrderCreated(OrderCreatedEvent event) {
        OrderAuditDocument doc = new OrderAuditDocument();
        doc.setOrderId(event.orderId());
        doc.setCustomerId(event.customerId());
        doc.setReferenceCode(event.referenceCode());
        doc.setStatus(event.status());
        doc.setTotalAmount(event.totalAmount());
        doc.setEventType("ORDER_CREATED");
        doc.setEventAt(event.eventAt());
        orderAuditRepository.save(doc);
    }
}
