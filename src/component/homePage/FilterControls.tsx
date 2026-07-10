import { useState, useEffect, useRef } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  scoreFilter: string;
  setScoreFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function FilterControls({
  searchQuery,
  setSearchQuery,
  scoreFilter,
  setScoreFilter,
  sortBy,
  setSortBy,
}: FilterControlsProps) {
  // Dropdown open states
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Refs for closing dropdowns when clicking outside
  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getScoreFilterLabel = (filterVal: string) => {
    switch (filterVal) {
      case "pro":
        return "Xuất sắc";
      case "avg":
        return "Trung bình";
      case "needs_practice":
        return "Cần tập thêm";
      default:
        return "Tất cả điểm";
    }
  };

  const getSortByLabel = (sortVal: string) => {
    switch (sortVal) {
      case "oldest":
        return "Cũ nhất";
      case "score_desc":
        return "Điểm cao nhất";
      case "score_asc":
        return "Điểm thấp nhất";
      default:
        return "Mới nhất";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/2 border border-white/5 backdrop-blur-md p-4 rounded-2xl relative z-20">
      {/* Search input */}
      <div className="w-full md:w-80 relative flex items-center">
        <Search size={16} className="absolute left-3 text-slate-500" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-xl h-11 pl-10 pr-4 text-white text-sm placeholder:text-gray-500 outline-none transition-all"
        />
      </div>

      {/* Filters Group */}
      <div className="w-full md:w-auto flex items-center gap-3 justify-end">
        {/* Score filter dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="flex items-center gap-2 px-4 border border-white/10 bg-transparent hover:bg-white/5 hover:border-purple-500/50 text-slate-300 font-medium h-11 rounded-xl text-sm cursor-pointer transition-all"
          >
            <Filter size={15} />
            Lọc: {getScoreFilterLabel(scoreFilter)}
            <ChevronDown size={14} className="ml-1" />
          </button>

          {filterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl p-1 shadow-2xl text-white z-30">
              <button
                onClick={() => { setScoreFilter("all"); setFilterDropdownOpen(false); }}
                className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-sm transition-all cursor-pointer"
              >
                Tất cả điểm số
              </button>
              <button
                onClick={() => { setScoreFilter("pro"); setFilterDropdownOpen(false); }}
                className="w-full text-left py-2 px-3 hover:bg-white/5 text-emerald-400 rounded-lg text-sm transition-all font-semibold cursor-pointer"
              >
                Xuất sắc (≥ 80)
              </button>
              <button
                onClick={() => { setScoreFilter("avg"); setFilterDropdownOpen(false); }}
                className="w-full text-left py-2 px-3 hover:bg-white/5 text-amber-400 rounded-lg text-sm transition-all font-semibold cursor-pointer"
              >
                Trung bình (60-79)
              </button>
              <button
                onClick={() => { setScoreFilter("needs_practice"); setFilterDropdownOpen(false); }}
                className="w-full text-left py-2 px-3 hover:bg-white/5 text-rose-400 rounded-lg text-sm transition-all font-semibold cursor-pointer"
              >
                Cần cải thiện (&lt; 60)
              </button>
            </div>
          )}
        </div>

        {/* Sort by dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex items-center gap-2 px-4 border border-white/10 bg-transparent hover:bg-white/5 hover:border-purple-500/50 text-slate-300 font-medium h-11 rounded-xl text-sm cursor-pointer transition-all"
          >
            Sắp xếp: {getSortByLabel(sortBy)}
            <ChevronDown size={14} className="ml-1" />
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl p-1 shadow-2xl text-white z-30">
              <button
                onClick={() => { setSortBy("newest"); setSortDropdownOpen(false); }}
                className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-sm transition-all cursor-pointer"
              >
                Mới nhất
              </button>
              <button
                onClick={() => { setSortBy("oldest"); setSortDropdownOpen(false); }}
                className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-sm transition-all cursor-pointer"
              >
                Cũ nhất
              </button>
              <button
                onClick={() => { setSortBy("score_desc"); setSortDropdownOpen(false); }}
                className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-sm transition-all font-semibold cursor-pointer"
              >
                Điểm cao nhất
              </button>
              <button
                onClick={() => { setSortBy("score_asc"); setSortDropdownOpen(false); }}
                className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-sm transition-all cursor-pointer"
              >
                Điểm thấp nhất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
