import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div
      id="terms-page-root"
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
            <h1 className="font-display text-4xl py-3 sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-gray-500">
              ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ
            </h1>
            <p className="text-sm font-mono text-gray-500 mt-3">
              Ngày hiệu lực: 07/07/2026
            </p>
          </div>

          {/* Document Body */}
          <div className="space-y-8 text-gray-300 leading-relaxed text-base">
            <p className="italic">
              Chào mừng bạn đến với EngSteps (sau đây gọi tắt là "Website" hoặc
              "Chúng tôi"). Vui lòng đọc kỹ Điều Khoản Sử Dụng này trước khi
              đăng ký tài khoản hoặc sử dụng bất kỳ dịch vụ nào trên Website của
              Chúng tôi. Việc bạn truy cập và sử dụng dịch vụ đồng nghĩa với
              việc bạn đồng ý tuân thủ toàn bộ các điều khoản dưới đây.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  1.
                </span>{" "}
                Đăng ký và Bảo mật Tài khoản
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>1.1.</strong> Để sử dụng đầy đủ các tính năng trên
                  Website, người dùng cần đăng ký một tài khoản cá nhân thông
                  qua các phương thức được chúng tôi hỗ trợ.
                </p>
                <p>
                  <strong>1.2.</strong> Người dùng có trách nhiệm cung cấp thông
                  tin chính xác, trung thực và tự bảo mật thông tin đăng nhập cá
                  nhân (mật khẩu, tài khoản).
                </p>
                <p>
                  <strong>1.3.</strong> Bạn hoàn toàn chịu trách nhiệm về mọi
                  hoạt động diễn ra dưới tài khoản của mình. Nếu phát hiện bất
                  kỳ hành vi truy cập trái phép nào, bạn cần thông báo ngay lập
                  tức cho bộ phận kỹ thuật của Chúng tôi.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  2.
                </span>{" "}
                Chính sách Chống Lạm dụng và Sử dụng Công bằng (Fair Use Policy)
              </h2>
              <p className="text-gray-400">
                Để duy trì tính ổn định của hệ thống và đảm bảo quyền lợi cho
                toàn bộ người dùng, Chúng tôi áp dụng chính sách nghiêm ngặt sau
                đây:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>2.1.</strong> Nguyên tắc "Một Người dùng - Một Tài
                  khoản": Mỗi cá nhân chỉ được phép đăng ký và sử dụng duy nhất
                  một (01) tài khoản trên hệ thống.
                </p>
                <p>
                  <strong>2.2.</strong> Nghiêm cấm các hành vi Spam tài khoản:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400 font-sans">
                  <li>
                    Nghiêm cấm việc đăng ký hàng loạt tài khoản tự động (bằng
                    bot, tool, script) hoặc đăng ký thủ công nhiều tài khoản
                    bằng email ảo, email tạm thời để lạm dụng các lượt dùng thử
                    ghi âm miễn phí từ hệ thống.
                  </li>
                  <li>
                    Nghiêm cấm việc chia sẻ tài khoản cá nhân cho nhiều người
                    khác cùng sử dụng chung.
                  </li>
                </ul>
                <p>
                  <strong>2.3.</strong> Hệ thống có cơ chế tự động giám sát IP,
                  dấu vết trình duyệt và hành vi đăng ký. Nếu phát hiện bất kỳ
                  dấu hiệu lạm dụng hoặc tạo nhiều tài khoản nhằm mục đích vượt
                  qua giới hạn của gói miễn phí, Chúng tôi có toàn quyền khóa
                  ngay lập tức và vĩnh viễn toàn bộ hệ sinh thái tài khoản liên
                  quan mà không cần báo trước.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  3.
                </span>{" "}
                Dịch vụ Trả phí, Thanh toán và Quảng cáo
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>3.1. Quảng cáo (Ads):</strong> Để duy trì hạ tầng vận
                  hành và bù đắp chi phí phát sinh (như phí gọi các API chấm
                  điểm của bên thứ ba), Website có thể hiển thị quảng cáo trong
                  quá trình người dùng sử dụng các gói dịch vụ miễn phí. Người
                  dùng đồng ý với việc xuất hiện các quảng cáo này khi sử dụng
                  gói miễn phí.
                </p>
                <p>
                  <strong>3.2. Gói Dịch vụ Trả phí:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400 font-sans">
                  <li>
                    Chúng tôi cung cấp các gói dịch vụ trả phí (đăng ký theo
                    tháng/quý/năm hoặc mua lượt sử dụng) để người dùng có thêm
                    các tính năng nâng cao và trải nghiệm không quảng cáo.
                  </li>
                  <li>
                    Biểu phí và quyền lợi của từng gói dịch vụ sẽ được niêm yết
                    công khai trên Website.
                  </li>
                </ul>
                <p>
                  <strong>3.3. Chính sách không hoàn tiền:</strong> Tất cả các
                  giao dịch thanh toán mua dịch vụ kỹ thuật số trên Website là
                  giao dịch cuối cùng và không được hoàn trả dưới mọi hình thức,
                  trừ trường hợp có lỗi kỹ thuật nghiêm trọng xuất phát hoàn
                  toàn từ phía hệ thống của Chúng tôi mà không thể khắc phục
                  được trong vòng 07 ngày làm việc.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-[28px] font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  4.
                </span>{" "}
                Hành vi bị Nghiêm cấm
              </h2>
              <p className="text-gray-400">
                Người dùng cam kết KHÔNG thực hiện hoặc hỗ trợ bên thứ ba thực
                hiện các hành vi sau:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>
                    4.1. Khai thác dữ liệu trái phép (Scraping/Crawling):
                  </strong>{" "}
                  Sử dụng bất kỳ robot, spider, ứng dụng tìm kiếm/truy xuất
                  trang web hoặc thiết bị, quy trình thủ công/tự động nào để
                  truy cập, thu hồi, cào dữ liệu (scrape), hoặc chỉ mục hóa bất
                  kỳ phần nào của Website.
                </p>
                <p>
                  <strong>
                    4.2. Kỹ thuật đảo ngược (Reverse Engineering):
                  </strong>{" "}
                  Cố gắng dịch ngược, đảo ngược mã nguồn, bẻ khóa các API chấm
                  điểm, API âm thanh hoặc can thiệp vào cấu trúc mã nguồn của
                  Website.
                </p>
                <p>
                  <strong>4.3. Tấn công hệ thống:</strong> Thực hiện các hành vi
                  tấn công từ chối dịch vụ (DDoS), spam dữ liệu âm thanh rác
                  liên tục nhằm phá hoại, làm nghẽn băng thông hệ thống hoặc
                  tăng chi phí tài nguyên API của Chúng tôi một cách bất thường.
                </p>
                <p>
                  <strong>4.4. Khai thác lỗ hổng:</strong> Sử dụng hoặc cố tình
                  tìm kiếm các lỗ hổng bảo mật, lỗi phần mềm để trục lợi cá nhân
                  hoặc gây thiệt hại cho Website.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-[28px] font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  5.
                </span>{" "}
                Xử lý Vi phạm và Khóa Tài khoản
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>5.1.</strong> Nếu phát hiện người dùng vi phạm bất kỳ
                  điều khoản nào quy định tại tài liệu này, Chúng tôi có toàn
                  quyền áp dụng các biện pháp xử lý sau tùy theo mức độ vi phạm:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400 font-sans">
                  <li>Cảnh cáo bằng văn bản/email gửi tới người dùng.</li>
                  <li>
                    Đình chỉ tạm thời quyền truy cập dịch vụ của tài khoản.
                  </li>
                  <li>
                    Khóa tài khoản vĩnh viễn và chặn địa chỉ IP truy cập mà
                    không có nghĩa vụ phải hoàn trả bất kỳ khoản phí nào còn dư
                    trong tài khoản trả phí của người dùng (nếu có).
                  </li>
                </ul>
                <p>
                  <strong>5.2.</strong> Trong trường hợp hành vi vi phạm gây ra
                  thiệt hại nghiêm trọng về tài chính hoặc danh tiếng cho
                  Website, Chúng tôi có quyền khởi kiện hoặc yêu cầu cơ quan
                  pháp luật can thiệp để xử lý và đòi bồi thường thiệt hại theo
                  quy định của pháp luật Việt Nam.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-[28px] font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  6.
                </span>{" "}
                Giới hạn Trách nhiệm pháp lý về kết quả AI
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>6.1.</strong> Dịch vụ chấm điểm phát âm và ngữ pháp
                  của Chúng tôi được vận hành dựa trên công nghệ Trí tuệ Nhân
                  tạo (AI) của bên thứ ba. Do đặc thù công nghệ, các kết quả
                  đánh giá, nhận xét lỗi sai và dự đoán điểm chỉ mang tính chất
                  tham khảo học tập.
                </p>
                <p>
                  <strong>6.2.</strong> Chúng tôi không cam kết hay đảm bảo rằng
                  kết quả chấm điểm của AI sẽ trùng khớp hoàn toàn với kết quả
                  chấm thi thực tế của các giám khảo con người trong các kỳ thi
                  chính thức. Chúng tôi từ chối mọi trách nhiệm pháp lý liên
                  quan đến kết quả thi cử thực tế của người dùng.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-[28px] font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-purple-500 font-mono text-[28px]">
                  7.
                </span>{" "}
                Thay đổi Điều khoản và Luật áp dụng
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>7.1.</strong> Chúng tôi giữ quyền cập nhật, sửa đổi
                  hoặc thay đổi các Điều khoản Sử dụng này vào bất kỳ lúc nào để
                  phù hợp với định hướng phát triển của dịch vụ. Các thay đổi sẽ
                  có hiệu lực ngay khi được đăng tải lên Website. Việc bạn tiếp
                  tục sử dụng Website đồng nghĩa với việc bạn chấp thuận các
                  thay đổi đó.
                </p>
                <p>
                  <strong>7.2.</strong> Điều khoản Sử dụng này được điều chỉnh
                  và giải thích theo các quy định của pháp luật nước Cộng hòa Xã
                  hội Chủ nghĩa Việt Nam.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
