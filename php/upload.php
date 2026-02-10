<?php
include("database.php");

// CORS headers
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

// Create upload directories if they don't exist
$baseUploadDir = '../uploads/';
$tenantDirs = [
    'tenants/picture/',
    'tenants/nid/',
    'tenants/passport/'
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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {
        // Get form data
        $unitid = $_POST['unitid'] ?? '';
        $name = $_POST['name'] ?? '';
        $nid_num = $_POST['nid_num'] ?? '';
        $father = $_POST['father'] ?? '';
        $mother = $_POST['mother'] ?? '';
        $occupation = $_POST['occupation'] ?? '';
        $workAddress = $_POST['workAddress'] ?? '';
        $presentAddress = $_POST['presentAddress'] ?? '';
        $permanentAddress = $_POST['permanentAddress'] ?? '';
        $ward = $_POST['ward'] ?? '';
        $thana = $_POST['thana'] ?? '';
        $citycorp = $_POST['citycorp'] ?? '';
        $advance = $_POST['advance'] ?? '';
        $phone1 = $_POST['phone1'] ?? '';
        $phone2 = $_POST['phone2'] ?? '';
        $famName = $_POST['famName'] ?? '';
        $famRltn = $_POST['famRltn'] ?? '';
        $famDOB = $_POST['famDOB'] ?? '';
        $startDate = $_POST['startDate'] ?? '';
        $endDate = $_POST['endDate'] ?? '';
        $notes = $_POST['notes'] ?? '';
        
        // Upload files
        $picturePath = null;
        $nidPath = null;
        $passportPath = null;
        
        if (isset($_FILES['renterPicture'])) {
            $picturePath = uploadFile($_FILES['renterPicture'], 'tenants/picture/', 'tenant_');
        }
        
        if (isset($_FILES['nidAttachment'])) {
            $nidPath = uploadFile($_FILES['nidAttachment'], 'tenants/nid/', 'nid_');
        }
        
        if (isset($_FILES['passportAttachment'])) {
            $passportPath = uploadFile($_FILES['passportAttachment'], 'tenants/passport/', 'passport_');
        }
        
        // Start transaction
        $conn->begin_transaction();
        
        // Update old tenant
        $updateOldSql = "UPDATE tenants SET status = 'Previous', unit_history=(select base_rent from units where unit_id=?),unit_id=NULL WHERE unit_id = ? AND status = 'Current'";
        $updateStmt = $conn->prepare($updateOldSql);
        $updateStmt->bind_param("ii", $unitid, $unitid);
        $updateStmt->execute();
        $updateStmt->close();
        
        // Insert new tenant with file paths
        $sql = "INSERT INTO tenants (
            unit_id, name, nid_num, father, mother, Occupation, Work_Address, 
            Present_Address, Permanent_address, ward, thana, Citycorp, Advance, 
            phone1, phone2, fam_name, fam_rltn, fam_DOB, start_date, end_date, notes,
            renter_picture_url, nid_attachment_url, passport_attachment_url
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "isssssssssssisssssssssss", 
            $unitid, $name, $nid_num, $father, $mother, $occupation, $workAddress, 
            $presentAddress, $permanentAddress, $ward, $thana, $citycorp, $advance, 
            $phone1, $phone2, $famName, $famRltn, $famDOB, $startDate, $endDate, $notes,
            $picturePath, $nidPath, $passportPath       
        );
        
        if ($stmt->execute()) {
            $conn->commit();
            $response = [
                "success" => true, 
                "message" => "Tenant registered successfully",
                "files" => [
                    "picture" => $picturePath,
                    "nid" => $nidPath,
                    "passport" => $passportPath
                ]
            ];
            echo json_encode($response);
        } else {
            $conn->rollback();
            throw new Exception("Database error: " . $stmt->error);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        $conn->rollback();
        $response = [
            "success" => false, 
            "message" => $e->getMessage()
        ];
        echo json_encode($response);
    }
}

$conn->close();
?>
