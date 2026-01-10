<?php
// logout.php
$origin = $_SERVER['HTTP_ORIGIN']??"*";
$allowed_origins = ["http://localhost:5173", 
                   "http://localhost:3000","https://www.qadersheaven.com"]; // Add your React app URL


if(in_array($origin, $allowed_origins)){
header("Access-Control-Allow-Origin:".$origin); 
}// Your React URL
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

// 1. Unset all session variables
$_SESSION = array();

// 2. Delete the session cookie from the browser
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Destroy the session on the server
session_destroy();

echo json_encode(["success" => true, "message" => "Logged out successfully"]);
?>