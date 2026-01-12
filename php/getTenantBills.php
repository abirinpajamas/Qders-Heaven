<?php
// TEMPORARY: Enable errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

include("database.php");

// Start session and check if tenant is logged in
if (!isset($_SESSION['tenant_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? "*";
$allowed_origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://www.qadersheaven.com"
];

if(in_array($origin, $allowed_origins)){
    header("Access-Control-Allow-Origin: " . $origin); 
}
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

$tenant_id = $_SESSION['tenant_id'];

// Get tenant's unit_id first
$tenant_sql = "SELECT unit_id FROM tenants WHERE tenant_id = ? LIMIT 1";
$tenant_stmt = $conn->prepare($tenant_sql);
$tenant_stmt->bind_param("i", $tenant_id);
$tenant_stmt->execute();
$tenant_data = $tenant_stmt->get_result()->fetch_assoc();

if (!$tenant_data) {
    echo json_encode(["success" => true, "bills" => []]);
    $conn->close();
    exit();
}

$unit_id = $tenant_data['unit_id'];

// Get bills for this tenant's unit
$bills_sql = "SELECT 
    b.bill_id,
    b.amount,
    b.paid,
    b.period_start,
    b.period_end,
    b.status,
    b.created_at,
    u.unit_number,
    p.name as property_name
    FROM bills b
    LEFT JOIN units u ON b.unit_id = u.unit_id
    LEFT JOIN properties p ON u.property_id = p.property_id
    WHERE b.tenant_id = ? 
    ORDER BY b.period_start DESC, b.created_at DESC";

$bills_stmt = $conn->prepare($bills_sql);
$bills_stmt->bind_param("i", $tenant_id);
$bills_stmt->execute();
$bills_result = $bills_stmt->get_result();

$bills = [];
while ($row = $bills_result->fetch_assoc()) {
    $bills[] = [
        'bill_id' => $row['bill_id'],
        'amount' => floatval($row['amount']),
        'paid' => floatval($row['paid']),
        'remaining' => floatval($row['amount']) - floatval($row['paid']),
        'period_start' => $row['period_start'],
        'period_end' => $row['period_end'],
        'status' => $row['status'],
        'created_at' => $row['created_at'],
        'unit_number' => $row['unit_number'],
        'property_name' => $row['property_name']
    ];
}

echo json_encode([
    "success" => true, 
    "bills" => $bills
]);

$conn->close();
?>