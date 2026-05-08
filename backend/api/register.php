<?php
// backend/api/register.php
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['username']) || empty($data['email']) || empty($data['password'])) {
    sendResponse(["status" => "error", "message" => "All fields are required."]);
}

$username = trim($data['username']);
$email = trim($data['email']);
$password = $data['password'];

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $hashed_password]);
    sendResponse(["status" => "success", "message" => "User registered successfully."]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        sendResponse(["status" => "error", "message" => "Username or email already exists."]);
    } else {
        sendResponse(["status" => "error", "message" => "Registration failed."]);
    }
}
?>
