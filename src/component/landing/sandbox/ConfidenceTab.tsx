import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import type { PronunciationItem } from "../../../types/landingPageType";

interface ConfidenceTabProps {
  transcript: string;
  pronunciationFeedback: PronunciationItem[];
  selectedWord: PronunciationItem | null;
  onSelectWord: (word: PronunciationItem | null) => void;
}

export default function ConfidenceTab({
  transcript,
  pronunciationFeedback,
  selectedWord,
  onSelectWord,
}: ConfidenceTabProps) {
  const getWordStyle = (
    isSelected: boolean,
    feedbackItem?: PronunciationItem | null,
  ): string => {
    if (!feedbackItem) {
      return isSelected
        ? "text-white bg-white/10"
        : "text-gray-300 hover:text-white hover:bg-white/5";
    }

    const score = feedbackItem.score ?? 0;
    if (score >= 75) {
      return isSelected
        ? "text-white bg-white/10"
        : "text-gray-300 hover:text-white hover:bg-white/5";
    } else if (score >= 45) {
      return isSelected
        ? "bg-yellow-500/30 border border-yellow-500/60 text-yellow-300 font-semibold"
        : "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-semibold hover:bg-yellow-500/30";
    } else {
      return isSelected
        ? "bg-red-500/20 border border-red-500/50 text-red-400 font-semibold"
        : "bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          Nhấp chuột vào các từ để xem độ tự tin nhận diện của AI:
        </h4>

        {/* Interactive transcript words picker */}
        <div className="p-4 bg-black/30 rounded-xl border border-white/5 flex flex-wrap gap-x-2.5 gap-y-3 leading-relaxed">
          {transcript.split(/\s+/).map((word, idx) => {
            const cleanedWord = word
              .toLowerCase()
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
              .trim();
            const feedbackItem = pronunciationFeedback.find(
              (f) => f.word.toLowerCase().trim() === cleanedWord,
            );

            const isSelected =
              selectedWord &&
              feedbackItem &&
              selectedWord.word.toLowerCase().trim() === cleanedWord;

            const wordStyle = getWordStyle(!!isSelected, feedbackItem);

            return (
              <span
                id={`confidence-word-interactive-${idx}`}
                key={idx}
                onClick={() => {
                  if (feedbackItem) {
                    onSelectWord(feedbackItem);
                  }
                }}
                className={`text-sm py-0.5 px-1.5 rounded cursor-pointer transition-all ${wordStyle}`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Displaying details for chosen word */}
      {selectedWord ? (
        <motion.div
          id="confidence-feedback-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-5 rounded-2xl border shadow-lg ${
            selectedWord.score !== undefined && selectedWord.score < 45
              ? "bg-linear-to-br from-red-950/20 to-indigo-950/20 border-red-500/20"
              : selectedWord.score !== undefined && selectedWord.score < 75
                ? "bg-linear-to-br from-yellow-950/30 to-indigo-950/20 border-yellow-500/30"
                : "bg-linear-to-br from-emerald-950/20 to-indigo-950/20 border-emerald-500/20"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <span
              className={`text-sm uppercase tracking-wider font-bold font-mono ${
                selectedWord.score !== undefined && selectedWord.score < 45
                  ? "text-red-400"
                  : selectedWord.score !== undefined && selectedWord.score < 75
                    ? "text-yellow-300"
                    : "text-emerald-400"
              }`}
            >
              Độ Tự Tin Nhận Diện Của AI (Confidence)
            </span>
          </div>

          <div className="bg-black/40 p-5 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase">
                Từ đang chọn
              </p>
              <p className="text-xl font-black text-white tracking-wide font-mono mt-1">
                "{selectedWord.word}"
              </p>
            </div>
            <div className="flex-1 md:max-w-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Tỷ lệ chính xác</span>
                <span
                  className={`text-sm font-bold ${
                    selectedWord.score !== undefined && selectedWord.score < 45
                      ? "text-red-400"
                      : selectedWord.score !== undefined &&
                          selectedWord.score < 75
                        ? "text-yellow-300"
                        : "text-emerald-400"
                  }`}
                >
                  {selectedWord.score}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedWord.score !== undefined && selectedWord.score < 45
                      ? "bg-red-500"
                      : selectedWord.score !== undefined &&
                          selectedWord.score < 75
                        ? "bg-yellow-500"
                        : "bg-emerald-400"
                  }`}
                  style={{ width: `${selectedWord.score ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
