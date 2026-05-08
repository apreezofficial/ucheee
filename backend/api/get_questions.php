<?php
// backend/api/get_questions.php
require_once '../config.php';

$category = $_GET['category'] ?? '';
$difficulty = $_GET['difficulty'] ?? '';

// Read JSON questions
$json_data = file_get_contents('../../src/data/questions.json');
$all_questions = json_decode($json_data, true) ?: [];

// Filter JSON questions
$filtered = array_filter($all_questions, function($q) use ($category, $difficulty) {
    return $q['category'] === $category && $q['difficulty'] === $difficulty;
});

// Fetch DB questions
try {
    $stmt = $pdo->prepare("SELECT * FROM questions WHERE category = ? AND difficulty = ?");
    $stmt->execute([$category, $difficulty]);
    $db_questions = $stmt->fetchAll();

    foreach ($db_questions as $q) {
        $filtered[] = [
            'id' => 'db_' . $q['id'],
            'category' => $q['category'],
            'difficulty' => $q['difficulty'],
            'question' => $q['question'],
            'options' => json_decode($q['options'], true),
            'answer' => $q['answer']
        ];
    }
} catch (PDOException $e) {
    // Ignore DB errors and just return JSON questions
}

sendResponse(array_values($filtered));
?>
