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

    $unit_id = $data->selectedUnit;
    $startperiod = $data->startperiod;
    $endperiod = $data->endperiod;
    $rentAmount = $data->rentAmount;
    $meterid = $data->meterid;
    $status = $data->status;
    $note = $data->note;

   

    $sql = "insert into bills (unit_id, period_start, period_end, amount, meter_id, status, notes) 
       values (?,?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issiiss", $unit_id, $startperiod, $endperiod, $rentAmount, $meterid, $status, $note);

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