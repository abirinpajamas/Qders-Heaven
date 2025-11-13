<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

    $unit_id = $data->unitid;
    $name = $data->name;
    $nid_num = $data->nid_num;
    $father = $data->father;
    $mother = $data->mother;
    $occupation = $data->occupation;
    $workAddress = $data->workAddress;
    $presentAddress = $data->presentAddress;
    $permanentAddress = $data->permanentAddress;
    $ward = $data->ward;
    $thana = $data->thana;
    $citycorp = $data->citycorp;
    $advance = $data->advance;
    $phone1 = $data->phone1;
    $phone2 = $data->phone2;
    $famName = $data->famName;
    $famRltn = $data->famRltn;
    $famDOB = $data->famDOB;
    $startDate = $data->startDate;
    $endDate = $data->endDate;
    $notes = $data->notes;


    $sql = "INSERT INTO tenants (
        unit_id, name, nid_num, father, mother, Occupation, Work_Address, 
        Present_Address, Permanent_address, ward, thana, Citycorp, Advance, 
        phone1, phone2, fam_name, fam_rltn, fam_DOB, start_date, end_date, notes
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssssssssssissssssss", $unit_id, $name, $nid_num, $father, $mother, $occupation, $workAddress, $presentAddress, $permanentAddress, $ward, $thana, $citycorp, $advance, $phone1, $phone2, $famName, $famRltn, $famDOB, $startDate, $endDate, $notes);

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