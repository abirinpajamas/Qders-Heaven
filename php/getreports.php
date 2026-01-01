<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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
  $start = isset($data->start) ? $data->start : null;
  $end = isset($data->end) ? $data->end : null;

  if (!$start || !$end) {
    echo json_encode(["success" => false, "message" => "Start and end dates are required."]);
    exit();
  }

  $sql = "SELECT 
            b.bill_id,
            b.unit_id,
            b.period_start,
            b.period_end,
            b.amount,
            b.meter_id,
            b.status,
            b.notes,
            b.changes,
            u.unit_number,
            u.property_id,
            p.name AS property_name,
            t.name AS tenant_name
          FROM bills b
          INNER JOIN units u ON b.unit_id = u.unit_id
          INNER JOIN properties p ON u.property_id = p.property_id
          LEFT JOIN tenants t ON t.unit_id = u.unit_id
          WHERE b.period_start >= ? AND b.period_end <= ?";

  $stmt = $conn->prepare($sql);
  $stmt->bind_param("ss", $start, $end);
  if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Query failed", "error" => $stmt->error]);
    exit();
  }
  $result = $stmt->get_result();
  $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
  echo json_encode(["success" => true, "data" => $rows]);
  $stmt->close();
  $conn->close();
  exit();
}

echo json_encode(["success" => false, "message" => "Invalid method"]);
