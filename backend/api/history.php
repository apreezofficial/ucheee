<?php
// backend/api/history.php
require_once '../config.php';

$username = $_GET['username'] ?? '';

if (!$username) {
    sendResponse(["status" => "error", "message" => "Username required"]);
}

try {
    $stmt = $pdo->prepare("SELECT category as quiz, score, created_at as time FROM leaderboard WHERE username = ? ORDER BY created_at DESC");
    $stmt->execute([$username]);
    $history = $stmt->fetchAll();

    sendResponse(["status" => "success", "history" => $history]);
} catch (PDOException $e) {
    sendResponse(["status" => "error", "message" => "Failed to fetch history"]);
}
?>
