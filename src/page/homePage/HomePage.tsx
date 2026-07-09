import { useState, useEffect, useRef } from "react";
import { Mic, Menu } from "lucide-react";
import Sidebar from "../../utility/sidebar/Sidebar";
import RecordingDetailModal from "../../component/homePage/RecordingDetailModal";
import StatsCards from "../../component/homePage/StatsCards";
import FilterControls from "../../component/homePage/FilterControls";
import RecordingsTable from "../../component/homePage/RecordingsTable";
import type { Recording } from "../../types/recording.type";
import { MOCK_ANALYSIS_RESULT } from "../../component/landing/MockData";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../utility/notification";

// Initial mock data that mirrors standard MOCK_ANALYSIS_RESULT
const INITIAL_RECORDINGS: Recording[] = [
  {
    id: "rec_1",
    title: "Speaking Assessment - Technology & AI",
    createdAt: "09/07/2026 10:15",
    duration: "00:45",
    durationSec: 45,
    fileSize: "1.2 MB",
    overallScore: 82,
    transcript:
      "Hello. Today, I want to practice speaking English freely. I will talk about what is on my mind. I believe that expressing random thoughts spontaneously is one of the best ways to improve my speaking fluency and overcome the fear of making mistakes.",
    analysisResult: MOCK_ANALYSIS_RESULT,
  },
  {
    id: "rec_2",
    title: "Daily Conversation - Shopping Mall",
    createdAt: "08/07/2026 15:30",
    duration: "00:24",
    durationSec: 24,
    fileSize: "680 KB",
    overallScore: 68,
    transcript:
      "I love shopping for new clothes, but I try to save my money. Yesterday, I went to the mall with my friends, and we bought some snacks instead.",
    analysisResult: {
      overallScore: 68,
      cefrLevel: "B1",
      levelName: "Intermediate",
      overallInsight:
        "Bạn phát âm tương đối rõ nhưng nhịp điệu chưa tốt và còn ngắc ngứ. Hãy tập trung cải thiện cách nối âm và ngữ pháp.",
      skills: {
        pronunciation: {
          score: 70,
          grade: "B-",
          details: "Phát âm ổn nhưng hay nuốt âm gió cuối.",
        },
        fluency: {
          score: 62,
          grade: "C+",
          details: "Nhiều khoảng ngắt quãng nhỏ khi tìm từ.",
        },
        comprehensibility: {
          score: 75,
          grade: "B",
          details: "Đối phương có thể hiểu hầu hết câu nói.",
        },
        grammar: {
          score: 64,
          grade: "C",
          details: "Lỗi sử dụng giới từ và mạo từ.",
        },
        vocabulary: {
          score: 69,
          grade: "C+",
          details: "Từ vựng đơn giản, lặp từ nhiều.",
        },
      },
      pronunciationFeedback: [
        {
          word: "shopping",
          expected: "/ˈʃɑːpɪŋ/",
          actual: "/ˈsɑːpɪŋ/",
          issue: "Phát âm s nhẹ thay vì s nặng",
          tip: "Chu môi và đẩy hơi mạnh để phát âm /ʃ/.",
          score: 55,
        },
        {
          word: "clothes",
          expected: "/kloʊðz/",
          actual: "/kloʊs/",
          issue: "Nuốt âm đuôi và phát âm sai phụ âm /ðz/",
          tip: "Đặt đầu lưỡi giữa hai hàm răng và rung dây thanh quản.",
          score: 45,
        },
      ],
      grammarFeedback: [
        {
          original: "Yesterday, I went to mall...",
          corrected: "Yesterday, I went to the mall...",
          rule: "Missing Article / Thiếu mạo từ",
          explain:
            "Dùng mạo từ 'the' trước 'mall' khi nói về một địa điểm cụ thể.",
        },
      ],
      vocabularyFeedback: [
        {
          originalWord: "bought",
          suggestedWord: "purchased",
          sentence: "...we bought some snacks...",
          betterSentence: "...we purchased some snacks...",
          reason:
            "Thay thế 'bought' bằng 'purchased' để tăng tính trang trọng.",
        },
      ],
      fluencyTimeline: [
        {
          time: "00:08",
          type: "hesitation",
          duration: "1.2s",
          severity: "medium",
          context: "Yesterday... I went",
        },
      ],
      wordsPerMinute: 110,
    },
  },
  {
    id: "rec_3",
    title: "IELTS Speaking Part 1 - Self Introduction",
    createdAt: "05/07/2026 09:00",
    duration: "00:35",
    durationSec: 35,
    fileSize: "920 KB",
    overallScore: 89,
    transcript:
      "Hello, let me introduce myself. My name is Alex, and I am a software engineer passionate about machine learning and frontend technologies. I have been studying English for five years.",
    analysisResult: {
      overallScore: 89,
      cefrLevel: "C1",
      levelName: "Advanced",
      overallInsight:
        "Rất xuất sắc! Phát âm tự nhiên, vốn từ học thuật phong phú và cấu trúc ngữ pháp đa dạng.",
      skills: {
        pronunciation: {
          score: 88,
          grade: "A",
          details: "Phát âm chuẩn xác, nhấn trọng âm rất tốt.",
        },
        fluency: {
          score: 90,
          grade: "A",
          details: "Trôi chảy, tự nhiên, không ngắc ngứ.",
        },
        comprehensibility: {
          score: 92,
          grade: "A+",
          details: "Hoàn toàn dễ nghe như người bản xứ.",
        },
        grammar: {
          score: 86,
          grade: "A",
          details: "Cấu trúc ngữ pháp hoàn hảo.",
        },
        vocabulary: {
          score: 90,
          grade: "A",
          details: "Vốn từ vựng nâng cao (passionate, tech).",
        },
      },
      pronunciationFeedback: [
        {
          word: "passionate",
          expected: "/ˈpæʃənət/",
          actual: "/ˈpæʃənət/",
          issue: "Không có lỗi",
          tip: "Phát âm rất tốt.",
          score: 95,
        },
      ],
      grammarFeedback: [],
      vocabularyFeedback: [],
      fluencyTimeline: [],
      wordsPerMinute: 145,
    },
  },
];

