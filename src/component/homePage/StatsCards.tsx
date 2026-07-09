import { Mic, Award, Clock, Volume2 } from "lucide-react";

interface StatsCardsProps {
  totalRecords: number;
  avgScore: number;
  totalDurationStr: string;
  proCount: number;
}

export default function StatsCards({
  totalRecords,
  avgScore,
  totalDurationStr,
  proCount,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat Card 1 */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/2 border border-white/5 backdrop-blur-md shadow-md">
        <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <Mic size={22} />
        </div>
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Tổng bản ghi
          </p>
          <h3 className="text-2xl font-black text-white mt-1">
            {totalRecords}
          </h3>
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/2 border border-white/5 backdrop-blur-md shadow-md">
        <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
          <Award size={22} />
        </div>
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Điểm TB
          </p>
          <h3 className="text-2xl font-black text-purple-400 mt-1">
            {avgScore}%
          </h3>
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/2 border border-white/5 backdrop-blur-md shadow-md">
        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <Clock size={22} />
        </div>
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Thời lượng nói
          </p>
          <h3 className="text-2xl font-black text-white mt-1">
            {totalDurationStr}
          </h3>
        </div>
      </div>

      {/* Stat Card 4 */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/2 border border-white/5 backdrop-blur-md shadow-md">
        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Volume2 size={22} />
        </div>
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Bản ghi Xuất Sắc
          </p>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {proCount}
          </h3>
        </div>
      </div>
    </div>
  );
}
