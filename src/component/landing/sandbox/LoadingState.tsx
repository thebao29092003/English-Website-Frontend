import { Mic } from "lucide-react";
import { motion } from "motion/react";

interface LoadingStateProps {
  message: string;
  isShow: boolean;
}

export default function LoadingState({ message, isShow }: LoadingStateProps) {
  return (
    <>
      {isShow && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-12 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center min-h-[500px]"
        >
          <div className="relative w-24 h-24 mb-6">
            {/* Glowing spinner background */}
            <div className="absolute inset-0 rounded-full border-4 border-white/5" />
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin" />
            <Mic className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">
            AI Đang Làm Việc
          </h3>
          <p className="text-purple-300 text-sm font-mono tracking-wide animate-pulse">
            {message}
          </p>
          <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 animate-[loading_2s_infinite]" />
          </div>
        </motion.div>
      )}
    </>
  );
}
