<?php
include ("database.php");

$origin = $_SERVER['HTTP_ORIGIN'] ?? "*";
$allowed_origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://www.qadersheaven.com"
];

if(in_array($origin, $allowed_origins)){
    header("Access-Control-Allow-Origin: " . $origin); 
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
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
    'tenants_count' => "SELECT COUNT(*) FROM tenants WHERE status = 'Current';",
    'properties_count' => "SELECT COUNT(*) FROM properties;",
    'duebills_count' => "SELECT COUNT(*) FROM bills WHERE status IN ('unpaid','partially paid', 'pending', 'overdue') AND tenant_id is not NULL;",
    
    // Revenue - Current Month
    'revenue' => "SELECT SUM(amount) FROM payments WHERE YEAR(paid_on) = YEAR(CURDATE()) AND MONTH(paid_on) = MONTH(CURDATE()) AND servbill_id IS NULL;",
    
    // Revenue - Previous Month
    'prev_revenue' => "SELECT SUM(amount) FROM payments WHERE paid_on >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') AND paid_on < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND servbill_id IS NULL;",

    // Property Growth
    'properties_prev' => "SELECT COUNT(*) FROM properties WHERE created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01');",
    // Tenant Growth
    'tenants_prev' => "SELECT COUNT(*) FROM tenants WHERE created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01');",];

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
    $data=['name'=>$_SESSION['admin_name'],'res'=>$response_data];
    echo json_encode($data);
} else {
    // Return the database error
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "A database query failed.", "details" => $response_data]);
}

$conn->close();

?>