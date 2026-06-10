package com.interview.module10.service;

import com.interview.module10.api.dto.CreateAdrRequest;
import com.interview.module10.domain.AdrRecord;
import com.interview.module10.domain.AdrStatus;
import com.interview.module10.repository.InMemoryAdrRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AdrServiceTest {

    @Test
    void shouldCreateAndPromoteAdrStatus() {
        AdrService service = new AdrService(new InMemoryAdrRepository());
        AdrRecord adr = service.create(new CreateAdrRequest(
                "Adopt event-driven integration",
                "Synchronous coupling causes release bottlenecks",
                "Use outbox + asynchronous consumers",
                "tech-lead"
        ));

        AdrRecord changed = service.changeStatus(adr.getId(), AdrStatus.ACCEPTED);

        assertEquals(AdrStatus.ACCEPTED, changed.getStatus());
    }
}
