import { Mic, Award, Clock, Volume2 } from "lucide-react";
import type { StatsCardsProps, StatItem } from "../../types/homePage.type";

export default function StatsCards({
  totalRecords,
  avgScore,
  totalDurationStr,
  proCount,
}: StatsCardsProps) {
  const stats: StatItem[] = [
    {
      icon: Mic,
      label: "Tổng bản ghi",
      value: totalRecords,
      iconBg: "bg-blue-500/10",
      iconBorder: "border-blue-500/20",
      iconColor: "text-blue-400",
      valueColor: "text-white",
    },
    {
      icon: Award,
      label: "Điểm trung bình",
      value: `${avgScore}`,
      iconBg: "bg-purple-500/10",
      iconBorder: "border-purple-500/20",
      iconColor: "text-purple-400",
      valueColor: "text-purple-400",
    },
    {
      icon: Clock,
      label: "Thời lượng nói",
      value: totalDurationStr,
      iconBg: "bg-indigo-500/10",
      iconBorder: "border-indigo-500/20",
      iconColor: "text-indigo-400",
      valueColor: "text-white",
    },
    {
      icon: Volume2,
      label: "Bản ghi Xuất Sắc",
      value: proCount,
      iconBg: "bg-emerald-500/10",
      iconBorder: "border-emerald-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(
        ({
          icon: Icon,
          label,
          value,
          iconBg,
          iconBorder,
          iconColor,
          valueColor,
        }) => (
          <div
            key={label}
            className="glass-panel p-3 rounded-2xl flex items-center gap-3 bg-white/2 border border-white/5 backdrop-blur-md shadow-md"
          >
            <div
              className={`w-9 h-9 rounded-xl ${iconBg} border ${iconBorder} flex items-center justify-center ${iconColor} shrink-0`}
            >
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </p>
              <h3 className={`text-lg font-black ${valueColor} mt-0.5`}>
                {value}
              </h3>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
