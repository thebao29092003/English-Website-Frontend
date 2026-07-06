import { Award, ChevronRight, Sparkles, Volume2 } from "lucide-react";
import type { VocabularyUpgrade } from "../../../types/landingPageType";
interface VocabularyTabProps {
  vocabularyFeedback: VocabularyUpgrade[];
  playTTS: (text: string, id: string) => void;
}
export default function VocabularyTab({
  vocabularyFeedback,
  playTTS,
}: VocabularyTabProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
        <Award className="w-4 h-4 text-blue-400" />
        Gợi ý nâng cấp vốn từ vựng (Upgrade Vocabulary):
      </h4>
      {vocabularyFeedback && vocabularyFeedback.length > 0 ? (
        vocabularyFeedback.map((v, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white/1 border border-white/5 flex flex-col gap-3"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm py-1 px-2.5 rounded bg-red-500/15 border border-red-500/20 text-red-400 font-mono">
                {v.originalWord}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <span className="text-sm py-1 px-2.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {v.suggestedWord}
              </span>
            </div>
            <div className="bg-black/30 p-3.5 rounded-lg space-y-2">
              <p className="text-sm text-gray-400">
                <strong className="text-gray-300">Thay thế trong câu:</strong> "
                {v.sentence}"
              </p>
              <p className="text-sm text-purple-300 font-semibold relative group">
                <strong className="text-purple-400">Nói thành:</strong> "
                {v.betterSentence}"
                <button
                  id={`play-tts-vocab-${idx}`}
                  onClick={() => playTTS(v.betterSentence, `vocab-${idx}`)}
                  className="absolute top-0 right-0 p-1 rounded hover:bg-white/10 transition-all text-purple-300 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </p>
            </div>
            <p className="text-sm text-gray-400 italic">
              <strong className="text-gray-300 not-italic">
                Lý do nâng cấp:
              </strong>{" "}
              {v.reason}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm italic">
          Không tìm thấy từ cần nâng cấp.
        </div>
      )}
    </div>
  );
}
