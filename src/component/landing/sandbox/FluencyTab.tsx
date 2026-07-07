import { Flame, CheckCircle2 } from "lucide-react";
import type { FluencyTimelineItem } from "../../../types/landingPageType";

interface FluencyTabProps {
  fluencyTimeline: FluencyTimelineItem[];
  wordsPerMinute?: number;
}

export default function FluencyTab({
  fluencyTimeline,
  wordsPerMinute = 135,
}: FluencyTabProps) {
  // Clamp value between 50 and 250
  const wpm = Math.max(50, Math.min(250, wordsPerMinute));

  // Calculate percentage for SVG arc (50 to 250 range)
  const percentage = (wpm - 50) / 200; // 0 to 1
  const pathLength = 157.08; // Circumference of semicircle with r=50 is PI*r = 157.08
  const strokeDashoffset = pathLength * (1 - percentage);

  // Determine status color and text based on WPM ranges
  let statusText = "Tốt";
  let statusColor = "text-emerald-400";
  let strokeColor = "#34d399"; // emerald-400

  if (wpm < 110) {
    statusText = "Chậm";
    statusColor = "text-amber-400";
    strokeColor = "#fbbf24"; // amber-400
  } else if (wpm > 150) {
    statusText = "Nhanh";
    statusColor = "text-rose-400";
    strokeColor = "#fb7185"; // rose-400
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: WPM Arc Gauge Widget */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/2 border border-white/5 relative overflow-hidden">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Tốc Độ Nói (WPM)
          </h4>

          <div className="relative flex items-center justify-center w-full h-28">
            <svg viewBox="0 0 120 70" className="w-48 h-28">
              <defs>
                <filter
                  id="gauge-glow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Semicircular background track */}
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke="#ffffff10"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Semicircular progress arc */}
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke={strokeColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${pathLength} ${pathLength}`}
                strokeDashoffset={strokeDashoffset}
                filter="url(#gauge-glow)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* WPM text inside the arc */}
            <div className="absolute bottom-2 flex flex-col items-center">
              <span className="text-3xl font-black text-white leading-none font-mono">
                {wpm}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                từ / phút
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div className="mt-4 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${wpm < 110 ? "bg-amber-400" : wpm > 150 ? "bg-rose-400" : "bg-emerald-400"}`}
            />
            <span className="text-gray-400">Trạng thái: </span>
            <span className={statusColor}>{statusText}</span>
          </div>

          {/* WPM guidelines */}
          <div className="mt-5 w-full flex items-center justify-between text-xs font-mono text-white- border-t border-white/5 pt-3">
            <div className="flex flex-col items-center">
              <span>&lt; 110</span>
              <span className="text-amber-500/70 font-semibold mt-0.5">
                Chậm
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span>110 - 150</span>
              <span className="text-emerald-500/70 font-semibold mt-0.5">
                Tốt
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span>&gt; 150</span>
              <span className="text-rose-500/70 font-semibold mt-0.5">
                Nhanh
              </span>
            </div>
          </div>
        </div>

        {/* Right: Hesitations/Pauses timeline */}
        <div className="md:col-span-7 space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Nhận diện nhịp điệu & Điểm ngắt quãng:
          </h4>
          <div className="p-4 rounded-xl bg-white/1 border border-white/5 space-y-4">
            <div className="flex justify-between text-xs text-gray-500 font-mono pb-2 border-b border-white/5">
              <span>Mốc thời gian</span>
              <span>Chi tiết sự cố</span>
              <span>Độ trễ</span>
            </div>
            {fluencyTimeline && fluencyTimeline.length > 0 ? (
              fluencyTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm gap-4"
                >
                  <div className="font-mono w-[68px] text-center text-purple-300 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/15">
                    {item.time}
                  </div>
                  <div className="flex-1 text-gray-300">
                    {item.type === "pause"
                      ? "Tạm ngừng quá lâu"
                      : "Ngập ngừng tìm từ"}{" "}
                    <span className="text-gray-500 text-xs font-mono block">
                      ({item.context})
                    </span>
                  </div>
                  <div
                    className={`font-mono font-bold ${
                      item.severity === "severe"
                        ? "text-red-400"
                        : item.severity === "medium"
                          ? "text-amber-400"
                          : "text-blue-400"
                    }`}
                  >
                    {item.duration}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Trôi chảy tuyệt vời, không
                có điểm ngập ngừng bất thường nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
