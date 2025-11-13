<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
	  // Allow POST and OPTIONS methods
	 
	  // Allow headers that you expect to receive (e.g., Content-Type)
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}
	

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}
   
  if($_SERVER["REQUEST_METHOD"] === "POST") {
      $data = json_decode(file_get_contents("php://input")); 

    $name = $data->name;
    $totalfloors = $data->total_floors;
    $address = $data->address;
    $units = $data->total_units;
    $description = $data->description;
    $status = $data->status;

    $sql = "insert into properties (name, total_floors, address, total_units, description, status) 
       values (?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $name, $totalfloors, $address, $units, $description, $status);

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