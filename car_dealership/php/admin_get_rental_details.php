<?php
require_once 'config.php';

setCORSHeaders();

// Accept both GET and POST parameters
$rentalId = null;

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['rental_id'])) {
    $rentalId = trim($_GET['rental_id']);
} else {
    $input = getJSONInput();
    if ($input && isset($input['rentalId'])) {
        $rentalId = trim($input['rentalId']);
    }
}

if (!$rentalId || empty($rentalId)) {
    sendResponse(false, null, 'Rental ID is required');
}

$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(false, null, 'Database connection failed');
}

try {
    // Get detailed rental information
    $stmt = $pdo->prepare("
        SELECT 
            r.id,
            r.rental_id,
            r.start_date,
            r.end_date,
            r.days,
            r.total_cost,
            r.status,
            r.created_at,
            u.name as customer_name,
            u.email as customer_email,
            u.phone as customer_phone,
            c.make as car_make,
            c.model as car_model,
            c.year as car_year,
            c.color as car_color,
            c.price as daily_rate
        FROM rentals r
        JOIN users u ON r.user_id = u.id
        JOIN cars c ON r.car_id = c.id
        WHERE r.rental_id = ?
    ");
    $stmt->execute([$rentalId]);
    $rental = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$rental) {
        sendResponse(false, null, 'Rental not found');
    }
    
    // Convert data types for consistency
    $rental['id'] = (int)$rental['id'];
    $rental['days'] = (int)$rental['days'];
    $rental['total_cost'] = (float)$rental['total_cost'];
    $rental['car_year'] = (int)$rental['car_year'];
    $rental['daily_rate'] = (float)$rental['daily_rate'];
    
    // Format dates for display
    $rental['start_date'] = date('Y-m-d', strtotime($rental['start_date']));
    $rental['end_date'] = date('Y-m-d', strtotime($rental['end_date']));
    $rental['created_at'] = date('Y-m-d H:i:s', strtotime($rental['created_at']));
    
    // Calculate cost breakdown
    $subtotal = $rental['daily_rate'] * $rental['days'];
    $tax = $subtotal * 0.1; // 10% tax
    $insurance = $rental['days'] * 5; // $5 per day insurance
    
    $rental['cost_breakdown'] = [
        'subtotal' => $subtotal,
        'tax' => $tax,
        'insurance' => $insurance,
        'total' => $subtotal + $tax + $insurance
    ];
    
    sendResponse(true, ['rental' => $rental]);
    
} catch (Exception $e) {
    error_log("Error fetching rental details: " . $e->getMessage());
    sendResponse(false, null, 'Failed to fetch rental details');
}
?>
