<?php
// Enable ALL error reporting and logging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');
error_reporting(E_ALL);
ini_set('display_errors', 1); // Temporarily enable to see errors

// Log that script started
error_log("=== AI Chat Script Started ===");

try {
    include("database.php");
    error_log("Database included successfully");
    
    // Check if connection exists
    if (!isset($conn)) {
        throw new Exception("Database connection not initialized");
    }
    
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    error_log("Database connection verified");
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? "*";
    $allowed_origins = [
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://www.qadersheaven.com"
    ];

    if(in_array($origin, $allowed_origins)){
        header("Access-Control-Allow-Origin: " . $origin); 
    }
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Credentials: true");

    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit();
    }

    // Get the JSON input
    $json_input = file_get_contents('php://input');
    error_log("Received input: " . $json_input);
    
    $data = json_decode($json_input, true);

    if (!$data || !isset($data['prompt'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => 'Invalid request. Prompt is required.'
        ]);
        exit();
    }

    $user_prompt = $data['prompt'];
    error_log("User prompt: " . $user_prompt);

    // Get current property data from database
    $context_data = [];

    // 1. Get current stats
    $queries = [
        'tenants_count' => "SELECT COUNT(*) FROM tenants WHERE status = 'Current';",
        'properties_count' => "SELECT COUNT(*) FROM properties;",
        'duebills_count' => "SELECT COUNT(*) FROM bills WHERE status IN ('unpaid','partially paid', 'pending', 'overdue') AND tenant_id is not NULL;",
        'revenue' => "SELECT SUM(amount) FROM payments WHERE YEAR(paid_on) = YEAR(CURDATE()) AND MONTH(paid_on) = MONTH(CURDATE()) AND servbill_id IS NULL;",
        'prev_revenue' => "SELECT SUM(amount) FROM payments WHERE paid_on >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') AND paid_on < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND servbill_id IS NULL;"
    ];

    foreach ($queries as $key => $sql) {
        error_log("Executing query for: " . $key);
        $result = $conn->query($sql);
        if (!$result) {
            error_log("Query failed for $key: " . $conn->error);
            throw new Exception("Database query failed for $key: " . $conn->error);
        }
        if ($result) {
            $row = $result->fetch_row();
            $context_data[$key] = $row[0] ?? 0;
            $result->free();
        }
    }
    
    error_log("Context data collected: " . json_encode($context_data));

    // 2. Get recent activities (last 5)
    $recent_activities_sql = "SELECT 
        'tenant_registered' as type,
        t.name as details,
        p.name as property_name,
        u.unit_number,
        t.created_at as timestamp
        FROM tenants t
        LEFT JOIN units u ON t.unit_id = u.unit_id
        LEFT JOIN properties p ON u.property_id = p.property_id
        WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        
        UNION ALL
        
        SELECT 
        'payment_received' as type,
        CONCAT('৳', FORMAT(p.amount, 0), ' via ', p.payment_method) as details,
        pr.name as property_name,
        u.unit_number,
        p.paid_on as timestamp
        FROM payments p
        LEFT JOIN bills b ON p.rentbill_id = b.bill_id
        LEFT JOIN units u ON b.unit_id = u.unit_id
        LEFT JOIN properties pr ON u.property_id = pr.property_id
        WHERE p.paid_on >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        
        UNION ALL
        
        SELECT 
        'bill_generated' as type,
        CONCAT('৳', FORMAT(b.amount, 0)) as details,
        p.name as property_name,
        u.unit_number,
        b.created_at as timestamp
        FROM bills b
        LEFT JOIN units u ON b.unit_id = u.unit_id
        LEFT JOIN properties p ON u.property_id = p.property_id
        WHERE b.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        
        ORDER BY timestamp DESC
        LIMIT 5";

    error_log("Executing recent activities query");
    $activities_result = $conn->query($recent_activities_sql);
    if (!$activities_result) {
        error_log("Activities query failed: " . $conn->error);
        throw new Exception("Activities query failed: " . $conn->error);
    }
    
    $activities = [];
    if ($activities_result) {
        while ($row = $activities_result->fetch_assoc()) {
            $activities[] = $row;
        }
        $activities_result->free();
    }
    
    error_log("Activities collected: " . count($activities) . " items");

    // 3. Get user info
    $user_name = $_SESSION['admin_name'] ?? 'Admin';
    error_log("User name: " . $user_name);

    // Build the complete prompt for Gemini
    $complete_prompt = "You are an AI assistant for Property Heaven, a property management system. You are helping {$user_name} manage their properties.

Current Property Management Data:
- Total Properties: {$context_data['properties_count']}
- Active Tenants: {$context_data['tenants_count']}
- Monthly Revenue: ৳" . number_format($context_data['revenue']) . "
- Pending Bills: {$context_data['duebills_count']}
- Previous Month Revenue: ৳" . number_format($context_data['prev_revenue']) . "

Recent Activities:
";
    foreach ($activities as $activity) {
        $complete_prompt .= "- " . ucfirst(str_replace('_', ' ', $activity['type'])) . ": " . $activity['details'] . 
                           " at " . $activity['property_name'] . " - Unit " . ($activity['unit_number'] ?? 'N/A') . "\n";
    }

    $complete_prompt .= "

User Question: {$user_prompt}

Please provide a helpful, concise response based on the property management data above. Focus on practical advice and insights relevant to property management. If the user asks for specific data that's not shown above, let them know what information is available.";

    error_log("Complete prompt built, calling Gemini API");

    // Call Gemini API
    $gemini_api_key = ''; // TODO: Move to env variable
    $gemini_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' . $gemini_api_key;

    $request_data = [
        'contents' => [
            [
                'parts' => [
                    [
                        'text' => $complete_prompt
                    ]
                ]
            ]
        ],
        'generationConfig' => [
            'temperature' => 0.7,
            'topK' => 40,
            'topP' => 0.95,
            'maxOutputTokens' => 1024,
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $gemini_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    error_log("Executing cURL request to Gemini");
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    error_log("Gemini API response code: " . $http_code);

    if ($error) {
        error_log("cURL error: " . $error);
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'API request failed: ' . $error
        ]);
        exit();
    }

    if ($http_code !== 200) {
        error_log("Gemini API error response: " . $response);
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'API request failed with status: ' . $http_code,
            'response' => $response
        ]);
        exit();
    }

    $gemini_response = json_decode($response, true);
    error_log("Gemini response decoded");

    if (isset($gemini_response['candidates'][0]['content']['parts'][0]['text'])) {
        $ai_response = $gemini_response['candidates'][0]['content']['parts'][0]['text'];
        
        error_log("Success! Sending response");
        echo json_encode([
            'success' => true,
            'response' => $ai_response
        ]);
    } else {
        error_log("Invalid Gemini response structure: " . json_encode($gemini_response));
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Invalid response from Gemini API',
            'response' => $gemini_response
        ]);
    }

    $conn->close();
    error_log("=== AI Chat Script Completed Successfully ===");
    
} catch (Exception $e) {
    error_log("EXCEPTION: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>