import type { AnalysisResult } from "./landingPage.type";

export interface Recording {
  id: string;
  title: string;
  createdAt: string;
  duration: string;
  durationSec: number;
  fileSize: string;
  overallScore: number;
  transcript: string;
  analysisResult: AnalysisResult;
}
