<?php
// Suppress warnings to prevent HTML in JSON response
error_reporting(0);
ini_set('display_errors', 0);

include ("database.php");
include ("auhcheck.php");

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


$sql = "SELECT
    t.*,u.unit_id,         
    u.unit_number,u.base_rent,
    p.name AS property_name  -- Select the property name and alias it for clarity
FROM
    tenants t
Left JOIN
    units u ON t.unit_id = u.unit_id
Left JOIN
    properties p ON u.property_id = p.property_id;";

$sql2="SELECT tenant_id FROM tenant_accounts";

$result = $conn->query($sql);
$result2=$conn->query($sql2);

if ($result->num_rows > 0) {
    $tenants = $result->fetch_all(MYSQLI_ASSOC);
    $tenants2=$result2->fetch_all(MYSQLI_ASSOC);
    $data=['role'=>$_SESSION['admin_role'],'tenants'=>$tenants,'tenantsaccounts'=>$tenants2];
    echo json_encode($data);
} else {
    echo json_encode(["message" => "tenants not found."]);
    exit;
}

$conn->close();