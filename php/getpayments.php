<?php
include("database.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Accept optional date range
$data = json_decode(file_get_contents("php://input"), true);
$start_date = $data['start_date'] ?? $_GET['start_date'] ?? date('Y-m-01');
$end_date = $data['end_date'] ?? $_GET['end_date'] ?? date('Y-m-d');

// Fetch all payment records with joined info
$sql = "SELECT p.payment_id,(b.amount - b.paid) as due, p.paid_on, p.amount, p.payment_method, p.reference_number, p.notes, p.rentbill_id, p.servbill_id, 
  t.name AS tenant_name, u.unit_number, b.status AS bill_status
FROM payments p
LEFT JOIN bills b ON p.rentbill_id = b.bill_id
LEFT JOIN tenants t ON b.tenant_id = t.tenant_id
LEFT JOIN units u ON b.unit_id = u.unit_id
WHERE p.paid_on BETWEEN ? AND ? AND p.servbill_id IS NULL
ORDER BY p.paid_on DESC, p.payment_id DESC";

$response = ["success"=>false];

try {
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $start_date, $end_date);
    $stmt->execute();
    $result = $stmt->get_result();
    $payments = [];
    while ($row = $result->fetch_assoc()) {
        $payments[] = $row;
    }
    $stmt->close();
    $response = [
        "success" => true,
        "payments" => $payments
    ];
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
