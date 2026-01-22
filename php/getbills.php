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

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "SELECT 
    b.bill_id, 
    b.unit_id, 
    b.period_start, 
    b.period_end, 
    b.amount, 
    b.paid, 
    b.meter_id, 
    b.status, 
    b.notes, 
    b.changes, 
    u.unit_number, 
    u.property_id, 
    p.name AS property_name, 
    t.name AS tenant_name,
    t.Status as tenantstatus 
FROM bills b
-- 1. Join units to get the room number
INNER JOIN units u ON b.unit_id = u.unit_id 
-- 2. Join properties to get the building name
INNER JOIN properties p ON u.property_id = p.property_id 
-- 3. JOIN DIRECTLY TO TENANT via tenant_id (The most important change)
INNER JOIN tenants t ON b.tenant_id = t.tenant_id;";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $bills = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($bills);
} else {
    echo json_encode([]);
}

$conn->close();
