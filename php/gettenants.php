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
    t.*,         
    u.unit_number,u.base_rent,
    p.name AS property_name  -- Select the property name and alias it for clarity
FROM
    tenants t
INNER JOIN
    units u ON t.unit_id = u.unit_id
INNER JOIN
    properties p ON u.property_id = p.property_id;";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $tenants = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($tenants);
} else {
    echo json_encode(["message" => "tenants not found."]);
    exit;
}

$conn->close();