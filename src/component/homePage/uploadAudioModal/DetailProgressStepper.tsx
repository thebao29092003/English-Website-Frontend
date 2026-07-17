import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Circle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UploadFileState } from "../../../types/homePage.type";

interface DetailProgressStepperProps {
  activeFile: UploadFileState | undefined;
  onClose: () => void;
}

export default function DetailProgressStepper({
  activeFile,
  onClose,
}: DetailProgressStepperProps) {
  const navigate = useNavigate();

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-600 border border-white/5 border-dashed rounded-2xl">
        <AlertCircle size={32} className="mb-2 opacity-35" />
        <p className="text-sm">
          Chọn một tệp ghi âm ở danh sách bên trái để xem tiến trình chi tiết.
        </p>
      </div>
    );
  }

  const getStepStatus = (
    fileStatus: UploadFileState["status"],
    step: "upload" | "fluency" | "deepseek" | "pronunciation",
  ) => {
    if (fileStatus === "failed") return "failed";

    const statusOrder = [
      "idle",
      "uploading",
      "submitted",
      "fluency_analyzed",
      "analysis_completed",
      "pronunciation_analyzed",
    ];
    const currentIndex = statusOrder.indexOf(fileStatus);

    if (step === "upload") {
      if (currentIndex >= 2) return "completed";
      if (currentIndex === 1) return "active";
      return "pending";
    }
    if (step === "fluency") {
      if (currentIndex >= 3) return "completed";
      if (currentIndex === 2) return "active";
      return "pending";
    }
    if (step === "deepseek") {
      if (currentIndex >= 4) return "completed";
      if (currentIndex === 3) return "active";
      return "pending";
    }
    if (step === "pronunciation") {
      if (currentIndex >= 5) return "completed";
      if (currentIndex === 4) return "active";
      return "pending";
    }
    return "pending";
  };

  const renderStepIcon = (
    status: "completed" | "active" | "failed" | "pending",
  ) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle2
            size={18}
            className="text-emerald-500 bg-[#090526] rounded-full shrink-0"
          />
        );
      case "active":
        return (
          <Loader2
            size={18}
            className="text-purple-400 animate-spin bg-[#090526] rounded-full shrink-0"
          />
        );
      case "failed":
        return (
          <AlertCircle
            size={18}
            className="text-rose-500 bg-[#090526] rounded-full shrink-0"
          />
        );
      case "pending":
      default:
        return (
          <Circle
            size={18}
            className="text-slate-600 bg-[#090526] rounded-full shrink-0"
          />
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden">
      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        <div>
          <h5 className="text-sm font-bold text-white truncate">
            {activeFile.file.name}
          </h5>
          <p className="text-xs text-slate-400 mt-1">
            ID: {activeFile.recordingId?.substring(0, 8) || "Đang cấp..."}
          </p>
        </div>

        {/* Progress Steps Visualizer */}
        <div className="relative pl-6 border-l border-white/10 space-y-6 mt-6 ml-2">
          {/* Step 1: Upload */}
          <div className="relative">
            <div className="absolute left-[-33px] top-0.5 flex items-center justify-center bg-[#090526] py-0.5">
              {renderStepIcon(getStepStatus(activeFile.status, "upload"))}
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  getStepStatus(activeFile.status, "upload") === "active"
                    ? "text-purple-300 font-bold"
                    : "text-white"
                }`}
              >
                1. Tải lên tệp âm thanh
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeFile.status === "uploading"
                  ? "Đang gửi tệp lên Cloudinary..."
                  : activeFile.status === "failed"
                    ? "Lỗi tải lên tệp"
                    : activeFile.recordingId
                      ? "Đã lưu bản ghi thành công"
                      : "Đang chờ..."}
              </p>
            </div>
          </div>

          {/* Step 2: Fluency */}
          <div className="relative">
            <div className="absolute left-[-33px] top-0.5 flex items-center justify-center bg-[#090526] py-0.5">
              {renderStepIcon(getStepStatus(activeFile.status, "fluency"))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                2. Phân tích độ trôi chảy & dễ hiểu
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeFile.status === "submitted"
                  ? "Đang tính toán nhịp độ & phát hiện ngập ngừng..."
                  : activeFile.scores?.fluency !== undefined
                    ? `Độ trôi chảy: ${activeFile.scores.fluency}%${activeFile.scores.confidence !== undefined ? `, Độ dễ hiểu: ${(activeFile.scores.confidence * 100).toFixed(2)}%` : ""}`
                    : "Đang chờ..."}
              </p>
            </div>
          </div>

          {/* Step 3: DeepSeek Grammar & Vocab */}
          <div className="relative">
            <div className="absolute left-[-33px] top-0.5 flex items-center justify-center bg-[#090526] py-0.5">
              {renderStepIcon(getStepStatus(activeFile.status, "deepseek"))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                3. Đánh giá ngữ pháp & từ vựng
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeFile.status === "fluency_analyzed"
                  ? "AI DeepSeek đang quét lỗi ngữ pháp & nâng cấp từ..."
                  : activeFile.scores?.grammar !== undefined
                    ? `Ngữ pháp: ${activeFile.scores.grammar}%, Từ vựng: ${activeFile.scores.vocab}%`
                    : "Đang chờ..."}
              </p>
            </div>
          </div>

          {/* Step 4: Pronunciation */}
          <div className="relative">
            <div className="absolute left-[-33px] top-0.5 flex items-center justify-center bg-[#090526] py-0.5">
              {renderStepIcon(
                getStepStatus(activeFile.status, "pronunciation"),
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                4. Đánh giá phát âm chi tiết
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeFile.status === "analysis_completed"
                  ? "AI đang so sánh IPA từng âm vị từ giọng đọc của bạn..."
                  : activeFile.scores?.pronunciation !== undefined
                    ? `Điểm phát âm: ${activeFile.scores.pronunciation}%`
                    : "Đang chờ..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Results link button */}
      {activeFile.status === "pronunciation_analyzed" && (
        <button
          onClick={() => {
            onClose();
            navigate(`/home/audio/${activeFile.recordingId}`);
          }}
          className="mt-6 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md shadow-emerald-600/20"
        >
          Xem kết quả đánh giá
          <ArrowRight size={14} />
        </button>
      )}

      {activeFile.status === "failed" && (
        <div className="mt-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-2">
          <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-rose-300 leading-relaxed">
            {activeFile.message ||
              "Quá trình xử lý âm thanh thất bại. Vui lòng kiểm tra định dạng hoặc thử lại."}
          </p>
        </div>
      )}
    </div>
  );
}
