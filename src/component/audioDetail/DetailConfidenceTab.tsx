import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import type { WordJsonItem } from "../../API/types/homeApi.type";

interface DetailConfidenceTabProps {
  wordsJson: WordJsonItem[];
  activeWordIndex: number | null;
  selectedWordIndex: number | null;
  onSelectWordIndex: (idx: number | null) => void;
}

export default function DetailConfidenceTab({
  wordsJson,
  activeWordIndex,
  selectedWordIndex,
  onSelectWordIndex,
}: DetailConfidenceTabProps) {
  const getWordStyle = (
    isCurrentlySpoken: boolean,
    isSelected: boolean,
    confidence: number
  ): string => {
    let baseStyle = "";
    const pct = Math.round(confidence * 100);

    if (pct >= 90) {
      baseStyle = "text-white hover:bg-white/5";
    } else if (pct >= 60) {
      baseStyle = "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-semibold hover:bg-yellow-500/30";
    } else {
      baseStyle = "bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20";
    }

    if (isCurrentlySpoken) {
      return `${baseStyle} ring-2 ring-purple-500 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 transition-all duration-150`;
    }

    if (isSelected) {
      return `${baseStyle} bg-white/10 text-white`;
    }

    return baseStyle;
  };

  const selectedWord = selectedWordIndex !== null ? wordsJson[selectedWordIndex] : null;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-3">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          Nhấp chuột vào từ để xem độ tự tin nhận diện của AI:
        </h4>

        {/* Interactive transcript words picker */}
        <div className="p-5 bg-black/40 rounded-2xl border border-white/5 flex flex-wrap gap-x-2.5 gap-y-3 leading-relaxed">
          {wordsJson.map((wordObj, idx) => {
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
                  wordObj.confidence
                )}`}
              >
                {wordObj.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* Displaying details for chosen word */}
      {selectedWord ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-5 rounded-2xl border shadow-lg ${
            Math.round(selectedWord.confidence * 100) < 60
              ? "bg-linear-to-br from-red-950/20 to-indigo-950/20 border-red-500/20"
              : Math.round(selectedWord.confidence * 100) < 90
                ? "bg-linear-to-br from-yellow-950/30 to-indigo-950/20 border-yellow-500/30"
                : "bg-linear-to-br from-emerald-950/20 to-indigo-950/20 border-emerald-500/20"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <span
              className={`text-sm uppercase tracking-wider font-bold font-mono ${
                Math.round(selectedWord.confidence * 100) < 60
                  ? "text-red-400"
                  : Math.round(selectedWord.confidence * 100) < 90
                    ? "text-yellow-300"
                    : "text-emerald-400"
              }`}
            >
              Độ Tự Tin Nhận Diện Của AI (Confidence)
            </span>
          </div>

          <div className="bg-black/40 p-5 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase">Từ đang chọn</p>
              <p className="text-xl font-black text-white tracking-wide font-mono mt-1">
                "{selectedWord.text}"
              </p>
            </div>
            <div className="flex-1 md:max-w-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Độ tin cậy nhận diện</span>
                <span
                  className={`text-sm font-bold ${
                    Math.round(selectedWord.confidence * 100) < 60
                      ? "text-red-400"
                      : Math.round(selectedWord.confidence * 100) < 90
                        ? "text-yellow-300"
                        : "text-emerald-400"
                  }`}
                >
                  {Math.round(selectedWord.confidence * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    Math.round(selectedWord.confidence * 100) < 60
                      ? "bg-red-500"
                      : Math.round(selectedWord.confidence * 100) < 90
                        ? "bg-yellow-500"
                        : "bg-emerald-400"
                  }`}
                  style={{ width: `${Math.round(selectedWord.confidence * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm italic border border-dashed border-white/10 rounded-2xl">
          Nhấp vào các từ để xem độ tự tin nhận diện của AI đối với từ đó.
        </div>
      )}
    </div>
  );
}
