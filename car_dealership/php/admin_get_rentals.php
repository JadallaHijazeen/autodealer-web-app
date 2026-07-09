<?php
require_once 'config.php';

setCORSHeaders();

$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(false, null, 'Database connection failed');
}

try {
    // Get all rentals with customer and car information
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
            c.color as car_color
        FROM rentals r
        JOIN users u ON r.user_id = u.id
        JOIN cars c ON r.car_id = c.id
        ORDER BY r.created_at DESC
    ");
    $stmt->execute();
    $rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert data types for consistency
    foreach ($rentals as &$rental) {
        $rental['id'] = (int)$rental['id'];
        $rental['days'] = (int)$rental['days'];
        $rental['total_cost'] = (float)$rental['total_cost'];
        $rental['car_year'] = (int)$rental['car_year'];
        
        // Format dates for display
        $rental['start_date'] = date('Y-m-d', strtotime($rental['start_date']));
        $rental['end_date'] = date('Y-m-d', strtotime($rental['end_date']));
        $rental['created_at'] = date('Y-m-d H:i:s', strtotime($rental['created_at']));
    }
    
    sendResponse(true, ['rentals' => $rentals]);
    
} catch (Exception $e) {
    error_log("Error fetching rentals for admin: " . $e->getMessage());
    sendResponse(false, null, 'Failed to fetch rentals');
}
?>
