import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
import { useAudioDetailQuery } from "../../API/callApi/audioDetailApi";
import { showErrorMessage } from "../../utility/notification";
import PageSkeleton from "../../utility/PageSkeleton";
import { useOutletContext } from "react-router-dom";

// Subcomponents
import DetailScoreOverview from "../../component/audioDetail/DetailScoreOverview";
import DetailPronunciationTab from "../../component/audioDetail/DetailPronunciationTab";
import DetailConfidenceTab from "../../component/audioDetail/DetailConfidenceTab";
import DetailFluencyTab from "../../component/audioDetail/DetailFluencyTab";
import DetailGrammarTab from "../../component/audioDetail/DetailGrammarTab";
import DetailVocabularyTab from "../../component/audioDetail/DetailVocabularyTab";
import DetailRephrasedTab from "../../component/audioDetail/DetailRephrasedTab";
import { formatDuration } from "../../utility/formatTimeSize";
import AudioDetailPageSkeleton from "./AudioDetailPageSkeleton";
import { usePlayTTS } from "../../utility/usePlayTTS";

type TabId = "pron" | "confidence" | "fluency" | "gram" | "vocab" | "rephrased";

interface TabDefinition {
  id: TabId;
  label: string;
}

const TABS: TabDefinition[] = [
  { id: "pron", label: "Phát Âm" },
  { id: "confidence", label: "Độ Dễ Hiểu" },
  { id: "fluency", label: "Trôi Chảy" },
  { id: "gram", label: "Ngữ Pháp" },
  { id: "vocab", label: "Từ Vựng" },
  { id: "rephrased", label: "Bản Nói Nâng Cao" },
];

