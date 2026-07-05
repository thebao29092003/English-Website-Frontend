import {
  IconMicrophone,
  IconShieldCheck,
  IconAward,
  IconAnalyze,
  IconArrowNarrowRight,
  IconBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";

interface HeroProps {
  onOpenAuth: (tab: "login" | "signup") => void;
}

export default function Hero({ onOpenAuth }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden transition-colors duration-500 bg-[#030014]"
    >
      {/* Background Glows from Design HTML */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-500 bg-violet-600/20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-500 bg-blue-600/20" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none transition-all duration-500 bg-indigo-500/10" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none transition-opacity opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Badge Intro */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6 w-fit backdrop-blur-sm transition-all border-violet-500/30 bg-violet-500/10 text-violet-400"
        >
          <IconAnalyze className="w-4.5 h-4.5 text-purple-500 animate-pulse" />
          <span>✨ NEXT-GEN AI EVALUATION — CÔNG NGHỆ MỚI NHẤT 2026</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto transition-colors text-white"
        >
          Bứt Phá Tiếng Anh <br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 via-violet-500 to-purple-600 glow-purple">
            Powered by AI.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-10 transition-colors text-slate-400"
        >
          EngSteps - Trợ lý AI thế hệ mới chấm điểm phát âm, độ trôi chảy, ngữ
          pháp, từ vựng và độ dễ hiểu chính xác đến từng âm tiết theo thang điểm
          chuẩn quốc tế.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-sm sm:max-w-none mx-auto mb-16"
        >
          <button
            id="hero-cta-sandbox"
            onClick={() => onOpenAuth("signup")}
            className="w-full sm:w-auto py-4 px-8 font-bold rounded-xl text-lg flex items-center justify-center gap-2 active:scale-98 transition-all duration-300 cursor-pointer bg-white hover:bg-slate-200 text-black shadow-xl shadow-white/5"
          >
            <IconMicrophone className="w-5 h-5 text-black" />
            Nói Thử Ngay (Free)
            <IconArrowNarrowRight className="w-4 h-4 text-black" />
          </button>
        </motion.div>

        {/* Feature stats labels with Premium Frosted Glass */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border backdrop-blur-md transition-all duration-500 border-white/10 bg-white/5 shadow-2xl"
        >
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-black transition-colors text-white">
              99.2%
            </p>
            <p className="text-xs font-medium font-mono uppercase tracking-wider mt-1 flex items-center justify-center gap-1 text-gray-400">
              <IconShieldCheck stroke={2} color="oklch(62.3% 0.214 259.815)" />{" "}
              AI ĐỘ CHÍNH XÁC
            </p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-black transition-colors text-white">
              500+
            </p>
            <p className="text-statistic">
              <IconAward stroke={2} color="oklch(62.7% 0.265 303.9)" />
              HỌC VIÊN TIN DÙNG
            </p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-black transition-colors text-white">
              1K+
            </p>
            <p className="text-statistic">
              {" "}
              <IconMicrophone stroke={2} color="oklch(58.5% 0.233 277.117)" />
              Câu đã phân tích
            </p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-black transition-colors text-white">
              &lt; 6s
            </p>
            <p className="text-statistic">
              {" "}
              <IconBolt stroke={2} color="oklch(66.7% 0.295 322.15)" />
              Phản hồi tức thì
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
