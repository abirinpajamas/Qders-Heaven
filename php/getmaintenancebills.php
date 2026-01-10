<?php
include ("database.php");

$origin = $_SERVER['HTTP_ORIGIN'] ?? "*";
$allowed_origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://www.qadersheaven.com"
];

if(in_array($origin, $allowed_origins)){
    header("Access-Control-Allow-Origin: " . $origin); 
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

// Check for connection error
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}


$sql = "SELECT b.bill_id, b.servprov_id, p.provider_name, 
        b.unit_id, u.unit_number, b.amount,b.status,b.paid,b.`sevicename`, 
        b.billdate, b.servicedate 
        FROM servbills b 
        LEFT JOIN servproviders p ON b.servprov_id = p.provider_id 
        LEFT JOIN units u ON b.unit_id = u.unit_id";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $bills = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($bills);
} else {
    echo json_encode([]);
}

$conn->close();