<?php
require_once 'config.php';

setCORSHeaders();

$input = getJSONInput();

if (!$input || !isset($input['carId']) || !isset($input['available'])) {
    sendResponse(false, null, 'Car ID and availability status are required');
}

$carId = (int)$input['carId'];
$available = (bool)$input['available'];

if ($carId <= 0) {
    sendResponse(false, null, 'Invalid car ID');
}

$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(false, null, 'Database connection failed');
}

try {
    // Check if car exists
    $stmt = $pdo->prepare("SELECT id, available FROM cars WHERE id = ?");
    $stmt->execute([$carId]);
    $car = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$car) {
        sendResponse(false, null, 'Car not found');
    }
    
    // If marking as available, check if there are active rentals
    if ($available) {
        $stmt = $pdo->prepare("SELECT COUNT(*) as active_count FROM rentals WHERE car_id = ? AND status = 'active'");
        $stmt->execute([$carId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['active_count'] > 0) {
            sendResponse(false, null, 'Cannot mark car as available while there are active rentals');
        }
    }
    
    // Update car availability
    $stmt = $pdo->prepare("UPDATE cars SET available = ? WHERE id = ?");
    $stmt->execute([$available ? 1 : 0, $carId]);
    
    $statusText = $available ? 'available' : 'rented';
    sendResponse(true, null, "Car marked as {$statusText} successfully");
    
} catch (Exception $e) {
    error_log("Error updating car availability: " . $e->getMessage());
    sendResponse(false, null, 'Failed to update car status');
}
?>
