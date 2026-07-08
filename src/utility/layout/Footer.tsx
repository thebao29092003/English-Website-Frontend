import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "../../component/landing/AuthModal";
import { useEffect, useState } from "react";
import { URL_FRONT_END } from "../../API/urlBase";

export default function Footer() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("signup");
  const location = useLocation();
  const navigate = useNavigate();

  const onOpenAuth = (tab: "login" | "signup") => {
    setAuthOpen(true);
    setAuthTab(tab);
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  const scrollToSection = (id: string) => {
    let basePath = new URL(URL_FRONT_END).pathname;
    navigate(`${basePath}#${id}`);

    // Scroll immediately if the element is already rendered on the page
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer
        id="footer"
        className="bg-[#02000d] border-t border-white/5 pt-16 pb-8 relative overflow-hidden"
      >
        {/* Background neon dots */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          {/* Top footer row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand Info */}
            <div className="md:col-span-2 space-y-4">
              <div
                id="footer-brand-logo"
                className="flex items-center gap-2 cursor-pointer group w-fit"
                onClick={() => scrollToSection("hero")}
              >
                <div
                  id="brand-logo"
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="logo">
                    <span className="font-black text-xs italic text-white">
                      ES
                    </span>
                  </div>
                  <span className="font-display text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                    EngSteps
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono font-medium text-purple-300 tracking-wider">
                    AI
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed">
                Trợ lý AI chấm điểm giọng nói tiếng Anh đột phá thế hệ mới. Đánh
                giá toàn diện 5 chiều Phát âm, Ngữ điệu, Độ trôi chảy, Ngữ pháp
                và Từ vựng tức thì.
              </p>
            </div>

            {/* Quick links 1 */}
            <div className="flex flex-col items-start">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono mb-4">
                Sản Phẩm
              </h4>
              <div className="space-y-2.5 flex flex-col items-start text-xs sm:text-sm text-gray-500">
                <button
                  onClick={() => scrollToSection("ai-sandbox-section")}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Thử Nghiệm AI
                </button>

                <button
                  onClick={() => scrollToSection("features-section")}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Mục Tiêu Của Bạn
                </button>
                <button
                  onClick={() => onOpenAuth("signup")}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Thử Nghiệm Miễn Phí
                </button>
                {/* <li>
                <a
                  href="#pricing-section"
                  className="hover:text-purple-400 transition-colors"
                >
                  Bảng Giá Đăng Ký
                </a>
              </li> */}
              </div>
            </div>

            {/* Quick links 2 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono mb-4">
                Pháp Lý & Hỗ Trợ
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-500">
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Điều Khoản Sử Dụng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Chính Sách Bảo Mật
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Liên Hệ Với Chúng Tôi
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom divider bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 font-mono">
            <p>© {currentYear} EngSteps. Phát triển bởi EngSteps Studio.</p>
          </div>
        </div>
      </footer>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        tab={authTab}
        setTab={setAuthTab}
      />
    </>
  );
}
