package com.interview.module3;

public final class TicketValidator {

    private TicketValidator() {
    }

    public static void validate(CreateTicketRequest request) {
        if (request.title() == null || request.title().isBlank()) {
            throw new IllegalArgumentException("title is required");
        }
        if (request.description() == null || request.description().isBlank()) {
            throw new IllegalArgumentException("description is required");
        }
        if (request.priority() == null || request.priority().isBlank()) {
            throw new IllegalArgumentException("priority is required");
        }
    }
}
