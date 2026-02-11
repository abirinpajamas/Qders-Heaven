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

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}
	

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}


  $baseUploadDir = '../uploads/';
$tenantDirs = [
    'properties/property/',
  
];

foreach ($tenantDirs as $dir) {
    $fullPath = $baseUploadDir . $dir;
    if (!file_exists($fullPath)) {
        mkdir($fullPath, 0755, true);
    }
}

function uploadFile($file, $directory, $prefix = '') {
    global $baseUploadDir;
    
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return null;
    }
    
    // Validate file
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    $maxFileSize = 5 * 1024 * 1024; // 5MB
    
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception("Invalid file type. Only images and PDFs are allowed.");
    }
    
    if ($file['size'] > $maxFileSize) {
        throw new Exception("File size too large. Maximum 5MB allowed.");
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = $prefix . uniqid('',true) . '_' . time() . '.' . $extension;
    $uploadPath = $baseUploadDir . $directory . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        return 'uploads/' . $directory . $filename;
    } else {
        throw new Exception("Failed to upload file.");
    }
}

   
  if($_SERVER["REQUEST_METHOD"] === "POST") {
      $data = json_decode(file_get_contents("php://input")); 

    $name = $_POST['name']??'';
    $totalfloors = $_POST['total_floors']??'';
    $address = $_POST['address']??'';
    $units = $_POST['total_units']??'';
    $description = $_POST['description']??'';
    $status = $_POST['status']??'';
    $picturePath = null;

    if (isset($_FILES['property_image'])) {
        $picturePath = uploadFile($_FILES['property_image'], 'properties/property/', 'property_');
    }

    $sql = "insert into properties (name, total_floors, address, total_units, description, status, property_picture_url) 
       values (?,?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $name, $totalfloors, $address, $units, $description, $status, $picturePath);

    if ($stmt->execute()) {
        $response=["success" => true, "message" => "Input successful"];
        echo json_encode($response);
    }
    else {

        $error=$stmt->error;
        if (strpos($error, "phone_no") !== false){
            $response=["success" => false, "message" => "Username already taken." ];
            echo json_encode($response);
        }
        else if (strpos($error, "provider_name") !== false){
            $response=["success" => false, "message" => "Email already exists." ];
            echo json_encode($response);
        }
        else {
        $response=["success" => false, "message" => "Error try again." ];
        echo json_encode($response);
        }
    }
    $stmt->close();
    }
    
    $conn->close();

?>