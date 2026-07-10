export interface RecordingResponse {
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
