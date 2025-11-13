<?php
include ("database.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Check for connection error
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// 1. Define all necessary SQL queries
$queries = [
    // Count of currently active tenants
    'tenants_count' => "SELECT COUNT(*) FROM Tenants WHERE status = 'Current';",
    
    // Count of total properties
    'properties_count' => "SELECT COUNT(*) FROM properties;",
    
    // Count of unpaid/pending/overdue bills
    'duebills_count' => "SELECT COUNT(*) FROM bills WHERE status IN ('unpaid', 'pending', 'overdue');",
    
    // Sum of amounts paid this month
    'revenue' => "SELECT SUM(paid_amount) AS total_paid FROM payments WHERE YEAR(paid_on) = YEAR(CURDATE()) AND MONTH(paid_on) = MONTH(CURDATE());"
];

// Initialize the final response array
$response_data = [];
$success = true;

// 2. Execute each query and collect results
foreach ($queries as $key => $sql) {
    $result = $conn->query($sql);

    if ($result) {
        $row = $result->fetch_row();
        // Store the result. SUM() and COUNT() always return one row with one column.
        // If SUM is null (no payments), set it to 0 for consistency.
        $value = ($row[0] === null && $key === 'total_paid_this_month') ? 0 : $row[0];
        
        $response_data[$key] = $value;
        $result->free(); // Free memory
    } else {
        // If any query fails, mark as failure and store the error
        $success = false;
        $response_data['error_query'] = $key;
        $response_data['database_error'] = $conn->error;
        break; // Stop execution on the first query error
    }
}

// 3. Return the final JSON response
if ($success) {
    // Return all calculated counts/sums
    echo json_encode($response_data);
} else {
    // Return the database error
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "A database query failed.", "details" => $response_data]);
}

$conn->close();

?>