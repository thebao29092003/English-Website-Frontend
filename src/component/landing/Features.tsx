import React, { useState } from "react";
import {
  GraduationCap,
  Globe,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Award,
  Smile,
  Languages,
  Sliders,
  Volume2,
  Sparkles,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { GoalCard } from "../../types/landingPageType";

const GOALS: GoalCard[] = [
  {
    id: "uni",
    title: "Vào trường Đại Học Mơ Ước",
    subtitle:
      "Du học & Săn học bổng xuất sắc tại các đại học hàng đầu thế giới thông qua chứng chỉ IELTS / TOEFL Speaking bứt phá.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    gradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    id: "work",
    title: "Định Cư & Toàn Cầu Hóa",
    subtitle:
      "Sinh sống và làm việc tại nước ngoài một cách tự tin nhất. Hòa nhập văn hóa bản xứ và giao tiếp mượt mà hằng ngày.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    gradient: "from-indigo-500/20 to-purple-500/10",
  },
  {
    id: "career",
    title: "Thăng Tiến Sự Nghiệp",
    subtitle:
      "Tăng thu nhập, làm sếp lớn, đàm phán thành công với đối tác nước ngoài và dẫn dắt các cuộc họp quốc tế thuận lợi.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    gradient: "from-purple-500/20 to-pink-500/10",
  },
];

interface DimensionDetail {
  id: string;
  title: string;
  engTitle: string;
  icon: any;
  metricLabel: string;
  metricVal: string;
  description: string;
  details: string[];
}

const DIMENSIONS: DimensionDetail[] = [
  {
    id: "pron",
    title: "Phát âm chuẩn IPA",
    engTitle: "Pronunciation (Phát âm)",
    icon: Award,
    metricLabel: "Thanh đo chuẩn",
    metricVal: "Phụ âm đuôi & Cặp nguyên âm",
    description:
      "Nhận diện chính xác từng âm tiết nhỏ nhất (phonemes), phát hiện tức thì các lỗi nuốt âm đuôi và lỗi phát âm sai nguyên âm.",
    details: [
      "Kiểm tra đầy đủ các âm cuối (ending sounds) như /s/, /z/, /t/, /d/.",
      "Đối chiếu trực quan khẩu hình miệng và âm học của người bản xứ.",
      "Hướng dẫn cụ thể cách đặt lưỡi và lấy hơi tự nhiên.",
    ],
  },
  {
    id: "inton",
    title: "Ngữ điệu & Nhấn nhá",
    engTitle: "Intonation & Word Stress (Nhấn âm)",
    icon: Volume2,
    metricLabel: "Chỉ số thông minh",
    metricVal: "Biểu đồ cao độ (Pitch variation)",
    description:
      "Ngữ điệu là hồn của lời nói. Hệ thống vẽ lại đồ thị cao độ giọng nói của bạn để sửa đổi việc nói đều đều (flat tone) thiếu biểu cảm.",
    details: [
      "Nhấn đúng trọng âm của từ đa âm tiết.",
      "Lên giọng hoặc xuống giọng tự nhiên ở cuối câu hỏi/câu trần thuật.",
      "Tạo độ nhấn nhá cảm xúc giúp lời nói thu hút, lôi cuốn người nghe.",
    ],
  },
  {
    id: "fluency",
    title: "Độ trôi chảy (Fluency)",
    engTitle: "Fluency & Coherence",
    icon: Activity,
    metricLabel: "Đo lường nhịp độ",
    metricVal: "WPM (Từ trên phút) & Điểm ngừng",
    description:
      "Phân tích tốc độ nói trung bình, nhận diện các khoảng ngập ngừng ngắt quãng bất thường (unnatural hesitations) hay lặp từ.",
    details: [
      "Phân biệt giữa ngừng tự nhiên để thở và ngừng ngấp nghé do bí từ.",
      "Đánh giá tần suất sử dụng từ đệm (uhm, ah, like, you know).",
      "Gợi ý các từ nối (discourse markers) để kết nối ý tưởng trôi chảy.",
    ],
  },
  {
    id: "gram",
    title: "Độ chính xác Ngữ pháp",
    engTitle: "Grammatical Accuracy",
    icon: Sliders,
    metricLabel: "Thang đo CEFR",
    metricVal: "Tần suất lỗi chia thì",
    description:
      "Quét và chỉnh sửa lỗi ngữ pháp ngay khi nói. Không chỉ phát hiện lỗi mà còn viết lại câu đúng ngữ cảnh, chuyên nghiệp hơn.",
    details: [
      "Sửa các lỗi phổ biến: chia động từ, số ít số nhiều, danh từ không đếm được.",
      "Khuyến khích sử dụng cấu trúc câu ghép, câu phức (complex structures).",
      "Báo cáo chi tiết giúp cải thiện điểm Grammar trong các bài thi nói.",
    ],
  },
  {
    id: "vocab",
    title: "Vốn từ vựng nâng cao",
    engTitle: "Vocabulary Range (Lexical)",
    icon: Languages,
    metricLabel: "Phân loại học thuật",
    metricVal: "Tỷ lệ từ vựng vượt trội",
    description:
      "Đánh giá mức độ phong phú của từ vựng được sử dụng. Gợi ý thay thế các từ vựng đơn điệu bằng các collocations, idioms học thuật.",
    details: [
      "Phân tích mức độ lặp từ (lexical repetition).",
      "Gợi ý từ đồng nghĩa nâng cao chuẩn IELTS Band 7.0+.",
      "Tích hợp kho collocations theo 25 chủ đề giao tiếp thông dụng nhất.",
    ],
  },
];

export default function Features() {
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
            Mục Tiêu Tiếng Anh Của Bạn Là Gì?
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
              className="rounded-3xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 p-6 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col group relative"
            >
              <div className="relative h-44 rounded-xl overflow-hidden mb-6 border border-white/5">
                <img
                  src={goal.image}
                  alt={goal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                {goal.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 flex-1">
                {goal.subtitle}
              </p>
              <a
                href="#ai-sandbox-section"
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 mt-auto group/link"
              >
                Luyện nói chủ đề này{" "}
                <ChevronRight className="w-4.5 h-4.5 group-hover/link:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>

        {/* 5 DIMENSIONS COMPONENT: tabs / accordion layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive list of dimensions */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs font-semibold tracking-widest font-mono text-purple-400 uppercase">
                CORE TECHNOLOGY
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight mt-1 mb-4">
                5 Chiều Đánh Giá <br />
                Chuẩn Khảo Thí
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
                        <p className="text-[10px] font-mono text-gray-400 uppercase mt-0.5 tracking-wider">
                          {dim.engTitle.split(" (")[0]}
                        </p>
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
                <div className="flex justify-between items-start gap-4 mb-6 pb-6 border-b border-white/5">
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
                      Tự động tính luồng hơi theo tiêu chuẩn CEFR
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
