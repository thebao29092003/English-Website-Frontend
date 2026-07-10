import type { RecordingResponse } from "../API/types/homeApi.type";
import type { Recording } from "../types/homePage.type";
import type { AnalysisResult } from "../types/landingPage.type";

/**
 * Formats raw byte count into a human-readable file size string.
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Converts seconds into MM:SS duration string.
 */
function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Formats ISO date string into DD/MM/YYYY HH:mm display format.
 */
function formatCreatedAt(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;

  const dd = date.getDate().toString().padStart(2, "0");
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

/**
 * Derives a grade letter from a numeric score.
 */
function scoreToGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

/**
 * Derives a CEFR level from a numeric score.
 */
function scoreToCefrLevel(score: number): { level: string; name: string } {
  if (score >= 90) return { level: "C2", name: "Proficient" };
  if (score >= 80) return { level: "C1", name: "Advanced" };
  if (score >= 70) return { level: "B2", name: "Upper-Intermediate" };
  if (score >= 60) return { level: "B1", name: "Intermediate" };
  if (score >= 50) return { level: "A2", name: "Pre-Intermediate" };
  return { level: "A1", name: "Beginner" };
}

/**
 * Normalizes a score value to 0-100 range.
 * Handles both 0-1 (decimal) and 0-100 (percentage) API formats.
 */
function normalizeScore(value: number): number {
  if (value <= 1 && value >= 0) return Math.round(value * 100);
  return Math.round(value);
}

/**
 * Builds a minimal AnalysisResult from the flat scores in the API response.
 * Detailed feedback arrays are left empty since the API doesn't provide them.
 */
function buildAnalysisResult(response: RecordingResponse): AnalysisResult {
  const { speechToText, analysis } = response;
  const overallScore = normalizeScore(speechToText.overallConfidence);
  const pronScore = normalizeScore(speechToText.pronunciationScore);
  const fluencyScore = normalizeScore(speechToText.fluencyScore);
  const grammarScore = analysis?.overallGrammarScore
    ? normalizeScore(analysis.overallGrammarScore)
    : 0;
  const vocabScore = analysis?.overallVocabScore
    ? normalizeScore(analysis.overallVocabScore)
    : 0;

  const comprehensibilityScore = Math.round(
    (pronScore + fluencyScore + overallScore) / 3,
  );

  const { level, name } = scoreToCefrLevel(overallScore);

  return {
    overallScore,
    cefrLevel: level,
    levelName: name,
    overallInsight: `Điểm tổng quan: ${overallScore}%. Phát âm: ${pronScore}%, Trôi chảy: ${fluencyScore}%, Ngữ pháp: ${grammarScore}%, Từ vựng: ${vocabScore}%.`,
    skills: {
      pronunciation: {
        score: pronScore,
        grade: scoreToGrade(pronScore),
        details: `Điểm phát âm: ${pronScore}%`,
      },
      fluency: {
        score: fluencyScore,
        grade: scoreToGrade(fluencyScore),
        details: `Điểm trôi chảy: ${fluencyScore}%`,
      },
      comprehensibility: {
        score: comprehensibilityScore,
        grade: scoreToGrade(comprehensibilityScore),
        details: `Điểm dễ hiểu: ${comprehensibilityScore}%`,
      },
      grammar: {
        score: grammarScore,
        grade: scoreToGrade(grammarScore),
        details:
          grammarScore > 0
            ? `Điểm ngữ pháp: ${grammarScore}%`
            : "Chưa có dữ liệu phân tích ngữ pháp.",
      },
      vocabulary: {
        score: vocabScore,
        grade: scoreToGrade(vocabScore),
        details:
          vocabScore > 0
            ? `Điểm từ vựng: ${vocabScore}%`
            : "Chưa có dữ liệu phân tích từ vựng.",
      },
    },
    pronunciationFeedback: [],
    grammarFeedback: [],
    vocabularyFeedback: [],
    fluencyTimeline: [],
    wordsPerMinute: 0,
  };
}

/**
 * Maps a single RecordingResponse from the API into
 * the Recording interface used by the UI.
 * Returns null if essential data (speechToText) is missing.
 */
export function mapRecordingResponse(
  response: RecordingResponse,
  index: number,
): Recording | null {
  if (!response.speechToText) return null;

  const overallScore = normalizeScore(response.speechToText.overallConfidence);

  return {
    id: `api_rec_${index}`,
    title: response.fileName || `Bản ghi #${index + 1}`,
    createdAt: formatCreatedAt(response.createdAt),
    duration: formatDuration(response.duration ?? 0),
    durationSec: Math.floor(response.duration ?? 0),
    fileSize: formatFileSize(response.fileSize ?? 0),
    overallScore,
    transcript: response.speechToText.aiTranscript || "",
    audioUrl: response.fileUrl,
    analysisResult: buildAnalysisResult(response),
  };
}

/**
 * Maps the entire API response array into Recording[].
 * Filters out any items with missing speechToText.
 */
export function mapRecordingResponses(
  responses: RecordingResponse[],
): Recording[] {
  return responses
    .map((res, idx) => mapRecordingResponse(res, idx))
    .filter((rec): rec is Recording => rec !== null);
}
