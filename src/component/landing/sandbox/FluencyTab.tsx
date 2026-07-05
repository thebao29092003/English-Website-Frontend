import { Flame, CheckCircle2 } from "lucide-react";
import type { FluencyTimelineItem } from "../../../types/landingPageType";
interface FluencyTabProps {
  fluencyTimeline: FluencyTimelineItem[];
}
export default function FluencyTab({ fluencyTimeline }: FluencyTabProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
        <Flame className="w-4 h-4 text-orange-400" />
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
              className="flex justify-between items-center text-xs gap-4"
            >
              <div className="font-mono text-purple-300 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/15">
                {item.time}
              </div>
              <div className="flex-1 text-gray-300">
                {item.type === "pause"
                  ? "Tạm ngừng quá lâu"
                  : "Ngập ngừng tìm từ"}{" "}
                <span className="text-gray-500 text-[11px] font-mono block">
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
          <div className="text-center py-6 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Trôi chảy tuyệt vời, không có
            điểm ngập ngừng bất thường nào.
          </div>
        )}
      </div>
    </div>
  );
}
