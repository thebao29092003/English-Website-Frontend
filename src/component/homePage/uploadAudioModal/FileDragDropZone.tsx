import { Upload } from "lucide-react";
import { useState } from "react";

interface FileDragDropZoneProps {
  isUploading: boolean;
  onFilesSelected: (files: File[]) => void;
  selectedCount: number;
}

export default function FileDragDropZone({
  isUploading,
  onFilesSelected,
  selectedCount,
}: FileDragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();

    // Nếu có file đang được rê trên ô kéo thả
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    const files = e.target.files ? Array.from(e.target.files) : [];
    onFilesSelected(files);
  };

  if (isUploading || selectedCount >= 5) return null;

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer relative group flex flex-col items-center justify-center min-h-[140px] mb-4 ${
        isDragging
          ? "border-purple-500 bg-purple-500/10 scale-[1.02] shadow-[0_0_15px_rgba(168,85,247,0.15)]" // Hiệu ứng khi đang kéo file lơ lửng
          : "border-white/10 hover:border-purple-500/40 bg-white/2 hover:bg-white/5" // Giao diện mặc định lúc bình thường
      }`}
    >
      {/* Input tàng hình phủ lên trên để hứng sự kiện Click chọn file thông thường */}
      <input
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileSelect}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />

      {/* Icon Upload tự động phóng to nhẹ khi rê file vào */}
      <Upload
        size={32}
        className={`transition-transform duration-200 ${
          isDragging
            ? "text-purple-400 scale-125"
            : "text-purple-400 group-hover:scale-110"
        }`}
      />

      {/* Dòng chữ chính tự động thay đổi nội dung tương ứng theo trạng thái kéo */}
      <p className="text-sm font-semibold text-white transition-colors duration-200 mt-2">
        {isDragging ? "Thả tay để nộp bài !" : "Kéo thả tệp âm thanh vào đây"}
      </p>

      {/* Dòng chữ phụ thay đổi nội dung khuyến khích người dùng */}
      <p className="text-sm text-slate-400 mt-1 transition-colors duration-200">
        {isDragging
          ? "Hệ thống đã sẵn sàng tiếp nhận tệp"
          : "hoặc nhấn để chọn tệp (Tối đa 5 file, định dạng MP3, WAV, M4A)"}
      </p>
    </div>
  );
}
