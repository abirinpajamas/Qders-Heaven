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
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));
    $bill_id = isset($data->bill_id) ? intval($data->bill_id) : 0;
    $status = isset($data->status) ? trim($data->status) : '';

    if ($bill_id <= 0 || $status === '') {
        echo json_encode(["success" => false, "message" => "Invalid bill id or status."]);
        exit();
    }

    $sql = "UPDATE bills SET status = ?, changes = NOW() WHERE bill_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $status, $bill_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Status updated"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating status.", "error" => $stmt->error]);
    }
    $stmt->close();
}

$conn->close();
