package com.interview.module10.service;

import com.interview.module10.api.dto.CreateAdrRequest;
import com.interview.module10.domain.AdrRecord;
import com.interview.module10.domain.AdrStatus;
import com.interview.module10.exception.DomainException;
import com.interview.module10.repository.InMemoryAdrRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AdrService {

    private final InMemoryAdrRepository repository;

    public AdrService(InMemoryAdrRepository repository) {
        this.repository = repository;
    }

    public AdrRecord create(CreateAdrRequest request) {
        AdrRecord adr = new AdrRecord(
                UUID.randomUUID(),
                request.title(),
                request.context(),
                request.decision(),
                request.owner()
        );
        repository.save(adr);
        return adr;
    }

    public AdrRecord changeStatus(UUID adrId, AdrStatus status) {
        AdrRecord adr = repository.findById(adrId)
                .orElseThrow(() -> new DomainException("ADR not found: " + adrId));
        adr.changeStatus(status);
        repository.save(adr);
        return adr;
    }

    public List<AdrRecord> list() {
        return repository.findAll();
    }
}
