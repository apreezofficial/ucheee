export interface Question {
  id: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  answer: string;
}

export interface UserStats {
  totalQuizzes: number;
  avgScore: number;
  bestCategory: string;
  totalCorrect: number;
  totalIncorrect: number;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  avgTime: number;
  rarity: string;
}
