import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  page: number;
  onChange: (page: number) => void;
}

export default function Pagination({ total, page, onChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", total);
      } else if (page >= total - 2) {
        pages.push(1, "...", total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", total);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1.5 py-4 border-t border-white/5 bg-[#030014]/20">
      {/* Previous Page Button */}
      <button
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page === 1}
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
          page === 1
            ? "border-white/5 text-slate-600 cursor-not-allowed"
            : "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white hover:border-purple-500/50 cursor-pointer"
        }`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-slate-500 font-medium select-none"
            >
              ...
            </span>
          );
        }

        const isCurrent = p === page;
        return (
          <button
            key={`page-${p}`}
            onClick={() => onChange(p as number)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold border transition-all cursor-pointer ${
              isCurrent
                ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                : "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white hover:border-purple-500/50"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Page Button */}
      <button
        onClick={() => page < total && onChange(page + 1)}
        disabled={page === total}
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
          page === total
            ? "border-white/5 text-slate-600 cursor-not-allowed"
            : "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white hover:border-purple-500/50 cursor-pointer"
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
