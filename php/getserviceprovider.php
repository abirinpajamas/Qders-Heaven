<?php
include ("database.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Check for connection error
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}


$sql = "SELECT * FROM servproviders";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $units = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($units);
} else {
    echo "Units not found.";
    exit;
}

$conn->close();