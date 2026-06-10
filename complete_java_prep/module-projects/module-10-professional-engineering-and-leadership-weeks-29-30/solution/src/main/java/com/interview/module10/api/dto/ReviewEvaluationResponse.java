package com.interview.module10.api.dto;

import java.util.List;

public record ReviewEvaluationResponse(
        boolean approved,
        int score,
        List<String> findings
) {
}
