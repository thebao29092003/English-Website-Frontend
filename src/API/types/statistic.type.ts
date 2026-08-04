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

export interface DailyScoreParams {
  fromDate: string;
  toDate: string;
}

export interface DailyScoreResponse {
  date: string;
  dateString: string;
  averagePronunciationScore: number;
  averageFluencyScore: number;
  averageOverallConfidence: number;
  averageGrammarScore: number;
  averageVocabScore: number;
  overallAverageScore: number;
}
