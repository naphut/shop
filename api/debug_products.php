<?php
require_once 'config.php';

echo "Debugging products table...\n";

try {
    $db = getDB();
    
    // Check if products table exists
    $result = $db->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products'");
    $table_exists = $result->fetch();
    
    if ($table_exists) {
        echo "✅ Products table exists\n";
        
        // Check table structure
        $result = $db->query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' ORDER BY ordinal_position");
        echo "Table structure:\n";
        foreach ($result as $column) {
            echo "  - " . $column['column_name'] . " (" . $column['data_type'] . ")\n";
        }
        
        // Check if there's data
        $result = $db->query("SELECT COUNT(*) as count FROM products");
        $count = $result->fetch();
        echo "Total products: " . $count['count'] . "\n";
        
        // Try to fetch actual products
        $result = $db->query("SELECT * FROM products LIMIT 3");
        $products = $result->fetchAll(PDO::FETCH_ASSOC);
        echo "Sample products:\n";
        foreach ($products as $product) {
            echo "  ID: " . $product['id'] . "\n";
            echo "  Name: " . ($product['name_json'] ?? 'NULL') . "\n";
            echo "  Price: " . $product['price'] . "\n\n";
        }
        
    } else {
        echo "❌ Products table does not exist\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
