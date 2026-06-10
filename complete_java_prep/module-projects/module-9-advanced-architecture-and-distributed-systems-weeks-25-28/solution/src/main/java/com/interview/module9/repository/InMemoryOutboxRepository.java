package com.interview.module9.repository;

import com.interview.module9.domain.OutboxEvent;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Repository
public class InMemoryOutboxRepository {

    private final List<OutboxEvent> events = Collections.synchronizedList(new ArrayList<>());

    public void save(OutboxEvent event) {
        events.add(event);
    }

    public List<OutboxEvent> findAll() {
        return new ArrayList<>(events);
    }
}
