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
define('DB_HOST', $_ENV['DB_HOST'] ?? 'ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'neondb');
define('DB_USER', $_ENV['DB_USER'] ?? 'neondb_owner');
define('DB_PASS', $_ENV['DB_PASS'] ?? 'npg_oaUnfsOMG9e7@ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech');
define('DB_PORT', $_ENV['DB_PORT'] ?? '5432');
define('DB_SSL', $_ENV['DB_SSL'] ?? 'require');

// Security Configuration
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'MASTER_NODE_SECURE_99_ALPHA_V3');
define('JWT_EXPIRY', $_ENV['JWT_EXPIRY'] ?? 86400);

// Server Configuration
define('APP_ENV', $_ENV['APP_ENV'] ?? 'development');
define('APP_DEBUG', $_ENV['APP_DEBUG'] ?? 'true');
define('APP_URL', $_ENV['APP_URL'] ?? 'http://localhost:8000');

// Database Connection Function
function getDB() {
    try {
        $dsn = "pgsql:host=".DB_HOST.";port=".DB_PORT.";dbname=".DB_NAME.";sslmode=".DB_SSL;
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        return null;
    }
}
?>
