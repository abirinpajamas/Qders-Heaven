<?php
session_start();

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? "*";
$allowed_origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://www.qadersheaven.com"
];

if(in_array($origin, $allowed_origins)){
    header("Access-Control-Allow-Origin: " . $origin); 
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if session exists (admin or tenant)
if (isset($_SESSION['admin_id'])) {
    // Admin session exists
    http_response_code(200);
    echo json_encode([
        "loggedIn" => true,
        "user_type" => "admin",
        "user_id" => $_SESSION['admin_id'],
        "name" => $_SESSION['admin_name'],
        "email" => $_SESSION['admin_email'],
        "role" => $_SESSION['admin_role']
    ]);
} elseif (isset($_SESSION['tenant_id'])) {
    // Tenant session exists
    http_response_code(200);
    echo json_encode([
        "loggedIn" => true,
        "user_type" => "tenant",
        "user_id" => $_SESSION['tenant_id'],
        "name" => $_SESSION['tenant_name'],
        "email" => $_SESSION['tenant_email']
    ]);
} else {
    // No session exists
    http_response_code(200);
    echo json_encode(["loggedIn" => false]);
}
?>