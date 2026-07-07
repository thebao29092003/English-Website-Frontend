import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FAQ_DATA } from "./MockData";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq-section"
      className="py-20 bg-[#030014] relative overflow-hidden"
    >
      {/* Small ambient glows */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 flex items-center justify-center gap-2">
            <span className="gradient-text bg-gradient-to-r from-blue-400 to-purple-400">
              Câu Hỏi
            </span>{" "}
            Thường Gặp
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Tìm hiểu thêm về cách thức vận hành của AI và các chính sách hỗ trợ
            người dùng của EngSteps.
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
                  <div
                    className={`p-1 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-all shrink-0`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
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
                      <div className="px-6 pb-6 text-sm sm:text-base text-gray-400 leading-relaxed border-t border-white/10 pt-4">
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
