import { Award, ChevronRight, Sparkles, Volume2 } from "lucide-react";
import type { VocabularySuggestionItem } from "../../API/types/homeApi.type";

interface DetailVocabularyTabProps {
  vocabularySuggestions: VocabularySuggestionItem[];
  playTTS: (text: string, id: string) => void;
}

export default function DetailVocabularyTab({
  vocabularySuggestions,
  playTTS,
}: DetailVocabularyTabProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
        <Award className="w-4 h-4 text-blue-400" />
        Đề xuất nâng cấp vốn từ vựng (Upgrade Vocabulary):
      </h4>
      {vocabularySuggestions && vocabularySuggestions.length > 0 ? (
        vocabularySuggestions.map((v, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white/1 border border-white/5 flex flex-col gap-3"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm py-1 px-3 rounded bg-red-500/15 border border-red-500/20 text-red-400 font-mono">
                {v.originalWord}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <span className="text-sm py-1 px-3 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" /> {v.suggestedAlternative}
              </span>
              <button
                onClick={() => playTTS(v.suggestedAlternative, `vocab-detail-${idx}`)}
                className="py-1 px-2.5 rounded bg-white/5 hover:bg-white/10 transition-all text-purple-300 cursor-pointer flex items-center gap-1 ml-auto text-xs"
                title="Nghe phát âm từ nâng cấp"
              >
                <Volume2 size={14} /> Nghe mẫu
              </button>
            </div>
            <div className="p-3.5 bg-black/20 rounded-lg text-sm">
              <p className="font-bold text-purple-300">Lý do & Cách dùng đề xuất:</p>
              <p className="text-gray-400 mt-1 leading-relaxed">{v.explanation}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm italic border border-dashed border-white/10 rounded-2xl">
          Không phát hiện từ vựng cần nâng cấp. Từ vựng bạn sử dụng tương đối hợp lý.
        </div>
      )}
    </div>
  );
}
