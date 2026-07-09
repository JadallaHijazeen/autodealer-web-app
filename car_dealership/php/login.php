<?php
require_once 'config.php';

setCORSHeaders();

$input = getJSONInput();

if (!$input || !isset($input['email']) || !isset($input['password'])) {
    sendResponse(false, null, 'Email and password are required');
}

$email = trim($input['email']);
$password = $input['password'];

if (!isValidEmail($email)) {
    sendResponse(false, null, 'Invalid email format');
}

$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(false, null, 'Database connection failed');
}

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        sendResponse(false, null, 'Invalid email or password');
    }
    
    // Verify password
    if (!verifyPassword($password, $user['password'])) {
        sendResponse(false, null, 'Invalid email or password');
    }
    
    // Remove password from response
    unset($user['password']);
    $user['id'] = (int)$user['id'];
    
    sendResponse(true, ['user' => $user], 'Login successful');
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    sendResponse(false, null, 'Login failed');
}
?>
