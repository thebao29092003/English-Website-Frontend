import { useOutletContext } from "react-router-dom";
import { BarChart3, Menu } from "lucide-react";
import AverageScoreCircle from "../../component/statistic/AverageScoreCircle";
import PolarAreaStatsCard from "../../component/statistic/PolarAreaStatsCard";
import LineProgressCard from "../../component/statistic/LineProgressCard";
import LearningSuggestions from "../../component/statistic/LearningSuggestions";
import QuickStatsSummary from "../../component/statistic/QuickStatsSummary";

export default function StatisticPage() {
  const { setMobileSidebarOpen } = useOutletContext<{
    setMobileSidebarOpen: (open: boolean) => void;
  }>();

  // Total audio recordings
  const totalRecordings = 48;

  // Latest scores representing the student's current levels
  const currentScores = {
    overall: 77,
    pronunciation: 74,
    vocab: 79,
    grammar: 73,
    fluency: 80,
    coherence: 79,
  };

  // Mock data for 7 Days timeframe
  const data7Days = {
    labels: ["13/07", "14/07", "15/07", "16/07", "17/07", "18/07", "19/07"],
    overall: [65, 68, 72, 70, 75, 78, 77],
    pronunciation: [60, 62, 68, 65, 72, 75, 74],
    vocab: [70, 72, 75, 74, 78, 80, 79],
    grammar: [62, 65, 69, 68, 72, 74, 73],
    fluency: [68, 70, 74, 72, 78, 82, 80],
    coherence: [65, 71, 74, 71, 75, 79, 79],
  };

  // Mock data for 30 Days timeframe
  const data30Days = {
    labels: [
      "05/07",
      "07/07",
      "09/07",
      "11/07",
      "13/07",
      "15/07",
      "17/07",
      "19/07",
    ],
    overall: [58, 62, 65, 69, 70, 74, 77, 78],
    pronunciation: [50, 55, 60, 64, 66, 70, 74, 75],
    vocab: [62, 66, 68, 72, 74, 76, 79, 80],
    grammar: [55, 60, 62, 65, 67, 70, 72, 74],
    fluency: [64, 68, 70, 74, 76, 80, 81, 82],
    coherence: [59, 61, 65, 70, 71, 74, 78, 79],
  };

  // Mock data for 3 Months (90 days) timeframe
  const data3Months = {
    labels: [
      "Tuần 1",
      "Tuần 2",
      "Tuần 3",
      "Tuần 4",
      "Tuần 5",
      "Tuần 6",
      "Tuần 7",
      "Tuần 8",
      "Tuần 9",
      "Tuần 10",
      "Tuần 11",
      "Tuần 12",
    ],
    overall: [50, 52, 55, 58, 60, 64, 68, 71, 73, 75, 77, 78],
    pronunciation: [45, 48, 50, 54, 56, 60, 65, 68, 70, 72, 74, 75],
    vocab: [55, 57, 60, 62, 65, 68, 71, 74, 76, 77, 79, 80],
    grammar: [48, 50, 52, 55, 58, 60, 64, 67, 69, 71, 73, 74],
    fluency: [52, 55, 58, 61, 63, 67, 71, 74, 76, 79, 81, 82],
    coherence: [50, 50, 55, 58, 58, 65, 69, 72, 74, 76, 78, 79],
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
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Quick Summary Bar */}
        <QuickStatsSummary
          totalRecordings={totalRecordings}
          overallScore={currentScores.overall}
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
            <div className="flex-1">
              <LineProgressCard
                data7Days={data7Days}
                data30Days={data30Days}
                data3Months={data3Months}
              />
            </div>
            <div className="h-fit">
              <LearningSuggestions scores={currentScores} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
