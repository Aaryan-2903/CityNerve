import { motion } from 'framer-motion';

export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: 'mirror' }}
      className={`bg-white/[0.05] rounded-md ${className}`}
    />
  );
}

export function WeatherSkeleton() {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 h-full">
            <Skeleton className="w-4 h-4 shrink-0 rounded-full" />
            <div className="flex flex-col gap-1 w-full">
              <Skeleton className="h-2 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IncidentSkeleton() {
  return (
    <div className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] mb-1.5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-4 w-3/4 mb-2" />
      <div className="flex items-center gap-1 mb-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.05]">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export function ResourceSkeleton() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 mb-1">
      <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between gap-1 mb-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center justify-between gap-1">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-2 w-8" />
        </div>
      </div>
    </div>
  );
}
