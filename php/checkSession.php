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

// Check if session exists
if (!isset($_SESSION['admin_id'])) {
    // Return 200 with loggedIn: false instead of 401
    http_response_code(200);
    echo json_encode(["loggedIn" => false]);
    exit();
}

// Session exists, return user data
http_response_code(200);
echo json_encode([
    "loggedIn" => true,
    "user_id" => $_SESSION['admin_id'],
    "name" => $_SESSION['admin_name'],
    "email" => $_SESSION['admin_email'],
    "role" => $_SESSION['admin_role']
]);
?>