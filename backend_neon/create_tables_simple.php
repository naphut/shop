<?php
require_once 'config.php';

echo "Creating tables for Neon PostgreSQL...\n";

try {
    $db = getDB();
    
    // Create categories table
    $db->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Categories table created\n";
    
    // Create users table
    $db->exec("
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(10) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Users table created\n";
    
    // Create products table with JSON fields
    $db->exec("
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name_json JSONB NOT NULL,
            description_json JSONB NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            typical_price DECIMAL(10,2),
            category_id INTEGER REFERENCES categories(id),
            brand VARCHAR(100),
            stock INTEGER DEFAULT 0,
            image_url TEXT,
            material VARCHAR(100),
            is_active BOOLEAN DEFAULT TRUE,
            is_best_seller BOOLEAN DEFAULT FALSE,
            is_new_arrival BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Products table created with JSON fields\n";
    
    // Insert categories
    $db->exec("INSERT INTO categories (name) VALUES ('Men'), ('Women'), ('Kids'), ('Custom') ON CONFLICT DO NOTHING");
    echo "✅ Categories inserted\n";
    
    // Insert sample products with JSON data
    $db->exec("
        INSERT INTO products (name_json, description_json, price, typical_price, category_id, brand, stock, image_url, material, is_active) VALUES 
        ('{\"en\": \"Classic T-Shirt\", \"kh\": \"អាវខ្លីសិច\"}', '{\"en\": \"Comfortable cotton t-shirt\", \"kh\": \"អាវខ្លីសិចស្រួល\"}', 19.99, 29.99, 1, 'MasterBrand', 100, 'https://via.placeholder.com/300', '100% Cotton', TRUE),
        ('{\"en\": \"Premium Polo\", \"kh\": \"អាវប៉ូឡូពិសខេស\"}', '{\"en\": \"High-quality polo shirt\", \"kh\": \"អាវប៉ូឡូពិសខុណភាពខ្ពស់\"}', 39.99, 49.99, 1, 'MasterBrand', 50, 'https://via.placeholder.com/300', 'Cotton Blend', TRUE),
        ('{\"en\": \"Casual Shirt\", \"kh\": \"អាវសម្រាប់ប្រចនំថ្ងៃ\"}', '{\"en\": \"Relaxed fit casual shirt\", \"kh\": \"អាវសម្រាប់ពេលប្រចនំថ្ងៃ\"}', 29.99, 39.99, 2, 'MasterBrand', 75, 'https://via.placeholder.com/300', 'Polyester', TRUE)
        ON CONFLICT DO NOTHING
    ");
    echo "✅ Sample products inserted\n";
    
    echo "✅ All tables created successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
