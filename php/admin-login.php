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
    $isLogin = !isset($data->name);
    
    if ($isLogin) {
        // Login logic
        $sql = "SELECT user_id, fname, password_hash, email, user_type FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $admin = $result->fetch_assoc();
            
            if (password_verify($password, $admin['password_hash'])) {
                // Generate simple token (in production, use JWT)
                 

                $_SESSION['admin_id'] = $admin['user_id'];
                $_SESSION['admin_name'] = $admin['fname'];
                $_SESSION['admin_email'] = $admin['email'];
                $_SESSION['admin_role'] = $admin['user_type'];
                
                $response["success"] = true;
                $response["message"] = "Login successful";
                $response["admin"] = [
                    "admin_id" => $admin['user_id'],
                    "name" => $admin['fname'],
                    "email" => $admin['email'],
                    "role" => $admin['user_type']
                ];
            } else {
                $response["message"] = "Invalid email or password. ";
            }
        } else {
            $response["message"] = "No admin found with this email";
        }
        $stmt->close();
        
    } else {
        // Signup logic
        $name = $data->name ?? '';
        $role = $data->role ?? '';
        
        if (empty($name) || empty($role)) {
            echo json_encode(["success" => false, "message" => "Name and role are required"]);
            exit();
        }
        
        // Check if email already exists
        $check_sql = "SELECT user_id FROM users WHERE email = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("s", $email);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if ($check_result->num_rows > 0) {
            $response["message"] = "Email already exists";
        } else {
            // Hash password
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert new admin
            $insert_sql = "INSERT INTO users (name, email, password_hash, role, created_at) 
                           VALUES (?, ?, ?, ?, NOW())";
            $insert_stmt = $conn->prepare($insert_sql);
            $insert_stmt->bind_param("sss", $name, $email, $password_hash, $role);
            
            if ($insert_stmt->execute()) {
                $admin_id = $conn->insert_id;
                
                // Generate token
                $token = base64_encode($admin_id . ':' . time());
                
                $response["success"] = true;
                $response["message"] = "Registration successful";
                $response["token"] = $token;
                $response["admin"] = [
                    "admin_id" => $admin_id,
                    "name" => $name,
                    "email" => $email,
                    "role" => $role
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
