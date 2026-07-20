export interface Recording {
  recodingId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl?: string;
  duration: number;
  createdAt: string;
  speechToText: {
    aiTranscript: string;
    overallConfidence: number;
    fluencyScore: number;
    pronunciationScore: number;
  };
  analysis?: {
    overallGrammarScore: number;
    overallVocabScore: number;
  };
}

export interface FilterState {
  searchQuery: string;
  scoreFilter: string;
  sortBy: string;
}

export interface UploadFileState {
  id: string;
  file: File;
  recordingId?: string;
  status:
    | "idle"
    | "uploading"
    | "submitted"
    | "fluency_analyzed"
    | "analysis_completed"
    | "pronunciation_analyzed"
    | "failed";
  progress: number;
  message?: string;
  scores?: {
    fluency?: number;
    confidence?: number;
    grammar?: number;
    vocab?: number;
    pronunciation?: number;
  };
}
