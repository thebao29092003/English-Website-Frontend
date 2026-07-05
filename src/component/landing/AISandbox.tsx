import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import type {
  AnalysisResult,
  PronunciationItem,
} from "../../types/landingPageType";
import { MOCK_ANALYSIS_RESULT } from "./sandbox/mockData";

// Import modular sub-components from sandbox/
import LoadingState from "./sandbox/LoadingState";
import WelcomeState from "./sandbox/WelcomeState";
import ScoreOverview from "./sandbox/ScoreOverview";
import PronunciationTab from "./sandbox/PronunciationTab";
import GrammarTab from "./sandbox/GrammarTab";
import VocabularyTab from "./sandbox/VocabularyTab";
import FluencyTab from "./sandbox/FluencyTab";

export default function AISandbox() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "pron" | "gram" | "vocab" | "fluency"
  >("pron");
  const [selectedWord, setSelectedWord] = useState<PronunciationItem | null>(
    null,
  );
  const [isTtsPlaying, setIsTtsPlaying] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  // Recognition ref
  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(18).fill(10));

  // Audio wave animation
  useEffect(() => {
    if (isRecording) {
      const animateWave = () => {
        setWaveHeights((prev) =>
          prev.map(() => Math.floor(Math.random() * 35) + 8),
        );
        animationFrameRef.current = requestAnimationFrame(animateWave);
      };
      animateWave();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setWaveHeights(Array(18).fill(10));
    }
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        setMicError(null);
        setTranscript("");
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript((finalTranscript + interimTranscript).trim());
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setMicError(
            "Quyền truy cập Micro bị từ chối. Hãy cấp quyền hoặc thử dùng văn bản mẫu.",
          );
        } else {
          setMicError(
            `Lỗi Micro: ${event.error}. Bạn vẫn có thể nhập/sửa văn bản trực tiếp.`,
          );
        }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const runAnalysis = async (overrideTranscript?: string) => {
    const textToAnalyze =
      overrideTranscript !== undefined ? overrideTranscript : transcript;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setSelectedWord(null);

    const statuses = [
      "AI đang thu âm bộ âm vị...",
      "Đang so sánh biểu đồ phát âm với người bản xứ...",
      "Kiểm tra kết cấu ngữ pháp & trật tự từ...",
      "Tính toán mức độ trôi chảy và tốc độ nói (WPM)...",
      "Đang lập báo cáo phân tích 5 chiều...",
    ];

    let statusIdx = 0;
    setAnalysisStatus(statuses[0]);

    const interval = setInterval(() => {
      statusIdx++;
      if (statusIdx < statuses.length) {
        setAnalysisStatus(statuses[statusIdx]);
      }
    }, 900);

    try {
      const response = await fetch("/api/analyze-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: textToAnalyze,
          topic: "Free English Speaking Practice",
          userLevel: "Intermediate",
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      if (data.pronunciationFeedback && data.pronunciationFeedback.length > 0) {
        setSelectedWord(data.pronunciationFeedback[0]);
      }
    } catch (error) {
      console.warn("Speech analysis error, falling back to mock data:", error);
      setResult(MOCK_ANALYSIS_RESULT);
      if (
        MOCK_ANALYSIS_RESULT.pronunciationFeedback &&
        MOCK_ANALYSIS_RESULT.pronunciationFeedback.length > 0
      ) {
        setSelectedWord(MOCK_ANALYSIS_RESULT.pronunciationFeedback[0]);
      }
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  // Play audio sample using standard Web Speech Synthesis
  const playTTS = (text: string, id: string) => {
    if (!window.speechSynthesis) return;

    // Stop any running speech
    window.speechSynthesis.cancel();

    if (isTtsPlaying === id) {
      setIsTtsPlaying(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    // Try to find a premium English voice
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") || v.name.includes("Natural")),
    );
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    utterance.onend = () => {
      setIsTtsPlaying(null);
    };
    utterance.onerror = () => {
      setIsTtsPlaying(null);
    };

    setIsTtsPlaying(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleStartDemo = () => {
    const sampleText =
      "Hello. Today, I want to practice speaking English freely. I will talk about what is on my mind. I believe that expressing random thoughts spontaneously is one of the best ways to improve my speaking fluency and overcome the fear of making mistakes.";
    setTranscript(sampleText);
    runAnalysis(sampleText);
  };

  return (
    <section
      id="ai-sandbox-section"
      className="py-20 bg-[#030014] relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Bảng Chấm Điểm{" "}
            <span className="gradient-text bg-linear-to-r from-blue-400 to-purple-400 glow-purple">
              AI Tiên Tiến
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Khám phá tính năng phân tích kết quả kép của EngSteps. Trải nghiệm
            thử bảng điểm chi tiết phân tích phát âm IPA, từ vựng C1/C2, ngữ
            điệu và ngữ pháp qua bản demo dưới đây.
          </p>
        </div>

        {/* Center Container for Analysis Report / Demo Trigger */}
        <div className="w-full">
          {/* If analyzing / Loading state */}
          {isAnalyzing && <LoadingState analysisStatus={analysisStatus} />}

          {/* If NO result & not analyzing: Welcome prompt */}
          {!result && !isAnalyzing && (
            <WelcomeState onStartDemo={handleStartDemo} />
          )}

          {/* ACTIVE RESULTS PANEL */}
          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Result Hero Header: Circular Gauge + Metrics Grid */}
              <ScoreOverview result={result} />

              {/* Tabs selection header */}
              <div className="flex bg-white/2 border-b border-white/5 p-1">
                <button
                  id="tab-pron"
                  onClick={() => setActiveTab("pron")}
                  className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === "pron"
                      ? "border-purple-500 text-white bg-purple-500/5 font-bold"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Phát Âm (Pron)
                </button>
                <button
                  id="tab-gram"
                  onClick={() => setActiveTab("gram")}
                  className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === "gram"
                      ? "border-purple-500 text-white bg-purple-500/5 font-bold"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Ngữ Pháp (Grammar)
                </button>
                <button
                  id="tab-vocab"
                  onClick={() => setActiveTab("vocab")}
                  className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === "vocab"
                      ? "border-purple-500 text-white bg-purple-500/5 font-bold"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Từ Vựng (Vocab)
                </button>
                <button
                  id="tab-fluency"
                  onClick={() => setActiveTab("fluency")}
                  className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === "fluency"
                      ? "border-purple-500 text-white bg-purple-500/5 font-bold"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Trôi Chảy (Fluency)
                </button>
              </div>

              {/* Tab content area */}
              <div className="p-6">
                {/* PRONUNCIATION TAB */}
                {activeTab === "pron" && (
                  <PronunciationTab
                    transcript={transcript}
                    pronunciationFeedback={result.pronunciationFeedback}
                    selectedWord={selectedWord}
                    onSelectWord={setSelectedWord}
                    playTTS={playTTS}
                  />
                )}

                {/* GRAMMAR TAB */}
                {activeTab === "gram" && (
                  <GrammarTab
                    grammarFeedback={result.grammarFeedback}
                    playTTS={playTTS}
                  />
                )}

                {/* VOCABULARY TAB */}
                {activeTab === "vocab" && (
                  <VocabularyTab
                    vocabularyFeedback={result.vocabularyFeedback}
                    playTTS={playTTS}
                  />
                )}

                {/* FLUENCY TIMELINE TAB */}
                {activeTab === "fluency" && (
                  <FluencyTab fluencyTimeline={result.fluencyTimeline} />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
