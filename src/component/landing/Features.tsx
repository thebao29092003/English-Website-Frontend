import { useState } from "react";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GOALS, DIMENSIONS } from "./MockData";

interface FeaturesProps {
  onOpenAuth: (tab: "login" | "signup") => void;
}

export default function Features({ onOpenAuth }: FeaturesProps) {
  const [activeDim, setActiveDim] = useState<string>(DIMENSIONS[0].id);

  const currentDim =
    DIMENSIONS.find((d) => d.id === activeDim) || DIMENSIONS[0];

  return (
    <section
      id="features-section"
      className="py-20 bg-[#030014] relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-[5%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* GOALS COMPONENT: What do you want English to do for you */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            <span className="gradient-text bg-linear-to-r from-blue-400 to-purple-400 glow-purple">
              Mục Tiêu
            </span>{" "}
            Tiếng Anh Của Bạn ?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            EngSteps được tối ưu hóa cho mọi lộ trình cá nhân hóa, giúp bạn đạt
            được bứt phá trong cuộc sống thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
          {GOALS.map((goal) => (
            <div
              id={`goal-card-${goal.id}`}
              key={goal.id}
              onClick={() => onOpenAuth("login")}
              className="rounded-3xl cursor-pointer overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 p-6 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col group relative"
            >
              <div className="relative h-44 rounded-xl overflow-hidden mb-6 border border-white/5">
                <img
                  src={goal.image}
                  alt={goal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                {goal.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 flex-1">
                {goal.subtitle}
              </p>
              <p className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center mt-auto group/link">
                Luyện nói ngay bây giờ
                <ChevronRight className="w-4.5 h-4.5 group-hover/link:translate-x-0.5 transition-transform" />
              </p>
            </div>
          ))}
        </div>

        {/* 5 DIMENSIONS COMPONENT: tabs / accordion layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive list of dimensions */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight mt-1 mb-4">
                Đánh Giá{" "}
                <span className="gradient-text bg-linear-to-r from-blue-400 to-purple-400 glow-purple">
                  Đa Chiều
                </span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Mỗi câu nói được chia nhỏ để đánh giá đồng thời dưới 5 trục cốt
                lõi, loại bỏ sự mơ hồ trong việc luyện giao tiếp.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {DIMENSIONS.map((dim) => {
                const IconComp = dim.icon;
                const isActive = dim.id === activeDim;
                return (
                  <button
                    id={`dim-tab-${dim.id}`}
                    key={dim.id}
                    onClick={() => setActiveDim(dim.id)}
                    className={`text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-purple-500/10 border-purple-500/30 shadow-lg"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2 rounded-lg ${
                          isActive
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-white/5 text-gray-400"
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {dim.title}
                        </h4>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-500 transition-transform ${isActive ? "translate-x-1 text-purple-400" : ""}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Dimension detailed display (Glass card) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDim}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="backdrop-blur-md bg-white/5 p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
              >
                {/* Visual highlights */}
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header detail */}
                <div className="flex justify-between items-start gap-4 mb-3 pb-5 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400">
                      {currentDim.metricLabel}
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-white mt-1">
                      {currentDim.engTitle}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold tracking-wider font-mono text-purple-300 rounded uppercase">
                    {currentDim.metricVal}
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {currentDim.description}
                </p>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-gray-400 font-mono uppercase tracking-widest">
                    Tính năng nổi bật
                  </h4>
                  <div className="space-y-3">
                    {currentDim.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Visual Widget placeholder */}
                <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping" />
                    <span className="text-[11px] font-mono text-gray-400">
                      Được phân tích đồng thời bởi 2 mô hình AI chuyên biệt
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">
                    ACTIVATED
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
