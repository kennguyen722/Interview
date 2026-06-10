package com.interview.module5.order;

import com.interview.module5.customer.Customer;
import com.interview.module5.customer.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(properties = {
    "spring.flyway.enabled=false",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class PurchaseOrderRepositoryTest {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void findTopCustomersShouldAggregateSpentAmount() {
        Customer customer = customerRepository.save(buildCustomer("Data User", "data@module5.dev"));

        purchaseOrderRepository.save(buildOrder(customer, "ORD-T1", BigDecimal.valueOf(120), Instant.now()));
        purchaseOrderRepository.save(buildOrder(customer, "ORD-T2", BigDecimal.valueOf(80), Instant.now()));

        var result = purchaseOrderRepository.findTopCustomers(Instant.now().minusSeconds(3600), Instant.now().plusSeconds(3600), 10);

        assertThat(result).isNotEmpty();
        assertThat(result.getFirst().getTotalSpent()).isEqualByComparingTo("200.00");
    }

    private Customer buildCustomer(String name, String email) {
        Customer customer = new Customer();
        customer.setName(name);
        customer.setEmail(email);
        return customer;
    }

    private PurchaseOrder buildOrder(Customer customer, String reference, BigDecimal total, Instant createdAt) {
        PurchaseOrder order = new PurchaseOrder();
        order.setCustomer(customer);
        order.setReferenceCode(reference);
        order.setStatus(OrderStatus.CREATED);
        order.setTotalAmount(total);
        order.setCreatedAt(createdAt);
        return order;
    }
}
