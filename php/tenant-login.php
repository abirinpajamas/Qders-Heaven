<?php
include("database.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

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
    $isLogin = !isset($data->name);
    
    if ($isLogin) {
        // Login logic
        $sql = "SELECT t.*, u.unit_number, p.name AS property_name 
                FROM tenants t 
                LEFT JOIN units u ON t.unit_id = u.unit_id 
                LEFT JOIN properties p ON u.property_id = p.property_id 
                WHERE t.email = ? AND t.status = 'Current'";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $tenant = $result->fetch_assoc();
            
            if (password_verify($password, $tenant['password_hash'])) {
                // Generate simple token (in production, use JWT)
                $token = base64_encode($tenant['tenant_id'] . ':' . time());
                
                $response["success"] = true;
                $response["message"] = "Login successful";
                $response["token"] = $token;
                $response["tenant"] = [
                    "tenant_id" => $tenant['tenant_id'],
                    "name" => $tenant['name'],
                    "email" => $tenant['email'],
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
        
    } else {
        // Signup logic
        $name = $data->name ?? '';
        $phone = $data->phone ?? '';
        $unit_id = $data->unit_id ?? '';
        
        if (empty($name) || empty($phone) || empty($unit_id)) {
            echo json_encode(["success" => false, "message" => "Name, phone, and unit ID are required"]);
            exit();
        }
        
        // Check if email already exists
        $check_sql = "SELECT tenant_id FROM tenants WHERE email = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("s", $email);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if ($check_result->num_rows > 0) {
            $response["message"] = "Email already exists";
        } else {
            // Hash password
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert new tenant
            $insert_sql = "INSERT INTO tenants (name, email, phone, password_hash, unit_id, status, created_at) 
                           VALUES (?, ?, ?, ?, ?, 'Current', NOW())";
            $insert_stmt = $conn->prepare($insert_sql);
            $insert_stmt->bind_param("sssis", $name, $email, $phone, $password_hash, $unit_id);
            
            if ($insert_stmt->execute()) {
                $tenant_id = $conn->insert_id;
                
                // Generate token
                $token = base64_encode($tenant_id . ':' . time());
                
                $response["success"] = true;
                $response["message"] = "Registration successful";
                $response["token"] = $token;
                $response["tenant"] = [
                    "tenant_id" => $tenant_id,
                    "name" => $name,
                    "email" => $email,
                    "phone" => $phone,
                    "unit_id" => $unit_id
                ];
            } else {
                $response["message"] = "Registration failed";
            }
            $insert_stmt->close();
        }
        $check_stmt->close();
    }
    
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
