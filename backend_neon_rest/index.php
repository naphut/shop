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

require_once 'config.php';
require_once 'JWT.php';

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

// Route Dispatcher
try {
    switch ($endpoint) {
        // --- PRODUCTS ---
        case 'products':
            if ($method === 'GET') {
                $data = getNeonAPI('products');
                sendResponse([
                    "success" => true,
                    "data" => $data
                ]);
            } else {
                sendError("Method not allowed", 405);
            }
            break;

        case 'categories':
            if ($method === 'GET') {
                $data = getNeonAPI('categories');
                sendResponse([
                    "success" => true,
                    "data" => $data
                ]);
            } else {
                sendError("Method not allowed", 405);
            }
            break;

        // --- USER LOGIN ---
        case 'login':
            if ($method !== 'POST') {
                sendError("Method not allowed", 405);
            }
            
            if (empty($input['email']) || empty($input['password'])) {
                sendError("Email and password are required");
            }
            
            $data = getNeonAPI('users?email=' . urlencode($input['email']));
            $users = $data['rows'] ?? [];
            
            if (!empty($users) && password_verify($input['password'], $users[0]['password'])) {
                $token = JWT::encode([
                    "id" => $users[0]['id'], 
                    "role" => $users[0]['role'], 
                    "name" => $users[0]['name'],
                    "email" => $users[0]['email']
                ], JWT_SECRET);
                
                sendResponse([
                    "success" => true,
                    "token" => $token,
                    "user" => [
                        "id" => $users[0]['id'], 
                        "name" => $users[0]['name'], 
                        "role" => $users[0]['role'], 
                        "email" => $users[0]['email']
                    ]
                ]);
            } else {
                sendError("Invalid credentials", 401);
            }
            break;

        // --- USER REGISTER ---
        case 'register':
            if ($method !== 'POST') {
                sendError("Method not allowed", 405);
            }
            
            if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
                sendError("Name, email, and password are required");
            }
            
            $data = getNeonAPI('users?email=' . urlencode($input['email']));
            $users = $data['rows'] ?? [];
            
            if (!empty($users)) {
                sendError("Email already exists", 409);
            } else {
                $newUser = [
                    'name' => $input['name'],
                    'email' => $input['email'],
                    'password' => password_hash($input['password'], PASSWORD_BCRYPT),
                    'role' => 'user'
                ];
                
                $result = getNeonAPI('users', 'POST', json_encode($newUser));
                sendResponse([
                    "success" => true,
                    "message" => "Registration successful"
                ]);
            }
            break;

        // --- ADMIN LOGIN ---
        case 'admin/login':
            if ($method !== 'POST') {
                sendError("Method not allowed", 405);
            }
            
            if (empty($input['email']) || empty($input['password'])) {
                sendError("Email and password are required");
            }
            
            $data = getNeonAPI('users?email=' . urlencode($input['email']) . '&role=admin');
            $users = $data['rows'] ?? [];
            
            if (!empty($users) && password_verify($input['password'], $users[0]['password'])) {
                $token = JWT::encode([
                    "id" => $users[0]['id'], 
                    "role" => $users[0]['role'], 
                    "name" => $users[0]['name'],
                    "email" => $users[0]['email']
                ], JWT_SECRET);
                
                sendResponse([
                    "success" => true,
                    "token" => $token,
                    "user" => [
                        "id" => $users[0]['id'], 
                        "name" => $users[0]['name'], 
                        "role" => $users[0]['role'], 
                        "email" => $users[0]['email']
                    ]
                ]);
            } else {
                sendError("Invalid admin credentials", 401);
            }
            break;

        // --- PROTECTED ROUTE ---
        case 'me':
            $user = verifyAuth();
            sendResponse([
                "success" => true,
                "user" => $user
            ]);
            break;

        // --- ADMIN DASHBOARD ---
        case 'admin/dashboard':
            $user = verifyAdmin();
            
            // Get orders count
            $ordersData = getNeonAPI('orders');
            $ordersCount = count($ordersData['rows'] ?? []);
            
            // Get users count
            $usersData = getNeonAPI('users?role=user');
            $usersCount = count($usersData['rows'] ?? []);
            
            // Get revenue (completed orders)
            $revenueData = getNeonAPI('orders?status=completed');
            $totalRevenue = array_sum(array_column($revenueData['rows'] ?? [], 'total_amount'));
            
            sendResponse([
                "success" => true,
                "data" => [
                    "revenue" => (float)$totalRevenue,
                    "orders" => (int)$ordersCount,
                    "users" => (int)$usersCount
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
