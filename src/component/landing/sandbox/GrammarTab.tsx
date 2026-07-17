import { CheckCircle2, Play, Pause } from "lucide-react";
import type { GrammarCorrection } from "../../../types/landingPage.type";
interface GrammarTabProps {
  grammarFeedback: GrammarCorrection[];
  playTTS: (text: string, id: string) => void;
  currentPlayingText?: string;
  stopTTS?: () => void;
}
export default function GrammarTab({
  grammarFeedback,
  playTTS,
  currentPlayingText,
  stopTTS,
}: GrammarTabProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-pink-400" />
        Chỉnh sửa cấu trúc & Lỗi ngữ pháp:
      </h4>
      {grammarFeedback && grammarFeedback.length > 0 ? (
        grammarFeedback.map((g, idx) => {
          const isPlaying = currentPlayingText === g.corrected;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/1 border border-white/5 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Original */}
                <div className="bg-red-950/15 border border-red-900/20 p-3 rounded-lg text-sm text-red-300">
                  <span className="font-mono text-sm font-bold uppercase tracking-wider block text-red-400/80 mb-1">
                    CÂU NÓI CỦA BẠN:
                  </span>
                  "{g.original}"
                </div>
                {/* Corrected */}
                <div className="bg-emerald-950/15 border border-emerald-900/20 p-3 rounded-lg text-sm text-emerald-300 relative group">
                  <span className="font-mono text-sm font-bold uppercase tracking-wider block text-emerald-400/80 mb-1">
                    GỢI Ý CỦA AI:
                  </span>
                  "{g.corrected}"
                  <button
                    id={`play-tts-grammar-${idx}`}
                    onClick={() => {
                      if (isPlaying) {
                        stopTTS?.();
                      } else {
                        playTTS(g.corrected, `gram-${idx}`);
                      }
                    }}
                    className="absolute top-1 right-1 py-1 px-2  rounded hover:bg-white/10 transition-all text-emerald-400 cursor-pointer"
                    title={isPlaying ? "Dừng phát" : "Nghe phát âm chuẩn"}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>
              </div>
              <div className="p-3 bg-black/20 rounded-lg text-sm space-y-1">
                <p className="font-bold text-purple-300">{g.rule}</p>
                <p className="text-gray-400 mt-1 leading-relaxed">{g.explain}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4.5 h-4.5" /> Không tìm thấy lỗi ngữ pháp
          nào! Rất tuyệt vời.
        </div>
      )}
    </div>
  );
}
