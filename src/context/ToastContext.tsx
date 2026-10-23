import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  ShieldAlert,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'suspend';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
  suspend: (title: string, reason?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = 'info', duration = 4000) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const newToast: ToastItem = { id, title, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const success = useCallback(
    (title: string, message?: string, duration = 3500) => {
      showToast(title, message, 'success', duration);
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string, duration = 4500) => {
      showToast(title, message, 'error', duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string, duration = 4000) => {
      showToast(title, message, 'warning', duration);
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, duration = 3500) => {
      showToast(title, message, 'info', duration);
    },
    [showToast]
  );

  const suspend = useCallback(
    (title: string, reason?: string, duration = 6000) => {
      showToast(title, reason, 'suspend', duration);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, success, error, warning, info, suspend, dismissToast }}
    >
      {children}

      {/* ── Toast Viewport Container (Floating Top-Right) ── */}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const typeConfig = {
            success: {
              bg: 'bg-white border-emerald-200 shadow-emerald-500/10',
              iconBg: 'bg-emerald-50 text-emerald-600',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
              titleColor: 'text-slate-900',
              barColor: 'bg-emerald-500',
            },
            error: {
              bg: 'bg-white border-red-200 shadow-red-500/10',
              iconBg: 'bg-red-50 text-red-600',
              icon: <AlertCircle className="w-5 h-5 text-red-600" />,
              titleColor: 'text-slate-900',
              barColor: 'bg-red-500',
            },
            warning: {
              bg: 'bg-white border-amber-200 shadow-amber-500/10',
              iconBg: 'bg-amber-50 text-amber-600',
              icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
              titleColor: 'text-slate-900',
              barColor: 'bg-amber-500',
            },
            info: {
              bg: 'bg-white border-blue-200 shadow-blue-500/10',
              iconBg: 'bg-blue-50 text-blue-600',
              icon: <Info className="w-5 h-5 text-blue-600" />,
              titleColor: 'text-slate-900',
              barColor: 'bg-blue-500',
            },
            suspend: {
              bg: 'bg-slate-900 border-red-500/40 shadow-2xl text-white',
              iconBg: 'bg-red-500/20 text-red-400',
              icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
              titleColor: 'text-white',
              barColor: 'bg-red-500',
            },
          }[t.type];

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 flex items-start gap-3 ${typeConfig.bg}`}
            >
              {/* Type Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeConfig.iconBg}`}
              >
                {typeConfig.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pr-1 space-y-0.5">
                <h4
                  className={`text-xs font-bold leading-tight ${typeConfig.titleColor}`}
                >
                  {t.title}
                </h4>
                {t.message && (
                  <p
                    className={`text-[11px] leading-relaxed line-clamp-3 ${
                      t.type === 'suspend' ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {t.message}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className={`p-1 rounded-lg transition shrink-0 ${
                  t.type === 'suspend'
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Tutup notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Bottom Subtle Accent Bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 opacity-70 ${typeConfig.barColor}`}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

