import { useState, useEffect, useRef } from "react";
import { Upload, Sparkles } from "lucide-react";
import { useAppSelector } from "../../API/hooks/hooks";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../../API/auth/authSlice";
import { useUploadAudioMutation } from "../../API/callApi/cloudinaryApi";
import { URL_DOT_NET } from "../../API/urlBase";
import * as signalR from "@microsoft/signalr";
import { showErrorMessage } from "../../utility/notification";
import type { UploadFileState } from "../../types/homePage.type";
import FileDragDropZone from "./uploadAudioModal/FileDragDropZone";
import UploadedFilesList from "./uploadAudioModal/UploadedFilesList";
import DetailProgressStepper from "./uploadAudioModal/DetailProgressStepper";

interface UploadAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadAudioModal({
  isOpen,
  onClose,
}: UploadAudioModalProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const currentToken = useAppSelector(selectCurrentToken);
  const [uploadAudio] = useUploadAudioMutation();

  const [isUploading, setIsUploading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<UploadFileState[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const hasActiveProcessing = selectedFiles.some(
    (f) =>
      f.status === "uploading" ||
      f.status === "submitted" ||
      f.status === "fluency_analyzed" ||
      f.status === "analysis_completed",
  );

  // Clean up SignalR connection and state when the modal closes or unmounts,
  // but only if there is no active background processing.
  useEffect(() => {
    if (!isOpen && !hasActiveProcessing) {
      disconnectSignalR();
      setSelectedFiles([]);
      setIsUploading(false);
      setActiveFileId(null);
    }
  }, [isOpen, hasActiveProcessing]);

  // Clean up SignalR connection when the component unmounts
  useEffect(() => {
    return () => {
      disconnectSignalR();
    };
  }, []);

  const disconnectSignalR = () => {
    if (connectionRef.current) {
      connectionRef.current.stop();
      connectionRef.current = null;
      console.log("SignalR Connection stopped.");
    }
  };

  const validateFiles = (files: File[]) => {
    const audioFiles = files.filter(
      (f) =>
        f.type.startsWith("audio/") ||
        f.name.endsWith(".m4a") ||
        f.name.endsWith(".wav") ||
        f.name.endsWith(".mp3"),
    );
    if (audioFiles.length === 0) {
      showErrorMessage("Định dạng file không hợp lệ");
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = audioFiles.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      showErrorMessage(
        `File "${oversizedFiles[0].name}" vượt quá dung lượng tối đa 5MB.`,
      );
    }
    return audioFiles.filter((file) => file.size <= MAX_FILE_SIZE);
  };

  const handleFilesSelected = (files: File[]) => {
    const audioFiles = validateFiles(files);
    if (!audioFiles) return;

    const currentCount = selectedFiles.length;
    const remainingSlots = 5 - currentCount;

    const filesToAdd = audioFiles.slice(0, remainingSlots).map((file) => ({
      id: Math.random().toString(36).substr(2, 6),
      file,
      status: "idle" as const,
      progress: 0,
    }));

    setSelectedFiles((prev) => [...prev, ...filesToAdd]);

    if (audioFiles.length > remainingSlots) {
      showErrorMessage(
        `Chỉ có thể thêm tối đa 5 file. Đã bỏ qua ${audioFiles.length - remainingSlots} file.`,
      );
    }
  };

  const handleRemoveFile = (id: string) => {
    if (isUploading) return;
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
    if (activeFileId === id) setActiveFileId(null);
  };

  const connectSignalR = async () => {
    if (connectionRef.current) {
      console.log(
        "SignalR Connection already exists, skipping initialization.",
      );
      return;
    }
    // 1. Establish SignalR connection
    try {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${URL_DOT_NET}/hubs/audio-processing`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => currentToken ?? "",
        })
        .withAutomaticReconnect()
        .build();

      conn.on(
        "ReceiveAudioStatus",
        (payload: {
          recordingId: string;
          status: string;
          message: string;
          data?: {
            fluencyScore?: number;
            confidenceScore?: number;
            overallGrammarScore?: number;
            overallVocabScore?: number;
            pronunciationScore?: number;
          };
        }) => {
          console.log("SignalR Event Received:", payload);

          setSelectedFiles((currentFiles) =>
            currentFiles.map((file) => {
              if (file.recordingId === payload.recordingId) {
                let updatedStatus = file.status;
                const scores = { ...file.scores };

                switch (payload.status) {
                  case "Submitted":
                    updatedStatus = "submitted";
                    break;
                  case "Fluency_Analyzed":
                    updatedStatus = "fluency_analyzed";
                    if (payload.data?.fluencyScore !== undefined) {
                      scores.fluency = payload.data.fluencyScore;
                    }
                    if (payload.data?.confidenceScore !== undefined) {
                      scores.confidence = payload.data.confidenceScore;
                    }
                    break;
                  case "Analysis_Completed":
                    updatedStatus = "analysis_completed";
                    if (payload.data?.overallGrammarScore !== undefined) {
                      scores.grammar = payload.data.overallGrammarScore;
                    }
                    if (payload.data?.overallVocabScore !== undefined) {
                      scores.vocab = payload.data.overallVocabScore;
                    }
                    break;
                  case "Pronunciation_Analyzed":
                    updatedStatus = "pronunciation_analyzed";
                    if (payload.data?.pronunciationScore !== undefined) {
                      scores.pronunciation = payload.data.pronunciationScore;
                    }
                    break;
                  default:
                    break;
                }

                return {
                  ...file,
                  status: updatedStatus,
                  message: payload.message,
                  scores,
                };
              }
              return file;
            }),
          );
        },
      );

      await conn.start();
      console.log(
        `SignalR Connection established. User ${currentUser?.UserId} auto-joined group.`,
      );
      connectionRef.current = conn;
    } catch (err) {
      console.error("SignalR Connection failed to start:", err);
      showErrorMessage(
        "Lỗi kết nối thời gian thực. Tiến trình sẽ không tự động cập nhật.",
      );
    }
  };

  const startUploadAndProcessing = async () => {
    // Active details display default to first item
    setActiveFileId(selectedFiles[0].id);
    setIsUploading(true);
    connectSignalR();

    // 2. Parallel audio uploads
    const uploadPromises = selectedFiles.map(async (fileState) => {
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === fileState.id
            ? { ...f, status: "uploading", progress: 20 }
            : f,
        ),
      );

      try {
        const formData = new FormData();
        formData.append("File", fileState.file);
        // 2 nghĩa là gọi full chấm điểm deepseek
        formData.append("TypeAnalyse", "2");

        const response = await uploadAudio(formData).unwrap();
        const recordingId = response.value;

        if (recordingId) {
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === fileState.id
                ? {
                    ...f,
                    recordingId,
                    status: "submitted",
                    progress: 100,
                  }
                : f,
            ),
          );
        } else {
          throw new Error("Không nhận được Recording ID từ máy chủ");
        }
      } catch (err: any) {
        console.error("Upload failed for file:", fileState.file.name, err);
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id
              ? {
                  ...f,
                  status: "failed",
                  message: err?.data?.message || "Lỗi tải lên tệp âm thanh.",
                }
              : f,
          ),
        );
      }
    });

    await Promise.allSettled(uploadPromises);
  };

  const activeFile = selectedFiles.find((f) => f.id === activeFileId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#090526]/90 border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-[90vh] md:h-[600px]">
        {/* Glow ambient effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Left column: Drag area and file list */}
        <div className="flex-1 p-6 flex flex-col border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Upload size={18} className="text-purple-400" />
              Tải Lên File Ghi Âm
            </h3>
            {!isUploading && selectedFiles.length > 0 && (
              <span className="text-sm font-mono text-slate-400">
                {selectedFiles.length}/5 file
              </span>
            )}
          </div>

          <FileDragDropZone
            isUploading={isUploading}
            onFilesSelected={handleFilesSelected}
            selectedCount={selectedFiles.length}
          />

          <UploadedFilesList
            files={selectedFiles}
            activeFileId={activeFileId}
            setActiveFileId={setActiveFileId}
            isUploading={isUploading}
            onRemoveFile={handleRemoveFile}
          />

          {/* Action buttons */}
          <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-bold text-sm disabled:opacity-50"
            >
              {isUploading ? "Chạy ẩn & Thoát" : "Thoát"}
            </button>

            {selectedFiles.length > 0 && !isUploading && (
              <button
                onClick={startUploadAndProcessing}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Phân tích ngay
                <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right column: Selected file processing status detail */}
        <div className="w-full md:w-[360px] p-6 bg-black/30 flex flex-col overflow-hidden">
          <h4 className="font-display text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            TIẾN TRÌNH CHI TIẾT
          </h4>

          <DetailProgressStepper activeFile={activeFile} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
