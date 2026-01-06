<?php
include("database.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// Get the specific bill ID and the TYPE (rent or service)
$bill_id = $data['bill_id'] ?? null;
$bill_type = $data['bill_type'] ?? null; // 'rent' or 'service'
$paid_on = $data['paid_on'] ?? null;
$amount = $data['amount'] ?? null;
$payment_method = $data['payment_method'] ?? null;
$reference = $data['reference'] ?? null;
$note = $data['note'] ?? null;

if (!$bill_id || !$bill_type || !$paid_on || !$amount || !$payment_method) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

// Logic to decide which column to fill
$rentbill_id = ($bill_type === 'rent') ? $bill_id : null;
$servbill_id = ($bill_type === 'service') ? $bill_id : null;

$sql = "INSERT INTO payments (rentbill_id, servbill_id, paid_on, amount, payment_method, reference_number, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
// "iids sss" -> int, int, date(string), double, string, string, string
$stmt->bind_param("iisdsss", $rentbill_id, $servbill_id, $paid_on, $amount, $payment_method, $reference, $note);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Payment recorded successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();