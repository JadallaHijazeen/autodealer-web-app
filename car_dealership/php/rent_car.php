<?php
require_once 'config.php';

setCORSHeaders();

$input = getJSONInput();

if (!$input || !isset($input['carId']) || !isset($input['userId']) || !isset($input['days']) || !isset($input['startDate']) || !isset($input['totalCost'])) {
    sendResponse(false, null, 'Missing required rental information');
}

$carId = (int)$input['carId'];
$userId = (int)$input['userId'];
$days = (int)$input['days'];
$startDate = $input['startDate'];
$totalCost = (float)$input['totalCost'];

// Validate input
if ($carId <= 0 || $userId <= 0 || $days <= 0 || $totalCost <= 0) {
    sendResponse(false, null, 'Invalid rental data');
}

if (!DateTime::createFromFormat('Y-m-d', $startDate)) {
    sendResponse(false, null, 'Invalid start date format');
}

$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(false, null, 'Database connection failed');
}

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Check if car is available
    $stmt = $pdo->prepare("SELECT available FROM cars WHERE id = ?");
    $stmt->execute([$carId]);
    $car = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$car) {
        $pdo->rollBack();
        sendResponse(false, null, 'Car not found');
    }
    
    if (!$car['available']) {
        $pdo->rollBack();
        sendResponse(false, null, 'Car is not available for rent');
    }
    
    // Calculate end date
    $startDateTime = new DateTime($startDate);
    $endDateTime = clone $startDateTime;
    $endDateTime->add(new DateInterval('P' . $days . 'D'));
    $endDate = $endDateTime->format('Y-m-d');
    
    // Generate rental ID
    $rentalId = 'RENT' . date('Ymd') . str_pad($carId, 3, '0', STR_PAD_LEFT) . str_pad($userId, 3, '0', STR_PAD_LEFT);
    
    // Insert rental record
    $stmt = $pdo->prepare("INSERT INTO rentals (rental_id, car_id, user_id, start_date, end_date, days, total_cost, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW())");
    $stmt->execute([$rentalId, $carId, $userId, $startDate, $endDate, $days, $totalCost]);
    
    // Update car availability
    $stmt = $pdo->prepare("UPDATE cars SET available = 0 WHERE id = ?");
    $stmt->execute([$carId]);
    
    // Commit transaction
    $pdo->commit();
    
    sendResponse(true, ['rentalId' => $rentalId], 'Car rented successfully');
    
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Rental error: " . $e->getMessage());
    sendResponse(false, null, 'Failed to process rental');
}
?>
