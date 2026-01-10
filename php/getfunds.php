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

// Get date range from request (POST preferred, fallback to GET)
$data = json_decode(file_get_contents("php://input"), true);
$start_date = $data['start_date'] ?? $_GET['start_date'] ?? date('Y-m-d', strtotime('-30 days'));
$end_date = $data['end_date'] ?? $_GET['end_date'] ?? date('Y-m-d');

// Total Income (rents only)
$income_sql = "SELECT COALESCE(SUM(amount),0) AS total_income FROM payments WHERE paid_on BETWEEN ? AND ? AND servbill_id IS NULL";
// Total Expenses (services only)
$expense_sql = "SELECT COALESCE(SUM(amount),0) AS total_expense FROM payments WHERE paid_on BETWEEN ? AND ? AND rentbill_id IS NULL";
// Recent Transactions
$recent_sql = "SELECT payment_id, paid_on, amount, payment_method, reference_number, notes, rentbill_id, servbill_id FROM payments WHERE paid_on BETWEEN ? AND ? ORDER BY paid_on DESC, payment_id DESC LIMIT 15";

$response = ["success"=>false];

try {
    // Income
    $stmt = $conn->prepare($income_sql);
    $stmt->bind_param("ss", $start_date, $end_date);
    $stmt->execute();
    $stmt->bind_result($total_income);
    $stmt->fetch();
    $stmt->close();
    // Expenses
    $stmt = $conn->prepare($expense_sql);
    $stmt->bind_param("ss", $start_date, $end_date);
    $stmt->execute();
    $stmt->bind_result($total_expense);
    $stmt->fetch();
    $stmt->close();
    // Recent Transactions
    $stmt = $conn->prepare($recent_sql);
    $stmt->bind_param("ss", $start_date, $end_date);
    $stmt->execute();
    $result = $stmt->get_result();
    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $row['type'] = $row['rentbill_id'] ? 'Income' : 'Expense';
        $transactions[] = $row;
    }
    $stmt->close();
    $response = [
        "success" => true,
        "total_income" => (float)$total_income,
        "total_expense" => (float)$total_expense,
        "total_revenue" => (float)$total_income - (float)$total_expense,
        "transactions" => $transactions
    ];
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
