import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconX,
  IconMenu2,
  IconBolt,
  IconArrowUpRight,
} from "@tabler/icons-react";
import AuthModal from "../../component/landing/AuthModal";
import { URL_FRONT_END } from "../../API/urlBase";
import { useAppDispatch, useAppSelector } from "../../API/hooks/hooks";
import { selectCurrentUser, logout } from "../../API/auth/authSlice";
import { showSuccessMessage } from "../../utility/notification";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setMobileMenuOpen(false);
    let basePath = new URL(URL_FRONT_END).pathname;
    navigate(`${basePath}#${id}`);

    // Scroll immediately if the element is already rendered on the page
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleForm = (type: "login" | "signup") => {
    setAuthOpen(true);
    setAuthTab(type);
  };

  const handleMobileForm = (type: "login" | "signup") => {
    setAuthOpen(true);
    setMobileMenuOpen(false);
    setAuthTab(type);
  };

  const handleLogout = () => {
    dispatch(logout());
    showSuccessMessage("Đăng xuất thành công");
    navigate("/");
  };

  return (
    <>
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
              onClick={() => scrollToSection("hero")}
            >
              <div className="logo">
                <span className="font-black text-xs italic text-white">ES</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                EngSteps
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono font-medium text-purple-300 tracking-wider">
                AI
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav
              id="desktop-nav"
              className="hidden lg:flex items-center gap-10"
            >
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
                Mục Tiêu Của Bạn
              </button>
              {/* <button
              onClick={() => scrollToSection("pricing-section")}
              className="button-nav"
            >
              Bảng Giá
            </button> */}
              <button
                onClick={() => scrollToSection("faq-section")}
                className="button-nav"
              >
                Hỏi Đáp
              </button>
            </nav>

            {/* User actions */}
            <div className="hidden lg:flex items-center gap-4">
              {currentUser ? (
                <>
                  <button
                    onClick={() => navigate("/home")}
                    className="text-sm font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:border-purple-500/50 h-10 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Bản ghi của tôi
                  </button>
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() =>
                        setProfileDropdownOpen(!profileDropdownOpen)
                      }
                      className="transition-transform border border-purple-500/50 rounded-full w-9 h-9 shrink-0 cursor-pointer overflow-hidden flex items-center justify-center bg-linear-to-brrom-purple-500 to-indigo-600 text-white font-bold text-sm shadow-md select-none focus:outline-none"
                    >
                      {currentUser?.email?.substring(0, 2)?.toUpperCase()}
                    </button>
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-[#0c0a24] border border-white/10 rounded-xl p-1 shadow-2xl text-white z-50">
                        <div className="h-14 gap-1 px-3 py-2 border-b border-white/5 flex flex-col justify-center">
                          <p className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider font-mono">
                            Đang đăng nhập bằng
                          </p>
                          <p className="font-bold text-white text-xs truncate mt-0.5">
                            {currentUser.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigate("/home");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left py-2.5 px-3 hover:bg-white/5 rounded-lg text-sm text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          Bản ghi âm của tôi
                        </button>
                        <button
                          onClick={() => {
                            navigate("/");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left py-2.5 px-3 hover:bg-white/5 rounded-lg text-sm text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          Trang chủ Landing
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left py-2.5 px-3 hover:bg-rose-500/10 text-rose-400 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    id="nav-login-btn"
                    onClick={() => handleForm("login")}
                    className="text-sm font-medium text-slate-400 hover:text-white bg-transparent hover:bg-white/5 border-none h-10 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Đăng Nhập
                  </button>
                  <button
                    id="nav-signup-btn"
                    onClick={() => handleForm("signup")}
                    className="text-sm font-semibold text-white h-10 px-6 button-primary"
                  >
                    {/* <IconSparkles className="w-4 h-4 text-purple-200 shrink-0" /> */}
                    <span>Đăng Ký Miễn Phí</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="lg:hidden flex items-center gap-3">
              {currentUser ? (
                <button
                  id="nav-mobile-home-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/home");
                  }}
                  className="text-xs font-bold text-white h-8 px-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all cursor-pointer"
                >
                  Bản Ghi Âm
                </button>
              ) : (
                <button
                  id="nav-mobile-signup-btn"
                  onClick={() => handleMobileForm("signup")}
                  className="text-xs font-bold text-white h-8 px-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all cursor-pointer"
                >
                  Dùng Thử AI
                </button>
              )}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg transition-all focus:outline-none cursor-pointer bg-white/5 text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? (
                  <IconX className="w-6 h-6" />
                ) : (
                  <IconMenu2 className="w-6 h-6" />
                )}
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
                Thử Nghiệm AI{" "}
                <IconBolt className="w-4 h-4 text-purple-400 shrink-0" />
              </button>
              <button
                onClick={() => scrollToSection("features-section")}
                className="button-nav-mobile"
              >
                Mục Tiêu Của Bạn
              </button>
              {/* <button
              onClick={() => scrollToSection("pricing-section")}
              className="button-nav-mobile"
            >
              Bảng Giá
            </button> */}
              <button
                onClick={() => scrollToSection("faq-section")}
                className="button-nav-mobile"
              >
                Hỏi Đáp
              </button>

              <div className="h-px my-4 bg-white/10" />

              {currentUser ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-purple-500/50 shrink-0 select-none">
                      {currentUser.email.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">
                        {currentUser.email.split("@")[0]}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/home");
                    }}
                    className="w-full h-12 rounded-xl text-center font-bold text-white bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Vào Kho Bản Ghi
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full h-12 rounded-xl border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:bg-rose-500/10 font-semibold cursor-pointer transition-all"
                  >
                    Đăng Xuất
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    id="mobile-nav-login"
                    onClick={() => handleMobileForm("login")}
                    className="w-full h-12 rounded-xl border border-white/10 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 font-semibold cursor-pointer transition-all"
                  >
                    Đăng Nhập
                  </button>
                  <button
                    id="mobile-nav-signup"
                    onClick={() => handleMobileForm("signup")}
                    className="w-full h-12 rounded-xl text-center font-bold text-white bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Đăng Ký Miễn Phí</span>
                    <IconArrowUpRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        tab={authTab}
        setTab={setAuthTab}
      />
    </>
  );
}
