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

if (!$data || !isset($data->startperiod) || !isset($data->endperiod)) {
    echo json_encode(["success" => false, "message" => "Start and end periods are required"]);
    exit();
}

$startperiod = $data->startperiod;
$endperiod = $data->endperiod;

$response = ["success" => false, "message" => "", "generated_bills" => 0];

try {
    // Get all active tenants with their units and rent amounts
    $sql = "SELECT t.tenant_id, u.unit_id, u.base_rent
            FROM tenants t
            inner JOIN units u ON t.unit_id = u.unit_id
            WHERE t.status = 'Current'";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $generated_count = 0;
        
        while ($tenant = $result->fetch_assoc()) {
            // Check if bill already exists for this period and unit
            $check_sql = "SELECT bill_id FROM bills 
              WHERE unit_id = ? 
              AND period_start <= ? 
              AND period_end >= ?";
            $check_stmt = $conn->prepare($check_sql);
            $check_stmt->bind_param("iss", $tenant['unit_id'], $endperiod,$startperiod);
            $check_stmt->execute();
            $check_result = $check_stmt->get_result();
            
            if ($check_result->num_rows == 0) {
                // Insert new bill
                $insert_sql = "INSERT INTO bills (unit_id, tenant_id, period_start, period_end, amount, status,notes)
                               VALUES (?, ?, ?, ?, ?, 'unpaid',?)";
                $insert_stmt = $conn->prepare($insert_sql);
                $notes = "Generation";
                $insert_stmt->bind_param("iissds", 
                    $tenant['unit_id'], 
                    $tenant['tenant_id'], 
                    $startperiod, 
                    $endperiod, 
                    $tenant['base_rent'], 
                    $notes
                );
                
                if ($insert_stmt->execute()) {
                    $generated_count++;
                }
                $insert_stmt->close();
            }
            $check_stmt->close();
        }
        
        $response["success"] = true;
        $response["message"] = $generated_count==0? "Bills already exist for this Period. No bills generated" : "Successfully generated $generated_count monthly bills";
        $response["generated_bills"] = $generated_count;
    } else {
        $response["message"] = "No active tenants found";
    }
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
