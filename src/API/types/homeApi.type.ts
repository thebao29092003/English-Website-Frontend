export interface RecordingResponse {
  recodingId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl?: string;
  duration: number;
  createdAt: string;
  speechToText: SpeechToText;
  analysis?: Analysis;
}

interface SpeechToText {
  aiTranscript: string;
  overallConfidence: number;
  fluencyScore: number;
  pronunciationScore: number;
}

interface Analysis {
  overallGrammarScore: number;
  overallVocabScore: number;
}

export interface WordJsonItem {
  text: string;
  start: number;
  end: number;
  confidence: number;
}

export interface WordPronunciationScoreItem {
  word: string;
  correct_phones: number;
  total_phones: number;
  accuracy: number;
  status: string; // e.g. "Incorrect" | "Partially Correct" | "Correct"
  original_pronunciation: string;
  standard_pronunciation: string;
}

export interface FluencyErrorItem {
  Type: string;
  Message: string;
  StartTime: number;
  EndTime: number;
  Duration: number;
}

export interface GrammarErrorItem {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabularySuggestionItem {
  originalWord: string;
  suggestedAlternative: string;
  explanation: string;
}

export interface RephrasedResponseItem {
  improvedText: string;
  style: string;
  explanation: string;
}

export interface AudioDetailValue {
  recodingId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  duration: number;
  createdAt: string;
  aiTranscript: string;
  overallConfidence: number;
  wordsJson: WordJsonItem[];
  fluencyScore: number;
  pronunciationScore: number;
  wordsPronunciationScore: WordPronunciationScoreItem[];
  fluencyErrors: FluencyErrorItem[];
  wordPerMinute: number;
  typeAnalyse: number;
  analysisContentJson: {
    grammarAnalysis?: {
      overallGrammarScore: number;
      errors: GrammarErrorItem[];
    };
    vocabularyAnalysis?: {
      overallVocabScore: number;
      suggestions: VocabularySuggestionItem[];
    };
    rephrasedResponses?: RephrasedResponseItem[];
    toeicEvaluation?: {
      detailedFeedback: string;
    };
  };
  overallGrammarScore: number;
  overallVocabScore: number;
}

