package com.interview.module10.api.dto;

import java.util.List;

public record CommunicationBriefResponse(
        String audience,
        String objective,
        List<String> keyMessages,
        List<String> nextSteps
) {
}
