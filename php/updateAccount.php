<?php
// Suppress warnings to prevent HTML in JSON response
error_reporting(0);
ini_set('display_errors', 0);

include("database.php");

$origin = $_SERVER['HTTP_ORIGIN'] ?? "*";
$allowed_origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://www.qadersheaven.com"
];

if(in_array($origin, $allowed_origins)){
    header("Access-Control-Allow-Origin: " . $origin); 
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get JSON input
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit();
}

$current_password = $data['current_password'] ?? '';
$new_email = $data['new_email'] ?? '';
$new_password = $data['new_password'] ?? '';
$user_type = $data['user_type'] ?? ''; // 'admin' or 'tenant'

if (empty($current_password)) {
    echo json_encode(["success" => false, "message" => "Current password is required"]);
    exit();
}

if (empty($user_type) || !in_array($user_type, ['admin', 'tenant'])) {
    echo json_encode(["success" => false, "message" => "Invalid user type"]);
    exit();
}

// Determine which user to update based on session and user_type
if (isset($_SESSION['admin_id'])) {
    $user_id = $_SESSION['admin_id'];
    $table = 'users';
    $id_field = 'user_id';
    $email_field = 'email';
    $password_field = 'password_hash';
} elseif (isset($_SESSION['tenant_id'])) {
    $user_id = $_SESSION['tenant_id'];
    $table = 'tenant_accounts';
    $id_field = 'tenant_id';
    $email_field = 'email';
    $password_field = 'password_hash';
} else {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

// First, verify current password
$verify_sql = "SELECT $password_field FROM $table WHERE $id_field = ?";
$verify_stmt = $conn->prepare($verify_sql);
$verify_stmt->bind_param("i", $user_id);
$verify_stmt->execute();
$result = $verify_stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit();
}

$user_data = $result->fetch_assoc();
$stored_password = $user_data[$password_field];

if (!password_verify($current_password, $stored_password)) {
    echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
    exit();
}

// Build update query
$update_fields = [];
$update_params = [];
$param_types = "";

// Add email update if provided
if (!empty($new_email)) {
    // Check if email already exists for another user
    $email_check_sql = "SELECT $id_field FROM $table WHERE $email_field = ? AND $id_field != ?";
    $email_check_stmt = $conn->prepare($email_check_sql);
    $email_check_stmt->bind_param("si", $new_email, $user_id);
    $email_check_stmt->execute();
    
    if ($email_check_stmt->get_result()->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email already exists"]);
        exit();
    }
    
    $update_fields[] = "$email_field = ?";
    $update_params[] = $new_email;
    $param_types .= "s";
}

// Add password update if provided
if (!empty($new_password)) {
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    $update_fields[] = "$password_field = ?";
    $update_params[] = $hashed_password;
    $param_types .= "s";
}

if (empty($update_fields)) {
    echo json_encode(["success" => false, "message" => "No changes provided"]);
    exit();
}

// Add user_id to parameters
$update_params[] = $user_id;
$param_types .= "i";

// Build and execute update query
$update_sql = "UPDATE $table SET " . implode(', ', $update_fields) . " WHERE $id_field = ?";
$update_stmt = $conn->prepare($update_sql);

// Bind parameters dynamically
$update_stmt->bind_param($param_types, ...$update_params);

if ($update_stmt->execute()) {
    echo json_encode([
        "success" => true, 
        "message" => "Account updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Failed to update account: " . $conn->error
    ]);
}

$conn->close();
?>
