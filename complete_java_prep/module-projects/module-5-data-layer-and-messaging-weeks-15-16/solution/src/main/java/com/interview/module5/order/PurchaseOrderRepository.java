package com.interview.module5.order;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    boolean existsByReferenceCode(String referenceCode);

    @EntityGraph(attributePaths = "customer")
    Optional<PurchaseOrder> findWithCustomerById(Long id);

    @Query(value = """
        SELECT
            c.id AS customerId,
            c.name AS customerName,
            c.email AS customerEmail,
            SUM(o.total_amount) AS totalSpent,
            COUNT(o.id) AS orderCount
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        WHERE o.created_at BETWEEN :from AND :to
        GROUP BY c.id, c.name, c.email
        ORDER BY totalSpent DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<TopCustomerReport> findTopCustomers(
        @Param("from") Instant from,
        @Param("to") Instant to,
        @Param("limit") int limit
    );
}
