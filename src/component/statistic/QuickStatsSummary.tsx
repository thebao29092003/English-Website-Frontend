import { Mic, Award, Flame, Clock } from "lucide-react";

interface QuickStatsSummaryProps {
  totalRecordings: number;
  overallScore: number;
  learningStreak?: number;
  totalPracticeTime?: string;
  weeklyRecordingsDiff?: number;
}

export default function QuickStatsSummary({
  totalRecordings,
  overallScore,
  learningStreak,
  totalPracticeTime,
  weeklyRecordingsDiff,
}: QuickStatsSummaryProps) {
  const formattedDiff =
    weeklyRecordingsDiff >= 0
      ? `+${weeklyRecordingsDiff}`
      : `${weeklyRecordingsDiff}`;

  const stats = [
    {
      id: "recordings",
      label: "Tổng Số Bài Thu Âm",
      value: `${totalRecordings}`,
      unit: "bài",
      badge: `${formattedDiff} bài so với tuần trước`,
      badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      icon: Mic,
      iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
      glowColor: "rgba(168, 85, 247, 0.15)",
    },
    {
      id: "score",
      label: "Điểm Đánh Giá TB",
      value: `${overallScore}`,
      unit: "/100",
      badge: "Xuất sắc",
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      icon: Award,
      iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      glowColor: "rgba(16, 185, 129, 0.15)",
    },
    {
      id: "streak",
      label: "Chuỗi Ngày Học",
      value: `${learningStreak}`,
      unit: "ngày",
      badge: "Duy trì phong độ",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      icon: Flame,
      iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      glowColor: "rgba(245, 158, 11, 0.15)",
    },
    {
      id: "practice-time",
      label: "Thời Gian Luyện Tập",
      value: `${totalPracticeTime}`,
      unit: "giờ",
      badge: "Tích lũy",
      badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      icon: Clock,
      iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      glowColor: "rgba(59, 130, 246, 0.15)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white/2 border border-white/5 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-white/10 transition-all duration-300"
          >
            {/* Soft Ambient Background Glow */}
            <div
              className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-40 transition-opacity duration-300 group-hover:opacity-70 pointer-events-none"
              style={{ backgroundColor: stat.glowColor }}
            />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.label}
              </span>
              <div
                className={`p-2.5 rounded-xl border ${stat.iconBg} transition-transform duration-300 group-hover:scale-110`}
              >
                <IconComponent size={18} />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {stat.unit}
                </span>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${stat.badgeColor}`}
              >
                {stat.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
