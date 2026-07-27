export interface UserAverageScoreResponse {
  averagePronunciationScore: number;
  averageFluencyScore: number;
  averageOverallConfidence: number;
  averageGrammarScore: number;
  averageVocabScore: number;
  overallAverageScore: number;
  totalRecordings: number;
  totalDuration: number;
  currentStreak: number;
  weeklyRecordingsDiff: number;
}
