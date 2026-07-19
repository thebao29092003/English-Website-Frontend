import { FileAudio, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { formatFileSize } from "../../../utility/formatTimeSize";
import type { UploadFileState } from "../../../types/homePage.type";

interface UploadedFilesListProps {
  files: UploadFileState[];
  activeFileId: string | null;
  setActiveFileId: (id: string) => void;
  isUploading: boolean;
  onRemoveFile: (id: string) => void;
}

export default function UploadedFilesList({
  files,
  activeFileId,
  setActiveFileId,
  isUploading,
  onRemoveFile,
}: UploadedFilesListProps) {
  if (files.length === 0) {
    return (
      <div className="min-h-[150px] flex flex-col items-center  justify-center text-center p-6 text-slate-500">
        <FileAudio size={40} className="mb-2 opacity-35" />
        <p className="text-sm">Chưa có tệp nào được chọn</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pr-1">
      {files.map((fileState) => {
        const isActive = fileState.id === activeFileId;
        return (
          <div
            key={fileState.id}
            onClick={() => setActiveFileId(fileState.id)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              isActive
                ? "bg-purple-500/10 border-purple-500/30"
                : "bg-white/2 border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <FileAudio
                size={20}
                className={
                  fileState.status === "failed"
                    ? "text-rose-500 shrink-0"
                    : fileState.status === "pronunciation_analyzed"
                      ? "text-emerald-400 shrink-0 animate-pulse"
                      : "text-purple-400 shrink-0"
                }
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate max-w-[360px] md:max-w-[400px]">
                  {fileState.file.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatFileSize(fileState.file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {fileState.status === "uploading" && (
                <Loader2 size={20} className="text-purple-400 animate-spin" />
              )}
              {fileState.status === "submitted" && (
                <Loader2 size={20} className="text-blue-400 animate-spin" />
              )}
              {(fileState.status === "fluency_analyzed" ||
                fileState.status === "analysis_completed") && (
                <Loader2 size={20} className="text-indigo-400 animate-spin" />
              )}
              {fileState.status === "pronunciation_analyzed" && (
                <CheckCircle2 size={20} className="text-emerald-400" />
              )}
              {fileState.status === "failed" && (
                <AlertCircle size={20} className="text-rose-500" />
              )}

              {!isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(fileState.id);
                  }}
                  className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:scale-110 transition-all hover:text-rose-400 cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
