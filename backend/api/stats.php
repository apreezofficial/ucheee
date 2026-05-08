<?php
// backend/api/stats.php
require_once '../config.php';

try {
    // Get total users
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $usersCount = $stmt->fetch()['count'];

    // Get total quizzes
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM leaderboard");
    $quizzesCount = $stmt->fetch()['count'];

    // Get average score
    $stmt = $pdo->query("SELECT AVG(score) as avg FROM leaderboard");
    $avgScore = round($stmt->fetch()['avg'] ?? 0);

    // Get recent activity
    $stmt = $pdo->query("SELECT username, category as quiz, score, created_at as time FROM leaderboard ORDER BY created_at DESC LIMIT 5");
    $recentActivity = $stmt->fetchAll();

    sendResponse([
        "stats" => [
            ["label" => "Total Quizzes", "value" => $quizzesCount],
            ["label" => "Avg. Score", "value" => $avgScore . " pts"],
        ],
        "recentActivity" => $recentActivity
    ]);
} catch (PDOException $e) {
    sendResponse(["status" => "error", "message" => "Stats fetch failed."]);
}
?>
