'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Database } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDemoMode } from '@/context/DemoModeContext';

export function LiveStatusHeader() {
  const { isDemoMode } = useDemoMode();
  const { isRefetchingAny, refetchAll } = useDashboardData();

  return (
    <div className="flex items-center justify-end px-4 py-2 gap-3 bg-[#070B14] border-b border-white/[0.05]">
      {isDemoMode && (
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20"
        >
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-medium text-purple-300">Demo Mode Active</span>
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
