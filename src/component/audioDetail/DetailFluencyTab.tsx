import { Flame, CheckCircle2 } from "lucide-react";
import type { FluencyErrorItem } from "../../API/types/homeApi.type";

interface DetailFluencyTabProps {
  fluencyScore: number;
  wordPerMinute: number;
  fluencyErrors: FluencyErrorItem[];
  onSeek: (ms: number) => void;
}

export default function DetailFluencyTab({
  fluencyScore,
  wordPerMinute,
  fluencyErrors,
  onSeek,
}: DetailFluencyTabProps) {
  // Clamp WPM between 50 and 250
  const wpm = Math.max(50, Math.min(250, wordPerMinute));
  const percentage = (wpm - 50) / 200;
  const pathLength = 157.08;
  const strokeDashoffset = pathLength * (1 - percentage);

  let statusText = "Tốt";
  let statusColor = "text-emerald-400";
  let strokeColor = "#34d399";

  if (wpm < 110) {
    statusText = "Chậm";
    statusColor = "text-amber-400";
    strokeColor = "#fbbf24";
  } else if (wpm > 150) {
    statusText = "Nhanh";
    statusColor = "text-rose-400";
    strokeColor = "#fb7185";
  }

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: WPM Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/2 border border-white/5 relative overflow-hidden">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Tốc Độ Nói (WPM)
          </h4>

          <div className="relative flex items-center justify-center w-full h-28">
            <svg viewBox="0 0 120 70" className="w-48 h-28">
              <defs>
                <filter id="gauge-glow-detail" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke="#ffffff10"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke={strokeColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${pathLength} ${pathLength}`}
                strokeDashoffset={strokeDashoffset}
                filter="url(#gauge-glow-detail)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute bottom-2 flex flex-col items-center">
              <span className="text-3xl font-black text-white leading-none font-mono">
                {wpm}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                từ / phút
              </span>
            </div>
          </div>

          <div className="mt-4 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                wpm < 110 ? "bg-amber-400" : wpm > 150 ? "bg-rose-400" : "bg-emerald-400"
              }`}
            />
            <span className="text-gray-400">Trạng thái: </span>
            <span className={statusColor}>{statusText}</span>
            <span className="text-gray-500 mx-1">|</span>
            <span className="text-gray-400">Điểm trôi chảy: </span>
            <span className="text-violet-400">{fluencyScore}/100</span>
          </div>

          <div className="mt-5 w-full flex items-center justify-between text-xs font-mono text-gray-400 border-t border-white/5 pt-3">
            <div className="flex flex-col items-center">
              <span>&lt; 110</span>
              <span className="text-amber-500/70 font-semibold mt-0.5">Chậm</span>
            </div>
            <div className="flex flex-col items-center">
              <span>110 - 150</span>
              <span className="text-emerald-500/70 font-semibold mt-0.5">Tốt</span>
            </div>
            <div className="flex flex-col items-center">
              <span>&gt; 150</span>
              <span className="text-rose-500/70 font-semibold mt-0.5">Nhanh</span>
            </div>
          </div>
        </div>

        {/* Right: Hesitations/Pauses timeline */}
        <div className="md:col-span-7 space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Điểm ngắt quãng & Sự cố trôi chảy (Nhấp để tua đến lỗi):
          </h4>
          <div className="p-4 rounded-xl bg-white/1 border border-white/5 space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between text-xs text-gray-500 font-mono pb-2 border-b border-white/5">
              <span className="w-[80px]">Mốc thời gian</span>
              <span className="flex-1 px-2">Chi tiết sự cố</span>
              <span className="w-[60px] text-right">Độ trễ</span>
            </div>
            {fluencyErrors && fluencyErrors.length > 0 ? (
              fluencyErrors.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSeek(item.StartTime * 1000)}
                  className="flex justify-between items-center text-sm gap-4 cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-all"
                  title="Nhấp để nghe vị trí này"
                >
                  <div className="font-mono w-[80px] text-center text-purple-300 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/15">
                    {formatTime(item.StartTime)}
                  </div>
                  <div className="flex-1 text-gray-300 px-2 text-xs sm:text-sm">
                    <span className="font-bold text-white block mb-0.5">
                      {item.Type === "Speed"
                        ? "Thay đổi tốc độ nói"
                        : item.Type === "Hesitation"
                          ? "Ngập ngừng / Hesitation"
                          : "Tạm dừng / Pause"}
                    </span>
                    {item.Message}
                  </div>
                  <div
                    className={`font-mono font-bold w-[60px] text-right ${
                      item.Duration > 1.5
                        ? "text-red-400"
                        : item.Duration > 0.8
                          ? "text-amber-400"
                          : "text-blue-400"
                    }`}
                  >
                    {item.Duration.toFixed(2)}s
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4.5 h-4.5" /> Trôi chảy tuyệt vời, không phát hiện lỗi ngắt quãng bất thường!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
