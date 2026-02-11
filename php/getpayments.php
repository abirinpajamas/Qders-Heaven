<?php
include("database.php");
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
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Accept optional date range
$data = json_decode(file_get_contents("php://input"), true);
$start_date = $data['start_date'] ?? $_GET['start_date'] ?? date('Y-m-01');
$end_date = $data['end_date'] ?? $_GET['end_date'] ?? date('Y-m-d');

// Fetch all payment records with joined info
$sql = "SELECT p.payment_id, (b.amount - b.paid) as due, p.paid_on, p.amount, p.payment_method, p.reference_number, p.notes, p.rentbill_id, p.servbill_id, 
  t.name AS tenant_name, u.unit_number, b.status AS bill_status
FROM payments p
LEFT JOIN bills b ON p.rentbill_id = b.bill_id
LEFT JOIN tenants t ON b.tenant_id = t.tenant_id
LEFT JOIN units u ON b.unit_id = u.unit_id
WHERE p.paid_on BETWEEN ? AND ? AND p.servbill_id IS NULL
ORDER BY p.paid_on DESC, p.payment_id DESC";

$sql1 = "SELECT 
    COALESCE(SUM(amount - paid), 0) AS total_due_amount,
    COUNT(bill_id) AS pending_bills_count
FROM bills
WHERE status IN ('unpaid', 'partially paid')
  AND period_start <= ? 
  AND period_end >= ?";

$response = ["success" => false];

try {
    // First query
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        throw new Exception("Query preparation failed: " . $conn->error);
    }
    
    $stmt->bind_param("ss", $start_date,$end_date);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // IMPORTANT: Fetch all results from first query before starting second query
    $payments = [];
    while ($row = $result->fetch_assoc()) {
        $payments[] = $row;
    }
    
    // Close first statement before preparing second one
    $stmt->close();
    
    // Now prepare and execute second query
    $stmt1 = $conn->prepare($sql1);
    
    if ($stmt1 === false) {
        throw new Exception("Query preparation failed: " . $conn->error);
    }
    
    $stmt1->bind_param("ss", $end_date, $start_date);
    $stmt1->execute();
    $result1 = $stmt1->get_result();
    
    $pending_bills = $result1->fetch_assoc();
    $total_due_amount = $pending_bills['total_due_amount'] ?? 0;
    $pending_bills_count = $pending_bills['pending_bills_count'] ?? 0;
    
    $stmt1->close();
    
    $response = [
        "success" => true,
        "payments" => $payments,
        "total_due_amount" => $total_due_amount,
        "pending_bills_count" => $pending_bills_count
    ];
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);