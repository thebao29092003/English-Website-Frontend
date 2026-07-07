import { ArrowLeft } from "lucide-react";

import ScrollToTop from "../utility/ScrollToTop";

export default function PrivacyPage() {
  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div
      id="privacy-page-root"
      className="min-h-screen bg-[#05021c] text-white dark flex flex-col"
    >
      {/* Main Content Area */}
      <main className="flex-1 pt-15 pb-15 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
          </button>

          {/* Document Header */}
          <div className="border-b border-white/10 pb-8 mb-8">
            <h1 className="font-display text-4xl py-3 sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-gray-400">
              CHÍNH SÁCH BẢO MẬT THÔNG TIN
            </h1>
            <p className="text-sm font-mono text-gray-500 mt-3">
              Ngày hiệu lực: 07/07/2026
            </p>
          </div>

          {/* Document Body */}
          <div className="space-y-8 text-gray-300 leading-relaxed text-base">
            <p className="italic">
              Tại EngSteps, Chúng tôi hiểu rằng quyền riêng tư và an toàn thông
              tin là mối quan tâm hàng đầu của bạn. Chính sách Bảo mật này mô tả
              cách Chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu của
              bạn khi bạn sử dụng dịch vụ trên Website. Chúng tôi cam kết bảo vệ
              dữ liệu cá nhân của bạn với trách nhiệm cao nhất và sự minh bạch
              tuyệt đối.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  1.
                </span>{" "}
                Thông Tin Chúng Tôi Thu Thập
              </h2>
              <p className="text-gray-400">
                Để vận hành dịch vụ phân tích bài nói, Chúng tôi chỉ thu thập
                các thông tin tối thiểu sau:
              </p>
              <div className="space-y-2">
                <p>
                  * <strong>Thông tin tài khoản:</strong> Địa chỉ email bạn cung
                  cấp khi đăng ký tài khoản.
                </p>
                <p>
                  * <strong>Dữ liệu âm thanh (Audio):</strong> Các file ghi âm
                  giọng nói của bạn khi thực hiện bài luyện tập nói trên
                  Website.
                </p>
                <p>
                  * <strong>Chỉ số đánh giá (Metrics):</strong> Điểm số phát âm,
                  độ trôi chảy, ngữ điệu, transcript và các nhận xét sửa lỗi ngữ
                  pháp/từ vựng được trả về từ hệ thống phân tích.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  2.
                </span>{" "}
                Mục Đích Lưu Trữ và Sử Dụng Dữ Liệu
              </h2>
              <p className="text-gray-400">
                Chúng tôi chỉ lưu trữ file âm thanh và các chỉ số đánh giá của
                bạn nhằm phục vụ cho mục đích duy nhất sau đây:
              </p>
              <div className="space-y-2">
                <p>
                  * <strong>Hiển thị lịch sử học tập:</strong> Giúp bạn có thể
                  nghe lại các bài nói cũ của chính mình để tự đánh giá sự thay
                  đổi.
                </p>
                <p>
                  * <strong>Tạo báo cáo tiến trình (Progress Reports):</strong>{" "}
                  Tổng hợp dữ liệu điểm số theo thời gian để vẽ biểu đồ tiến bộ,
                  giúp bạn biết mình đã cải thiện được bao nhiêu phần trăm và
                  cần tập trung vào kỹ năng nào.
                </p>
                <p className="text-gray-400 italic">
                  Dữ liệu này chỉ được hiển thị ở màn hình cá nhân của riêng bạn
                  sau khi đăng nhập tài khoản hợp lệ.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  3.
                </span>{" "}
                Cam Kết Tuyệt Đối Về Dữ Liệu Âm Thanh (Audio)
              </h2>
              <p className="text-gray-400">
                Giọng nói của bạn là tài sản riêng tư của bạn. Chúng tôi cam kết
                bảo vệ dữ liệu âm thanh này bằng các nguyên tắc nghiêm ngặt:
              </p>
              <div className="space-y-2">
                <p>
                  * <strong>KHÔNG chia sẻ thương mại:</strong> Chúng tôi cam kết
                  không bán, không trao đổi, không chia sẻ dữ liệu âm thanh của
                  bạn cho bất kỳ bên thứ ba nào vì mục đích tiếp thị, quảng cáo
                  hoặc thương mại. Dữ liệu âm thanh của bạn chỉ được lưu trữ một
                  cách bảo mật trên hạ tầng điện toán đám mây của đối tác lưu
                  trữ uy tín nhằm mục đích kỹ thuật duy nhất là lưu giữ lịch sử
                  và hiển thị lại cho bạn.
                </p>
                <p>
                  * <strong>KHÔNG dùng để huấn luyện AI:</strong> Chúng tôi cam
                  kết không sử dụng các file ghi âm của bạn để huấn luyện, tinh
                  chỉnh (fine-tune) bất kỳ mô hình Trí tuệ Nhân tạo (AI) nào của
                  Chúng tôi hoặc đối tác.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  4.
                </span>{" "}
                Cam Kết Bảo Vệ Thông Tin Cá Nhân và Email
              </h2>
              <p className="text-gray-400">
                Chúng tôi hiểu rằng email của bạn cần được bảo vệ khỏi tin nhắn
                rác (Spam) và các mối nguy hại khác:
              </p>
              <div className="space-y-2">
                <p>
                  * <strong>KHÔNG mua bán, trao đổi:</strong> Chúng tôi cam kết
                  tuyệt đối không mua bán, không trao đổi, không cho thuê và
                  không chia sẻ danh sách email hoặc thông tin cá nhân của người
                  dùng cho bất kỳ cá nhân, tổ chức hay đối tác quảng cáo nào
                  khác dưới bất kỳ hình thức nào dưới mọi trường hợp.
                </p>
                <p className="italic text-gray-400">
                  Email của bạn chỉ được sử dụng nội bộ để: Xác thực tài khoản,
                  gửi thông báo bảo mật, gửi báo cáo kết quả học tập cá nhân
                  (nếu bạn đăng ký nhận) hoặc hỗ trợ kỹ thuật khi bạn yêu cầu.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  5.
                </span>{" "}
                Đơn vị xử lý dữ liệu bên thứ ba (Third-party Data Processors)
              </h2>
              <p className="text-gray-400">
                Để vận hành dịch vụ kỹ thuật một cách ổn định và tối ưu hiệu
                năng, Chúng tôi có sử dụng một số hạ tầng công nghệ từ các đối
                tác uy tín toàn cầu bao gồm:
              </p>
              <div className="space-y-2">
                <p>
                  * <strong>Cloudinary:</strong> Đối tác hạ tầng điện toán đám
                  mây được sử dụng để lưu trữ bảo mật các file ghi âm của bạn.
                </p>
                <p>
                  * <strong>AssemblyAI & DeepSeek:</strong> Các cổng dịch vụ trí
                  tuệ nhân tạo được sử dụng để phân tích giọng nói và phản hồi
                  lỗi sai ngữ pháp/từ vựng.
                </p>
                <p className="italic text-gray-400">
                  <strong>Cam kết:</strong> Các đối tác này chỉ đóng vai trò là
                  đơn vị xử lý kỹ thuật trung gian theo yêu cầu của Chúng tôi.
                  Họ cam kết tuân thủ các điều khoản bảo mật dữ liệu nghiêm ngặt
                  và không có quyền sử dụng dữ liệu cá nhân hay file âm thanh
                  của bạn cho bất kỳ mục đích riêng nào khác của họ.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  6.
                </span>{" "}
                An Toàn Dữ Liệu và Quyền Được Xóa Bỏ
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>6.1. Biện pháp bảo mật:</strong> Chúng tôi áp dụng các
                  biện pháp kỹ thuật tiêu chuẩn (như mã hóa đường truyền
                  SSL/HTTPS, thiết lập tường lửa quyền truy cập dữ liệu và lưu
                  trữ trên các máy chủ đám mây bảo mật) để bảo vệ dữ liệu của
                  bạn khỏi việc truy cập hoặc rò rỉ trái phép.
                </p>
                <p>
                  <strong>
                    6.2. Quyền yêu cầu xóa dữ liệu (Right to be Forgotten):
                  </strong>{" "}
                  Bạn có toàn quyền kiểm soát dữ liệu của mình.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400 font-sans">
                  <li>
                    Bạn có thể chủ động xóa các bài ghi âm cũ trong trang quản
                    lý lịch sử.
                  </li>
                  <li>
                    Bạn có quyền yêu cầu xóa vĩnh viễn tài khoản của mình. Khi
                    tài khoản bị xóa, hệ thống của Chúng tôi sẽ tự động xóa sạch
                    toàn bộ thông tin cá nhân, email và tất cả các file ghi âm
                    liên quan của bạn trên hệ thống lưu trữ tĩnh trong vòng 30
                    ngày làm việc.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  7.
                </span>{" "}
                Thay Đổi Chính Sách Bảo Mật
              </h2>
              <p>
                Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian
                để phản ánh các thay đổi trong cách Chúng tôi xử lý dữ liệu hoặc
                đáp ứng các yêu cầu pháp lý mới. Các thay đổi sẽ được cập nhật
                công khai tại trang này kèm theo ngày hiệu lực mới nhất.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Scroll-to-top floating button */}
      <ScrollToTop />
    </div>
  );
}
