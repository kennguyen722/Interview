package com.interview.module5.order;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interview.module5.common.error.NotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @Test
    void createShouldReturnCreated() throws Exception {
        OrderCreateRequest request = new OrderCreateRequest(1L, "ORD-ABCD-100", BigDecimal.valueOf(200));
        OrderResponse response = new OrderResponse(10L, 1L, "Alice Nguyen", "ORD-ABCD-100", OrderStatus.CREATED, BigDecimal.valueOf(200), Instant.now());

        when(orderService.create(any(OrderCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.referenceCode").value("ORD-ABCD-100"));
    }

    @Test
    void findByIdShouldReturnNotFound() throws Exception {
        when(orderService.findById(eq(999L))).thenThrow(new NotFoundException("Order not found: 999"));

        mockMvc.perform(get("/api/v1/orders/999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Order not found: 999"));
    }

    @Test
    void reportShouldReturnData() throws Exception {
        TopCustomerResponse row = new TopCustomerResponse(1L, "Alice Nguyen", "alice@module5.dev", BigDecimal.valueOf(409.49), 2L);

        when(orderService.topCustomers(any(LocalDate.class), any(LocalDate.class), eq(5)))
            .thenReturn(List.of(row));

        mockMvc.perform(get("/api/v1/orders/reports/top-customers")
                .param("from", "2026-01-01")
                .param("to", "2026-12-31"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].customerName").value("Alice Nguyen"));
    }
}
