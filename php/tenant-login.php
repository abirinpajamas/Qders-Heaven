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

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit();
}

$email = $data->email ?? '';
$password = $data->password ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit();
}

$response = ["success" => false, "message" => ""];

try {
    // Check if it's login or signup based on presence of name field
    
        // Login logic
        $sql = "SELECT t.*, u.unit_number,u.unit_id, p.name as property_name,p.property_id
                FROM tenant_accounts t
                inner JOIN tenants te ON t.tenant_id = te.tenant_id
                inner JOIN units u ON te.unit_id = u.unit_id
                inner JOIN properties p ON u.property_id = p.property_id
                WHERE t.email = ? ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $tenant = $result->fetch_assoc();
            
            if (password_verify($password, $tenant['password_hash'])) {
                // Generate simple token (in production, use JWT)
                $token = base64_encode($tenant['tenant_id'] . ':' . time());
                
                // Set session variables
                $_SESSION['tenant_id'] = $tenant['tenant_id'];
                $_SESSION['tenant_name'] = $tenant['name'];
                $_SESSION['tenant_email'] = $tenant['email'];
                
                $response["success"] = true;
                $response["message"] = "Login successful";
                $response["token"] = $token;
                $response["tenant"] = [
                    "tenant_id" => $tenant['tenant_id'],
                    "name" => $tenant['name'],
                    "email" => $tenant['email'],
                    "unit_id" => $tenant['unit_id'],
                    "property_id" => $tenant['property_id'],
                    "unit_number" => $tenant['unit_number'],
                    "property_name" => $tenant['property_name']
                ];
            } else {
                $response["message"] = "Invalid email or password";
            }
        } else {
            $response["message"] = "No tenant found with this email";
        }
        $stmt->close();
        
    
    
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
