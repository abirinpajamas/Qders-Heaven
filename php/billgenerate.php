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
   
  if($_SERVER["REQUEST_METHOD"] === "POST") {
      $data = json_decode(file_get_contents("php://input")); 

    $unit_id = $data->selectedUnit;
    $startperiod = $data->startperiod;
    $endperiod = $data->endperiod;
    $rentAmount = $data->rentAmount;
    $meterid = $data->meterid;
    $status = $data->status;
    $note = $data->note;

   


    $sql="select tenant_id from tenants where unit_id=?";
    $stmt1=$conn->prepare($sql);
    $stmt1->bind_param("i",$unit_id);
    $stmt1->execute();
    $result=$stmt1->get_result();

 if($result->num_rows>0){
 

    $row = $result->fetch_assoc();
    $tenant_id = $row['tenant_id'];
    $sql = "insert into bills (unit_id,tenant_id, period_start, period_end, amount, meter_id, status, notes) 
       values (?,?,?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iissiiss", $unit_id,$tenant_id, $startperiod, $endperiod, $rentAmount, $meterid, $status, $note);

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


 }else{
    $response=["success" => false, "message" => "No active tenant staying in the Unit" ];
    echo json_encode($response);
    }
    $stmt1->close();

    }
    
    $conn->close();

?>