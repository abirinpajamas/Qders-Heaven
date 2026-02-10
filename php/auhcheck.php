<?php


if(!isset($_SESSION['admin_id']) && !isset($_SESSION['tenant_id'])) {
    http_response_code(401);    
 exit(json_encode(["error" => "Access denied"]));}

?>