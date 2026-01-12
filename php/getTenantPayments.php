<?php
// Headers MUST come before any output
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

// Enable errors for debugging (remove after fixing)
error_reporting(E_ALL);
ini_set('display_errors', 1);

include("database.php");

// Start session and check if tenant is logged in
if (!isset($_SESSION['tenant_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

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
    echo json_encode(["success" => true, "payments" => []]);
    $conn->close();
    exit();
}

$unit_id = $tenant_data['unit_id'];

// Get payments for this tenant's unit
$payments_sql = "SELECT 
    p.payment_id,
    p.amount,
    p.paid_on,
    p.payment_method,
    p.reference_number,
    p.notes,
    b.bill_id,
    b.period_start,
    b.period_end,
    u.unit_number
    FROM payments p
    LEFT JOIN bills b ON p.rentbill_id = b.bill_id
    LEFT JOIN units u ON b.unit_id = u.unit_id
    LEFT JOIN tenants t ON u.unit_id = t.unit_id
    WHERE t.tenant_id = ?
    ORDER BY p.paid_on DESC";

$payments_stmt = $conn->prepare($payments_sql);
$payments_stmt->bind_param("i", $tenant_id);
$payments_stmt->execute();
$payments_result = $payments_stmt->get_result();

$payments = [];
while ($row = $payments_result->fetch_assoc()) {
    $payments[] = [
        'payment_id' => $row['payment_id'],
        'amount' => floatval($row['amount']),
        'paid_on' => $row['paid_on'],
        'payment_method' => $row['payment_method'],
        'reference' => $row['reference_number'],
        'note' => $row['notes'],
        'bill_id' => $row['bill_id'],
        'period_start' => $row['period_start'],
        'period_end' => $row['period_end'],
        'unit_number' => $row['unit_number']
    ];
}

echo json_encode([
    "success" => true, 
    "payments" => $payments
]);

$conn->close();
?>