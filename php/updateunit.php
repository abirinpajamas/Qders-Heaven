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


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Get the JSON data
$data = json_decode(file_get_contents("php://input"), true);

$unit_id = $data['unit_id'] ?? null;
$field = $data['field'] ?? null;
$value = $data['value'] ?? null;

// 2. Validate input
if (!$unit_id || !$field) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request data."]);
    exit();
}

// 3. Whitelist allowed columns (Security step: prevents updating sensitive fields)
$allowed_fields = [
    'unit_number', 
    'bedrooms', 
    'bathrooms', 
    'electricmeter', 
    'gasmeter', 
    'square_footage', 
    'base_rent', 
    'type', 
    'status'
];

if (!in_array($field, $allowed_fields)) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Updating this field is not allowed."]);
    exit();
}

// 4. Prepare the dynamic SQL
$sql = "UPDATE units SET $field = ? WHERE unit_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database prepare failed."]);
    exit();
}

// 5. Bind and Execute
$stmt->bind_param("si", $value, $unit_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true, 
        "message" => "Unit field updated successfully.",
        "updated_field" => $field,
        "new_value" => $value
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Execute error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
