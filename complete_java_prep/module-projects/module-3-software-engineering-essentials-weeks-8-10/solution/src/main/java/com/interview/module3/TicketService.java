package com.interview.module3;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

public class TicketService {

    private static final Logger LOGGER = Logger.getLogger(TicketService.class.getName());
    private final List<SupportTicket> tickets = new ArrayList<>();

    public SupportTicket create(CreateTicketRequest request) {
        TicketValidator.validate(request);
        SupportTicket ticket = new SupportTicket(
                UUID.randomUUID(),
                request.title().trim(),
                request.description().trim(),
                request.priority().trim().toUpperCase(),
                Instant.now()
        );
        tickets.add(ticket);
        LOGGER.info(() -> "Created ticket id=" + ticket.id() + " priority=" + ticket.priority());
        return ticket;
    }

    public List<SupportTicket> list() {
        return List.copyOf(tickets);
    }
}
