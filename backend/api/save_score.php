<?php
// backend/api/save_score.php
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['username']) || !isset($data['score'])) {
    sendResponse(["status" => "error", "message" => "Missing data"]);
}

$username = $data['username'];
$score = $data['score'];
$category = $data['category'] ?? 'General';
$rarity = $data['rarity'] ?? 'Pro';

try {
    $stmt = $pdo->prepare("INSERT INTO leaderboard (username, score, category, rarity) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $score, $category, $rarity]);
    sendResponse(["status" => "success", "message" => "Score saved"]);
} catch (PDOException $e) {
    sendResponse(["status" => "error", "message" => "Save failed: " . $e->getMessage()]);
}
?>
