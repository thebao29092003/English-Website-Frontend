import { Skeleton } from "@heroui/react";

export default function HomePageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="glass-panel p-3 rounded-2xl flex items-center gap-3 bg-white/2 border border-white/5 backdrop-blur-md shadow-md"
          >
            {/* Icon placeholder */}
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              {/* Label placeholder */}
              <Skeleton className="h-3 w-16 rounded-md" />
              {/* Value placeholder */}
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Controls Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 backdrop-blur-md">
        {/* Search input placeholder */}
        <Skeleton className="h-10 w-full md:max-w-xs rounded-xl" />

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Dropdown 1 placeholder */}
          <Skeleton className="h-10 w-32 rounded-xl flex-1 md:flex-none" />
          {/* Dropdown 2 placeholder */}
          <Skeleton className="h-10 w-40 rounded-xl flex-1 md:flex-none" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white/2 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/1">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>

        <div className="divide-y divide-white/5">
          {Array.from({ length: 2 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Title & Info */}
              <div className="flex items-start gap-3 flex-1 min-w-[200px]">
                {/* Play button placeholder */}
                <Skeleton className="w-8 h-8 rounded-lg shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  {/* Title placeholder */}
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <div className="flex gap-2">
                    {/* Date placeholder */}
                    <Skeleton className="h-3 w-24 rounded-md" />
                    {/* File size placeholder */}
                    <Skeleton className="h-3 w-12 rounded-md" />
                  </div>
                </div>
              </div>

              {/* Middle Column: Scores */}
              <div className="flex flex-wrap items-center gap-6 md:gap-8 shrink-0">
                {/* Overall Score Circle/Badge */}
                <div className="flex items-center gap-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-16 rounded-md" />
                    <Skeleton className="h-3 w-12 rounded-md" />
                  </div>
                </div>

                {/* Pronunciation Progress */}
                <div className="w-24 space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-8 rounded-md" />
                    <Skeleton className="h-3 w-6 rounded-md" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>

                {/* Fluency Progress */}
                <div className="w-24 space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-8 rounded-md" />
                    <Skeleton className="h-3 w-6 rounded-md" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 justify-end shrink-0 w-full md:w-auto">
                <Skeleton className="w-20 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
