<?php
// backend/api/get_leaderboard.php
require_once '../config.php';

try {
    $stmt = $pdo->query("SELECT username, score, rarity FROM leaderboard ORDER BY score DESC LIMIT 10");
    $entries = $stmt->fetchAll();
    sendResponse($entries);
} catch (PDOException $e) {
    sendResponse(["status" => "error", "message" => "Fetch failed"]);
}
?>
