<?php
include ("database.php");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Check for connection error
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}


$sql = "SELECT * FROM properties";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $properties = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($properties);
} else {
    echo "Property not found.";
    exit;
}

$conn->close();