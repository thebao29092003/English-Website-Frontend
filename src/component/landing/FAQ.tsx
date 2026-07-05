import React, { useState } from "react";
import { Plus, Minus, HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { FAQItem } from "../../types/landingPageType";

const FAQ_DATA: FAQItem[] = [
  {
    id: "tech",
    question: "Công nghệ AI chấm điểm giọng nói của EngSteps hoạt động thế nào?",
    answer: "EngSteps sử dụng công nghệ chuyển đổi âm học (acoustic models) kết hợp với các mô hình ngôn ngữ lớn tiên tiến nhất từ Google để phân tích âm thanh giọng nói của bạn. Khi bạn nói, AI sẽ đối chiếu dữ liệu sóng âm của bạn với hàng nghìn giờ nói chuẩn giọng bản xứ Mỹ, Anh. Hệ thống sẽ bóc tách và phân tích đồng thời 5 khía cạnh cốt lõi: phát âm từng ký tự IPA, độ trôi chảy (lưu lượng từ ngắt quãng), kết cấu ngữ pháp câu, dải từ vựng học thuật và độ dễ hiểu tổng quan."
  },
  {
    id: "ielts",
    question: "Tôi có thể sử dụng EngSteps để luyện thi IELTS Speaking không?",
    answer: "Cực kỳ hiệu quả! Các tiêu chí chấm của EngSteps (Pronunciation, Fluency, Grammar, Lexical Resource) trùng khớp 100% với 4 tiêu chí chấm điểm chính thức của kỳ thi IELTS Speaking. Báo cáo chấm điểm của EngSteps quy đổi tương đương sang thang điểm IELTS Band (ví dụ Band 6.5, 7.0, 7.5) cùng với ước lượng thang đo CEFR giúp bạn theo dõi sát sao sự tiến bộ mỗi ngày."
  },
  {
    id: "accent",
    question: "EngSteps có nhận dạng tốt giọng của người Việt mới bắt đầu học không?",
    answer: "Có. AI của EngSteps được tối ưu huấn luyện đặc biệt dựa trên dữ liệu phát âm của người học Châu Á và người Việt Nam. Hệ thống hiểu rõ các thói quen lỗi phát âm phổ biến của người Việt (như nuốt âm đuôi, phát âm sai phụ âm ghép, đặt sai trọng âm từ), từ đó đưa ra các mẹo sửa khẩu hình bằng Tiếng Việt cực kỳ dễ hiểu và trực quan."
  },
  {
    id: "mic",
    question: "Nếu thiết bị của tôi không kết nối được Micro thì có luyện tập được không?",
    answer: "Được. Nếu thiết bị của bạn bị hỏng micro hoặc trình duyệt chặn quyền ghi âm, bạn vẫn có thể nhập văn bản hoặc click vào các mẫu câu có sẵn để trải nghiệm đầy đủ giao diện chấm điểm trực quan của AI. Ngoài ra, bạn cũng có thể mở EngSteps trên điện thoại di động vì hệ thống tương thích tốt với mọi loại micro trên điện thoại."
  },
  {
    id: "pricing",
    question: "Tôi có được thay đổi hoặc hủy bỏ gói cước giữa chừng không?",
    answer: "Hoàn toàn linh hoạt. Bạn có thể tự do nâng cấp, hạ cấp hoặc hủy bỏ gói dịch vụ hằng tháng bất kỳ lúc nào trực tiếp trong trang quản lý tài khoản của mình mà không tốn thêm bất kỳ chi phí phát sinh nào. Chúng tôi cam kết hoàn tiền 100% trong vòng 3 ngày đầu tiên nếu bạn không hài lòng với sản phẩm."
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="py-20 bg-[#030014] relative overflow-hidden">
      {/* Small ambient glows */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 flex items-center justify-center gap-2">
            Giải Đáp <span className="gradient-text bg-gradient-to-r from-blue-400 to-purple-400">Thắc Mắc</span> Thường Gặp
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Tìm hiểu thêm về cách thức vận hành của AI và các chính sách hỗ trợ người dùng của EngSteps.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq) => {
            const isOpen = faq.id === openId;
            return (
              <div
                id={`faq-item-${faq.id}`}
                key={faq.id}
                className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden transition-all duration-300"
              >
                {/* Trigger Row */}
                <button
                  id={`faq-toggle-${faq.id}`}
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 text-white hover:text-purple-300 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="font-semibold text-sm sm:text-base leading-relaxed flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-purple-400 shrink-0" />
                    {faq.question}
                  </span>
                  <div className={`p-1 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-all shrink-0`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
