'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const TOAST_VARIANTS = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = TOAST_VARIANTS[toast.variant || 'info'];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-md min-w-[300px] max-w-[400px] ${config.bg} ${config.border}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white/90">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs text-white/70 mt-1 line-clamp-2">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
