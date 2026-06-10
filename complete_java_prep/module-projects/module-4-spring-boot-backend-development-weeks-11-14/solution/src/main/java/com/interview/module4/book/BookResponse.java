package com.interview.module4.book;

import java.math.BigDecimal;

public record BookResponse(
    Long id,
    String title,
    String isbn,
    int publishedYear,
    BigDecimal price,
    AuthorResponse author
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
            book.getId(),
            book.getTitle(),
            book.getIsbn(),
            book.getPublishedYear(),
            book.getPrice(),
            new AuthorResponse(book.getAuthor().getId(), book.getAuthor().getName())
        );
    }
}
