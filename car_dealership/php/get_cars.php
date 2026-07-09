<?php
require_once 'config.php';

setCORSHeaders();

$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(false, null, 'Database connection failed');
}

try {
    // Get all available cars
    $stmt = $pdo->prepare("SELECT * FROM cars WHERE available = 1 ORDER BY make, model");
    $stmt->execute();
    $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert price to float for consistency
    foreach ($cars as &$car) {
        $car['price'] = (float)$car['price'];
        $car['available'] = (bool)$car['available'];
        $car['id'] = (int)$car['id'];
        $car['year'] = (int)$car['year'];
    }
    
    sendResponse(true, ['cars' => $cars]);
    
} catch (Exception $e) {
    error_log("Error fetching cars: " . $e->getMessage());
    sendResponse(false, null, 'Failed to fetch cars');
}
?>
