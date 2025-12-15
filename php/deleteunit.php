<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
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

    if ($id <= 0) {
        echo json_encode(["success" => false, "message" => "Invalid unit id."]);
        exit();
    }

    $sql = "DELETE FROM units WHERE unit_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Delete successful"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting unit.", "error" => $stmt->error]);
    }
    $stmt->close();
}
