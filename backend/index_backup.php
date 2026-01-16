<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once 'config.php';
require_once 'JWT.php';

// Database Connection
$db = getDB();

// Router Logic
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = explode('/', trim($requestUri, '/'));
// Filter out empty strings from path
$path = array_filter($path, function($item) {
    return $item !== '';
});
$endpoint = implode('/', $path);
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

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
        die(json_encode(["error" => "Session Terminated: Unauthorized"]));
    }
    return $user;
}

function verifyAdmin() {
    $user = verifyAuth();
    if ($user->role !== 'admin') {
        http_response_code(403);
        die(json_encode(["error" => "Access Forbidden: Admin Protocol Required"]));
    }
    return $user;
}

// ROUTE DISPATCHER
switch ($endpoint) {
    // --- AUTH ---
    case 'auth/register':
        if ($method !== 'POST') break;
        $hash = password_hash($input['password'], PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
        try {
            $stmt->execute([$input['name'], $input['email'], $hash]);
            echo json_encode(["message" => "Account Registered"]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["error" => "Identity Conflict: Email already exists"]);
        }
        break;

    case 'auth/login':
        if ($method !== 'POST') break;
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$input['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && password_verify($input['password'], $user['password'])) {
            $token = JWT::encode(["id" => $user['id'], "role" => $user['role'], "name" => $user['name']], JWT_SECRET);
            echo json_encode([
                "token" => $token,
                "user" => ["id" => $user['id'], "name" => $user['name'], "role" => $user['role'], "email" => $user['email']]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid Credentials"]);
        }
        break;

    case 'auth/me':
        $user = verifyAuth();
        echo json_encode($user);
        break;

    // --- USER ---
    case 'user/profile':
        $auth = verifyAuth();
        if ($method === 'GET') {
            $stmt = $db->prepare("SELECT id, name, email, phone, address FROM users WHERE id = ?");
            $stmt->execute([$auth->id]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } else if ($method === 'PUT') {
            $stmt = $db->prepare("UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?");
            $stmt->execute([$input['name'], $input['phone'], $input['address'], $auth->id]);
            echo json_encode(["message" => "Profile Updated"]);
        }
        break;

    case 'user/orders':
        $auth = verifyAuth();
        if ($method === 'GET') {
            $stmt = $db->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
            $stmt->execute([$auth->id]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } else if ($method === 'POST') {
            $db->beginTransaction();
            try {
                $stmt = $db->prepare("INSERT INTO orders (user_id, total_amount, address) VALUES (?, ?, ?)");
                $stmt->execute([$auth->id, $input['total_amount'], $input['address']]);
                $orderId = $db->lastInsertId();
                
                foreach ($input['items'] as $item) {
                    $stmt = $db->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_time, selected_size, selected_color) VALUES (?, ?, ?, ?, ?, ?)");
                    $stmt->execute([
                        $orderId,
                        $item['product_id'],
                        $item['quantity'],
                        $item['price_at_time'],
                        $item['selected_size'] ?? null,
                        $item['selected_color'] ?? null
                    ]);
                }
                
                $db->commit();
                echo json_encode(["message" => "Order Created", "order_id" => $orderId]);
            } catch (Exception $e) {
                $db->rollback();
                http_response_code(400);
                echo json_encode(["error" => "Order Creation Failed"]);
            }
        }
        break;

    // --- PUBLIC PRODUCTS ---
    case 'products':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'categories':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM categories");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    // --- ADMIN ---
    case 'admin/dashboard':
        verifyAdmin();
        $revenue = $db->query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'completed'")->fetch();
        $orders = $db->query("SELECT COUNT(*) as count FROM orders")->fetch();
        $users = $db->query("SELECT COUNT(*) as count FROM users WHERE role = 'user'")->fetch();
        echo json_encode([
            "revenue" => (float)$revenue['total'],
            "orders" => (int)$orders['count'],
            "users" => (int)$users['count']
        ]);
        break;

    case 'admin/orders':
        verifyAdmin();
        if ($method === 'GET') {
            $stmt = $db->query("SELECT o.*, u.name as customer_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } else if ($method === 'PUT') {
            $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$input['status'], $input['id']]);
            echo json_encode(["message" => "Order Logic Updated"]);
        }
        break;

    case 'admin/products':
        verifyAdmin();
        if ($method === 'GET') {
            $stmt = $db->query("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } else if ($method === 'POST') {
            $stmt = $db->prepare("INSERT INTO products (name_json, description_json, price, typical_price, category_id, brand, stock, image_url, material, is_active, is_best_seller, is_new_arrival) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                json_encode($input['name']),
                json_encode($input['description']),
                $input['price'],
                $input['typical_price'] ?? null,
                $input['category_id'] ?? null,
                $input['brand'] ?? null,
                $input['stock'] ?? 0,
                $input['image_url'] ?? null,
                $input['material'] ?? null,
                $input['is_active'] ?? true,
                $input['is_best_seller'] ?? false,
                $input['is_new_arrival'] ?? false
            ]);
            echo json_encode(["message" => "Product Created", "id" => $db->lastInsertId()]);
        } else if ($method === 'PUT') {
            $stmt = $db->prepare("UPDATE products SET name_json = ?, description_json = ?, price = ?, typical_price = ?, category_id = ?, brand = ?, stock = ?, image_url = ?, material = ?, is_active = ?, is_best_seller = ?, is_new_arrival = ? WHERE id = ?");
            $stmt->execute([
                json_encode($input['name']),
                json_encode($input['description']),
                $input['price'],
                $input['typical_price'] ?? null,
                $input['category_id'] ?? null,
                $input['brand'] ?? null,
                $input['stock'] ?? 0,
                $input['image_url'] ?? null,
                $input['material'] ?? null,
                $input['is_active'] ?? true,
                $input['is_best_seller'] ?? false,
                $input['is_new_arrival'] ?? false,
                $input['id']
            ]);
            echo json_encode(["message" => "Product Updated"]);
        } else if ($method === 'DELETE') {
            $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$input['id']]);
            echo json_encode(["message" => "Product Deleted"]);
        }
        break;

    case 'admin/categories':
        verifyAdmin();
        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM categories ORDER BY name");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } else if ($method === 'POST') {
            $stmt = $db->prepare("INSERT INTO categories (name) VALUES (?)");
            $stmt->execute([$input['name']]);
            echo json_encode(["message" => "Category Created", "id" => $db->lastInsertId()]);
        } else if ($method === 'PUT') {
            $stmt = $db->prepare("UPDATE categories SET name = ? WHERE id = ?");
            $stmt->execute([$input['name'], $input['id']]);
            echo json_encode(["message" => "Category Updated"]);
        } else if ($method === 'DELETE') {
            $stmt = $db->prepare("DELETE FROM categories WHERE id = ?");
            $stmt->execute([$input['id']]);
            echo json_encode(["message" => "Category Deleted"]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found: " . $endpoint]);
        break;
}
?>