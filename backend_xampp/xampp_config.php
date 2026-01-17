<?php
// XAMPP Configuration for Master Shirt Shop

// Database Configuration
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'ecommerce');
define('DB_USER', 'root');
define('DB_PASS', '');

// Security Configuration
define('JWT_SECRET', 'MASTER_NODE_SECURE_99_ALPHA_V3');
define('JWT_EXPIRY', 86400);

// Server Configuration
define('APP_ENV', 'development');
define('APP_DEBUG', 'true');
define('APP_URL', 'http://localhost:8001');

// Database Connection Function
function getDB() {
    try {
        $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8", DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        return null;
    }
}
?>
