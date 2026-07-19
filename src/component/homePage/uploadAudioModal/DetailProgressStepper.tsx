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
      <div className="flex-1 min-h-full flex flex-col items-center justify-center text-center p-6 text-slate-600 border border-white/5 border-dashed rounded-2xl">
        <AlertCircle size={32} className="mb-2 opacity-35" />
        <p className="text-sm">
          Chọn một tệp ghi âm ở danh sách bên trái để xem tiến trình chi tiết.
        </p>
      </div>
    );
  }

  const getStepStatus = (
    file: UploadFileState,
    step: "upload" | "fluency" | "deepseek" | "pronunciation",
  ) => {
    if (file.status === "failed") return "failed";

    const statusOrder = [
      "idle",
      "uploading",
      "submitted",
      "fluency_analyzed",
      "analysis_completed",
      "pronunciation_analyzed",
    ];
    const currentIndex = statusOrder.indexOf(file.status);

    // Bước 1 & 2: tuần tự, dùng status index bình thường
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

    // Bước 3 & 4: chạy song song sau fluency, dùng scores để xác định hoàn thành
    if (step === "deepseek") {
      if (file?.scores?.grammar !== undefined) return "completed";
      if (currentIndex >= 3) return "active";
      return "pending";
    }
    if (step === "pronunciation") {
      if (file?.scores?.pronunciation !== undefined) return "completed";
      if (currentIndex >= 3) return "active";
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

  const steps = [
    {
      key: "upload" as const,
      title: "1. Tải lên tệp âm thanh",
      getDescription: (file: UploadFileState) =>
        file.status === "uploading"
          ? "Đang gửi tệp lên Cloudinary..."
          : file.status === "failed"
            ? "Lỗi tải lên tệp"
            : file.recordingId
              ? "Đã lưu bản ghi thành công"
              : "Đang chờ...",
    },
    {
      key: "fluency" as const,
      title: "2. Phân tích độ trôi chảy & dễ hiểu",
      getDescription: (file: UploadFileState) =>
        file.status === "submitted"
          ? "Đang tính toán nhịp độ & phát hiện ngập ngừng..."
          : (file?.scores?.fluency && file?.scores?.confidence) !== undefined
            ? `Độ trôi chảy: ${file.scores.fluency}%, Độ dễ hiểu: ${(file.scores.confidence * 100).toFixed(2)}%`
            : "Đang chờ...",
    },
    {
      key: "deepseek" as const,
      title: "3. Đánh giá ngữ pháp & từ vựng",
      getDescription: (file: UploadFileState) =>
        file.scores?.grammar !== undefined
          ? `Ngữ pháp: ${file.scores.grammar}%, Từ vựng: ${file.scores.vocab}%`
          : file.scores?.fluency !== undefined
            ? "AI DeepSeek đang quét lỗi ngữ pháp & nâng cấp từ..."
            : "Đang chờ...",
    },
    {
      key: "pronunciation" as const,
      title: "4. Đánh giá phát âm chi tiết",
      getDescription: (file: UploadFileState) =>
        file.scores?.pronunciation !== undefined
          ? `Điểm phát âm: ${file.scores.pronunciation}%`
          : file.scores?.fluency !== undefined
            ? "AI đang so sánh IPA từng âm vị từ giọng đọc của bạn..."
            : "Đang chờ...",
    },
  ];

  return (
    <div className="flex flex-col justify-between">
      <div className="space-y-4 pr-1">
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
          {steps.map((step) => {
            const stepStatus = getStepStatus(activeFile, step.key);
            const isActive = stepStatus === "active";
            return (
              <div key={step.key} className="relative">
                <div className="absolute left-[-33px] top-0.5 flex items-center justify-center bg-[#090526] py-0.5">
                  {renderStepIcon(stepStatus)}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isActive ? "text-purple-300 font-bold" : "text-white"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {step.getDescription(activeFile)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Results link button — hiện khi cả grammar lẫn pronunciation đều đã có điểm */}
      {activeFile.scores?.grammar !== undefined &&
        activeFile.scores?.pronunciation !== undefined && (
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
