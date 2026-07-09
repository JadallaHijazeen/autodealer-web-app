<?php
require_once 'config.php';

setCORSHeaders();

$input = getJSONInput();

if (!$input || !isset($input['rentalId'])) {
    sendResponse(false, null, 'Rental ID is required');
}

$rentalId = trim($input['rentalId']);

if (empty($rentalId)) {
    sendResponse(false, null, 'Invalid rental ID');
}

$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(false, null, 'Database connection failed');
}

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Get rental information
    $stmt = $pdo->prepare("SELECT car_id, status FROM rentals WHERE rental_id = ?");
    $stmt->execute([$rentalId]);
    $rental = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$rental) {
        $pdo->rollBack();
        sendResponse(false, null, 'Rental not found');
    }
    
    if ($rental['status'] !== 'active') {
        $pdo->rollBack();
        sendResponse(false, null, 'Rental is not active');
    }
    
    // Update rental status to completed
    $stmt = $pdo->prepare("UPDATE rentals SET status = 'completed' WHERE rental_id = ?");
    $stmt->execute([$rentalId]);
    
    // Make car available again
    $stmt = $pdo->prepare("UPDATE cars SET available = 1 WHERE id = ?");
    $stmt->execute([$rental['car_id']]);
    
    // Commit transaction
    $pdo->commit();
    
    sendResponse(true, null, 'Rental completed successfully');
    
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Error completing rental: " . $e->getMessage());
    sendResponse(false, null, 'Failed to complete rental');
}
?>
