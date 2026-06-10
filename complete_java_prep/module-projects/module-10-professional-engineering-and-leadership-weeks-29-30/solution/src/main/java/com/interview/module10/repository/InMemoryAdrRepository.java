package com.interview.module10.repository;

import com.interview.module10.domain.AdrRecord;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryAdrRepository {

    private final ConcurrentHashMap<UUID, AdrRecord> store = new ConcurrentHashMap<>();

    public void save(AdrRecord adr) {
        store.put(adr.getId(), adr);
    }

    public Optional<AdrRecord> findById(UUID id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<AdrRecord> findAll() {
        return new ArrayList<>(store.values());
    }
}
