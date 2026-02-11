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

// DEBUG: Log what we're receiving
error_log("=== UPDATE PROPERTY DEBUG ===");
error_log("FILES: " . print_r($_FILES, true));
error_log("POST: " . print_r($_POST, true));
error_log("Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
error_log("HTTP_Content-Type: " . ($_SERVER['HTTP_CONTENT_TYPE'] ?? 'not set'));

// Check if this is a file upload request by checking $_FILES
if (!empty($_FILES) && isset($_FILES['property_image'])) {
    error_log("Processing as FILE UPLOAD");
    
    // Handle file upload
    $property_id = $_POST['property_id'] ?? null;
    $field = $_POST['field'] ?? null;
    
    if (!$property_id || $field !== 'property_image') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid file upload request. ID: $property_id, Field: $field"]);
        exit();
    }

    // Create upload directory if it doesn't exist
    $baseUploadDir = '../uploads/';
    $propertyDirs = ['properties/property/'];
    
    foreach ($propertyDirs as $dir) {
        $fullPath = $baseUploadDir . $dir;
        if (!file_exists($fullPath)) {
            mkdir($fullPath, 0755, true);
        }
    }

    function uploadFile($file, $directory, $prefix = '') {
        global $baseUploadDir;
        
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            error_log("Upload error: " . ($file['error'] ?? 'file not set'));
            return null;
        }
        
        // Validate file
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        $maxFileSize = 5 * 1024 * 1024; // 5MB
        
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception("Invalid file type. Only images are allowed.");
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
            error_log("File uploaded successfully to: $uploadPath");
            return 'uploads/' . $directory . $filename;
        } else {
            throw new Exception("Failed to upload file.");
        }
    }

    try {
    $picturePath = null;
    if (isset($_FILES['property_image'])) {
        
        // --- NEW STEP: DELETE OLD PHOTO ---
        // 1. Get the current photo path from DB
        $getOldSql = "SELECT property_picture_url FROM properties WHERE property_id = ?";
        $getStmt = $conn->prepare($getOldSql);
        $getStmt->bind_param("i", $property_id);
        $getStmt->execute();
        $res = $getStmt->get_result();
        $oldData = $res->fetch_assoc();
        $getStmt->close();

        $oldPhotoPath = $oldData['property_picture_url'] ?? null;

        // 2. Upload the new file
        $picturePath = uploadFile($_FILES['property_image'], 'properties/property/', 'property_');

        if ($picturePath) {
            // 3. Delete the old file from the server directory
            // We use ../ to go from the PHP folder to the root where /uploads is
            if ($oldPhotoPath) {
                $absoluteOldPath = "../" . $oldPhotoPath;
                if (file_exists($absoluteOldPath)) {
                    unlink($absoluteOldPath); 
                    error_log("Deleted old file: " . $absoluteOldPath);
                }
            }

            // 4. Update database with new image path
            $sql = "UPDATE properties SET property_picture_url = ? WHERE property_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("si", $picturePath, $property_id);
            
            if ($stmt->execute()) {
                echo json_encode([
                    "success" => true,
                    "message" => "Property image updated successfully.",
                    "new_url" => $picturePath
                ]);
            } else {
                throw new Exception("Database update failed.");
            }
            $stmt->close();
        }
    }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }

} else {
    error_log("Processing as JSON UPDATE");
    
    // Handle JSON update (existing logic)
    // 1. Get the JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    error_log("JSON data: " . print_r($data, true));

    $property_id = $data['property_id'] ?? null;
    $field = $data['field'] ?? null;
    $value = $data['value'] ?? null;

    // 2. Validate input
    if (!$property_id || !$field) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid request data."]);
        exit();
    }

    // 3. Whitelist allowed columns (Security step: prevents updating sensitive fields)
    $allowed_fields = [
        'name',
        'total_floors',
        'address',
        'total_units',
        'status',
        'property_picture_url'
    ];

    if (!in_array($field, $allowed_fields)) {
        error_log("BLOCKED: Field '$field' not in allowed fields");
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Updating this field is not allowed. Field: $field"]);
        exit();
    }

    // 4. Prepare the dynamic SQL
    $sql = "UPDATE properties SET $field = ? WHERE property_id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database prepare failed."]);
        exit();
    }

    // 5. Bind and Execute
    $stmt->bind_param("si", $value, $property_id);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Property field updated successfully.",
            "updated_field" => $field,
            "new_value" => $value
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Execute error: " . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>