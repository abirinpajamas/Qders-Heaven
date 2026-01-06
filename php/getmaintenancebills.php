<?php
include ("database.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Check for connection error
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}


$sql = "SELECT 
    b.bill_number, 
    b.provider_id, 
    p.provider_name, 
    b.unit_id, 
    u.unit_number, 
    b.amount, 
    b.description, 
    b.bill_date, 
    b.due_date
FROM servbills b
LEFT JOIN service_providers p ON b.provider_id = p.provider_id
LEFT JOIN units u ON b.unit_id = u.unit_id";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $bills = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($bills);
} else {
    echo json_encode([]);
}

$conn->close();