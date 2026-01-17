cat > setup.php << 'EOF'
<?php
// Database Setup Script
echo "🗄️ Setting up Master Shirt Shop database...\n";

try {
    // Create database connection
    $pdo = new PDO('sqlite:' . __DIR__ . '/database.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Database connected successfully\n";
    
    // Create tables
    $tables = [
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(10) DEFAULT 'user',
            phone VARCHAR(50),
            address TEXT,
            status BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        
        "CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        
        "CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            typical_price DECIMAL(10,2),
            category_id INTEGER,
            brand VARCHAR(100),
            stock INTEGER DEFAULT 0,
            image_url TEXT,
            material VARCHAR(100),
            is_active INTEGER DEFAULT 1,
            is_best_seller INTEGER DEFAULT 0,
            is_new_arrival INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )",
        
        "CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            address TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )",
        
        "CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price_at_time DECIMAL(10,2) NOT NULL,
            selected_size VARCHAR(10),
            selected_color VARCHAR(50),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )"
    ];
    
    // Execute table creation
    foreach ($tables as $sql) {
        $pdo->exec($sql);
        echo "✅ Created table: " . substr($sql, 0, 30) . "...\n";
    }
    
    // Insert sample data
    echo "📦 Inserting sample data...\n";
    
    // Insert categories
    $categories = ["Men", "Women", "Kids", "Custom"];
    foreach ($categories as $category) {
        $stmt = $pdo->prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
        $stmt->execute([$category]);
    }
    echo "✅ Categories inserted\n";
    
    // Insert admin user
    $adminPassword = password_hash('admin123', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute(['System Admin', 'admin@master.com', $adminPassword, 'admin']);
    echo "✅ Admin user created (admin@master.com / admin123)\n";
    
    // Insert regular user
    $userPassword = password_hash('user123', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute(['John Doe', 'user@example.com', $userPassword, 'user']);
    echo "✅ Regular user created (user@example.com / user123)\n";
    
    // Insert sample products
    $products = [
        [
            'name' => json_encode(['en' => 'Classic T-Shirt', 'kh' => 'អាវខ្លីសិច']),
            'description' => json_encode(['en' => 'Comfortable cotton t-shirt', 'kh' => 'អាវខ្លីសិចស្រួល']),
            'price' => 19.99,
            'typical_price' => 29.99,
            'category_id' => 1,
            'brand' => 'MasterBrand',
            'stock' => 100,
            'image_url' => 'https://via.placeholder.com/300',
            'material' => '100% Cotton',
            'is_active' => 1,
            'is_best_seller' => 1,
            'is_new_arrival' => 0
        ],
        [
            'name' => json_encode(['en' => 'Premium Polo', 'kh' => 'អាវប៉ូឡពិសេ']),
            'description' => json_encode(['en' => 'High-quality polo shirt', 'kh' => 'អាវប៉ូឡពិសេ']),
            'price' => 39.99,
            'typical_price' => 49.99,
            'category_id' => 1,
            'brand' => 'MasterBrand',
            'stock' => 50,
            'image_url' => 'https://via.placeholder.com/300',
            'material' => 'Cotton Blend',
            'is_active' => 1,
            'is_best_seller' => 0,
            'is_new_arrival' => 1
        ]
    ];
    
    foreach ($products as $product) {
        $stmt = $pdo->prepare("INSERT OR IGNORE INTO products (name, description, price, typical_price, category_id, brand, stock, image_url, material, is_active, is_best_seller, is_new_arrival) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $product['name'],
            $product['description'],
            $product['price'],
            $product['typical_price'],
            $product['category_id'],
            $product['brand'],
            $product['stock'],
            $product['image_url'],
            $product['material'],
            $product['is_active'],
            $product['is_best_seller'],
            $product['is_new_arrival']
        ]);
    }
    
    echo "✅ Products inserted\n";
    echo "🎉 Database setup complete!\n";
    echo "📊 Database location: " . __DIR__ . "/database.sqlite\n";
    echo "👤 Admin: admin@master.com / admin123\n";
    echo "👤 User: user@example.com / user123\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
EOF