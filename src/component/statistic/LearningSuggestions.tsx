import {
  BookOpen,
  AlertCircle,
  ArrowRight,
  PlayCircle,
  FileText,
} from "lucide-react";

interface LearningSuggestionsProps {
  scores: {
    pronunciation: number;
    vocab: number;
    grammar: number;
    fluency: number;
    coherence: number;
  };
}

export default function LearningSuggestions({
  scores,
}: LearningSuggestionsProps) {
  // Find the lowest score
  const skills = [
    { name: "Phát âm", score: scores.pronunciation, key: "pronunciation" },
    { name: "Từ vựng", score: scores.vocab, key: "vocab" },
    { name: "Ngữ pháp", score: scores.grammar, key: "grammar" },
    { name: "Trôi chảy", score: scores.fluency, key: "fluency" },
    { name: "Mạch lạc", score: scores.coherence, key: "coherence" },
  ];

  // Sort ascending to get weakest skills
  const sortedSkills = [...skills].sort((a, b) => a.score - b.score);
  const weakestSkill = sortedSkills[0];

  // Static recommendations mapped to keys
  const recommendationsMap: Record<
    string,
    {
      title: string;
      desc: string;
      type: "speech" | "reading" | "grammar";
      action: string;
      duration: string;
    }[]
  > = {
    pronunciation: [
      {
        title: "Luyện phát âm đuôi -s/-es và -ed",
        desc: "Hệ thống phát hiện bạn hay bỏ lỡ hoặc phát âm chưa rõ âm vị cuối từ. Hãy tập trung luyện nói bài này.",
        type: "speech",
        action: "Bắt đầu luyện phát âm",
        duration: "10 phút",
      },
      {
        title: "Tập trung vào trọng âm của từ (Word Stress)",
        desc: "Nghe bài nói mẫu và học theo cách nhấn nhá trọng âm của các từ 3-4 âm tiết thông dụng.",
        type: "speech",
        action: "Mở bài nghe trọng âm",
        duration: "15 phút",
      },
    ],
    vocab: [
      {
        title: "Mở rộng từ vựng chủ đề Giáo Dục (Education)",
        desc: "Sử dụng từ vựng nâng cao (collocations/idioms) như 'gain knowledge', 'academic performance' thay vì các từ quá đơn giản.",
        type: "reading",
        action: "Học từ vựng nâng cao",
        duration: "12 phút",
      },
      {
        title: "Luyện bài viết ôn tập từ đồng nghĩa (Synonyms)",
        desc: "Thực hành thay thế các từ vựng cơ bản (good, bad, happy) bằng các từ học thuật phong phú hơn.",
        type: "reading",
        action: "Vào phòng từ vựng",
        duration: "8 phút",
      },
    ],
    grammar: [
      {
        title: "Sửa lỗi Thì hiện tại hoàn thành vs. Quá khứ đơn",
        desc: "Các đoạn ghi âm gần đây của bạn cho thấy sự nhầm lẫn giữa hai thì này khi mô tả trải nghiệm.",
        type: "grammar",
        action: "Xem hướng dẫn ngữ pháp",
        duration: "15 phút",
      },
      {
        title: "Luyện viết câu phức sử dụng Mệnh đề quan hệ",
        desc: "Thực hành liên kết các câu đơn thành câu phức với 'who, which, that' để tăng độ đa dạng ngữ pháp.",
        type: "grammar",
        action: "Bắt đầu luyện tập",
        duration: "10 phút",
      },
    ],
    fluency: [
      {
        title: "Bài tập Phản xạ nói nhanh (Shadowing)",
        desc: "Hãy bật một đoạn ghi âm ngắn của người bản xứ và nói đuổi (shadow) theo họ để tăng phản xạ nhịp điệu.",
        type: "speech",
        action: "Mở chế độ Shadowing",
        duration: "15 phút",
      },
      {
        title: "Giảm thiểu từ đệm (Filler words: uh, ah, like)",
        desc: "Luyện nói về một chủ đề trong 1 phút mà không dùng từ đệm. AI sẽ đếm tần suất xuất hiện.",
        type: "speech",
        action: "Thử thách 1 phút nói",
        duration: "5 phút",
      },
    ],
    coherence: [
      {
        title: "Liên kết ý với Từ nối (Linking words)",
        desc: "Sử dụng trạng từ liên kết như 'Furthermore', 'Consequently', 'On the other hand' để gắn kết các ý rõ ràng.",
        type: "reading",
        action: "Xem từ liên kết mẫu",
        duration: "10 phút",
      },
      {
        title: "Bài tập cấu trúc trả lời dạng PEEL",
        desc: "Khung trả lời chuẩn Point (Luận điểm) - Explanation (Giải thích) - Example (Ví dụ) - Link (Kết nối) giúp câu trả lời mạch lạc.",
        type: "grammar",
        action: "Thực hành khung PEEL",
        duration: "20 phút",
      },
    ],
  };

  const selectedRecs =
    recommendationsMap[weakestSkill.key] || recommendationsMap.pronunciation;

  return (
    <div className="bg-white/2 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between shadow-lg relative h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold uppercase tracking-wider text-white">
            Nhiệm Vụ Đề Xuất Từ AI
          </h3>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-semibold text-purple-300 animate-pulse">
            Cá nhân hóa
          </span>
        </div>
        <p className="text-sm text-slate-400 mb-5">
          Hệ thống AI phân tích thấy kỹ năng{" "}
          <strong className="text-purple-400 font-bold">
            {weakestSkill.name}
          </strong>{" "}
          ({weakestSkill.score}/100) của bạn cần cải thiện nhất.
        </p>

        {/* Suggestion List */}
        <div className="space-y-4">
          {selectedRecs.map((rec, index) => (
            <div
              key={index}
              className="group p-4 bg-white/3 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors shrink-0">
                  {rec.type === "speech" ? (
                    <PlayCircle size={18} />
                  ) : rec.type === "reading" ? (
                    <BookOpen size={18} />
                  ) : (
                    <FileText size={18} />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {rec.title}
                    </h4>
                    <span className="font-mono text-sm text-slate-500 shrink-0">
                      {rec.duration}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {rec.desc}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all pt-1.5">
                    <span>{rec.action}</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <AlertCircle size={14} className="text-slate-400" />
          Tự động cập nhật sau mỗi bản ghi âm mới
        </span>
      </div>
    </div>
  );
}
