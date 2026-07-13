import { CheckCircle2, Volume2 } from "lucide-react";
import type { GrammarErrorItem } from "../../API/types/homeApi.type";

interface DetailGrammarTabProps {
  grammarErrors: GrammarErrorItem[];
  playTTS: (text: string, id: string) => void;
}

export default function DetailGrammarTab({
  grammarErrors,
  playTTS,
}: DetailGrammarTabProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-pink-400" />
        Chỉnh sửa cấu trúc & Lỗi ngữ pháp phát hiện:
      </h4>
      {grammarErrors && grammarErrors.length > 0 ? (
        grammarErrors.map((g, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white/1 border border-white/5 space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Original sentence */}
              <div className="bg-red-950/15 border border-red-900/20 p-3.5 rounded-lg text-sm text-red-300">
                <span className="font-mono text-xs font-bold uppercase tracking-wider block text-red-400/80 mb-1">
                  CÂU BẠN NÓI:
                </span>
                "{g.original}"
              </div>
              {/* Corrected sentence */}
              <div className="bg-emerald-950/15 border border-emerald-900/20 p-3.5 rounded-lg text-sm text-emerald-300 relative group pr-10">
                <span className="font-mono text-xs font-bold uppercase tracking-wider block text-emerald-400/80 mb-1">
                  AI ĐỀ XUẤT SỬA:
                </span>
                "{g.corrected}"
                <button
                  onClick={() => playTTS(g.corrected, `gram-detail-${idx}`)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded hover:bg-white/10 transition-all text-emerald-400 cursor-pointer"
                  title="Nghe phát âm chuẩn câu sửa"
                >
                  <Volume2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-3 bg-black/20 rounded-lg text-sm">
              <p className="font-bold text-purple-300">Giải thích chi tiết:</p>
              <p className="text-gray-400 mt-1 leading-relaxed">{g.explanation}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-1.5 border border-dashed border-white/10 rounded-2xl">
          <CheckCircle2 className="w-4.5 h-4.5" /> Tuyệt vời! Không phát hiện lỗi ngữ pháp nào trong bài nói của bạn.
        </div>
      )}
    </div>
  );
}
