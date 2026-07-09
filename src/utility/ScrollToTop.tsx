import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop — A floating action button that appears once the user has
 * scrolled past a defined threshold and smoothly scrolls the page back to top
 * when clicked.
 */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const SCROLL_THRESHOLD = 300;

    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="scroll-to-top-btn"
          aria-label="Cuộn lên đầu trang"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 cursor-pointer right-8 z-50 flex items-center justify-center w-11 h-11 rounded-full
                     bg-linear-to-br from-violet-600 to-blue-600
                     shadow-xl shadow-violet-500/30
                     border border-white/10
                     text-white
                     transition-shadow duration-300
                     hover:shadow-violet-500/50 hover:shadow-xl
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
