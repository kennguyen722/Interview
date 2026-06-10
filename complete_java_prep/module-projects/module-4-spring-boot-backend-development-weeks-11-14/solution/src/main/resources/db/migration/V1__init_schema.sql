CREATE TABLE authors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    published_year INT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE INDEX idx_books_published_year ON books(published_year);
CREATE INDEX idx_books_author_id ON books(author_id);
CREATE INDEX idx_books_title ON books(title);
