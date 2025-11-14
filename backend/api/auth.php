<?php
require_once '../config/database.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// SIGNUP
if ($method === 'POST' && isset($input['action']) && $input['action'] === 'signup') {
    $full_name = $conn->real_escape_string($input['full_name']);
    $email = $conn->real_escape_string($input['email']);
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    
    // Check if email already exists
    $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
    if ($check->num_rows > 0) {
        sendResponse(['error' => 'Email already exists'], 400);
    }
    
    $sql = "INSERT INTO users (full_name, email, password) VALUES ('$full_name', '$email', '$password')";
    
    if ($conn->query($sql)) {
        $user_id = $conn->insert_id;
        sendResponse([
            'success' => true,
            'message' => 'Account created successfully',
            'user' => [
                'id' => $user_id,
                'full_name' => $full_name,
                'email' => $email
            ]
        ], 201);
    } else {
        sendResponse(['error' => 'Registration failed'], 500);
    }
}

// SIGNIN
if ($method === 'POST' && isset($input['action']) && $input['action'] === 'signin') {
    $email = $conn->real_escape_string($input['email']);
    $password = $input['password'];
    
    $result = $conn->query("SELECT * FROM users WHERE email = '$email'");
    
    if ($result->num_rows === 0) {
        sendResponse(['error' => 'Invalid email or password'], 401);
    }
    
    $user = $result->fetch_assoc();
    
    if (password_verify($password, $user['password'])) {
        unset($user['password']); // Remove password from response
        sendResponse([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user
        ]);
    } else {
        sendResponse(['error' => 'Invalid email or password'], 401);
    }
}

$conn->close();
?>