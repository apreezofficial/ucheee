<?php
// backend/api/login.php
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['email']) || empty($data['password'])) {
    sendResponse(["status" => "error", "message" => "Email and password are required."]);
}

$email = trim($data['email']);
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        sendResponse([
            "status" => "success", 
            "message" => "Login successful.",
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "email" => $user['email']
            ]
        ]);
    } else {
        sendResponse(["status" => "error", "message" => "Invalid email or password."]);
    }
} catch (PDOException $e) {
    sendResponse(["status" => "error", "message" => "Login failed."]);
}
?>
