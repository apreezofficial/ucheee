<?php
// backend/api/create_quiz.php
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['question']) || empty($data['options']) || empty($data['answer'])) {
    sendResponse(["status" => "error", "message" => "All fields are required."]);
}

$category = $data['category'] ?? 'general_knowledge';
$difficulty = $data['difficulty'] ?? 'easy';
$question = $data['question'];
$options = json_encode($data['options']);
$answer = $data['answer'];
$created_by = $data['username'] ?? 'Anonymous';

try {
    $stmt = $pdo->prepare("INSERT INTO questions (category, difficulty, question, options, answer, created_by) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$category, $difficulty, $question, $options, $answer, $created_by]);
    sendResponse(["status" => "success", "message" => "Question added successfully."]);
} catch (PDOException $e) {
    sendResponse(["status" => "error", "message" => "Failed to add question."]);
}
?>
