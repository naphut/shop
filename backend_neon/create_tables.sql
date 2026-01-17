-- Master Shirt Shop Database Schema for Neon PostgreSQL
-- Create tables (they will be created automatically by Neon)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    brand VARCHAR(100),
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    material VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    selected_size VARCHAR(10),
    selected_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Data
INSERT INTO categories (name) VALUES 
('Men'),
('Women'),
('Kids'),
('Custom');

-- Insert Admin User
INSERT INTO users (name, email, password, role) VALUES 
('System Admin', 'admin@master.com', '$2y$12$L/okWbSo1DVZq1TBIdlPXOrBXFIEGIYXJyvDn213LN.O6ZT/2cPiW', 'admin');

-- Insert Sample Products
INSERT INTO products (name, description, price, category_id, brand, stock, image_url, material, is_active) VALUES 
('Classic T-Shirt', 'Comfortable cotton t-shirt perfect for everyday wear', 19.99, 1, 'MasterBrand', 100, 'https://via.placeholder.com/300', '100% Cotton', TRUE),
('Premium Polo', 'High-quality polo shirt with premium fabric', 39.99, 1, 'MasterBrand', 50, 'https://via.placeholder.com/300', 'Cotton Blend', TRUE),
('Casual Shirt', 'Relaxed fit casual shirt for weekend outings', 29.99, 2, 'MasterBrand', 75, 'https://via.placeholder.com/300', 'Polyester', TRUE);
