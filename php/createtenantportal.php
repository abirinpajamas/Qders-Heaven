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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit();
}

$tenant_id = $data->tenant_id ?? '';
$email = $data->email ?? '';
$tenant_name = $data->tenant_name ?? '';
$password = $data->password ?? '';

if (empty($tenant_id) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Tenant ID, email, and password are required"]);
    exit();
}

$response = ["success" => false, "message" => ""];

try {
    // Check if tenant exists and get their details
    
    
    // Check if tenant already has a portal account
    $check_sql = "SELECT user_id FROM tenant_accounts WHERE tenant_id = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("i", $tenant_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        $response["message"] = "Tenant already has a portal account";
        echo json_encode($response);
        exit();
    }
    
    // Check if email is already used by another portal account
    $email_check_sql = "SELECT user_id FROM tenant_accounts WHERE email = ?";
    $email_check_stmt = $conn->prepare($email_check_sql);
    $email_check_stmt->bind_param("s", $email);
    $email_check_stmt->execute();
    $email_check_result = $email_check_stmt->get_result();
    
    if ($email_check_result->num_rows > 0) {
        $response["message"] = "Email is already used for another portal account";
        echo json_encode($response);
        exit();
    }
    
    // Hash the password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Create tenant portal account
    $insert_sql = "INSERT INTO tenant_accounts (tenant_id, email,name, password_hash) 
                   VALUES (?, ?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("isss", $tenant_id, $email, $tenant_name, $password_hash);
    
    if ($insert_stmt->execute()) {
        $portal_account_id = $conn->insert_id;
        
        $response["success"] = true;
        $response["message"] = "Tenant portal account created successfully";
        $response["portal_account"] = [
            "portal_account_id" => $portal_account_id,
            "tenant_id" => $tenant_id,
            "email" => $email,
            "tenant_name" => $tenant_name
        ];
    } else {
        $response["message"] = "Failed to create portal account";
    }
    
    $insert_stmt->close();
    $email_check_stmt->close();
    $check_stmt->close();
    
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