export default function AudioDetailPage() {
  const { recordingId } = useParams<{ recordingId: string }>();
  const navigate = useNavigate();

  // Sidebar Layout Controller from Shared Outlet Layout
  const { setMobileSidebarOpen } = useOutletContext<{
    setMobileSidebarOpen: (open: boolean) => void;
  }>();

  // RTK Query call
  const { data, isLoading, isError } = useAudioDetailQuery(recordingId || "");
  const value = data?.value;

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabId>("pron");

  // Audio Playback States
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Highlighting states - optimized by only updating when change occurs
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null,
  );
  const lastIndexRef = useRef<number | null>(null);

  // usePlayTTS hook integration
  const { playTTS: triggerTTS, stopTTS } = usePlayTTS();

  // Clean up audio & TTS on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopTTS();
    };
  }, []);

  // Keyboard shortcuts: Space key to play/pause audio, ArrowLeft/Right to seek 3s backward/forward
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (audioRef.current) {
          const newTime = Math.max(0, audioRef.current.currentTime - 3);
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (audioRef.current) {
          const duration = audioRef.current.duration || 0;
          const newTime = Math.min(duration, audioRef.current.currentTime + 3);
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying]);

  if (isError) {
    showErrorMessage("Không thể tải chi tiết bản ghi âm");
  }

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause TTS if playing
      stopTTS();
      audioRef.current.play().catch((err) => {
        console.error("Playback failed", err);
        showErrorMessage("Không thể phát bản ghi âm");
      });
      setIsPlaying(true);
    }
  };

  // được kích hoạt khi có sự thay đổi về thời gian của audio
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;

    // update state này để thanh trượt (seek bar) ở dưới màn hình chạy theo đúng tiến độ của âm thanh.
    setCurrentTime(audio.currentTime);

    if (!value || !value.wordsJson) return;

    const timeMs = audio.currentTime * 1000;
    const words = value.wordsJson;

    let foundIdx = -1;
    for (let i = 0; i < words.length; i++) {
      if (timeMs >= words[i].start && timeMs <= words[i].end) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx !== lastIndexRef.current) {
      lastIndexRef.current = foundIdx;
      setActiveWordIndex(foundIdx === -1 ? null : foundIdx);
    }
  };

  // được kích hoạt khi metadata của audio được load
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setDuration(e.currentTarget.duration);
  };

  // được kích hoạt khi kết thúc audio
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setActiveWordIndex(null);
    lastIndexRef.current = null;
  };

  // Hàm handleProgressChange được kích hoạt khi người dùng kéo thanh trượt
  // (seek bar) hoặc click vào một vị trí bất kỳ trên thanh tiến trình để tua
  // nhanh hoặc tua lại file âm thanh
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Hàm này được dùng khi người dùng nhấn chọn các nút tốc độ phát
  //  để nghe chậm lại hoặc nghe nhanh hơn.
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Hàm này hoạt động khi người dùng kéo thanh trượt điều chỉnh âm lượng (slider).
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = v === 0;
    }
  };

  // Hàm này được kích hoạt khi người dùng click trực tiếp vào biểu tượng
  // loa để tắt hoặc bật lại âm thanh một cách nhanh chóng mà không cần kéo thanh trượt.
  const toggleMute = () => {
    if (!audioRef.current) return;
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  // Play TTS (Standard voice guide)
  const playTTS = (text: string, _id?: string) => {
    // Pause main audio if playing
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    triggerTTS(text);
  };

  return (
    <>
      {isLoading ? (
        <PageSkeleton
          setMobileSidebarOpen={setMobileSidebarOpen}
          headerTitle="Chi tiết bản ghi âm"
        >
          <AudioDetailPageSkeleton />
        </PageSkeleton>
      ) : (
        <div className="flex flex-col min-h-screen pb-28">
          {/* Header Bar */}
          <header className="h-16 border-b border-white/5 bg-[#030014]/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-7">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/home")}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white cursor-pointer transition-all flex items-center justify-center"
                title="Quay lại"
              >
                <ArrowLeft size={16} />
              </button>
              <h1 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Chi tiết bản ghi âm:{" "}
                <span className="text-purple-400">
                  {value?.fileName || "Bản ghi âm"}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
                AI Analysis Report
              </span>
            </div>
          </header>

          {isError || !value ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
              <HelpCircle size={48} className="text-rose-500 animate-bounce" />
              <h3 className="text-lg font-bold text-white">
                Không tìm thấy chi tiết bản ghi âm
              </h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Có lỗi xảy ra hoặc bản ghi âm không còn tồn tại trên máy chủ.
              </p>
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all cursor-pointer"
              >
                Quay lại trang chủ
              </button>
            </div>
          ) : (
            <>
              {/* Audio detail hidden audio element */}
              <audio
                ref={audioRef}
                src={value.fileUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleAudioEnded}
              />

              <main className="flex-1 p-6 max-w-[95%] w-full mx-auto space-y-6 relative">
                {/* Ambient Background Glows */}
                <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Interactive Analysis Report Card */}
                <div className="glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/5">
                  {/* Score Overview gauge */}
                  <DetailScoreOverview value={value} />

                  {/* Tab options bar */}
                  <div className="flex bg-white/2 border-b border-white/5 overflow-x-auto scrollbar-thin">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setSelectedWordIndex(null);
                        }}
                        className={`flex-1 min-w-[120px] py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer text-center ${
                          activeTab === tab.id
                            ? "border-purple-500 text-white bg-purple-500/5 font-bold"
                            : "border-transparent text-gray-400 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Display Area */}
                  <div className="p-6">
                    {activeTab === "pron" && (
                      <DetailPronunciationTab
                        wordsJson={value.wordsJson}
                        wordsPronunciationScore={value.wordsPronunciationScore}
                        activeWordIndex={activeWordIndex}
                        selectedWordIndex={selectedWordIndex}
                        onSelectWordIndex={setSelectedWordIndex}
                        playTTS={playTTS}
                      />
                    )}

                    {activeTab === "confidence" && (
                      <DetailConfidenceTab
                        wordsJson={value.wordsJson}
                        activeWordIndex={activeWordIndex}
                        selectedWordIndex={selectedWordIndex}
                        onSelectWordIndex={setSelectedWordIndex}
                      />
                    )}

                    {activeTab === "fluency" && (
                      <DetailFluencyTab
                        fluencyScore={value.fluencyScore}
                        wordPerMinute={value.wordPerMinute}
                        fluencyErrors={value.fluencyErrors}
                        onSeek={(startMs) => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = startMs / 1000;
                            setCurrentTime(startMs / 1000);
                            if (!isPlaying) togglePlay();
                          }
                        }}
                      />
                    )}

                    {activeTab === "gram" && (
                      <DetailGrammarTab
                        grammarErrors={
                          value.analysisContentJson.grammarAnalysis?.errors ||
                          []
                        }
                        playTTS={playTTS}
                      />
                    )}

                    {activeTab === "vocab" && (
                      <DetailVocabularyTab
                        vocabularySuggestions={
                          value.analysisContentJson.vocabularyAnalysis
                            ?.suggestions || []
                        }
                        playTTS={playTTS}
                      />
                    )}

                    {activeTab === "rephrased" && (
                      <DetailRephrasedTab
                        rephrasedResponses={
                          value.analysisContentJson.rephrasedResponses
                        }
                        toeicFeedback={
                          value.analysisContentJson.toeicEvaluation
                            ?.detailedFeedback
                        }
                        playTTS={playTTS}
                      />
                    )}
                  </div>
                </div>
              </main>

              {/* Custom Premium Audio Player (Fixed bottom bar) */}
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#07041f]/90 border-t border-white/10 backdrop-blur-xl p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Play / Pause & Skip Buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 active:scale-95 transition-all cursor-pointer shadow-lg shadow-purple-600/30"
                      title={isPlaying ? "Tạm dừng" : "Phát ghi âm"}
                    >
                      {isPlaying ? (
                        <Pause size={20} />
                      ) : (
                        <Play size={20} className="ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = 0;
                          setCurrentTime(0);
                        }
                      }}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                      title="Phát lại từ đầu"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>

                  {/* Progress Seek Bar */}
                  <div className="flex-1 w-full flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 min-w-[35px]">
                      {formatDuration(currentTime)}
                    </span>
                    <div className="flex-1 relative h-5 flex items-center group">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        step="0.01"
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer outline-none accent-purple-500 z-10"
                      />
                      {/* Visual background progress indicator */}
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-linear-to-r from-purple-500 to-indigo-500 rounded-full pointer-events-none z-0"
                        style={{
                          width: `${(currentTime / (duration || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400 min-w-[35px]">
                      {formatDuration(duration)}
                    </span>
                  </div>

                  {/* Playback speed & Volume details */}
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    {/* Speed Rates control */}
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-xl">
                      {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRateChange(rate)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            playbackRate === rate
                              ? "bg-purple-600 text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>

                    {/* Volume bar */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                        title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={18} />
                        ) : (
                          <Volume2 size={18} />
                        )}
                      </button>
                      <div className="relative w-20 h-5 flex items-center group">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer outline-none accent-purple-400 z-10"
                        />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-linear-to-r from-purple-500 to-indigo-500 rounded-full pointer-events-none z-0"
                          style={{
                            width: `${(isMuted || volume === 0 ? 0 : volume) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
