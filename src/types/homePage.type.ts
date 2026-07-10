import type { AnalysisResult } from "./landingPage.type";
import { type LucideIcon } from "lucide-react";

export interface Recording {
  id: string;
  title: string;
  createdAt: string;
  duration: string;
  durationSec: number;
  fileSize: string;
  overallScore: number;
  transcript: string;
  audioUrl?: string;
  analysisResult: AnalysisResult;
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
