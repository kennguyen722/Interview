package com.interview.module4.book;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(properties = {
    "spring.flyway.enabled=false",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Test
    void searchShouldFilterByYearAndPriceRange() {
        Author author = authorRepository.save(new Author("Test Author"));

        Book b1 = new Book();
        b1.setTitle("Book A");
        b1.setIsbn("1111111111");
        b1.setPublishedYear(2020);
        b1.setPrice(BigDecimal.valueOf(20));
        b1.setAuthor(author);

        Book b2 = new Book();
        b2.setTitle("Book B");
        b2.setIsbn("2222222222");
        b2.setPublishedYear(2020);
        b2.setPrice(BigDecimal.valueOf(50));
        b2.setAuthor(author);

        bookRepository.save(b1);
        bookRepository.save(b2);

        var page = bookRepository.search(2020, "Book", BigDecimal.valueOf(25), BigDecimal.valueOf(60), PageRequest.of(0, 10));

        assertThat(page.getTotalElements()).isEqualTo(1);
        assertThat(page.getContent().getFirst().getTitle()).isEqualTo("Book B");
    }
}
