import React from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-slate-900/95 text-emerald-200',
    error: 'border-rose-500/40 bg-slate-900/95 text-rose-200',
    info: 'border-amber-500/40 bg-slate-900/95 text-amber-200'
  };

  return (
    <div className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all animate-slideUp ${
            borders[toast.type] || borders.info
          }`}
        >
          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
            {icons[toast.type] || icons.info}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
