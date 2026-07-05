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
          Nhấp chuột vào từng từ màu đỏ để xem hướng dẫn sửa phát âm:
        </h4>

        {/* Interactive transcript words picker */}
        <div className="p-4 bg-black/30 rounded-xl border border-white/5 flex flex-wrap gap-x-2.5 gap-y-3 leading-relaxed">
          {transcript.split(/\s+/).map((word, idx) => {
            const cleanedWord = word
              .toLowerCase()
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            const feedbackItem = pronunciationFeedback.find(
              (f) => f.word.toLowerCase() === cleanedWord,
            );

            return (
              <span
                id={`word-interactive-${idx}`}
                key={idx}
                onClick={() => {
                  if (feedbackItem) {
                    onSelectWord(feedbackItem);
                  }
                }}
                className={`text-sm py-0.5 px-1.5 rounded cursor-pointer transition-all ${
                  feedbackItem
                    ? "bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
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
          className="p-5 rounded-2xl bg-linear-to-br from-red-950/20 to-indigo-950/20 border border-red-500/20 shadow-lg"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-wider font-bold font-mono text-red-400">
              Lớp Hướng Dẫn Phát Âm IPA
            </span>
            <button
              id="pron-speak-sample"
              onClick={() =>
                playTTS(selectedWord.word, `pron-${selectedWord.word}`)
              }
              className="py-1 px-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[11px] font-bold text-red-300 flex items-center gap-1 transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> Nghe mẫu
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded-xl mb-4 border border-white/5">
            <div>
              <p className="text-[10px] font-mono text-gray-500 uppercase">
                Phát âm Chuẩn xác
              </p>
              <p className="text-lg font-black text-emerald-400 tracking-wide font-mono mt-0.5">
                {selectedWord.expected}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-gray-500 uppercase">
                Bạn đã phát âm
              </p>
              <p className="text-lg font-black text-red-400 tracking-wide font-mono mt-0.5">
                {selectedWord.actual}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-white">Vấn đề phát hiện:</p>
              <p className="text-xs text-gray-300 mt-1">{selectedWord.issue}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Bí quyết sửa giọng (Vocal Coach Tip):
              </p>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {selectedWord.tip}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-xs italic">
          Không phát hiện lỗi phát âm nghiêm trọng hoặc hãy nhấp vào từ màu đỏ
          để xem chi tiết.
        </div>
      )}
    </div>
  );
}
