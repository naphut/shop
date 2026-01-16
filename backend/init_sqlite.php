<?php
// Initialize SQLite database
try {
    $pdo = new PDO('sqlite:' . __DIR__ . '/database.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create tables
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(50),
            address TEXT,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(10) DEFAULT 'user',
            status BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_json TEXT NOT NULL,
            description_json TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            typical_price DECIMAL(10,2),
            category_id INTEGER,
            brand VARCHAR(100),
            stock INTEGER DEFAULT 0,
            image_url TEXT,
            material VARCHAR(100),
            is_active BOOLEAN DEFAULT 1,
            is_best_seller BOOLEAN DEFAULT 0,
            is_new_arrival BOOLEAN DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            address TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER NOT NULL,
            price_at_time DECIMAL(10,2) NOT NULL,
            selected_size VARCHAR(10),
            selected_color VARCHAR(50),
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ");
    
    // Insert categories
    $pdo->exec("INSERT OR IGNORE INTO categories (name) VALUES ('Men'), ('Women'), ('Kids'), ('Custom')");
    
    // Insert default admin
    $admin_password = password_hash('admin123', PASSWORD_BCRYPT);
    $pdo->exec("INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('System Admin', 'admin@master.com', '$admin_password', 'admin')");
    
    // Insert sample products
    $pdo->exec("INSERT OR IGNORE INTO products (name_json, description_json, price, typical_price, category_id, brand, stock, image_url, material, is_active, is_best_seller, is_new_arrival) VALUES 
        ('{\"en\": \"Classic T-Shirt\", \"kh\": \"អាវខ្លីសិច\"}', '{\"en\": \"Comfortable cotton t-shirt\", \"kh\": \"អាវខ្លីសិចស្រួល\"}', 19.99, 29.99, 1, 'MasterBrand', 100, 'https://via.placeholder.com/300', '100% Cotton', 1, 1, 0),
        ('{\"en\": \"Premium Polo\", \"kh\": \"អាវប៉ូឡូពិសេស\"}', '{\"en\": \"High-quality polo shirt\", \"kh\": \"អាវប៉ូឡូគុណភាពខ្ពស់\"}', 39.99, 49.99, 1, 'MasterBrand', 50, 'https://via.placeholder.com/300', 'Cotton Blend', 1, 0, 1),
        ('{\"en\": \"Casual Shirt\", \"kh\": \"អាវសម្រាប់ប្រចាំថ្ងៃ\"}', '{\"en\": \"Everyday casual shirt\", \"kh\": \"អាវសម្រាប់ពេលប្រចាំថ្ងៃ\"}', 29.99, 39.99, 2, 'MasterBrand', 75, 'https://via.placeholder.com/300', 'Polyester', 1, 0, 0)
    ");
    
    echo "SQLite database initialized successfully!\n";
    echo "Admin login: admin@master.com / admin123\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
