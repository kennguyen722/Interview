package com.interview.module10.service;

import com.interview.module10.api.dto.ReviewEvaluationRequest;
import com.interview.module10.api.dto.ReviewEvaluationResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

class ReviewQualityServiceTest {

    @Test
    void shouldFailWeakReviewForHighRiskChange() {
        ReviewQualityService service = new ReviewQualityService();
        ReviewEvaluationResponse response = service.evaluate(new ReviewEvaluationRequest(
                "Minor",
                List.of("Style"),
                9,
                "ok"
        ));

        assertFalse(response.approved());
    }
}
