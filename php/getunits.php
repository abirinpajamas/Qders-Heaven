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


$sql = "SELECT units.*,properties.name,tenants.tenant_id,tenants.name as tenantname FROM units inner join properties ON properties.property_id = units.property_id left join tenants on tenants.unit_id=units.unit_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $units = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($units);
} else {
    echo json_encode([]);
}

$conn->close();