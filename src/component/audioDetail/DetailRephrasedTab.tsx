import { Sparkles, MessageSquare, Play, Pause } from "lucide-react";
import type { RephrasedResponseItem } from "../../API/types/audio.type";

interface DetailRephrasedTabProps {
  rephrasedResponses?: RephrasedResponseItem[];
  toeicFeedback?: string;
  playTTS: (text: string, id: string) => void;
  currentPlayingText?: string;
  stopTTS?: () => void;
}

export default function DetailRephrasedTab({
  rephrasedResponses = [],
  toeicFeedback = "",
  playTTS,
  currentPlayingText,
  stopTTS,
}: DetailRephrasedTabProps) {
  return (
    <div className="space-y-6">
      {/* 1. Rephrased Suggestions */}
      {rephrasedResponses.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Cách diễn đạt nâng cao từ AI :
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rephrasedResponses.map((r, idx) => {
              const isPlaying = currentPlayingText === r.improvedText;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/2 border border-white/5 flex flex-col justify-between space-y-4 hover:border-purple-500/25 transition-all duration-300 relative group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">
                        Phong cách: {r.style}
                      </span>
                      <button
                        onClick={() => {
                          if (isPlaying) {
                            stopTTS?.();
                          } else {
                            playTTS(r.improvedText, `rephrase-${idx}`);
                          }
                        }}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 transition-all text-purple-400 cursor-pointer"
                        title={isPlaying ? "Dừng phát" : "Nghe phát âm bản nâng cao"}
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    </div>
                    <p className="text-base text-white italic leading-relaxed">
                      "{r.improvedText}"
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5 text-sm text-gray-400">
                    <span className="font-bold text-purple-300 block mb-1">
                      Mẹo nâng điểm:
                    </span>
                    {r.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TOEIC Evaluation */}
      {toeicFeedback && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            Đánh giá tổng quan
          </h4>
          <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-950/20 to-purple-950/20 border border-indigo-500/10 text-sm leading-relaxed text-gray-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="font-bold text-white font-mono text-xs uppercase tracking-widest">
                Nhận xét từ giám khảo AI
              </span>
            </div>
            {toeicFeedback}
          </div>
        </div>
      )}
    </div>
  );
}