export default function HomePage() {
  const [recordings, setRecordings] = useState<Recording[]>(INITIAL_RECORDINGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedRecord, setSelectedRecord] = useState<Recording | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Sidebar Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Audio Playback States
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  const handlePlayPause = (rec: Recording) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    if (playingId === rec.id) {
      setPlayingId(null);
      audioPlayerRef.current = null;
      return;
    }

    // Generate speech using Youdao TTS API
    const url = `https://dict.youdao.com/dictvoice?type=0&audio=${encodeURIComponent(rec.transcript)}`;
    const audio = new Audio(url);
    audioPlayerRef.current = audio;
    setPlayingId(rec.id);

    audio.onended = () => {
      if (playingId === rec.id || audioPlayerRef.current === audio) {
        setPlayingId(null);
      }
    };
    audio.onerror = () => {
      showErrorMessage("Lỗi khi tải tệp ghi âm");
      setPlayingId(null);
    };

    audio.play().catch((err) => {
      console.error("Playback failed", err);
      setPlayingId(null);
    });
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa bản ghi âm này? Hành động này không thể hoàn tác.",
      )
    ) {
      setRecordings((prev) => prev.filter((r) => r.id !== id));
      showSuccessMessage("Đã xóa bản ghi âm thành công");
      if (playingId === id) {
        if (audioPlayerRef.current) audioPlayerRef.current.pause();
        setPlayingId(null);
      }
    }
  };

  const handleOpenDetail = (rec: Recording) => {
    setSelectedRecord(rec);
    setDetailModalOpen(true);
  };

  // Calculations for quick statistics
  const totalRecords = recordings.length;
  const avgScore = totalRecords
    ? Math.round(
        recordings.reduce((sum, r) => sum + r.overallScore, 0) / totalRecords,
      )
    : 0;
  const totalDurationSec = recordings.reduce(
    (sum, r) => sum + r.durationSec,
    0,
  );
  const totalDurationStr = (() => {
    const mins = Math.floor(totalDurationSec / 60);
    const secs = totalDurationSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  })();
  const proCount = recordings.filter((r) => r.overallScore >= 80).length;

  // Filter and Sort recordings
  const filteredRecordings = recordings
    .filter((rec) => {
      // Search
      const matchesSearch =
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.transcript.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by Score
      if (scoreFilter === "pro") return matchesSearch && rec.overallScore >= 80;
      if (scoreFilter === "avg")
        return matchesSearch && rec.overallScore >= 60 && rec.overallScore < 80;
      if (scoreFilter === "needs_practice")
        return matchesSearch && rec.overallScore < 60;

      return matchesSearch;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === "score_desc") {
        return b.overallScore - a.overallScore;
      }
      if (sortBy === "score_asc") {
        return a.overallScore - b.overallScore;
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-[#030014] text-white flex">
      {/* Sidebar - Collapsible & Responsive */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/5 bg-[#030014]/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <Mic size={18} className="text-purple-400" />
              Kho Bản Ghi Âm Luyện Nói
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
              AI Panel
            </span>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-8 relative">
          {/* Ambient Glows */}
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Page Intro */}
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
              Chào mừng trở lại!
            </h2>
            <p className="text-sm text-slate-400">
              Dưới đây là các bản ghi âm của bạn đã được đánh giá bằng công nghệ
              AI 5 khía cạnh.
            </p>
          </div>

          {/* Quick Statistics Grid */}
          <StatsCards
            totalRecords={totalRecords}
            avgScore={avgScore}
            totalDurationStr={totalDurationStr}
            proCount={proCount}
          />

          {/* Filtering & Searching Controls */}
          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            scoreFilter={scoreFilter}
            setScoreFilter={setScoreFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Recordings list Table Wrapper */}
          <div className="bg-white/2 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
            <RecordingsTable
              recordings={filteredRecordings}
              playingId={playingId}
              handlePlayPause={handlePlayPause}
              handleOpenDetail={handleOpenDetail}
              handleDelete={handleDelete}
            />
          </div>
        </main>
      </div>

      {/* Recording Detail Modal */}
      <RecordingDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        recording={selectedRecord}
      />
    </div>
  );
}
