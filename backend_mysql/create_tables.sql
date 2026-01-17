-- Master Shirt Shop Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS master_shirt_shop;
USE master_shirt_shop;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    brand VARCHAR(100),
    stock INT DEFAULT 0,
    image_url TEXT,
    material VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    selected_size VARCHAR(10),
    selected_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
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
