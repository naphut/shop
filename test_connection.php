<?php
require_once 'config.php';

echo "Testing database connection...\n";
$db = getDB();

if ($db) {
    echo "✅ Database connected successfully!\n";
    
    // Test a simple query
    $result = $db->query("SELECT COUNT(*) as count FROM users");
    $count = $result->fetch();
    echo "Users in database: " . $count['count'] . "\n";
    
    // Test tables
    $tables = $db->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    echo "Tables found: ";
    foreach ($tables as $table) {
        echo $table['table_name'] . " ";
    }
    echo "\n";
    
} else {
    echo "❌ Database connection failed!\n";
    echo "Error: " . error_get_last()['message'] . "\n";
}
?>
