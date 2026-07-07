import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialTab = "login",
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(initialTab);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="auth-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop overlay */}
        <motion.div
          id="auth-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 backdrop-blur-md transition-colors duration-350 bg-black/85"
        />

        {/* Modal Container */}
        <motion.div
          id="auth-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl backdrop-blur-md p-8 text-left shadow-2xl z-10 transition-all duration-300 bg-[#030014]/85 border border-white/10 text-white"
        >
          {/* Top glowing bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Close button */}
          <button
            id="close-auth-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 mb-4 animate-pulse">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2 text-white">
                {tab === "login"
                  ? "Đăng nhập thành công!"
                  : "Đăng ký thành công!"}
              </h3>
              <p className="text-sm max-w-xs text-gray-400">
                {tab === "login"
                  ? "Chào mừng bạn quay trở lại với EngSteps. Đang tải trang điều khiển..."
                  : "Tài khoản của bạn đã được thiết lập. Hãy bắt đầu chinh phục tiếng Anh!"}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8 text-center">
                <h2
                  id="auth-modal-title"
                  className="font-display text-3xl font-extrabold tracking-tight mb-2 text-white"
                >
                  Eng<span className="text-purple-600">Steps</span>
                </h2>
                <p className="text-xs uppercase tracking-widest font-mono text-gray-400">
                  AI-Powered Speech Assessor
                </p>
              </div>

              {/* Tabs */}
              <div className="flex p-1 rounded-lg mb-6 border bg-white/5 border-white/10">
                <button
                  id="tab-login"
                  onClick={() => setTab("login")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                    tab === "login"
                      ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  id="tab-signup"
                  onClick={() => setTab("signup")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                    tab === "signup"
                      ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Đăng Ký
                </button>
              </div>

              {/* Render appropriate form */}
              {tab === "login" ? (
                <LoginForm
                  onSuccess={handleSuccess}
                  loading={loading}
                  setLoading={setLoading}
                />
              ) : (
                <SignupForm
                  onSuccess={handleSuccess}
                  loading={loading}
                  setLoading={setLoading}
                />
              )}
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
