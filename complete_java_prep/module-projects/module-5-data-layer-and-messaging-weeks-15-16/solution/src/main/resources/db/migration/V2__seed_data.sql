INSERT INTO customers(name, email) VALUES
('Alice Nguyen', 'alice@module5.dev'),
('Bob Tran', 'bob@module5.dev'),
('Carol Vu', 'carol@module5.dev');

INSERT INTO orders(customer_id, reference_code, status, total_amount, created_at) VALUES
(1, 'ORD-1001', 'CREATED', 149.99, NOW() - INTERVAL '7 days'),
(1, 'ORD-1002', 'COMPLETED', 259.50, NOW() - INTERVAL '2 days'),
(2, 'ORD-1003', 'CREATED', 90.00, NOW() - INTERVAL '1 day'),
(3, 'ORD-1004', 'COMPLETED', 330.25, NOW() - INTERVAL '10 days');
