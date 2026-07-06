import { Flame, Sparkles } from "lucide-react";

interface WelcomeStateProps {
  onStartDemo: () => void;
}

export default function WelcomeState({ onStartDemo }: WelcomeStateProps) {
  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 p-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center min-h-[500px]">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-purple-400 mb-6">
        <Flame className="w-8 h-8 animate-pulse" />
      </div>
      <h3 className="font-display text-2xl font-bold text-white mb-3">
        Bảng Báo Cáo Phân Tích Kép
      </h3>
      <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
        Sau khi gửi câu nói tự do, AI của EngSteps sẽ phân tích và chấm điểm
        phát âm IPA, dễ hiểu, trôi chảy, từ vựng và ngữ pháp qua bản demo dưới
        đây.
      </p>
      <button
        id="demo-trigger-btn"
        onClick={onStartDemo}
        className="py-3 px-6 rounded-xl border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4" /> Demo Phân Tích AI Ngay
      </button>
    </div>
  );
}
