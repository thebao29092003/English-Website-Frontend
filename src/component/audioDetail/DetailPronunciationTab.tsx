import { motion } from "motion/react";
import { MessageSquare, Volume2 } from "lucide-react";
import type { WordJsonItem, WordPronunciationScoreItem } from "../../API/types/homeApi.type";

interface DetailPronunciationTabProps {
  wordsJson: WordJsonItem[];
  wordsPronunciationScore: WordPronunciationScoreItem[];
  activeWordIndex: number | null;
  selectedWordIndex: number | null;
  onSelectWordIndex: (idx: number | null) => void;
  playTTS: (text: string, id: string) => void;
}

export default function DetailPronunciationTab({
  wordsJson,
  wordsPronunciationScore,
  activeWordIndex,
  selectedWordIndex,
  onSelectWordIndex,
  playTTS,
}: DetailPronunciationTabProps) {
  const getWordStyle = (
    isCurrentlySpoken: boolean,
    isSelected: boolean,
    feedbackItem?: WordPronunciationScoreItem
  ): string => {
    let baseStyle = "";

    if (!feedbackItem) {
      baseStyle = "text-gray-300 hover:text-white hover:bg-white/5";
    } else {
      const status = feedbackItem.status;
      if (status === "Correct") {
        baseStyle = "text-white hover:bg-white/5";
      } else if (status === "Partially Correct") {
        baseStyle = "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-semibold hover:bg-yellow-500/30";
      } else {
        baseStyle = "bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20";
      }
    }

    if (isCurrentlySpoken) {
      return `${baseStyle} ring-2 ring-purple-500 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 transition-all duration-150`;
    }

    if (isSelected) {
      return `${baseStyle} bg-white/10 text-white`;
    }

    return baseStyle;
  };

  const selectedWord = selectedWordIndex !== null ? wordsPronunciationScore[selectedWordIndex] : null;
  const selectedWordMeta = selectedWordIndex !== null ? wordsJson[selectedWordIndex] : null;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-3">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          Nhấp chuột vào từ để xem chi tiết phát âm bên dưới:
        </h4>

        {/* Word display container */}
        <div className="p-5 bg-black/40 rounded-2xl border border-white/5 flex flex-wrap gap-x-2.5 gap-y-3 leading-relaxed">
          {wordsJson.map((wordObj, idx) => {
            const feedbackItem = wordsPronunciationScore[idx];
            const isCurrentlySpoken = activeWordIndex === idx;
            const isSelected = selectedWordIndex === idx;

            return (
              <span
                key={idx}
                onClick={() => {
                  onSelectWordIndex(idx);
                }}
                className={`text-sm py-0.5 px-2 rounded cursor-pointer transition-all ${getWordStyle(
                  isCurrentlySpoken,
                  isSelected,
                  feedbackItem
                )}`}
              >
                {wordObj.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* Selected word pronunciation detail card */}
      {selectedWord && selectedWordMeta ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border shadow-lg ${
            selectedWord.status === "Incorrect"
              ? "bg-linear-to-br from-red-950/20 to-indigo-950/20 border-red-500/20"
              : selectedWord.status === "Partially Correct"
                ? "bg-linear-to-br from-yellow-950/30 to-indigo-950/20 border-yellow-500/30"
                : "bg-linear-to-br from-emerald-950/20 to-indigo-950/20 border-emerald-500/20"
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <span
              className={`text-sm uppercase tracking-wider font-bold font-mono flex items-center gap-2 ${
                selectedWord.status === "Incorrect"
                  ? "text-red-400"
                  : selectedWord.status === "Partially Correct"
                    ? "text-yellow-300"
                    : "text-emerald-400"
              }`}
            >
              Phân tích phát âm từ: "{selectedWord.word}"
              <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold font-mono">
                {Math.round(selectedWord.accuracy * 100)}% chính xác
              </span>
            </span>
            <button
              onClick={() => playTTS(selectedWord.word, `pron-${selectedWord.word}`)}
              className={`py-1 px-3 border rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                selectedWord.status === "Incorrect"
                  ? "bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-300"
                  : selectedWord.status === "Partially Correct"
                    ? "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/30 text-yellow-200"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-300"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" /> Nghe phát âm mẫu
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded-xl mb-4 border border-white/5">
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase">Phát âm chuẩn (IPA)</p>
              <p className="text-lg font-black text-emerald-400 tracking-wide font-mono mt-0.5">
                /{selectedWord.standard_pronunciation}/
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase">Bạn đã phát âm</p>
              <p
                className={`text-lg font-black tracking-wide font-mono mt-0.5 ${
                  selectedWord.status === "Incorrect"
                    ? "text-red-400"
                    : selectedWord.status === "Partially Correct"
                      ? "text-yellow-300"
                      : "text-emerald-400"
                }`}
              >
                /{selectedWord.original_pronunciation || "N/A"}/
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <span className="font-bold text-white">Kết quả đánh giá: </span>
              {selectedWord.status === "Incorrect"
                ? "Chưa chính xác. Bạn đã phát âm lệch so với chuẩn IPA."
                : selectedWord.status === "Partially Correct"
                  ? "Khá chính xác nhưng một số âm vị chưa chuẩn."
                  : "Rất tốt! Bạn phát âm hoàn toàn chính xác."}
            </p>
            <p>
              <span className="font-bold text-white">Số âm chính xác: </span>
              <span className="font-mono text-purple-300">
                {selectedWord.correct_phones} / {selectedWord.total_phones}
              </span>{" "}
              âm vị chuẩn.
            </p>
            <p className="text-xs text-gray-500">
              * Mẹo: Click nghe phát âm chuẩn và lặp lại chậm rãi để lưỡi làm quen với các âm vị có độ chính xác thấp.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm italic border border-dashed border-white/10 rounded-2xl">
          Nhấp vào các từ có màu để xem chi tiết hướng dẫn phát âm IPA.
        </div>
      )}
    </div>
  );
}
