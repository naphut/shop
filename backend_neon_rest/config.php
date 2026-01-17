<?php
// Neon REST API Configuration
define('NEON_API_URL', 'https://ep-young-voice-ah2904qr.apirest.c-3.us-east-1.aws.neon.tech/neondb/rest/v1');
define('NEON_API_KEY', $_ENV['NEON_API_KEY'] ?? 'your_neon_api_key_here');

// Security Configuration
define('JWT_SECRET', 'MASTER_NODE_SECURE_99_ALPHA_V3');
define('JWT_EXPIRY', 86400);

// Server Configuration
define('APP_ENV', 'development');
define('APP_DEBUG', 'true');
define('APP_URL', 'http://localhost:8000');

// Neon REST API Connection Function
function getNeonAPI($endpoint, $method = 'GET', $data = null) {
    $url = NEON_API_URL . '/' . $endpoint;
    
    $options = [
        'http' => [
            'header' => 'Content-Type: application/json',
            'method' => $method,
            'ignore_errors' => true
        ]
    ];
    
    if ($data && $method === 'POST') {
        $options['http']['header']['Content-Type'] = 'application/json';
        $options['http']['content'] = json_encode($data);
    }
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result === false) {
        throw new Exception("Neon API request failed");
    }
    
    return json_decode($result, true);
}

// JWT Functions (for local use)
function getAuthUser() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return JWT::decode($matches[1], JWT_SECRET);
    }
    return null;
}

function verifyAuth() {
    $user = getAuthUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }
    return $user;
}

function verifyAdmin() {
    $user = verifyAuth();
    if ($user->role !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden - Admin access required"]);
        exit();
    }
    return $user;
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

function sendError($message, $statusCode = 400) {
    http_response_code($statusCode);
    echo json_encode(["error" => $message]);
    exit();
}
?>
