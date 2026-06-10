package com.interview.module9.api.dto;

import java.util.List;
import java.util.Map;

public record SystemDesignResponse(
        String context,
        List<String> serviceBoundaries,
        List<String> resilienceControls,
        List<String> consistencyPatterns,
        Map<String, String> tradeoffs
) {
}
