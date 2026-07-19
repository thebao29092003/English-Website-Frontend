import { useState, useEffect, useRef } from "react";
import { Mic, Square, Trash2, Radio } from "lucide-react";
import { showErrorMessage } from "../../../utility/notification";
import { formatTime } from "../../../utility/formatTimeSize";
import LiveAudioVisualizer from "./LiveAudioVisualizer";

interface AudioRecorderProps {
  onAudioRecorded: (file: File) => void;
  isUploading: boolean;
  disabled: boolean;
  onRecordingStateChange: (isRecording: boolean) => void;
}

export default function AudioRecorder({
  onAudioRecorded,
  isUploading,
  disabled,
  onRecordingStateChange,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIdRef = useRef<number | null>(null);

  const [activeMediaRecorder, setActiveMediaRecorder] =
    useState<MediaRecorder | null>(null);

  useEffect(() => {
    return () => {
      stopTimer();
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startTimer = () => {
    stopTimer();
    setRecordingTime(0);
    const interval = window.setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 79) {
          // Reached limit of 80 seconds
          stopRecording();
          return 80;
        }
        return prev + 1;
      });
    }, 1000);
    timerIdRef.current = interval;
  };

  const stopTimer = () => {
    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  const getSupportedMimeType = () => {
    const types = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav"];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "";
  };

  const startRecording = async () => {
    if (disabled || isUploading) return;
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });
      mediaRecorderRef.current = mediaRecorder;
      setActiveMediaRecorder(mediaRecorder);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const actualMimeType = mediaRecorder.mimeType || "audio/webm";
        let extension = "webm";
        if (actualMimeType.includes("mp4")) extension = "mp4";
        else if (actualMimeType.includes("ogg")) extension = "ogg";
        else if (actualMimeType.includes("wav")) extension = "wav";

        const audioBlob = new Blob(chunksRef.current, { type: actualMimeType });
        const file = new File([audioBlob], `audio-${Date.now()}.${extension}`, {
          type: actualMimeType,
        });

        onAudioRecorded(file);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      onRecordingStateChange(true);
      startTimer();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      showErrorMessage(
        "Không thể truy cập Microphone. Vui lòng cấp quyền truy cập.",
      );
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    stopTimer();
    setActiveMediaRecorder(null);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    onRecordingStateChange(false);
  };

  const cancelRecording = () => {
    if (!isRecording) return;
    stopTimer();
    setActiveMediaRecorder(null);
    setIsRecording(false);
    onRecordingStateChange(false);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.onstop = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
      mediaRecorderRef.current.stop();
    }
  };

  if (isUploading || disabled) return null;

  return (
    <div
      className={`mb-2 p-3 border border-white/10 rounded-2xl bg-white/2 transition-all duration-300 ${isRecording ? "border-purple-500 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]" : "hover:border-white/20"}`}
    >
      {!isRecording ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Mic size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Ghi âm trực tiếp
              </p>
            </div>
          </div>
          <button
            onClick={startRecording}
            disabled={disabled || isUploading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all hover:shadow-lg hover:shadow-purple-600/30 active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            Bắt đầu ghi
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider animate-pulse flex items-center gap-1">
                <Radio size={12} /> Đang thu âm
              </span>
            </div>
            <span className="font-mono text-sm font-semibold text-slate-300">
              {formatTime(recordingTime)} / 01:20
            </span>
          </div>

          {/* Real-time Frequency Wave visualizer */}
          <div className="h-20">
            {activeMediaRecorder && (
              <LiveAudioVisualizer
                mediaRecorder={activeMediaRecorder}
                height={70}
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={stopRecording}
              className="flex-1 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-600/20 cursor-pointer active:scale-95"
            >
              <Square size={14} /> Dừng và Lưu
            </button>
            <button
              onClick={cancelRecording}
              className="px-3 py-2 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
              title="Hủy ghi âm"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
