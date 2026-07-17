import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Mic, Menu, Upload } from "lucide-react";
import StatsCards from "../../component/homePage/StatsCards";
import FilterControls from "../../component/homePage/FilterControls";
import RecordingsTable from "../../component/homePage/RecordingsTable";
import type { Recording, FilterState } from "../../types/homePage.type";
import Pagination from "../../component/homePage/Pagination";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../utility/notification";
import {
  useRecordingQuery,
  useAudioDeleteMutation,
} from "../../API/callApi/audioApi";
import PageSkeleton from "../../utility/PageSkeleton";
import HomePageSkeleton from "./HomePageSkeleton";
import { showConfirmDialog } from "../../utility/confirmDialog";
import { getOverallScore } from "../../utility/getOverallScore";
import UploadAudioModal from "../../component/homePage/UploadAudioModal";

export default function HomePage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useRecordingQuery();
  const [audioDelete] = useAudioDeleteMutation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const recordings = data?.value || [];

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    scoreFilter: "all",
    sortBy: "newest",
  });

  const { searchQuery, scoreFilter, sortBy } = filters;

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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

    if (playingId === rec.recodingId) {
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
    setPlayingId(rec.recodingId);

    audio.onended = () => {
      if (playingId === rec.recodingId || audioPlayerRef.current === audio) {
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

  const handleDelete = (recodingId: string) => {
    showConfirmDialog({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa bản ghi âm này?",
      confirmText: "Xóa",
      cancelText: "Hủy bỏ",
      onConfirm: async () => {
        try {
          await audioDelete(recodingId).unwrap();
          showSuccessMessage("Xóa bản ghi âm thành công");
          refetch();
        } catch (error) {
          showErrorMessage("Lỗi khi xóa bản ghi âm");
        }
      },
    });
  };

  const handleOpenDetail = (rec: Recording) => {
    navigate(`/home/audio/${rec.recodingId}`);
  };

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecordings.length / pageSize);
  const paginatedRecordings = filteredRecordings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
          <header className="h-16 border-b border-white/5 bg-[#030014]/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-7">
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
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/20 hover:shadow-purple-600/35 transition-all duration-200 hover:scale-[1.03] active:scale-95"
              >
                <Upload size={14} />
                Tải lên ghi âm
              </button>
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
            <FilterControls filters={filters} setFilters={setFilters} />

            {/* Recordings list Table Wrapper */}
            <div className="bg-white/2 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
              <RecordingsTable
                recordings={paginatedRecordings}
                playingId={playingId}
                handlePlayPause={handlePlayPause}
                handleOpenDetail={handleOpenDetail}
                handleDelete={handleDelete}
              />
              {totalPages > 1 && (
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                />
              )}
            </div>
          </main>

          <UploadAudioModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
          />
        </>
      )}
    </>
  );
}
