import type { AnalysisResult } from "../../../types/landingPageType";
interface ScoreOverviewProps {
  result: AnalysisResult;
}
export default function ScoreOverview({ result }: ScoreOverviewProps) {
  return (
    <div className="p-6 sm:p-8 bg-linear-to-b from-white/2 to-transparent border-b border-white/5">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
        {/* Circle Score Gauge */}
        <div className="relative shrink-0 flex items-center justify-center">
          {/* SVG Gauge */}
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-white/5"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-purple-500"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={
                2 * Math.PI * 62 * (1 - result.overallScore / 100)
              }
              strokeLinecap="round"
            />
          </svg>
          {/* Inner overlay details */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="font-display text-4xl font-extrabold text-white tracking-tight leading-none">
              {result.overallScore}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 mt-1">
              Điểm Số
            </span>
            <span className="px-2 py-0.5 mt-2 rounded bg-purple-500/15 text-[11px] font-bold text-purple-300 border border-purple-500/20">
              {result.cefrLevel}
            </span>
          </div>
        </div>
        {/* Band levels descriptions */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center justify-center gap-2 mb-2 sm:justify-end">
            <span className="text-xs uppercase font-bold tracking-widest font-mono text-blue-400">
              English Speaking Report
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h4 className="font-display text-2xl sm:text-2xl font-black text-purple-300 mt-1">
            Cấp độ: {result.levelName}
          </h4>
          <p className="text-sm text-gray-400 mt-3 font-mono border-l-2 border-purple-500/30 pl-3 italic">
            "{result.overallInsight}"
          </p>
        </div>
      </div>
      {/* 5 Dimensions Progress Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t border-white/10">
        {/* Metric 1 */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 font-sans block mb-1">
            Phát âm
          </span>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-xl font-black text-blue-400 leading-none">
              {result.skills.pronunciation.score}%
            </span>
            <span className="text-[10px] font-bold text-blue-300 font-mono">
              {result.skills.pronunciation.grade}
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              style={{
                width: `${result.skills.pronunciation.score}%`,
              }}
              className="h-full bg-blue-400"
            />
          </div>
        </div>
        {/* Metric 2 */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 font-sans block mb-1">
            Trôi chảy
          </span>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-xl font-black text-violet-400 leading-none">
              {result.skills.fluency.score}%
            </span>
            <span className="text-[10px] font-bold text-violet-300 font-mono">
              {result.skills.fluency.grade}
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              style={{ width: `${result.skills.fluency.score}%` }}
              className="h-full bg-violet-400"
            />
          </div>
        </div>
        {/* Metric 3 */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 font-sans block mb-1">
            Từ vựng
          </span>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-xl font-black text-indigo-400 leading-none">
              {result.skills.vocabulary.score}%
            </span>
            <span className="text-[10px] font-bold text-indigo-300 font-mono">
              {result.skills.vocabulary.grade}
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              style={{ width: `${result.skills.vocabulary.score}%` }}
              className="h-full bg-indigo-400"
            />
          </div>
        </div>
        {/* Metric 4 */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 font-sans block mb-1">
            Ngữ pháp
          </span>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-xl font-black text-purple-400 leading-none">
              {result.skills.grammar.score}%
            </span>
            <span className="text-[10px] font-bold text-purple-300 font-mono">
              {result.skills.grammar.grade}
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              style={{ width: `${result.skills.grammar.score}%` }}
              className="h-full bg-purple-400"
            />
          </div>
        </div>
        {/* Metric 5 */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm col-span-2 md:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 font-sans block mb-1">
            Dễ hiểu
          </span>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-xl font-black text-emerald-400 leading-none">
              {result.skills.comprehensibility.score}%
            </span>
            <span className="text-[10px] font-bold text-emerald-300 font-mono">
              {result.skills.comprehensibility.grade}
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              style={{
                width: `${result.skills.comprehensibility.score}%`,
              }}
              className="h-full bg-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
