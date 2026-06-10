package com.interview.module3;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TicketServiceTest {

    @Test
    void shouldCreateTicket() {
        TicketService service = new TicketService();
        service.create(new CreateTicketRequest("Title", "Description", "medium"));

        assertEquals(1, service.list().size());
    }

    @Test
    void shouldRejectMissingTitle() {
        TicketService service = new TicketService();

        assertThrows(IllegalArgumentException.class,
                () -> service.create(new CreateTicketRequest("", "Description", "medium")));
    }
}
