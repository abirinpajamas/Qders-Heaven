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
    $id = isset($data->id) ? intval($data->id) : 0;
    $status = isset($data->status) ? $data->status : '';

    if ($id <= 0) {
        echo json_encode(["success" => false, "message" => "Invalid tenant id."]);
        exit();
    }
  
   if ($status === 'Current') {
        $sql="UPDATE units SET status='vacant' WHERE unit_id=?";
        $stmt = $conn->prepare($sql);
        // Bind 2 parameters
        $stmt->bind_param("i", $id);
        $stmt->execute();
        // This query has 2 placeholders (?)
        $sql = "UPDATE tenants SET status = 'Previous', unit_history=(SELECT base_rent FROM units WHERE unit_id=?), unit_id=NULL WHERE unit_id = ? AND status = 'Current'";
        $stmt = $conn->prepare($sql);
        // Bind 2 parameters
        $stmt->bind_param("ii", $id, $id);
    } 
    else if ($status === 'Previous') {
        // This query has 1 placeholder (?)
        $sql = "DELETE FROM tenants WHERE tenant_id = ? AND status = 'Previous'";
        $stmt = $conn->prepare($sql);
        // Bind only 1 parameter
        $stmt->bind_param("i", $id);
    } 
    else {
        echo json_encode(["success" => false, "message" => "Unknown status type."]);
        exit();
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Operation successful"]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error.", "error" => $stmt->error]);
    }
    
    $stmt->close();
}