<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Load dependencies
require_once 'config.php';
require_once 'JWT.php';

// Database Connection
$db = getDB();

// Enhanced Router Logic - Support both query param and path-based endpoints
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

// Get endpoint from query parameter OR URL path
$endpoint = $_GET['endpoint'] ?? '';

if (empty($endpoint)) {
    // Parse from URL path if no query parameter
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $path = explode('/', trim($requestUri, '/'));
    
    // Remove empty strings and 'api' prefix if present
    $path = array_filter($path, function($item) {
        return $item !== '' && $item !== 'api';
    });
    
    $endpoint = implode('/', $path);
}

// Authentication functions
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
        echo json_encode(["error" => "Unauthorized - Invalid or missing token"]);
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

// Route Dispatcher
try {
    switch ($endpoint) {
        // --- AUTH ENDPOINTS ---
        case 'auth/login':
        case 'login':
            if ($method !== 'POST') {
                sendError("Method not allowed", 405);
            }
            
            if (empty($input['email']) || empty($input['password'])) {
                sendError("Email and password are required");
            }
            
            $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$input['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($input['password'], $user['password'])) {
                $token = JWT::encode([
                    "id" => $user['id'], 
                    "role" => $user['role'], 
                    "name" => $user['name'],
                    "email" => $user['email']
                ], JWT_SECRET);
                
                sendResponse([
                    "success" => true,
                    "token" => $token,
                    "user" => [
                        "id" => $user['id'], 
                        "name" => $user['name'], 
                        "role" => $user['role'], 
                        "email" => $user['email']
                    ]
                ]);
            } else {
                sendError("Invalid credentials", 401);
            }
            break;

        case 'auth/register':
        case 'register':
            if ($method !== 'POST') {
                sendError("Method not allowed", 405);
            }
            
            if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
                sendError("Name, email, and password are required");
            }
            
            $hash = password_hash($input['password'], PASSWORD_BCRYPT);
            $stmt = $db->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
            
            try {
                $stmt->execute([$input['name'], $input['email'], $hash]);
                sendResponse([
                    "success" => true,
                    "message" => "Registration successful"
                ]);
            } catch (Exception $e) {
                if (strpos($e->getMessage(), 'UNIQUE') !== false) {
                    sendError("Email already exists", 409);
                } else {
                    sendError("Registration failed", 500);
                }
            }
            break;

        case 'auth/me':
            $user = verifyAuth();
            sendResponse([
                "success" => true,
                "user" => $user
            ]);
            break;

        // --- PRODUCT ENDPOINTS ---
        case 'products':
            if ($method === 'GET') {
                $stmt = $db->query("
                    SELECT p.*, c.name as category_name 
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id 
                    WHERE p.is_active = 1
                ");
                $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
                sendResponse([
                    "success" => true,
                    "data" => $products
                ]);
            } else {
                sendError("Method not allowed", 405);
            }
            break;

        case 'categories':
            if ($method === 'GET') {
                $stmt = $db->query("SELECT * FROM categories ORDER BY name");
                $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
                sendResponse([
                    "success" => true,
                    "data" => $categories
                ]);
            } else {
                sendError("Method not allowed", 405);
            }
            break;

        // --- USER ENDPOINTS ---
        case 'user/profile':
            $auth = verifyAuth();
            if ($method === 'GET') {
                $stmt = $db->prepare("SELECT id, name, email, phone, address FROM users WHERE id = ?");
                $stmt->execute([$auth->id]);
                $profile = $stmt->fetch(PDO::FETCH_ASSOC);
                sendResponse([
                    "success" => true,
                    "data" => $profile
                ]);
            } else if ($method === 'PUT') {
                $stmt = $db->prepare("UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?");
                $stmt->execute([$input['name'], $input['phone'], $input['address'], $auth->id]);
                sendResponse([
                    "success" => true,
                    "message" => "Profile updated successfully"
                ]);
            } else {
                sendError("Method not allowed", 405);
            }
            break;

        // --- ADMIN ENDPOINTS ---
        case 'admin/dashboard':
            $user = verifyAdmin();
            $revenue = $db->query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'completed'")->fetch();
            $orders = $db->query("SELECT COUNT(*) as count FROM orders")->fetch();
            $users = $db->query("SELECT COUNT(*) as count FROM users WHERE role = 'user'")->fetch();
            
            sendResponse([
                "success" => true,
                "data" => [
                    "revenue" => (float)$revenue['total'],
                    "orders" => (int)$orders['count'],
                    "users" => (int)$users['count']
                ]
            ]);
            break;

        // --- DEFAULT 404 ---
        default:
            sendError("Endpoint not found", 404);
            break;
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    sendError("Internal server error", 500);
}
?>
