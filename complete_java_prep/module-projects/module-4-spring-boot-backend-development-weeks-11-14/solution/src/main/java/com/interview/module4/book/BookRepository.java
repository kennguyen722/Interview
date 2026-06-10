package com.interview.module4.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

  boolean existsByIsbnIgnoreCase(String isbn);

    @EntityGraph(attributePaths = "author")
    Optional<Book> findWithAuthorById(Long id);

    @EntityGraph(attributePaths = "author")
    @Query("""
        select b from Book b
        where (:year is null or b.publishedYear = :year)
          and (:title is null or lower(b.title) like lower(concat('%', :title, '%')))
          and (:minPrice is null or b.price >= :minPrice)
          and (:maxPrice is null or b.price <= :maxPrice)
        """)
    Page<Book> search(Integer year, String title, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
}
