<?php
require_once 'config.php';

echo "Updating Neon database schema...\n";

try {
    $db = getDB();
    
    // Drop existing products table
    $db->exec("DROP TABLE IF EXISTS products CASCADE");
    echo "Dropped existing products table\n";
    
    // Read and execute the new schema
    $schema = file_get_contents('create_tables.sql');
    // Split by semicolons instead of dashes to handle SQL properly
    $statements = explode(';', $schema);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        // Skip empty statements and comments
        if (!empty($statement) && !preg_match('/^--/', $statement) && !preg_match('/^CREATE TABLE IF NOT EXISTS users/', $statement)) {
            echo "Executing: " . substr($statement, 0, 50) . "...\n";
            $db->exec($statement);
        }
    }
    
    echo "✅ Database schema updated successfully!\n";
    
    // Verify the update
    $result = $db->query("SELECT name FROM categories LIMIT 1");
    $category = $result->fetch();
    if ($category) {
        echo "✅ Database schema verified with categories table: " . $category['name'] . "\n";
    }
    
    // Check products count
    $result = $db->query("SELECT COUNT(*) as count FROM products");
    $count = $result->fetch();
    echo "✅ Total products in database: " . $count['count'] . "\n";
    
} catch (Exception $e) {
    echo "❌ Error updating database: " . $e->getMessage() . "\n";
}
?>
