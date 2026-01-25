<?php
session_start();
$is_localhost = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

if($is_localhost){
$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "qadersheaven";
$conn = "";
}else{

$db_server = "localhost";
$db_user = "u334051902_abir5046";
$db_pass = "Abir@5046";
$db_name = "u334051902_propertym";
$conn = ""; // Use false for a failed connection


}

try {
    $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);
} catch (mysqli_sql_exception) {
    
}

//$db_user = "u334051902_abir5046";
//$db_pass = "Abir@5046";
//$db_name = "u334051902_propertym";

try {
    $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);
    if (!$conn) {
        throw new Exception("Connection failed: " . mysqli_connect_error());
    }
} catch (Exception $e) {
    // In production, log errors to a file instead of displaying them to users
    error_log($e->getMessage());
    die("Database connection error. Please try again later.");
}


?>

