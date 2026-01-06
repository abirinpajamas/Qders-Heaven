<?php
include("database.php");

header("Access-Control-Allow-Origin:*"); // More secure than *
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // If it's an OPTIONS request, return 200 OK and exit immediately
    http_response_code(200);
    exit();
}

// 3. Now check for POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$provider_id = isset($data['provider_id']) ? $data['provider_id'] : null;
$unit_id = isset($data['unit_id']) ? $data['unit_id'] : null;
$amount = isset($data['amount']) ? $data['amount'] : null;
$description = isset($data['description']) ? $data['description'] : null;
$servicedate = isset($data['due_date']) ? $data['due_date'] : null;

if (!$provider_id || !$unit_id || !$amount || !$description || !$servicedate) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

$sql = "INSERT INTO servbills (servprov_id, unit_id, amount, sevicename, servicedate) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit();
}
$stmt->bind_param("iiiss", $provider_id, $unit_id, $amount, $description, $servicedate);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Maintenance bill created successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Insert failed: " . $stmt->error]);
}
$stmt->close();
$conn->close();
