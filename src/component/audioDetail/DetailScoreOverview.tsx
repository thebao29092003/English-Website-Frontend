import type { AudioDetailValueResponse } from "../../API/types/audioDetail.type";

interface DetailScoreOverviewProps {
  value: AudioDetailValueResponse;
}

export default function DetailScoreOverview({
  value,
}: DetailScoreOverviewProps) {
  // Normalize scores to 0-100 scale
  const pronScore = Math.round(value.pronunciationScore * 100);
  const confidenceScore = Math.round(value.overallConfidence * 100);
  const fluencyScore = Math.round(value.fluencyScore);
  const grammarScore = Math.round(value.overallGrammarScore);
  const vocabScore = Math.round(value.overallVocabScore);

  const scores = [
    pronScore,
    confidenceScore,
    fluencyScore,
    grammarScore,
    vocabScore,
  ].filter((s) => s > 0);
  const overallScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  // Determine CEFR-like level based on overall score
  let cefrLevel = "A1";
  let levelName = "Cơ bản (Beginner)";
  let overallInsight =
    "Bạn bắt đầu hành trình luyện nói. Hãy tiếp tục luyện tập phát âm rõ ràng hơn.";

  if (overallScore >= 85) {
    cefrLevel = "C1";
    levelName = "Lưu loát (Advanced)";
    overallInsight =
      "Khả năng nói tuyệt vời! Phát âm chuẩn, trôi chảy tự nhiên và sử dụng từ ngữ phong phú.";
  } else if (overallScore >= 70) {
    cefrLevel = "B2";
    levelName = "Khá (Upper Intermediate)";
    overallInsight =
      "Giao tiếp tự tin. Cần chú ý tinh chỉnh một số chi tiết phát âm và trôi chảy để hoàn hảo hơn.";
  } else if (overallScore >= 50) {
    cefrLevel = "B1";
    levelName = "Trung bình (Intermediate)";
    overallInsight =
      "Có thể truyền tải ý tưởng cơ bản. Cần cải thiện tính trôi chảy và sửa các lỗi phát âm cụ thể.";
  } else if (overallScore >= 30) {
    cefrLevel = "A2";
    levelName = "Sơ cấp (Elementary)";
    overallInsight =
      "Có cố gắng diễn đạt nhưng tốc độ còn chậm và nhiều lỗi phát âm cơ bản. Hãy luyện tập thêm hàng ngày.";
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return {
        colorClass: "text-emerald-400",
        bgClass: "bg-emerald-400",
      };
    }
    if (score >= 50) {
      return {
        colorClass: "text-amber-400",
        bgClass: "bg-amber-400",
      };
    }
    return {
      colorClass: "text-rose-400",
      bgClass: "bg-rose-400",
    };
  };

  const skillsConfig = [
    {
      label: "Phát âm",
      score: pronScore,
      ...getScoreColor(pronScore),
    },
    {
      label: "Dễ hiểu",
      score: confidenceScore,
      ...getScoreColor(confidenceScore),
    },
    {
      label: "Trôi chảy",
      score: fluencyScore,
      ...getScoreColor(fluencyScore),
    },
    {
      label: "Ngữ pháp",
      score: grammarScore,
      ...getScoreColor(grammarScore),
    },
    {
      label: "Từ vựng",
      score: vocabScore,
      ...getScoreColor(vocabScore),
    },
  ];

  return (
    <div className="p-6 sm:p-8 bg-linear-to-b from-white/2 to-transparent border-b border-white/5">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
        {/* Circle Score Gauge */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-white/5"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-purple-500"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={2 * Math.PI * 62 * (1 - overallScore / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center text-center">
            <span className="font-display text-4xl font-extrabold text-white tracking-tight leading-none">
              {overallScore}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 mt-1">
              ĐIỂM TỔNG HỢP
            </span>
            <span className="px-2 py-0.5 mt-2 rounded bg-purple-500/15 text-[11px] font-bold text-purple-300 border border-purple-500/20">
              {cefrLevel}
            </span>
          </div>
        </div>

        {/* Level Details */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center justify-center gap-2 mb-2 sm:justify-end">
            <span className="text-xs uppercase font-bold tracking-widest font-mono text-blue-400">
              Báo Cáo Phân Tích Giọng Nói AI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h4 className="font-display text-2xl sm:text-2xl font-black text-purple-300 mt-1">
            Cấp độ tương đương: {levelName}
          </h4>
          <p className="text-sm text-gray-400 mt-3 font-mono border-l-2 border-purple-500/30 pl-3 italic">
            "{overallInsight}"
          </p>
        </div>
      </div>

      {/* 5 Skills Score Bars */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t border-white/10">
        {skillsConfig.map((skill, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm"
          >
            <span className="text-[11px] font-bold text-slate-400 font-sans block mb-1">
              {skill.label}
            </span>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span
                className={`text-xl font-black ${skill.colorClass} leading-none`}
              >
                {skill.score}%
              </span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${skill.score}%` }}
                className={`h-full ${skill.bgClass}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
