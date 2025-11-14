<?php
require_once '../config/database.php';
require_once './send_email.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// GET - Read all employees
if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    
    if (!$user_id) {
        sendResponse(['error' => 'User ID required'], 400);
    }
    
    $sql = "SELECT * FROM employees WHERE user_id = ? ORDER BY created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $employees = [];
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
    
    sendResponse(['employees' => $employees]);
}

// POST - Create employee
if ($method === 'POST') {
    $name = $conn->real_escape_string($input['name']);
    $email = $conn->real_escape_string($input['email']);
    $phone = $conn->real_escape_string($input['phone']);
    $position = $conn->real_escape_string($input['position']);
    $department = $conn->real_escape_string($input['department']);
    $salary = floatval($input['salary']);
    $join_date = $conn->real_escape_string($input['join_date']);
    $user_id = intval($input['user_id']);
    
    $sql = "INSERT INTO employees (name, email, phone, position, department, salary, join_date, user_id) 
            VALUES ('$name', '$email', '$phone', '$position', '$department', $salary, '$join_date', $user_id)";
    
    if ($conn->query($sql)) {
        $employee_id = $conn->insert_id;
        
        // Send email notification
        sendEmailNotification(
            $email,
            'Welcome to the Team!',
            "Dear $name,\n\nWelcome to our organization! You have been added to our employee management system.\n\nPosition: $position\nDepartment: $department\nJoining Date: $join_date\n\nWe look forward to working with you!\n\nBest regards,\nHR Team"
        );
        
        sendResponse([
            'success' => true,
            'message' => 'Employee created successfully',
            'employee_id' => $employee_id
        ], 201);
    } else {
        sendResponse(['error' => 'Failed to create employee'], 500);
    }
}

// PUT - Update employee
if ($method === 'PUT') {
    $id = intval($input['id']);
    $name = $conn->real_escape_string($input['name']);
    $email = $conn->real_escape_string($input['email']);
    $phone = $conn->real_escape_string($input['phone']);
    $position = $conn->real_escape_string($input['position']);
    $department = $conn->real_escape_string($input['department']);
    $salary = floatval($input['salary']);
    $join_date = $conn->real_escape_string($input['join_date']);
    $user_id = intval($input['user_id']);
    
    $sql = "UPDATE employees SET 
            name = '$name',
            email = '$email',
            phone = '$phone',
            position = '$position',
            department = '$department',
            salary = $salary,
            join_date = '$join_date'
            WHERE id = $id AND user_id = $user_id";
    
    if ($conn->query($sql)) {
        // Send email notification
        sendEmailNotification(
            $email,
            'Employee Information Updated',
            "Dear $name,\n\nYour employee information has been updated in our system.\n\nUpdated Details:\nPosition: $position\nDepartment: $department\nSalary: $$salary\n\nIf you have any questions, please contact HR.\n\nBest regards,\nHR Team"
        );
        
        sendResponse([
            'success' => true,
            'message' => 'Employee updated successfully'
        ]);
    } else {
        sendResponse(['error' => 'Failed to update employee'], 500);
    }
}

// DELETE - Delete employee
if ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    $user_id = intval($_GET['user_id'] ?? 0);
    
    if (!$id || !$user_id) {
        sendResponse(['error' => 'Employee ID and User ID required'], 400);
    }
    
    $sql = "DELETE FROM employees WHERE id = $id AND user_id = $user_id";
    
    if ($conn->query($sql)) {
        sendResponse([
            'success' => true,
            'message' => 'Employee deleted successfully'
        ]);
    } else {
        sendResponse(['error' => 'Failed to delete employee'], 500);
    }
}

$conn->close();
?>