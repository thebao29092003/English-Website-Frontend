import { useState, useEffect, useRef } from "react";
import { Upload, Sparkles } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../API/hooks/hooks";
import {
  selectCurrentUser,
  selectCurrentToken,
  setCredentials,
  logout,
} from "../../API/auth/authSlice";
import { useUploadAudioMutation } from "../../API/callApi/cloudinaryApi";
import { URL_DOT_NET } from "../../API/urlBase";
import * as signalR from "@microsoft/signalr";
import { showErrorMessage } from "../../utility/notification";
import type { UploadFileState } from "../../types/homePage.type";
import FileDragDropZone from "./uploadAudioModal/FileDragDropZone";
import UploadedFilesList from "./uploadAudioModal/UploadedFilesList";
import DetailProgressStepper from "./uploadAudioModal/DetailProgressStepper";
import AudioRecorder from "./uploadAudioModal/AudioRecorder";

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
  const dispatch = useAppDispatch();
  const [uploadAudio] = useUploadAudioMutation();

  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<UploadFileState[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const hasActiveProcessing = selectedFiles.some((f) => {
    // File đang trong quá trình upload hoặc phân tích
    if (
      f.status === "uploading" ||
      f.status === "submitted" ||
      f.status === "fluency_analyzed" ||
      f.status === "analysis_completed"
    ) {
      return true;
    }
    // Status có thể đã nhảy lên pronunciation_analyzed nhưng grammar chưa về
    if (
      f.status === "pronunciation_analyzed" &&
      (f.scores?.grammar === undefined || f.scores?.pronunciation === undefined)
    ) {
      return true;
    }
    return false;
  });

  // Reset state and disconnect SignalR when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setActiveFileId(null);
      setIsUploading(false);
      disconnectSignalR();
    }
  }, [isOpen]);

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
    const allowedExtensions = [
      ".mp3",
      ".aac",
      ".ogg",
      ".flac",
      ".alac",
      ".aiff",
      ".wav",
      ".m4a",
      ".webm",
    ];
    const audioFiles = files.filter((f) => {
      const nameLower = f.name.toLowerCase();
      return allowedExtensions.some((ext) => nameLower.endsWith(ext));
    });
    if (audioFiles.length === 0) {
      showErrorMessage("Định dạng file không hợp lệ");
      return [];
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
    if (!audioFiles || audioFiles.length === 0) return;

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

  const isTokenExpired = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Buffer 10 seconds before actual expiration
      return payload.exp * 1000 < Date.now() + 10000;
    } catch {
      return true;
    }
  };

  const refreshTokenSignalR = async () => {
    let token = currentToken;
    if (token && isTokenExpired(token)) {
      try {
        // console.log("Token expired, refreshing token for SignalR...");
        const response = await fetch(`${URL_DOT_NET}/api/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          const refreshData = await response.json();

          token = refreshData?.value;
          dispatch(setCredentials({ user: currentUser, token }));
          // console.log("Token refreshed successfully for SignalR.");
        }
      } catch (err) {
        dispatch(logout());
        window.location.replace("/");
      }
    }
    return token ?? "";
  };

  const connectSignalR = async () => {
    if (connectionRef.current) {
      // console.log(
      //   "SignalR Connection already exists, skipping initialization.",
      // );
      return;
    }
    // 1. Establish SignalR connection
    try {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${URL_DOT_NET}/hubs/audio-processing`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: refreshTokenSignalR,
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
          // console.log("SignalR Event Received:", payload);

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
                // Chống tụt status khi event đến không đúng thứ tự
                // (ví dụ: Pronunciation_Analyzed đến trước Analysis_Completed)
                const STATUS_ORDER: UploadFileState["status"][] = [
                  "idle",
                  "uploading",
                  "submitted",
                  "fluency_analyzed",
                  "analysis_completed",
                  "pronunciation_analyzed",
                ];
                const currentIdx = STATUS_ORDER.indexOf(file.status);
                const newIdx = STATUS_ORDER.indexOf(updatedStatus);
                // Nếu trạng thái mới có thứ tự đi lùi hoặc bằng trạng thái hiện tại, chúng ta giữ nguyên trạng thái cũ (file.status)
                // để tránh việc giao diện bị quay lui lại các bước trước đó.
                const finalStatus =
                  newIdx > currentIdx ? updatedStatus : file.status;

                return {
                  ...file,
                  status: finalStatus,
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
      // console.log(
      //   `SignalR Connection established. User ${currentUser?.UserId} auto-joined group.`,
      // );
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
    await connectSignalR();

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
      <div className="relative w-full max-w-6xl bg-[#090526]/90 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-[90vh] md:h-[85vh] overflow-y-auto md:overflow-y-hidden overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Glow ambient effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Left column: Drag area and file list */}
        <div className="w-full md:flex-1 p-6 flex flex-col border-b md:border-b-0 md:border-r border-white/5 h-auto md:h-full shrink-0 md:shrink">
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

          {!isRecording && (
            <FileDragDropZone
              isUploading={isUploading}
              onFilesSelected={handleFilesSelected}
              selectedCount={selectedFiles.length}
            />
          )}

          <AudioRecorder
            onAudioRecorded={(file) => handleFilesSelected([file])}
            isUploading={isUploading}
            disabled={selectedFiles.length >= 5}
            onRecordingStateChange={setIsRecording}
          />

          {/* Action buttons */}
          <div className="mt-4 pt-4 flex-1 flex flex-col justify-between border-t border-white/5 min-h-0 md:overflow-hidden gap-3">
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
              <UploadedFilesList
                files={selectedFiles}
                activeFileId={activeFileId}
                setActiveFileId={setActiveFileId}
                isUploading={isUploading}
                onRemoveFile={handleRemoveFile}
              />
            </div>

            <div className="w-full flex gap-4 mt-auto">
              {!hasActiveProcessing && (
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-bold text-sm disabled:opacity-50"
                >
                  Thoát
                </button>
              )}

              {selectedFiles.length > 0 && !isUploading && (
                <button
                  onClick={startUploadAndProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Phân tích ngay
                  <Sparkles size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Selected file processing status detail */}
        <div className="w-full md:w-[420px] p-6 bg-black/30 flex flex-col h-auto md:h-full shrink-0">
          <h4 className="font-display text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            TIẾN TRÌNH CHI TIẾT
          </h4>

          <DetailProgressStepper activeFile={activeFile} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
