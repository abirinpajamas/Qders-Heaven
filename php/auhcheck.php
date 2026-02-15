<?php


if(!isset($_SESSION['admin_id']) && !isset($_SESSION['tenant_id'])) {
    // Set CORS headers before sending error response
    $origin = $_SERVER['HTTP_ORIGIN'] ?? "*";
    $allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://www.qadersheaven.com"
    ];

    if(in_array($origin, $allowed_origins)){
        header("Access-Control-Allow-Origin: " . $origin);
    }
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Credentials: true");

    http_response_code(401);
    exit(json_encode(["success" =>false, "message" =>"Access denied"]));

}