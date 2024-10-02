-- Create schema if it doesn't already exist
CREATE SCHEMA IF NOT EXISTS myschema;

-- Drop tables if they already exist
DROP TABLE IF EXISTS myschema.transaction_items CASCADE;
DROP TABLE IF EXISTS myschema.transactions CASCADE;
DROP TABLE IF EXISTS myschema.inventory CASCADE;
DROP TABLE IF EXISTS myschema.products CASCADE;
DROP TABLE IF EXISTS myschema.users CASCADE;

-- Create the users table
CREATE TABLE myschema.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords for security
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'cashier', 'manager', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the products table
CREATE TABLE myschema.products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the inventory table
CREATE TABLE myschema.inventory (
    inventory_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES myschema.products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Create the transactions table
CREATE TABLE myschema.transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES myschema.users(user_id) ON DELETE SET NULL,
    transaction_total NUMERIC(10, 2) NOT NULL CHECK (transaction_total >= 0),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the transaction_items table
CREATE TABLE myschema.transaction_items (
    transaction_item_id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL REFERENCES myschema.transactions(transaction_id) ON DELETE CASCADE,
    product_id INT REFERENCES myschema.products(product_id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);
