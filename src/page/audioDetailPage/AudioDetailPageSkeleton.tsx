import { Skeleton } from "@heroui/react";

export default function AudioDetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Detail Score Overview Skeleton */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/2 border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
          {/* Circular Gauge Placeholder */}
          <Skeleton className="w-36 h-36 rounded-full shrink-0" />
          
          {/* Level Details Placeholder */}
          <div className="space-y-3 flex-1 w-full">
            <div className="flex justify-center sm:justify-end mb-2">
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
            <Skeleton className="h-7 w-3/4 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* 5 Skills Progress Bar Placeholders */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-white/10">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
              <Skeleton className="h-3 w-16 rounded-md" />
              <Skeleton className="h-5 w-10 rounded-md" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Placeholder */}
      <div className="glass-card rounded-2xl p-6 bg-white/2 border border-white/5 space-y-4">
        {/* Tab Selection Bar Placeholder */}
        <div className="flex gap-2 border-b border-white/5 pb-4 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-8 flex-1 rounded-lg min-w-[100px]" />
          ))}
        </div>

        {/* Tab content placeholder */}
        <div className="space-y-3 pt-2">
          <Skeleton className="h-4 w-1/3 rounded-md" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
