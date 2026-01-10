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
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->id)) {
    echo json_encode(["success" => false, "message" => "Bill ID is required"]);
    exit();
}

$bill_id = $data->id;

$response = ["success" => false, "message" => ""];

try {
    // First check if there are any payments associated with this bill
    $check_sql = "SELECT payment_id FROM payments WHERE rentbill_id = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("i", $bill_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        $response["message"] = "Cannot delete bill: It has associated payments";
    } else {
        // Delete the bill
        $delete_sql = "DELETE FROM bills WHERE bill_id = ?";
        $delete_stmt = $conn->prepare($delete_sql);
        $delete_stmt->bind_param("i", $bill_id);
        
        if ($delete_stmt->execute()) {
            $response["success"] = true;
            $response["message"] = "Bill deleted successfully";
        } else {
            $response["message"] = "Failed to delete bill";
        }
        $delete_stmt->close();
    }
    $check_stmt->close();
    
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
