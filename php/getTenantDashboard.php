<?php
include ("database.php");

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

// Tenant basic and unit info
$sqlTenant = "SELECT t.name AS tenant_name, t.unit_id, u.unit_number, u.base_rent
              FROM tenants t 
              INNER JOIN units u ON u.unit_id = t.unit_id
              WHERE t.tenant_id = ? LIMIT 1";
if ($stmt = $conn->prepare($sqlTenant)) {
    $stmt->bind_param("i", $tenant_id);
    if ($stmt->execute()) {
        $res = $stmt->get_result();
        if ($row = $res->fetch_assoc()) {
            $response['tenant_name'] = $row['tenant_name'];
            $response['unit_id'] = intval($row['unit_id']);
            $response['unit_label'] = $row['unit_number'];
            $response['base_rent'] = $row['base_rent'];
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Tenant not found"]);
            $stmt->close();
            $conn->close();
            exit();
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $stmt->error]);
        $stmt->close();
        $conn->close();
        exit();
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $conn->error]);
    $conn->close();
    exit();
}

$unit_id = $response['unit_id'];

// Due bills count for this unit
$sqlDue = "SELECT COUNT(*) AS due_bills_count FROM bills WHERE unit_id = ? AND status IN ('unpaid','pending','overdue')";
if ($stmt = $conn->prepare($sqlDue)) {
    $stmt->bind_param("i", $unit_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $response['due_bills_count'] = intval($row['due_bills_count'] ?? 0);
    $stmt->close();
}

// Paid this month sum for this unit
$sqlPaidMonth = "SELECT COALESCE(SUM(payments.amount),0) AS total_paid FROM payments 
inner join bills ON payments.rentbill_id=bills.bill_id WHERE bills.unit_id = ? AND YEAR(payments.paid_on) = YEAR(CURDATE()) AND MONTH(payments.paid_on) = MONTH(CURDATE())";
if ($stmt = $conn->prepare($sqlPaidMonth)) {
    $stmt->bind_param("i", $unit_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $response['paid_this_month'] = floatval($row['total_paid'] ?? 0);
    $stmt->close();
}

// Last payment info
$sqlLastPayment = "SELECT payments.amount, payments.paid_on FROM payments 
inner join bills ON payments.rentbill_id=bills.bill_id WHERE bills.unit_id = ? ORDER BY payments.paid_on DESC LIMIT 1";
if ($stmt = $conn->prepare($sqlLastPayment)) {
    $stmt->bind_param("i", $unit_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($row = $res->fetch_assoc()) {
        $response['last_payment_amount'] = floatval($row['amount']);
        $response['last_payment_date'] = $row['paid_on'];
    } else {
        $response['last_payment_amount'] = 0;
        $response['last_payment_date'] = null;
    }
    $stmt->close();
}

$response['success'] = true;
echo json_encode($response);

$conn->close();
