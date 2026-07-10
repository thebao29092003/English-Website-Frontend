import React from "react";
import { Menu, Mic } from "lucide-react";

interface PageSkeletonProps {
  setMobileSidebarOpen: (open: boolean) => void;
  headerTitle?: string;
  headerIcon?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export default function PageSkeleton({
  setMobileSidebarOpen,
  headerTitle = "Kho Bản Ghi Âm Luyện Nói",
  headerIcon = <Mic size={18} className="text-purple-400" />,
  headerRight = (
    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 animate-pulse">
      AI Panel
    </span>
  ),
  children,
}: PageSkeletonProps) {
  return (
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
            {headerIcon}
            {headerTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {headerRight}
        </div>
      </header>

      {/* Dashboard Content Container */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {children}
      </main>
    </>
  );
}
