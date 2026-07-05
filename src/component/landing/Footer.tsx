import React from "react";


export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-[#02000d] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
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
              onClick={scrollToTop}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
                <span className="font-black text-xs italic text-white">ES</span>
              </div>
              {/* <span className={`font-display text-xl font-bold tracking-tight bg-clip-text text-transparent ${
                isDark
                  ? "bg-gradient-to-r from-white to-slate-400"
                  : "bg-gradient-to-r from-slate-900 to-slate-700"
              }`}>
                EngSteps
              </span> */}
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono font-medium text-purple-300 tracking-wider">AI</span>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed">
              Trợ lý AI chấm điểm giọng nói tiếng Anh đột phá thế hệ mới. Đánh giá toàn diện 5 chiều Phát âm, Ngữ điệu, Độ trôi chảy, Ngữ pháp và Từ vựng tức thì.
            </p>

            {/* Social icons */}
            {/* <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Github className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Youtube className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter className="w-4.5 h-4.5" />
              </a>
            </div> */}
          </div>

          {/* Quick links 1 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono mb-4">Sản Phẩm</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-500">
              <li><a href="#ai-sandbox-section" className="hover:text-purple-400 transition-colors">Thử Nghiệm AI</a></li>
              <li><a href="#features-section" className="hover:text-purple-400 transition-colors">5 Chiều Đánh Giá</a></li>
              <li><a href="#pricing-section" className="hover:text-purple-400 transition-colors">Bảng Giá Đăng Ký</a></li>
              <li><a href="#comparison-section" className="hover:text-purple-400 transition-colors">So Sánh Vượt Trội</a></li>
            </ul>
          </div>

          {/* Quick links 2 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono mb-4">Pháp Lý & Hỗ Trợ</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-500">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Điều Khoản Sử Dụng</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Chính Sách Bảo Mật</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Trung Tâm Trợ Giúp</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Liên Hệ Đóng Góp</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom divider bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 font-mono">
          <p>© {currentYear} EngSteps. Phát triển bởi AI Studio Build.</p>
          {/* <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group"
          >
            Lên đầu trang <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button> */}
        </div>

      </div>
    </footer>
  );
}
