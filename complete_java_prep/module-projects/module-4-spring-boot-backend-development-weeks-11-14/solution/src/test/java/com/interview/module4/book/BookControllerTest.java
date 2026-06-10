package com.interview.module4.book;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interview.module4.common.error.NotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookService bookService;

    @Test
    void createShouldReturnCreated() throws Exception {
        BookCreateRequest request = new BookCreateRequest(
            "Domain-Driven Design",
            "9780321125217",
            2004,
            BigDecimal.valueOf(62.99),
            1L
        );

        BookResponse response = new BookResponse(
            10L,
            request.title(),
            request.isbn(),
            request.publishedYear(),
            request.price(),
            new AuthorResponse(1L, "Eric Evans")
        );

        when(bookService.create(any(BookCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(10L))
            .andExpect(jsonPath("$.title").value("Domain-Driven Design"));
    }

    @Test
    void findByIdShouldReturnNotFound() throws Exception {
        when(bookService.findById(eq(999L))).thenThrow(new NotFoundException("Book not found: 999"));

        mockMvc.perform(get("/api/v1/books/999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Book not found: 999"));
    }

    @Test
    void searchShouldReturnPagedResult() throws Exception {
        BookResponse item = new BookResponse(
            1L,
            "Clean Code",
            "9780132350884",
            2008,
            BigDecimal.valueOf(45.00),
            new AuthorResponse(1L, "Robert C. Martin")
        );

        when(bookService.search(any(BookSearchCriteria.class), any(Pageable.class)))
            .thenReturn(new PageImpl<>(List.of(item), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/v1/books"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].title").value("Clean Code"));
    }
}
