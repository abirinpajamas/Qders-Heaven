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

    $id = $data->property;
    $unitnum = $data->unitnum;
    $bathroom = $data->bathroom;
    $bedrooms = $data->bedrooms;
    $meter = $data->meter;
    $squareFootage = $data->squareFootage;
    $baseRent = $data->baseRent;
    $type = $data->type;
    $status = $data->status;

    $sql = "insert into units (property_id, unit_number, bathrooms, bedrooms, meter, square_Footage, base_Rent, type, status) 
       values (?,?,?,?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isiisdiss", $id, $unitnum, $bathroom, $bedrooms, $meter, $squareFootage, $baseRent, $type, $status);

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