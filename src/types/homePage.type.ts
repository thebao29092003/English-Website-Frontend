import { type LucideIcon } from "lucide-react";

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

export interface StatsCardsProps {
  totalRecords: number;
  avgScore: number;
  totalDurationStr: string;
  proCount: number;
}

export interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  valueColor: string;
}

export interface FilterState {
  searchQuery: string;
  scoreFilter: string;
  sortBy: string;
}

