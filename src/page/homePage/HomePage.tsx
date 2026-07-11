import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Mic, Menu } from "lucide-react";
import StatsCards from "../../component/homePage/StatsCards";
import FilterControls from "../../component/homePage/FilterControls";
import RecordingsTable from "../../component/homePage/RecordingsTable";
import type { Recording } from "../../types/homePage.type";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../utility/notification";
import { useRecordingQuery } from "../../API/homeApi/homeApi";
import PageSkeleton from "../../utility/PageSkeleton";
import HomePageSkeleton from "./HomePageSkeleton";
import { showConfirmDialog } from "../../utility/confirmDialog";
import { getOverallScore } from "../../utility/getOverallScore";

export default function HomePage() {
  const { data, isLoading, isError } = useRecordingQuery();

  const recordings = data?.value || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Sidebar Layout Controller from Shared Outlet Layout
  const { setMobileSidebarOpen } = useOutletContext<{
    setMobileSidebarOpen: (open: boolean) => void;
  }>();

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

    if (playingId === rec.fileName) {
      setPlayingId(null);
      audioPlayerRef.current = null;
      return;
    }
    const url = rec.fileUrl;
    if (url == null) {
      showErrorMessage("Đoạn âm thanh hiện không có sẵn");
      return;
    }
    const audio = new Audio(url);
    audioPlayerRef.current = audio;
    setPlayingId(rec.fileName);

    audio.onended = () => {
      if (playingId === rec.fileName || audioPlayerRef.current === audio) {
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

  const handleDelete = (fileName: string) => {
    showConfirmDialog({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa bản ghi âm này?",
      confirmText: "Xóa",
      cancelText: "Hủy bỏ",
      onConfirm: async () => {
        try {
          // TODO: gọi api xóa + refetch data
          console.log("Xóa file:", fileName);
          showSuccessMessage("Xóa bản ghi âm thành công");
        } catch (error) {
          showErrorMessage("Lỗi khi xóa bản ghi âm");
        }
      },
    });
  };

  const handleOpenDetail = (rec: Recording) => {
    console.log("Xem chi tiết bản ghi âm:", rec.fileName);
  };

  // Helper to compute overall score for a recording

  // Calculations for quick statistics
  const totalRecords = recordings.length;
  const avgScore = totalRecords
    ? Math.round(
        recordings.reduce((sum, r) => sum + getOverallScore(r), 0) /
          totalRecords,
      )
    : 0;
  const totalDurationSec = recordings.reduce(
    (sum, r) => sum + (r.duration || 0),
    0,
  );
  const totalDurationStr = (() => {
    const mins = Math.floor(totalDurationSec / 60);
    const secs = Math.round(totalDurationSec % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  })();
  const proCount = recordings.filter((r) => getOverallScore(r) >= 80).length;

  // Filter and Sort recordings
  const filteredRecordings = recordings
    .filter((rec) => {
      // Search
      const matchesSearch =
        (rec.fileName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (rec.speechToText?.aiTranscript || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const score = getOverallScore(rec);

      // Filter by Score
      if (scoreFilter === "pro") return matchesSearch && score >= 80;
      if (scoreFilter === "avg")
        return matchesSearch && score >= 60 && score < 80;
      if (scoreFilter === "needs_practice") return matchesSearch && score < 60;

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
        return getOverallScore(b) - getOverallScore(a);
      }
      if (sortBy === "score_asc") {
        return getOverallScore(a) - getOverallScore(b);
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Error state notification helper
  if (isError) {
    showErrorMessage("Không thể tải bản ghi âm từ máy chủ.");
  }

  return (
    <>
      {isLoading ? (
        <PageSkeleton setMobileSidebarOpen={setMobileSidebarOpen}>
          <HomePageSkeleton />
        </PageSkeleton>
      ) : (
        <>
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
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-4 relative">
            {/* Ambient Glows */}
            <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

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
        </>
      )}
    </>
  );
}
