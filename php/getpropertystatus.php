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

// 1. Corrected spelling and initial structure
$response = [ 
    "details" => [],
    "count" => []
];

// Detail query
$sql = "SELECT * from properties"; 
// Count query
$s_sql = "SELECT property_id, COUNT(unit_id) AS unit_count FROM units WHERE status='occupied' GROUP BY property_id";

$result = $conn->query($sql);
$countres = $conn->query($s_sql);

// Process Property Details
if ($result && $result->num_rows > 0) {
    // 2. Assigns the array of property objects directly to the 'details' key
    $response["details"] = $result->fetch_all(MYSQLI_ASSOC);

    // 3. Optimized Count Data Format (The main fix)
    if ($countres && $countres->num_rows > 0) {
        // Creates a key-value map for easy frontend access
            $response["count"] =$countres->fetch_all(MYSQLI_ASSOC);
        
    }
    
    echo json_encode($response);

} else {
    // 4. Corrected error message clarity
    echo json_encode(["message" => "Properties not found."]);
    // Removed 'exit' here as $conn->close() should run, though it's not critical.
}

$conn->close();

?>