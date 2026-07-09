export interface SkillMetric {
  score: number;
  grade: string;
  details: string;
}

export interface SkillsAnalysis {
  pronunciation: SkillMetric;
  fluency: SkillMetric;
  comprehensibility: SkillMetric;
  grammar: SkillMetric;
  vocabulary: SkillMetric;
}

export interface PronunciationItem {
  word: string;
  expected: string;
  actual: string;
  issue: string;
  tip: string;
  score?: number;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  rule: string;
  explain: string;
}

export interface VocabularyUpgrade {
  originalWord: string;
  suggestedWord: string;
  sentence: string;
  betterSentence: string;
  reason: string;
}

export interface FluencyTimelineItem {
  time: string;
  type: "pause" | "hesitation";
  duration: string;
  severity: "minor" | "medium" | "severe";
  context: string;
}

export interface AnalysisResult {
  overallScore: number;
  cefrLevel: string;
  levelName: string;
  skills: SkillsAnalysis;
  pronunciationFeedback: PronunciationItem[];
  grammarFeedback: GrammarCorrection[];
  vocabularyFeedback: VocabularyUpgrade[];
  overallInsight: string;
  fluencyTimeline: FluencyTimelineItem[];
  wordsPerMinute?: number;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  accent: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface GoalCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
}

export interface DimensionDetail {
  id: string;
  title: string;
  engTitle: string;
  icon: any;
  metricLabel: string;
  metricVal: string;
  description: string;
  details: string[];
}