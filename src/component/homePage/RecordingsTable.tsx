import { Mic, Play, Pause, Eye, Trash2, Calendar } from "lucide-react";
import type { Recording } from "../../types/homePage.type";
import {
  formatDate,
  formatDuration,
  formatFileSize,
} from "../../utility/formatTimeSize";
import { getOverallScore } from "../../utility/getOverallScore";

interface RecordingsTableProps {
  recordings: Recording[];
  playingId: string | null;
  handlePlayPause: (rec: Recording) => void;
  handleOpenDetail: (rec: Recording) => void;
  handleDelete: (recodingId: string) => void;
}

// Helper to compute overall score for a recording

export default function RecordingsTable({
  recordings,
  playingId,
  handlePlayPause,
  handleOpenDetail,
  handleDelete,
}: RecordingsTableProps) {
  const getScoreColorClasses = (score: number) => {
    if (score >= 80)
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    if (score >= 50)
      return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    return "bg-rose-500/10 border-rose-500/20 text-rose-400";
  };

  const getScoreChipLabel = (score: number) => {
    if (score >= 80) return "Xuất sắc";
    if (score >= 50) return "Trung bình";
    return "Cần cải thiện";
  };

  if (recordings.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <Mic size={48} className="mx-auto text-slate-600 animate-pulse" />
        <h3 className="text-lg font-bold text-white">
          Không tìm thấy bản ghi nào
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Hãy thử gõ từ khóa tìm kiếm khác hoặc thay đổi bộ lọc điểm số để tìm
          lại bản ghi âm.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full scrollbar-thin">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-white/5 text-slate-300 font-bold border-b border-white/5">
            <th className="py-4 px-6 text-sm uppercase font-mono tracking-wider">
              Thông tin bản ghi
            </th>
            <th className="py-4 px-6 text-sm uppercase font-mono tracking-wider">
              Ngày tạo
            </th>
            <th className="py-4 px-6 text-sm uppercase font-mono tracking-wider">
              Điểm đánh giá
            </th>
            <th className="py-4 px-6 text-sm uppercase font-mono tracking-wider">
              Thời lượng
            </th>
            <th className="py-4 px-6 text-sm uppercase font-mono tracking-wider text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {recordings.map((rec, index) => {
            const overallScore = getOverallScore(rec);
            const formattedTitle = rec.fileName ? rec.fileName : "Bản ghi âm";
            const transcript = rec.speechToText?.aiTranscript || "";

            return (
              <tr
                key={rec.recodingId}
                className={`border-b border-white/5 transition-colors hover:bg-white/10 ${
                  index % 2 === 0 ? "bg-white/3" : "bg-white/1"
                }`}
              >
                {/* Name & Transcript preview */}
                <td className="py-4 px-6 text-sm">
                  <div className="space-y-1.5 max-w-[280px] sm:max-w-sm">
                    <h4
                      className="font-semibold text-white truncate text-base hover:text-purple-300 cursor-pointer transition-colors"
                      onClick={() => handleOpenDetail(rec)}
                    >
                      {formattedTitle}
                    </h4>
                    <p className="text-sm text-slate-400 line-clamp-1 italic">
                      "{transcript}"
                    </p>
                  </div>
                </td>

                {/* Created date */}
                <td className="py-4 px-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar size={14} className="text-slate-500 shrink-0" />
                    <span className="font-mono text-sm">
                      {formatDate(rec.createdAt)}
                    </span>
                  </div>
                </td>

                {/* Score Chip */}
                <td className="py-4 px-6 text-sm min-w-[175px]">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${getScoreColorClasses(
                      overallScore,
                    )}`}
                  >
                    <span>{overallScore}</span> -{" "}
                    {getScoreChipLabel(overallScore)}{" "}
                  </div>
                </td>

                {/* Duration & Size */}
                <td className="py-4 px-6 text-sm">
                  <div className="space-y-0.5 font-mono text-sm">
                    <p className="text-white">{formatDuration(rec.duration)}</p>
                    <p className="text-slate-500 text-[10px]">
                      {formatFileSize(rec.fileSize)}
                    </p>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-sm text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Play/Pause Button */}
                    <button
                      onClick={() => handlePlayPause(rec)}
                      title={
                        playingId === rec.recodingId ? "Tạm dừng" : "Nghe lại"
                      }
                      className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all border ${
                        playingId === rec.recodingId
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/40"
                          : "bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {playingId === rec.recodingId ? (
                        <Pause size={15} className="animate-pulse" />
                      ) : (
                        <Play size={15} />
                      )}
                    </button>

                    {/* View details */}
                    <button
                      onClick={() => handleOpenDetail(rec)}
                      title="Xem phân tích AI"
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-slate-300 cursor-pointer transition-all"
                    >
                      <Eye size={15} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(rec.recodingId)}
                      title="Xóa bản ghi"
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-400 text-slate-400 cursor-pointer transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
