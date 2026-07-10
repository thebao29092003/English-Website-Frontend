import { useState } from "react";
import { Check, Sparkles, Flame } from "lucide-react";
import type { Plan } from "../../types/landingPage.type";

const PLANS: Plan[] = [
  {
    id: "trial",
    name: "Thử Nghiệm",
    price: "0",
    period: "7 ngày",
    description:
      "Làm quen với AI chấm điểm và kiểm tra trình độ CEFR ban đầu hoàn toàn miễn phí.",
    features: [
      "1 lượt chấm nói chuyên sâu 5 chiều",
      "Sửa lỗi phát âm IPA của 10 từ",
      "Sửa lỗi ngữ pháp 3 câu đầu tiên",
      "Lưu trữ báo cáo trong 7 ngày",
      "Tương thích thiết bị di động & PC",
    ],
    buttonText: "Bắt Đầu Miễn Phí",
    accent: "border-white/10 bg-white/5 backdrop-blur-md shadow-lg",
  },
  {
    id: "starter",
    name: "Starter",
    price: "129.000",
    period: "tháng",
    description:
      "Lộ trình lý tưởng cho người bận rộn muốn duy trì thói quen nói tiếng Anh hằng tuần.",
    features: [
      "5 lượt chấm nói chuyên sâu mỗi tháng",
      "Mở khóa sửa lỗi phát âm IPA từ bất kỳ",
      "Chỉnh sửa lỗi ngữ pháp không giới hạn",
      "Kho 15 chủ đề giao tiếp thực tế",
      "Lưu trữ báo cáo lịch sử học tập",
    ],
    buttonText: "Đăng Ký Starter",
    accent: "border-white/10 bg-white/5 backdrop-blur-md shadow-lg",
  },
  {
    id: "pro",
    name: "Pro Đột Phá",
    price: "249.000",
    period: "tháng",
    description:
      "Giải pháp bứt phá tối ưu cho người luyện thi IELTS, chuẩn bị phỏng vấn xin việc.",
    features: [
      "30 lượt chấm nói chuyên sâu mỗi tháng",
      "Ưu tiên xử lý băng thông AI tốc độ cao",
      "Phân tích mốc thời gian trôi chảy (Fluency Timelines)",
      "Đầy đủ gợi ý nâng band từ vựng",
      "Nghe phát âm chuẩn giọng bản xứ (TTS)",
      "Báo cáo tiến độ trực quan theo tuần",
    ],
    isPopular: true,
    buttonText: "Chinh Phục Ngay",
    accent:
      "border-purple-500/40 bg-purple-500/10 shadow-2xl backdrop-blur-md shadow-purple-500/5",
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: "499.000",
    period: "tháng",
    description:
      "Luyện nói thả ga không giới hạn dành cho người khao khát làm chủ tiếng Anh trong thời gian ngắn nhất.",
    features: [
      "Không giới hạn lượt chấm nói hằng ngày",
      "Hỗ trợ tất cả 25+ chủ đề nâng cao",
      "Phân tích chuyên sâu biểu đồ ngữ điệu (Pitch curves)",
      "Được truy cập sớm các tính năng AI mới",
      "Báo cáo phân tích tháng so sánh liên tục",
      "Support riêng từ đội ngũ sư phạm 24/7",
    ],
    buttonText: "Trở Thành Bản Xứ",
    accent: "border-white/10 bg-white/5 backdrop-blur-md shadow-lg",
  },
];

interface PricingProps {
  onPlanSelect: (planId: string) => void;
}

export default function Pricing({ onPlanSelect }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      id="pricing-section"
      className="landing-section"
    >
      {/* Background glow filters */}
      <div className="glow-orb top-[20%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 blur-[130px]" />
      <div className="glow-orb bottom-[10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10 blur-[130px]" />
      <div className="glow-orb top-[50%] left-[30%] w-[350px] h-[350px] bg-indigo-500/5 blur-[100px]" />

      <div className="landing-container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="landing-heading">
            Đầu Tư Cho{" "}
            <span className="gradient-text-purple-no-glow">
              Giọng Nói
            </span>{" "}
            Của Bạn
          </h2>
          <p className="landing-description">
            Không có hợp đồng ràng buộc. Nâng cấp hoặc hủy gói bất kỳ lúc nào
            bạn muốn. Chọn gói dịch vụ phù hợp nhất với tần suất luyện nói của
            bạn.
          </p>
        </div>

        {/* Annual / Monthly Toggle */}
        <div className="flex items-center justify-center gap-3.5 mb-16">
          <span
            className={`text-sm font-semibold transition-all ${!isYearly ? "text-white" : "text-gray-500"}`}
          >
            Thanh toán hằng tháng
          </span>
          <button
            id="billing-cycle-toggle"
            onClick={() => setIsYearly(!isYearly)}
            className="w-12 h-6.5 rounded-full p-1 bg-white/10 border border-white/10 flex items-center transition-all cursor-pointer"
          >
            <div
              className={`w-4.5 h-4.5 rounded-full bg-purple-500 transition-all ${isYearly ? "translate-x-5.5 bg-blue-400" : "translate-x-0"}`}
            />
          </button>
          <span
            className={`text-sm font-semibold transition-all flex items-center gap-1.5 ${isYearly ? "text-white" : "text-gray-500"}`}
          >
            Thanh toán hằng năm
            <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-bold py-0.5 px-2 rounded-full">
              Tiết kiệm 20%
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => {
            // Apply annual discount if toggled (except for free plan)
            const basePrice = parseInt(plan.price.replace(".", ""));
            const finalPrice =
              isYearly && basePrice > 0
                ? Math.floor(basePrice * 0.8).toLocaleString("vi-VN")
                : plan.price;

            return (
              <div
                id={`price-card-${plan.id}`}
                key={plan.id}
                className={`rounded-3xl border p-7 flex flex-col justify-between transition-all duration-300 relative group/card ${plan.accent} ${
                  plan.isPopular
                    ? "hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/10"
                    : "hover:border-white/15 hover:shadow-xl hover:shadow-blue-500/5"
                }`}
              >
                {/* Popular Badge overlay */}
                {plan.isPopular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 text-[10px] font-mono font-bold py-1 px-3 rounded-full text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-300 fill-orange-300/10" />
                    Được đăng ký nhiều nhất
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className="font-display text-lg font-bold text-gray-300 group-hover/card:text-white transition-colors">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mt-4 mb-2">
                    <span className="font-display text-3xl sm:text-4xl font-black text-white">
                      {plan.price === "0" ? "0đ" : `${finalPrice}đ`}
                    </span>
                    {plan.price !== "0" && (
                      <span className="text-xs text-gray-400 font-mono">
                        /{plan.period}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-2 leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>

                  <div className="h-px bg-white/5 my-6" />

                  {/* Feature Checklist */}
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 rounded-full p-0.5 ${
                            plan.isPopular
                              ? "bg-purple-500/15 text-purple-300"
                              : "bg-white/5 text-gray-400"
                          }`}
                        />
                        <span className="text-gray-300 text-xs leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  id={`select-plan-${plan.id}`}
                  onClick={() => onPlanSelect(plan.id)}
                  className={`w-full py-3.5 mt-8 rounded-xl font-bold text-xs transition-all tracking-wide flex items-center justify-center gap-1 cursor-pointer ${
                    plan.isPopular
                      ? "bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white shadow-md shadow-purple-500/10"
                      : "bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/5"
                  }`}
                >
                  {plan.isPopular && (
                    <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  )}
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
