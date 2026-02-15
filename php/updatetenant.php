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

// DEBUG: Log what we're receiving
error_log("=== UPDATE TENANT DEBUG ===");
error_log("Raw input: " . file_get_contents("php://input"));
error_log("Decoded data: " . print_r($data, true));

$tenant_id = $data['tenant_id'] ?? null;
$field = $data['field'] ?? null;
$value = $data['value'] ?? null;

error_log("Extracted - tenant_id: $tenant_id, field: $field, value: $value");

// 2. Validate input
if (!$tenant_id || !$field) {
    error_log("Validation failed - tenant_id: " . ($tenant_id ? 'set' : 'missing') . ", field: " . ($field ? 'set' : 'missing'));
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request data.", "debug" => ["tenant_id" => $tenant_id, "field" => $field, "value" => $value]]);
    exit();
}

// 3. Whitelist allowed columns (Security step: prevents updating password/sensitive fields)
$allowed_fields_tenants = [
    'name', 'phone1', 'phone2', 'email', 'nid_num', 'father', 'mother', 
    'Occupation', 'Work_Address', 'Present_Address', 'Permanent_address', 
    'ward', 'thana', 'Citycorp', 'Advance', 'start_date', 'end_date', 
    'fam_name', 'fam_rltn', 'fam_DOB', 'notes', 'base_rent'
];

if (!in_array($field, $allowed_fields_tenants)) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Updating this field is not allowed."]);
    exit();
}

// 4. Prepare the dynamic SQL
// Handle base_rent separately since it's in the units table
if ($field === 'base_rent') {
    // Need to get unit_id from tenant first
    $getUnitSql = "SELECT unit_id FROM tenants WHERE tenant_id = ?";
    $getUnitStmt = $conn->prepare($getUnitSql);
    $getUnitStmt->bind_param("i", $tenant_id);
    $getUnitStmt->execute();
    $unitResult = $getUnitStmt->get_result();
    $unitData = $unitResult->fetch_assoc();
    $getUnitStmt->close();
    
    if (!$unitData || !$unitData['unit_id']) {
        error_log("No unit found for tenant: $tenant_id");
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "No unit found for this tenant."]);
        exit();
    }
    
    $unit_id = $unitData['unit_id'];
    $sql = "UPDATE units SET $field = ? WHERE unit_id = ?";
    error_log("SQL Query (units table): $sql");
    error_log("Field: $field, Value: $value, Unit ID: $unit_id");
} else {
    $sql = "UPDATE tenants SET $field = ? WHERE tenant_id = ?";
    error_log("SQL Query (tenants table): $sql");
    error_log("Field: $field, Value: $value, Tenant ID: $tenant_id");
}

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Database prepare failed. Error: " . $conn->error);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database prepare failed.", "debug" => ["sql" => $sql, "error" => $conn->error]]);
    exit();
}

// 5. Bind and Execute
// Use appropriate ID and parameter types based on which table we're updating
if ($field === 'base_rent') {
    // For units table: bind value and unit_id
    $stmt->bind_param("si", $value, $unit_id);
    $log_id = $unit_id;
} else {
    // For tenants table: bind value and tenant_id
    $stmt->bind_param("si", $value, $tenant_id);
    $log_id = $tenant_id;
}

error_log("Binding params - Value: $value, ID: $log_id");

if ($stmt->execute()) {
    echo json_encode([
        "success" => true, 
        "message" => "Field updated successfully.",
        "updated_field" => $field,
        "new_value" => $value
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Execute error: " . $stmt->error]);
}

$stmt->close();
$conn->close();