<?php
// Suppress warnings to prevent HTML in JSON response
error_reporting(0);
ini_set('display_errors', 0);

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
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit();
}

// Get recent activities from various tables
$activities = [];

// 1. Recent tenant registrations (last 7 days)
$tenant_sql = "SELECT 
    t.name as tenant_name,
    t.created_at,
    u.unit_number,
    p.name as property_name
    FROM tenants t
    LEFT JOIN units u ON t.unit_id = u.unit_id
    LEFT JOIN properties p ON u.property_id = p.property_id
    WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY t.created_at DESC
    LIMIT 5";

$tenant_result = $conn->query($tenant_sql);
if ($tenant_result) {
    while ($row = $tenant_result->fetch_assoc()) {
        $activities[] = [
            'type' => 'tenant_registered',
            'action' => 'New tenant registered',
            'details' => $row['tenant_name'],
            'property' => $row['property_name'] . ' - Unit ' . ($row['unit_number'] || 'N/A'),
            'time' => time_ago($row['created_at']),
            'timestamp' => $row['created_at']
        ];
    }
}

// 2. Recent payments (last 7 days)
$payment_sql = "SELECT 
    p.amount,
    p.paid_on,
    p.payment_method,
    b.bill_id,
    u.unit_number,
    pr.name as property_name
    FROM payments p
    LEFT JOIN bills b ON p.rentbill_id = b.bill_id
    LEFT JOIN units u ON b.unit_id = u.unit_id
    LEFT JOIN properties pr ON u.property_id = pr.property_id
    WHERE p.paid_on >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY p.paid_on DESC
    LIMIT 5";

$payment_result = $conn->query($payment_sql);
if ($payment_result) {
    while ($row = $payment_result->fetch_assoc()) {
        $activities[] = [
            'type' => 'payment_received',
            'action' => 'Payment received',
            'details' => '৳' . number_format($row['amount']) . ' via ' . ucfirst($row['payment_method']),
            'property' => $row['property_name'] . ' - Unit ' . ($row['unit_number'] || 'N/A'),
            'time' => time_ago($row['paid_on']),
            'timestamp' => $row['paid_on']
        ];
    }
}

// 3. Recent bills generated (last 7 days)
$bill_sql = "SELECT 
    b.bill_id,
    b.amount,
    b.period_start,
    b.period_end,
    b.created_at,
    u.unit_number,
    p.name as property_name
    FROM bills b
    LEFT JOIN units u ON b.unit_id = u.unit_id
    LEFT JOIN properties p ON u.property_id = p.property_id
    WHERE b.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY b.created_at DESC
    LIMIT 5";

$bill_result = $conn->query($bill_sql);
if ($bill_result) {
    while ($row = $bill_result->fetch_assoc()) {
        $activities[] = [
            'type' => 'bill_generated',
            'action' => 'Bill generated',
            'details' => '৳' . number_format($row['amount']) . ' for ' . date('M Y', strtotime($row['period_start'])),
            'property' => $row['property_name'] . ' - Unit ' . ($row['unit_number'] || 'N/A'),
            'time' => time_ago($row['created_at']),
            'timestamp' => $row['created_at']
        ];
    }
}

// Sort all activities by timestamp
usort($activities, function($a, $b) {
    return strtotime($b['timestamp']) - strtotime($a['timestamp']);
});

// Return top 10 activities
$activities = array_slice($activities, 0, 10);

echo json_encode(['success' => true, 'activities' => $activities]);

// Helper function to calculate time ago
function time_ago($datetime) {
    $time = strtotime($datetime);
    $now = time();
    $diff = $now - $time;
    
    if ($diff < 60) {
        return 'Just now';
    } elseif ($diff < 3600) {
        return floor($diff / 60) . ' minutes ago';
    } elseif ($diff < 86400) {
        return floor($diff / 3600) . ' hours ago';
    } elseif ($diff < 604800) {
        return floor($diff / 86400) . ' days ago';
    } else {
        return date('M j, Y', $time);
    }
}

$conn->close();
?>
