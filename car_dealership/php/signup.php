<?php
require_once 'config.php';

setCORSHeaders();

$input = getJSONInput();

if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['password']) || !isset($input['phone'])) {
    sendResponse(false, null, 'All fields are required');
}

$name = trim($input['name']);
$email = trim($input['email']);
$password = $input['password'];
$phone = trim($input['phone']);

// Validate input
if (strlen($name) < 2) {
    sendResponse(false, null, 'Name must be at least 2 characters long');
}

if (!isValidEmail($email)) {
    sendResponse(false, null, 'Invalid email format');
}

if (strlen($password) < 6) {
    sendResponse(false, null, 'Password must be at least 6 characters long');
}

if (strlen($phone) < 10) {
    sendResponse(false, null, 'Phone number must be at least 10 characters long');
}

$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(false, null, 'Database connection failed');
}

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        sendResponse(false, null, 'Email already registered');
    }
    
    // Hash password
    $hashedPassword = hashPassword($password);
    
    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, phone, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$name, $email, $hashedPassword, $phone]);
    
    sendResponse(true, null, 'Account created successfully');
    
} catch (Exception $e) {
    error_log("Signup error: " . $e->getMessage());
    sendResponse(false, null, 'Registration failed');
}
?>
