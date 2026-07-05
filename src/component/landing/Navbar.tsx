import { useState, useEffect } from "react";
import { IconX,IconMenu2, IconBolt, IconArrowUpRight } from "@tabler/icons-react";

interface NavbarProps {
  onOpenAuth: (tab: "login" | "signup") => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#030014]/80 backdrop-blur-md py-3 border-b border-white/5 shadow-lg shadow-purple-500/5"
          : " bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            id="brand-logo"
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="logo">
              <span className="font-black text-xs italic text-white">ES</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
              EngSteps
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono font-medium text-purple-300 tracking-wider">AI</span>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-10">
            <button
              onClick={() => scrollToSection("ai-sandbox-section")}
              className="button-nav"
            >
              Thử Nghiệm AI
            </button>
            <button
              onClick={() => scrollToSection("features-section")}
              className="button-nav"
            >
              5 Chiều Đánh Giá
            </button>
            <button
              onClick={() => scrollToSection("pricing-section")}
              className="button-nav"
            >
              Bảng Giá
            </button>
            <button
              onClick={() => scrollToSection("faq-section")}
              className="button-nav"
            >
              Hỏi Đáp
            </button>
          </nav>

          {/* User actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              id="nav-login-btn"
              onClick={() => onOpenAuth("login")}
              className="text-sm font-medium text-slate-400 hover:text-white bg-transparent hover:bg-white/5 border-none h-10 px-4 rounded-xl transition-all cursor-pointer"
            >
              Đăng Nhập
            </button>
            <button
              id="nav-signup-btn"
              onClick={() => onOpenAuth("signup")}
              className="text-sm font-semibold text-white h-10 px-6 button-primary"
            >
              {/* <IconSparkles className="w-4 h-4 text-purple-200 shrink-0" /> */}
              <span>Đăng Ký Miễn Phí</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              id="nav-mobile-signup-btn"
              onClick={() => onOpenAuth("signup")}
              className="text-xs font-bold text-white h-8 px-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all cursor-pointer"
            >
              Dùng Thử AI
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg transition-all focus:outline-none cursor-pointer bg-white/5 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-overlay"
          className="lg:hidden fixed inset-0 top-[60px] z-100 backdrop-blur-lg border-t transition-all bg-[#030014]/95 border-white/5"
        >
          <nav className="flex flex-col gap-4 p-6 bg-[#030014]/95">
            <button
              onClick={() => scrollToSection("ai-sandbox-section")}
              className="button-nav-mobile"
            >
              Thử Nghiệm AI <IconBolt className="w-4 h-4 text-purple-400 shrink-0" />
            </button>
            <button
              onClick={() => scrollToSection("features-section")}
              className="button-nav-mobile"
            >
              5 Chiều Đánh Giá
            </button>
            <button
              onClick={() => scrollToSection("pricing-section")}
              className="button-nav-mobile"
            >
              Bảng Giá
            </button>
            <button
              onClick={() => scrollToSection("faq-section")}
              className="button-nav-mobile"
            >
              Hỏi Đáp
            </button>

            <div className="h-px my-4 bg-white/10" />

            <div className="flex flex-col gap-3">
              <button
                id="mobile-nav-login"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth("login");
                }}
                className="w-full h-12 rounded-xl border border-white/10 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 font-semibold cursor-pointer transition-all"
              >
                Đăng Nhập
              </button>
              <button
                id="mobile-nav-signup"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth("signup");
                }}
                className="w-full h-12 rounded-xl text-center font-bold text-white bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Đăng Ký Miễn Phí</span>
                <IconArrowUpRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
