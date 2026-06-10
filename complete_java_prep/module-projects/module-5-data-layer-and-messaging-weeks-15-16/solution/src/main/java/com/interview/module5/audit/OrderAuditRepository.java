package com.interview.module5.audit;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderAuditRepository extends MongoRepository<OrderAuditDocument, String> {
}
