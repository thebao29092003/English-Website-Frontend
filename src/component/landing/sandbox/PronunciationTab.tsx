import { motion } from "motion/react";
import { MessageSquare, Volume2 } from "lucide-react";
import type { PronunciationItem } from "../../../types/landingPageType";

interface PronunciationTabProps {
  transcript: string;
  pronunciationFeedback: PronunciationItem[];
  selectedWord: PronunciationItem | null;
  onSelectWord: (word: PronunciationItem | null) => void;
  playTTS: (text: string, id: string) => void;
}

export default function PronunciationTab({
  transcript,
  pronunciationFeedback,
  selectedWord,
  onSelectWord,
  playTTS,
}: PronunciationTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          Nhấp chuột vào các từ màu vàng hoặc màu đỏ để xem hướng dẫn sửa phát
          âm:
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

            // Determine word style based on score
            // >= 75: bình thường (đúng), 45-74: vàng (sai vừa), < 45: đỏ (sai nhiều)
            let wordStyle = "text-gray-300 hover:text-white hover:bg-white/5";

            if (feedbackItem) {
              const score = feedbackItem.score ?? 0;

              if (score >= 75) {
                wordStyle = "text-gray-300 hover:text-white hover:bg-white/5";
              } else if (score >= 45) {
                wordStyle =
                  "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-semibold hover:bg-yellow-500/30";
              } else {
                wordStyle =
                  "bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20";
              }
            }

            return (
              <span
                id={`word-interactive-${idx}`}
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

      {/* Displaying details for chosen mispronounced word */}
      {selectedWord ? (
        <motion.div
          id="pron-feedback-card"
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
          <div className="flex justify-between items-center mb-3">
            <span
              className={`text-sm uppercase tracking-wider font-bold font-mono flex items-center gap-2 ${
                selectedWord.score !== undefined && selectedWord.score < 45
                  ? "text-red-400"
                  : selectedWord.score !== undefined && selectedWord.score < 75
                    ? "text-yellow-300"
                    : "text-emerald-400"
              }`}
            >
              Hướng Dẫn Phát Âm IPA
              {selectedWord.score !== undefined && (
                <span className="px-2 py-1 rounded bg-white/10 text-xs font-bold">
                  Điểm: {selectedWord.score}/100
                </span>
              )}
            </span>
            <button
              id="pron-speak-sample"
              onClick={() =>
                playTTS(selectedWord.word, `pron-${selectedWord.word}`)
              }
              className={`py-1 px-2.5 border rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                selectedWord.score !== undefined && selectedWord.score < 45
                  ? "bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-300"
                  : selectedWord.score !== undefined && selectedWord.score < 75
                    ? "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/30 text-yellow-200"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-300"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" /> Nghe mẫu
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded-xl mb-4 border border-white/5">
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase">
                Phát âm Chuẩn xác
              </p>
              <p className="text-lg font-black text-emerald-400 tracking-wide font-mono mt-0.5">
                {selectedWord.expected}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase">
                Bạn đã phát âm
              </p>
              <p
                className={`text-lg font-black tracking-wide font-mono mt-0.5 ${
                  selectedWord.score !== undefined && selectedWord.score < 45
                    ? "text-red-400"
                    : selectedWord.score !== undefined &&
                        selectedWord.score < 75
                      ? "text-yellow-300"
                      : "text-emerald-400"
                }`}
              >
                {selectedWord.actual}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-bold text-white">Vấn đề phát hiện:</p>
              <p className="text-sm text-gray-300 mt-1">{selectedWord.issue}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Bí quyết sửa giọng (Vocal Coach Tip):
              </p>
              <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                {selectedWord.tip}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm italic">
          Không phát hiện lỗi phát âm nghiêm trọng hoặc hãy nhấp vào các từ có
          màu để xem chi tiết.
        </div>
      )}
    </div>
  );
}
