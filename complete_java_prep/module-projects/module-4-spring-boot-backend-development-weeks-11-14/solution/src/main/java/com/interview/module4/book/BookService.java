package com.interview.module4.book;

import com.interview.module4.common.error.ConflictException;
import com.interview.module4.common.error.NotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    @Transactional
    public BookResponse create(BookCreateRequest request) {
        if (bookRepository.existsByIsbnIgnoreCase(request.isbn())) {
            throw new ConflictException("Book with ISBN already exists: " + request.isbn());
        }

        Author author = authorRepository.findById(request.authorId())
            .orElseThrow(() -> new NotFoundException("Author not found: " + request.authorId()));

        Book book = new Book();
        book.setTitle(request.title().trim());
        book.setIsbn(request.isbn().trim());
        book.setPublishedYear(request.publishedYear());
        book.setPrice(request.price());
        book.setAuthor(author);

        return BookResponse.from(bookRepository.save(book));
    }

    @Transactional
    public BookResponse update(Long id, BookCreateRequest request) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Book not found: " + id));

        Author author = authorRepository.findById(request.authorId())
            .orElseThrow(() -> new NotFoundException("Author not found: " + request.authorId()));

        book.setTitle(request.title().trim());
        book.setIsbn(request.isbn().trim());
        book.setPublishedYear(request.publishedYear());
        book.setPrice(request.price());
        book.setAuthor(author);

        return BookResponse.from(book);
    }

    public BookResponse findById(Long id) {
        Book book = bookRepository.findWithAuthorById(id)
            .orElseThrow(() -> new NotFoundException("Book not found: " + id));
        return BookResponse.from(book);
    }

    public Page<BookResponse> search(BookSearchCriteria criteria, Pageable pageable) {
        return bookRepository.search(
                criteria.year(),
                criteria.title(),
                criteria.minPrice(),
                criteria.maxPrice(),
                pageable)
            .map(BookResponse::from);
    }

    @Transactional
    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new NotFoundException("Book not found: " + id);
        }
        bookRepository.deleteById(id);
    }
}
