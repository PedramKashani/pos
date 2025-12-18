-- Seed data for POS System
-- Run this in Supabase SQL Editor after setup.sql

-- Insert test users
-- All passwords are: "password123"
-- Usernames: admin, manager1, cashier1
INSERT INTO myschema.users (username, password, full_name, role) VALUES
('admin', '$2b$10$rw4BKRLgGfUp7PtO72O2pOAiOgGP70nN1hLbLsORR9uYDZ/XiNPcm', 'Admin User', 'admin'),
('manager1', '$2b$10$yy4CZz/21CBbjYCz72vglOI2uSD2PgoEQNFwWEIPaOGTz0JJ9TdTW', 'Manager One', 'manager'),
('cashier1', '$2b$10$ec0xJsxfsodoJAd0CPhVguzqonDSSNEJEUiUstvcH0HYgQKG/4eRW', 'Cashier One', 'cashier')
ON CONFLICT (username) DO NOTHING;

-- Insert sample products
INSERT INTO myschema.products (name, description, price, category) VALUES
('Laptop', 'High-performance laptop for work and gaming', 1299.99, 'Electronics'),
('Wireless Mouse', 'Ergonomic wireless mouse with long battery life', 29.99, 'Electronics'),
('Keyboard', 'Mechanical keyboard with RGB lighting', 89.99, 'Electronics'),
('Monitor', '27-inch 4K monitor with HDR support', 399.99, 'Electronics'),
('Headphones', 'Noise-cancelling wireless headphones', 199.99, 'Electronics'),
('USB Cable', 'USB-C to USB-A cable, 6ft', 12.99, 'Accessories'),
('Webcam', '1080p HD webcam with microphone', 79.99, 'Electronics'),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 34.99, 'Furniture'),
('Notebook', 'Spiral-bound notebook, 200 pages', 4.99, 'Office Supplies'),
('Pen Set', 'Set of 5 gel pens, assorted colors', 8.99, 'Office Supplies')
ON CONFLICT DO NOTHING;

-- Insert inventory for products
INSERT INTO myschema.inventory (product_id, quantity)
SELECT p.product_id, 
  CASE p.name
    WHEN 'Laptop' THEN 15
    WHEN 'Wireless Mouse' THEN 50
    WHEN 'Keyboard' THEN 30
    WHEN 'Monitor' THEN 20
    WHEN 'Headphones' THEN 25
    WHEN 'USB Cable' THEN 100
    WHEN 'Webcam' THEN 40
    WHEN 'Desk Lamp' THEN 35
    WHEN 'Notebook' THEN 200
    WHEN 'Pen Set' THEN 150
  END as quantity
FROM myschema.products p
WHERE p.name IN ('Laptop', 'Wireless Mouse', 'Keyboard', 'Monitor', 'Headphones', 'USB Cable', 'Webcam', 'Desk Lamp', 'Notebook', 'Pen Set')
AND NOT EXISTS (
  SELECT 1 FROM myschema.inventory i WHERE i.product_id = p.product_id
);

-- Insert sample customers
INSERT INTO myschema.customers (first_name, last_name, email, phone_number, address_line_1, city, state, postal_code, country) VALUES
('John', 'Doe', 'john.doe@email.com', '555-0101', '123 Main St', 'New York', 'NY', '10001', 'USA'),
('Jane', 'Smith', 'jane.smith@email.com', '555-0102', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'USA'),
('Bob', 'Johnson', 'bob.johnson@email.com', '555-0103', '789 Pine Rd', 'Chicago', 'IL', '60601', 'USA'),
('Alice', 'Williams', 'alice.williams@email.com', '555-0104', '321 Elm St', 'Houston', 'TX', '77001', 'USA'),
('Charlie', 'Brown', 'charlie.brown@email.com', '555-0105', '654 Maple Dr', 'Phoenix', 'AZ', '85001', 'USA')
ON CONFLICT (email) DO NOTHING;

