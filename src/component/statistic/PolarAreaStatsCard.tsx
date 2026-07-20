import PolarAreaChart from "../../utility/chart/PolarAreaChart";

interface PolarAreaStatsCardProps {
  scores: {
    pronunciation: number;
    vocab: number;
    grammar: number;
    fluency: number;
    coherence: number;
  };
}

export default function PolarAreaStatsCard({
  scores,
}: PolarAreaStatsCardProps) {
  const chartData = {
    labels: ["Phát âm", "Từ vựng", "Ngữ pháp", "Trôi chảy", "Mạch lạc"],
    datasets: [
      {
        label: "Điểm kỹ năng",
        data: [
          scores.pronunciation,
          scores.vocab,
          scores.grammar,
          scores.fluency,
          scores.coherence,
        ],
        backgroundColor: [
          "rgba(52, 211, 153, 0.25)", // Bright Emerald (Phát âm)
          "rgba(96, 165, 250, 0.25)", // Bright Blue (Từ vựng)
          "rgba(251, 191, 36, 0.25)", // Bright Amber/Yellow (Ngữ pháp)
          "rgba(244, 114, 182, 0.25)", // Bright Pink (Trôi chảy)
          "rgba(192, 132, 252, 0.25)", // Bright Purple (Mạch lạc)
        ],
        borderColor: [
          "#34d399", // Neon Emerald (Phát âm)
          "#60a5fa", // Neon Blue (Từ vựng)
          "#fbbf24", // Neon Amber (Ngữ pháp)
          "#f472b6", // Neon Pink (Trôi chảy)
          "#c084fc", // Neon Purple (Mạch lạc)
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white/2 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between shadow-lg relative h-full">
      <div>
        <h3 className="text-base font-bold uppercase tracking-wider text-white mb-1">
          Biểu Đồ Kỹ Năng
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Chi tiết 5 khía cạnh năng lực
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <PolarAreaChart data={chartData} />
      </div>
    </div>
  );
}
