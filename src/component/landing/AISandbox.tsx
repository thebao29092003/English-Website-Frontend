import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import type {
  AnalysisResult,
  PronunciationItem,
} from "../../types/landingPage.type";
import { MOCK_ANALYSIS_RESULT } from "./MockData";

// Import modular sub-components from sandbox/
import LoadingState from "./sandbox/LoadingState";
import WelcomeState from "./sandbox/WelcomeState";
import ScoreOverview from "./sandbox/ScoreOverview";
import PronunciationTab from "./sandbox/PronunciationTab";
import ConfidenceTab from "./sandbox/ConfidenceTab";
import GrammarTab from "./sandbox/GrammarTab";
import VocabularyTab from "./sandbox/VocabularyTab";
import FluencyTab from "./sandbox/FluencyTab";

type TabId = "pron" | "confidence" | "fluency" | "gram" | "vocab";

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
];

export default function AISandbox() {
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("pron");
  const [selectedWord, setSelectedWord] = useState<PronunciationItem | null>(
    null,
  );
  const [isTtsPlaying, setIsTtsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const runAnalysis = (overrideTranscript?: string) => {
    const textToAnalyze =
      overrideTranscript?.trim() !== undefined
        ? overrideTranscript
        : transcript;
    if (!textToAnalyze) return;

    setIsAnalyzing(true);
    setResult(null);
    setSelectedWord(null);

    const statuses = [
      "Tải tập tin âm thanh...",
      "Chuyển đổi audio thành text và IPA...",
      "Đánh giá phát âm, trôi chảy và dễ hiểu...",
      "Đánh giá từ vựng và ngữ pháp...",
      "Hoàn thành báo cáo...",
    ];

    let statusIdx = 0;
    setAnalysisStatus(statuses[0]);

    const interval = setInterval(() => {
      statusIdx++;
      if (statusIdx < statuses.length) {
        setAnalysisStatus(statuses[statusIdx]);
      } else {
        clearInterval(interval);
        setResult(MOCK_ANALYSIS_RESULT);
        if (
          MOCK_ANALYSIS_RESULT.pronunciationFeedback &&
          MOCK_ANALYSIS_RESULT.pronunciationFeedback.length > 0
        ) {
          setSelectedWord(MOCK_ANALYSIS_RESULT.pronunciationFeedback[0]);
        }
        setIsAnalyzing(false);
      }
    }, 700);
  };

  // Play audio sample using Youdao TTS
  const playTTS = (text: string, id: string) => {
    // Stop any running speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (isTtsPlaying === id) {
      setIsTtsPlaying(null);
      return;
    }

    const url = `https://dict.youdao.com/dictvoice?type=0&audio=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onended = () => {
      if (audioRef.current === audio) {
        setIsTtsPlaying(null);
        audioRef.current = null;
      }
    };
    audio.onerror = () => {
      if (audioRef.current === audio) {
        setIsTtsPlaying(null);
        audioRef.current = null;
      }
    };

    setIsTtsPlaying(id);
    audio.play().catch((error) => {
      console.error("Audio playback error:", error);
      if (audioRef.current === audio) {
        setIsTtsPlaying(null);
        audioRef.current = null;
      }
    });
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
      className="landing-section"
    >
      {/* Background Glows */}
      <div className="glow-orb top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[130px]" />
      <div className="glow-orb bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px]" />
      <div className="glow-orb top-[40%] right-[20%] w-[350px] h-[350px] bg-violet-500/10 blur-[100px]" />

      <div className="landing-container">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="landing-heading">
            Bảng Chấm Điểm{" "}
            <span className="gradient-text-purple">
              AI Tiên Tiến
            </span>
          </h2>
          <p className="landing-description">
            Khám phá tính năng phân tích kết quả 5 bước của EngSteps. Trải
            nghiệm thử bảng điểm chi tiết phân tích phát âm IPA, dễ hiểu, trôi
            chảy, từ vựng và ngữ pháp qua bản demo dưới đây.
          </p>
        </div>

        {/* Center Container for Analysis Report / Demo Trigger */}
        <div className="w-full">
          {/* If analyzing / Loading state */}
          {<LoadingState message={analysisStatus} isShow={isAnalyzing} />}

          {/* If NO result & not analyzing: Welcome prompt */}
          {!result && !isAnalyzing && (
            <WelcomeState onStartDemo={handleStartDemo} />
          )}

          {/* ACTIVE RESULTS PANEL */}
          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Result Hero Header: Circular Gauge + Metrics Grid */}
              <ScoreOverview result={result} />

              {/* Tabs selection header */}
              <div className="flex bg-white/2 border-b border-white/5">
                {TABS.map((tab) => (
                  <button
                    id={`tab-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "border-purple-500 text-white bg-purple-500/5 font-bold"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
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

                {/* CONFIDENCE TAB */}
                {activeTab === "confidence" && (
                  <ConfidenceTab
                    transcript={transcript}
                    pronunciationFeedback={result.pronunciationFeedback}
                    selectedWord={selectedWord}
                    onSelectWord={setSelectedWord}
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
                  <FluencyTab
                    fluencyTimeline={result.fluencyTimeline}
                    wordsPerMinute={result.wordsPerMinute}
                  />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
