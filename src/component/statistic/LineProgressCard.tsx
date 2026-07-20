import { useState } from "react";
import LineChart from "../../utility/chart/LineChart";

export type Timeframe = "7days" | "30days" | "3months";

interface LineProgressCardProps {
  data7Days: {
    labels: string[];
    overall: number[];
    pronunciation: number[];
    vocab: number[];
    grammar: number[];
    fluency: number[];
    coherence: number[];
  };
  data30Days: {
    labels: string[];
    overall: number[];
    pronunciation: number[];
    vocab: number[];
    grammar: number[];
    fluency: number[];
    coherence: number[];
  };
  data3Months: {
    labels: string[];
    overall: number[];
    pronunciation: number[];
    vocab: number[];
    grammar: number[];
    fluency: number[];
    coherence: number[];
  };
}

export default function LineProgressCard({
  data7Days,
  data30Days,
  data3Months,
}: LineProgressCardProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("7days");

  const currentData =
    timeframe === "7days"
      ? data7Days
      : timeframe === "30days"
        ? data30Days
        : data3Months;

  const datasets = [
    {
      label: "Điểm trung bình",
      data: currentData.overall,
      borderColor: "#a855f7", // purple-500
      backgroundColor: "rgba(168, 85, 247, 0.08)",
      borderWidth: 3,
      tension: 0.3,
      hidden: false,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Phát âm",
      data: currentData.pronunciation,
      borderColor: "#10b981", // emerald-500
      backgroundColor: "rgba(16, 185, 129, 0.03)",
      borderWidth: 2,
      tension: 0.3,
      hidden: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
    {
      label: "Từ vựng",
      data: currentData.vocab,
      borderColor: "#3b82f6", // blue-500
      backgroundColor: "rgba(59, 130, 246, 0.03)",
      borderWidth: 2,
      tension: 0.3,
      hidden: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
    {
      label: "Ngữ pháp",
      data: currentData.grammar,
      borderColor: "#f59e0b", // amber-500
      backgroundColor: "rgba(245, 158, 11, 0.03)",
      borderWidth: 2,
      tension: 0.3,
      hidden: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
    {
      label: "Trôi chảy",
      data: currentData.fluency,
      borderColor: "#ec4899", // pink-500
      backgroundColor: "rgba(236, 72, 153, 0.03)",
      borderWidth: 2,
      tension: 0.3,
      hidden: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
    {
      label: "Mạch lạc",
      data: currentData.coherence,
      borderColor: "#06b6d4", // cyan-500
      backgroundColor: "rgba(6, 182, 212, 0.03)",
      borderWidth: 2,
      tension: 0.3,
      hidden: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
  ];

  return (
    <div className="bg-white/2 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between shadow-lg relative h-full">
      <div className="flex flex-col  gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold uppercase tracking-wider text-white mb-1">
            Biểu Đồ Tiến Trình Học Tập
          </h3>
          <p className="text-sm text-slate-400">
            Hiển thị mặc định Điểm TB. Hãy click vào các nhãn bên dưới để
            bật/tắt chi tiết kỹ năng khác.
          </p>
        </div>

        {/* Timeframe selector inline tabs */}
        <div className="flex items-center self-start sm:self-center bg-white/5 border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => setTimeframe("7days")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${
              timeframe === "7days"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/20 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            7 Ngày
          </button>
          <button
            onClick={() => setTimeframe("30days")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${
              timeframe === "30days"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/20 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            30 Ngày
          </button>
          <button
            onClick={() => setTimeframe("3months")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${
              timeframe === "3months"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/20 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            3 Tháng
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] flex items-center justify-center">
        <LineChart labels={currentData.labels} datasets={datasets} />
      </div>
    </div>
  );
}
