import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mic } from "lucide-react";
import type {
  PronunciationItem,
} from "../../types/landingPage.type";
import type { Recording } from "../../types/recording.type";

// Import sandbox parts
import ScoreOverview from "../landing/sandbox/ScoreOverview";
import PronunciationTab from "../landing/sandbox/PronunciationTab";
import ConfidenceTab from "../landing/sandbox/ConfidenceTab";
import GrammarTab from "../landing/sandbox/GrammarTab";
import VocabularyTab from "../landing/sandbox/VocabularyTab";
import FluencyTab from "../landing/sandbox/FluencyTab";

interface RecordingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recording: Recording | null;
}

type TabId = "pron" | "confidence" | "fluency" | "gram" | "vocab";

const TABS = [
  { id: "pron", label: "Phát Âm" },
  { id: "confidence", label: "Độ Dễ Hiểu" },
  { id: "fluency", label: "Trôi Chảy" },
  { id: "gram", label: "Ngữ Pháp" },
  { id: "vocab", label: "Từ Vựng" },
];

export default function RecordingDetailModal({
  isOpen,
  onClose,
  recording,
}: RecordingDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("pron");
  const [selectedWord, setSelectedWord] = useState<PronunciationItem | null>(null);
  const [isTtsPlaying, setIsTtsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (
      recording?.analysisResult?.pronunciationFeedback &&
      recording.analysisResult.pronunciationFeedback.length > 0
    ) {
      setSelectedWord(recording.analysisResult.pronunciationFeedback[0]);
    }
  }, [recording]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (!recording) return null;

  const { title, createdAt, transcript, analysisResult } = recording;

  // Play audio sample using Youdao TTS
  const playTTS = (text: string, id: string) => {
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

  const handleClose = () => {
    if (audioRef.current) audioRef.current.pause();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 backdrop-blur-md transition-colors bg-black/80"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl backdrop-blur-md text-left shadow-2xl z-10 transition-all bg-[#030014]/95 border border-white/10 text-white flex flex-col"
          >
            {/* Top glowing bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 z-50" />

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/5 relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Mic size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold font-display text-white tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Được ghi âm lúc: {createdAt}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="w-full">
                {/* Result Hero Header: Circular Gauge + Metrics Grid */}
                <ScoreOverview result={analysisResult} />

                {/* Tabs Selection Header */}
                <div className="flex bg-white/2 border-b border-white/5 sticky top-0 bg-[#06041c] z-20">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabId)}
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

                {/* Tab Content Area */}
                <div className="p-6">
                  {/* PRONUNCIATION TAB */}
                  {activeTab === "pron" && (
                    <PronunciationTab
                      transcript={transcript}
                      pronunciationFeedback={analysisResult.pronunciationFeedback}
                      selectedWord={selectedWord}
                      onSelectWord={setSelectedWord}
                      playTTS={playTTS}
                    />
                  )}

                  {/* CONFIDENCE TAB */}
                  {activeTab === "confidence" && (
                    <ConfidenceTab
                      transcript={transcript}
                      pronunciationFeedback={analysisResult.pronunciationFeedback}
                      selectedWord={selectedWord}
                      onSelectWord={setSelectedWord}
                    />
                  )}

                  {/* GRAMMAR TAB */}
                  {activeTab === "gram" && (
                    <GrammarTab
                      grammarFeedback={analysisResult.grammarFeedback}
                      playTTS={playTTS}
                    />
                  )}

                  {/* VOCABULARY TAB */}
                  {activeTab === "vocab" && (
                    <VocabularyTab
                      vocabularyFeedback={analysisResult.vocabularyFeedback}
                      playTTS={playTTS}
                    />
                  )}

                  {/* FLUENCY TIMELINE TAB */}
                  {activeTab === "fluency" && (
                    <FluencyTab
                      fluencyTimeline={analysisResult.fluencyTimeline}
                      wordsPerMinute={analysisResult.wordsPerMinute || 120}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
