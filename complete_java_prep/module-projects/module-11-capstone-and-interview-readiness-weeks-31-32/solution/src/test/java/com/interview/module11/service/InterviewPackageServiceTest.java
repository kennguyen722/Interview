package com.interview.module11.service;

import com.interview.module11.api.dto.InterviewPackageRequest;
import com.interview.module11.api.dto.InterviewPackageResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

class InterviewPackageServiceTest {

    @Test
    void shouldBuildPortfolioBullets() {
        InterviewPackageService service = new InterviewPackageService();
        InterviewPackageResponse response = service.generate(new InterviewPackageRequest(
                "Alex",
                List.of("Reduced p95 latency by 40%"),
                List.of("Event-driven order pipeline"),
                List.of("99.95% availability")
        ));

        assertFalse(response.portfolioBullets().isEmpty());
    }
}
