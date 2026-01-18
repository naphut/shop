<?php
// Neon PostgreSQL Configuration
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        putenv("$key=$value");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

loadEnv(__DIR__ . '/.env');

// Neon PostgreSQL Configuration
define('DB_HOST', 'ep-bitter-hill-ahicq02h-pooler.c-3.us-east-1.aws.neon.tech');
define('DB_NAME', 'neondb');
define('DB_USER', 'neondb_owner');
define('DB_PASS', 'npg_xUWu8qKeaSL4');
define('DB_PORT', '5432');
define('DB_SSL', 'require');

// Security Configuration
define('JWT_SECRET', 'your_super_secret_jwt_key_change_this_in_production');
define('JWT_EXPIRY', $_ENV['JWT_EXPIRY'] ?? 86400);

// Server Configuration
define('APP_ENV', 'production');
define('APP_DEBUG', false);
define('APP_URL', 'https://your-backend-url.railway.app');

// Database Connection Function
function getDB() {
    try {
        $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";sslmode=" . DB_SSL;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}
?>
