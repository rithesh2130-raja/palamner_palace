import React from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const icons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const colorStyles = {
    success: 'bg-emerald-900/90 border-emerald-700 text-emerald-100',
    warning: 'bg-amber-900/90 border-amber-700 text-amber-100',
    error: 'bg-red-900/90 border-red-700 text-red-100',
    info: 'bg-gray-900/90 border-gray-700 text-gray-100',
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed z-toast bottom-20 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 sm:bottom-6 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast) => {
        const IconComponent = icons[toast.type] || icons.info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg border shadow-lg backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-5 ${colorStyles[toast.type] || colorStyles.info}`}
          >
            <div className="flex items-center gap-3">
              <IconComponent className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors text-inherit"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
