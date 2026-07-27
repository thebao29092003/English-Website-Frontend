import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { BarChart3, Menu } from "lucide-react";
import AverageScoreCircle from "../../component/statistic/AverageScoreCircle";
import PolarAreaStatsCard from "../../component/statistic/PolarAreaStatsCard";
import LineProgressCard, {
  type ChartDataFormat,
} from "../../component/statistic/LineProgressCard";
import QuickStatsSummary from "../../component/statistic/QuickStatsSummary";
import {
  useGetUserAverageScoreQuery,
  useGetDailyScoresQuery,
} from "../../API/callApi/statisticApi";
import type { DailyScoreResponse } from "../../API/types/statistic.type";
import { formatDateToYYYYMMDD } from "../../utility/formatTimeSize";

const transformDailyScoresToChartData = (
  scores: DailyScoreResponse[],
): ChartDataFormat => {
  return {
    labels: scores.map((item) => item.dateString),
    overall: scores.map((item) => item.overallAverageScore),
    pronunciation: scores.map((item) => item.averagePronunciationScore),
    vocab: scores.map((item) => item.averageVocabScore),
    grammar: scores.map((item) => item.averageGrammarScore),
    fluency: scores.map((item) => item.averageFluencyScore),
    confidence: scores.map((item) => item.averageOverallConfidence),
  };
};

export default function StatisticPage() {
  const { setMobileSidebarOpen } = useOutletContext<{
    setMobileSidebarOpen: (open: boolean) => void;
  }>();

  const { data: userAverageScoreData } = useGetUserAverageScoreQuery();
  const userStats = userAverageScoreData?.value;

  // Compute 90 days date range for GetDailyScores API (last 90 days to today)
  const { fromDateStr, toDateStr } = useMemo(() => {
    const today = new Date();
    const toStr = formatDateToYYYYMMDD(today);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 89); // Lùi lại 89 ngày (Tổng là 90 ngày bao gồm cả hôm nay)

    const fromStr = formatDateToYYYYMMDD(startDate);

    return { fromDateStr: fromStr, toDateStr: toStr };
  }, []);

  const { data: dailyScoresData } = useGetDailyScoresQuery({
    fromDate: fromDateStr,
    toDate: toDateStr,
  });

  const dailyScores = useMemo(
    () => dailyScoresData?.value || [],
    [dailyScoresData],
  );

  const data7Days = useMemo(
    () => transformDailyScoresToChartData(dailyScores.slice(-7)),
    [dailyScores],
  );

  const data30Days = useMemo(
    () => transformDailyScoresToChartData(dailyScores.slice(-30)),
    [dailyScores],
  );

  const data3Months = useMemo(
    () => transformDailyScoresToChartData(dailyScores),
    [dailyScores],
  );

  // Total audio recordings
  const totalRecordings = userStats?.totalRecordings ?? 0;

  // Learning streak
  const learningStreak = userStats?.currentStreak ?? 0;

  // Total practice time in hours calculated from totalDuration (seconds)
  const totalPracticeTime = ((userStats?.totalDuration ?? 0) / 3600).toFixed(1);

  // Latest scores representing the student's current levels
  const currentScores = {
    overall: userStats?.overallAverageScore ?? 0,
    pronunciation: userStats?.averagePronunciationScore ?? 0,
    vocab: userStats?.averageVocabScore ?? 0,
    grammar: userStats?.averageGrammarScore ?? 0,
    fluency: userStats?.averageFluencyScore ?? 0,
    confidence: userStats?.averageOverallConfidence ?? 0,
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="h-16 border-b border-white/5 bg-[#030014]/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-7 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-purple-400" />
            Thống Kê Tiến Trình Học Tập
          </h1>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-semibold text-purple-300">
          Học viên EngSteps
        </span>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-8xl w-full mx-auto relative overflow-y-auto scrollbar-thin">
        {/* Ambient background glows */}
        <div className="absolute top-10 right-10 w-125 h-125 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-100 h-100 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Quick Summary Bar */}
        <QuickStatsSummary
          totalRecordings={totalRecordings}
          overallScore={currentScores.overall}
          learningStreak={learningStreak}
          totalPracticeTime={totalPracticeTime}
          weeklyRecordingsDiff={userStats?.weeklyRecordingsDiff ?? 0}
        />

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Column 1 (Left - 1/3 Width) - Focus on "Current State" */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="h-fit">
              <AverageScoreCircle score={currentScores.overall} />
            </div>
            <div className="flex-1">
              <PolarAreaStatsCard scores={currentScores} />
            </div>
          </div>

          {/* Column 2 & 3 (Right - 2/3 Width) - Focus on "Progress & Recommendations" */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <LineProgressCard
              data7Days={data7Days}
              data30Days={data30Days}
              data3Months={data3Months}
            />
          </div>
        </div>
      </main>
    </>
  );
}
