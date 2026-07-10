import { useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onClose: () => void;
}

const ConfirmDialogComponent = ({
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const handleCancel = () => {
    setIsOpen(false);
    if (onCancel) onCancel();
    setTimeout(onClose, 200); // Wait for exit animation
  };

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
    } catch (err) {
      console.error("Confirm action error:", err);
    } finally {
      setIsPending(false);
      setIsOpen(false);
      setTimeout(onClose, 200); // Wait for exit animation
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md bg-[#0a0822]/80 border border-purple-500/30 backdrop-blur-md p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)] text-white overflow-hidden z-10"
          >
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500" />

            {/* Header info */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <HelpCircle size={22} className="animate-pulse" />
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-display  text-lg font-bold text-purple-300 tracking-tight flex items-center gap-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Buttons action footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="px-4 py-2.5 hover:scale-102 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer select-none"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="px-5 py-2.5 hover:scale-102 bg-linear-to-r from-purple-500 to-indigo-600 border border-purple-500/30 hover:border-purple-500/50 shadow-lg text-white font-semibold text-sm rounded-xl cursor-pointer select-none hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center gap-2"
              >
                {isPending && (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                )}
                <span>{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const showConfirmDialog = (options: {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  const cleanup = () => {
    root.unmount();
    container.remove();
  };

  root.render(
    <ConfirmDialogComponent
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      onConfirm={options.onConfirm}
      onCancel={options.onCancel}
      onClose={cleanup}
    />,
  );
};
