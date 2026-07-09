import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  IconHome,
  IconChevronLeft,
  IconAlertTriangle,
} from "@tabler/icons-react";

export default function ErrorPage() {
  return (
    <div
      id="error-page-root"
      className="min-h-screen bg-[#030014] text-white flex flex-col items-center justify-center relative overflow-hidden px-4"
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full blur-[120px] pointer-events-none bg-violet-600/15" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full blur-[120px] pointer-events-none bg-blue-600/15" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20" />

      <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center">
        {/* Animated Warning Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.1,
          }}
          className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30 mb-8 shadow-lg shadow-amber-500/5"
        >
          <IconAlertTriangle className="w-10 h-10 text-amber-500" />
        </motion.div>

        {/* 404 Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-8xl sm:text-9xl font-black tracking-tighter mb-4"
        >
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 glow-purple">
            404
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4"
        >
          Không tìm thấy trang yêu cầu
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-400 text-sm sm:text-base leading-relaxed mb-10 max-w-md"
        >
          Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển. Hãy quay
          trở lại trang chủ để tiếp tục trải nghiệm cùng EngSteps.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            to="/"
            className="w-full sm:w-auto py-3 px-8 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 bg-white hover:bg-slate-200 text-black shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <IconHome className="w-4.5 h-4.5" />
            Về Trang Chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto py-3 px-8 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-300 hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <IconChevronLeft className="w-4.5 h-4.5" />
            Quay Lại
          </button>
        </motion.div>
      </div>
    </div>
  );
}
