interface AverageScoreCircleProps {
  score: number;
}

export default function AverageScoreCircle({ score }: AverageScoreCircleProps) {
  // Determine color and classification based on thresholds:
  // score >= 80 -> green (emerald-400, #10b981)
  // score >= 50 -> amber/yellow (amber-400, #f59e0b)
  // score < 50 -> rose/red (rose-400, #f43f5e)

  const getStatusDetails = (val: number) => {
    if (val >= 80) {
      return {
        label: "Xuất sắc",
        colorClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
        strokeColor: "#10b981",
        shadowColor: "rgba(16, 185, 129, 0.3)",
        desc: "Tuyệt vời! Bạn đang nắm vững các kỹ năng phát âm và từ vựng. Hãy duy trì phong độ nhé!",
      };
    } else if (val >= 50) {
      return {
        label: "Trung bình",
        colorClass: "text-amber-400 border-amber-500/20 bg-amber-500/10",
        strokeColor: "#f59e0b",
        shadowColor: "rgba(245, 158, 11, 0.3)",
        desc: "Khá tốt! Bạn có nền tảng tốt nhưng cần luyện nói trôi chảy và sửa lỗi ngữ pháp nhiều hơn.",
      };
    } else {
      return {
        label: "Cần cải thiện",
        colorClass: "text-rose-400 border-rose-500/20 bg-rose-500/10",
        strokeColor: "#f43f5e",
        shadowColor: "rgba(244, 63, 94, 0.3)",
        desc: "Cố lên! Bạn cần dành nhiều thời gian hơn để luyện phát âm chuẩn và bổ sung vốn từ vựng cơ bản.",
      };
    }
  };

  const details = getStatusDetails(score);

  // SVG parameters
  const size = 160;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white/2 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden h-full">
      {/* Ambient glow in card background matching the score state color */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[60px] opacity-10 pointer-events-none transition-all duration-500"
        style={{ backgroundColor: details.strokeColor }}
      />

      <h3 className="text-base font-bold uppercase tracking-wider text-white mb-6">
        Điểm Đánh Giá Chung
      </h3>

      {/* Circular Progress Ring */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-5">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            className="text-white/5"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={center}
            cy={center}
          />
          {/* Progress circle line */}
          <circle
            stroke={details.strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={center}
            cy={center}
            style={{
              strokeDashoffset,
              filter: `drop-shadow(0 0 6px ${details.shadowColor})`,
              transition: "stroke-dashoffset 0.8s ease-in-out",
            }}
          />
        </svg>

        {/* Text inside the circle */}
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold tracking-tight text-white leading-none">
            {score}
          </span>
          <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider mt-1.5">
            Điểm TB
          </span>
        </div>
      </div>

      {/* Score Rating Chip */}
      <div
        className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border transition-all duration-300 ${details.colorClass}`}
      >
        {details.label}
      </div>

      <p className="text-sm text-slate-400 mt-4 leading-relaxed max-w-[240px]">
        {details.desc}
      </p>
    </div>
  );
}
