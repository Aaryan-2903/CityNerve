'use client';

import { motion } from 'framer-motion';
import { RefreshCw, WifiOff } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export function LiveStatusHeader() {
  const { isOffline, isRefetchingAny, refetchAll } = useDashboardData();

  return (
    <div className="flex items-center justify-end px-4 py-2 gap-3 bg-[#070B14] border-b border-white/[0.05]">
      {isOffline && (
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20"
        >
          <WifiOff className="w-3.5 h-3.5 text-red-400" />
          <span className="text-xs font-medium text-red-400">Offline - Retrying...</span>
        </motion.div>
      )}
      
      <button
        onClick={() => void refetchAll()}
        disabled={isRefetchingAny}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRefetchingAny ? 'animate-spin text-blue-400' : ''}`} />
        <span className="text-xs font-medium">{isRefetchingAny ? 'Refreshing...' : 'Refresh Data'}</span>
      </button>
    </div>
  );
}
