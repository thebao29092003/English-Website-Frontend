import { useState, useEffect, useRef } from "react";
import { Mic, Square, Trash2, Radio } from "lucide-react";
import { showErrorMessage } from "../../../utility/notification";

interface AudioRecorderProps {
  onAudioRecorded: (file: File) => void;
  isUploading: boolean;
  disabled: boolean;
}

export default function AudioRecorder({
  onAudioRecorded,
  isUploading,
  disabled,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIdRef = useRef<number | null>(null);

  // Web Audio API references
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    return () => {
      stopTimer();
      cleanupAudioAnalyser();
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

  const cleanupAudioAnalyser = () => {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current
        .close()
        .catch((err) => console.error("Error closing AudioContext:", err));
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

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

      // Initialize Web Audio API for Real-Time Visualizer
      try {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64; // Smaller size for better mapping to 20 bars
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateVisualization = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          for (let i = 0; i < 20; i++) {
            const bar = barRefs.current[i];
            if (bar) {
              const dataIndex = Math.floor(i * (bufferLength / 20));
              const value = dataArray[dataIndex] || 0;
              // Map volume level to height percentage (min 15%, max 100%)
              const heightPercent = Math.min(
                100,
                Math.max(15, (value / 255) * 100),
              );
              bar.style.height = `${heightPercent}%`;
            }
          }

          animationFrameIdRef.current =
            requestAnimationFrame(updateVisualization);
        };

        animationFrameIdRef.current =
          requestAnimationFrame(updateVisualization);
      } catch (audioErr) {
        console.warn("Could not start audio visualizer:", audioErr);
      }

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        cleanupAudioAnalyser();
        const actualMimeType = mediaRecorder.mimeType || "audio/webm";
        let extension = "webm";
        if (actualMimeType.includes("mp4")) extension = "mp4";
        else if (actualMimeType.includes("ogg")) extension = "ogg";
        else if (actualMimeType.includes("wav")) extension = "wav";

        const audioBlob = new Blob(chunksRef.current, { type: actualMimeType });
        const file = new File(
          [audioBlob],
          `ghi-am-${Date.now()}.${extension}`,
          { type: actualMimeType },
        );

        onAudioRecorded(file);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
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
    cleanupAudioAnalyser();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (!isRecording) return;
    stopTimer();
    cleanupAudioAnalyser();
    setIsRecording(false);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
        <div className="flex flex-col gap-3">
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
          <div className="flex items-end justify-center gap-1 h-8 px-4 py-1.5 bg-black/20 rounded-lg">
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20,
            ].map((bar, idx) => {
              return (
                <div
                  key={bar}
                  ref={(el) => {
                    barRefs.current[idx] = el;
                  }}
                  className="w-1 bg-purple-500 rounded-full"
                  style={{
                    height: "15%",
                  }}
                />
              );
            })}
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
