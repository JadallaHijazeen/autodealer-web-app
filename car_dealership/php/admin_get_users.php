<?php
require_once 'config.php';

setCORSHeaders();

$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(false, null, 'Database connection failed');
}

try {
    // Get all users (excluding password for security)
    $stmt = $pdo->prepare("
        SELECT 
            id,
            name,
            email,
            phone,
            created_at,
            (SELECT COUNT(*) FROM rentals WHERE user_id = users.id) as total_rentals,
            (SELECT COUNT(*) FROM rentals WHERE user_id = users.id AND status = 'active') as active_rentals
        FROM users 
        ORDER BY created_at DESC
    ");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert data types for consistency
    foreach ($users as &$user) {
        $user['id'] = (int)$user['id'];
        $user['total_rentals'] = (int)$user['total_rentals'];
        $user['active_rentals'] = (int)$user['active_rentals'];
        
        // Format date for display
        $user['created_at'] = date('Y-m-d H:i:s', strtotime($user['created_at']));
    }
    
    sendResponse(true, ['users' => $users]);
    
} catch (Exception $e) {
    error_log("Error fetching users for admin: " . $e->getMessage());
    sendResponse(false, null, 'Failed to fetch users');
}
?>
