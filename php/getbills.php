<?php
include ("database.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "SELECT b.bill_id, b.unit_id, b.period_start, b.period_end, b.amount, b.meter_id, b.status, b.notes,
        b.changes, u.unit_number, u.property_id, p.name AS property_name, t.name AS tenant_name 
        FROM bills b INNER JOIN units u ON b.unit_id = u.unit_id 
        INNER JOIN properties p ON u.property_id = p.property_id 
        LEFT JOIN tenants t ON t.unit_id = u.unit_id 
        WHERE t.status = 'Current';";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $bills = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($bills);
} else {
    echo json_encode([]);
}

$conn->close();
