import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  Globe,
  Inbox,
  TrendingUp,
  QrCode,
  LayoutTemplate,
  Zap,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Plus,
} from 'lucide-react';

/* ─── Tutorial Steps ─────────────────────────────────────────────── */
interface TutorialStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  target?: string; // CSS selector / data-tour attribute
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlightPadding?: number;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Selamat Datang di Loka! 🎉',
    description:
      'Loka adalah platform untuk membuat landing page bisnis lokal Anda dengan cepat dan mudah. Ikuti panduan ini untuk mengenal fitur-fitur utama yang tersedia.',
    position: 'center',
  },
  {
    id: 'websites',
    icon: <Globe className="w-5 h-5" />,
    title: 'Website Saya',
    description:
      'Di sini Anda bisa melihat dan mengelola seluruh landing page bisnis Anda, memantau status publikasi, dan membuka editor.',
    target: '[data-tour="nav-websites"]',
    position: 'right',
    highlightPadding: 6,
  },
  {
    id: 'create-website',
    icon: <Plus className="w-5 h-5" />,
    title: 'Buat Website Baru',
    description:
      'Klik tombol "+ Buat Website" untuk membuat landing page baru, pilih preset template bisnis, atau buat dari nol.',
    target: '[data-tour="create-website-btn"]',
    position: 'bottom',
    highlightPadding: 6,
  },
  {
    id: 'leads',
    icon: <Inbox className="w-5 h-5" />,
    title: 'Kotak Masuk Leads',
    description:
      'Semua pesan, pertanyaan, dan nomor kontak pelanggan yang dikirim melalui formulir website Anda akan masuk ke sini secara otomatis.',
    target: '[data-tour="nav-leads"]',
    position: 'right',
    highlightPadding: 6,
  },
  {
    id: 'analytics',
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Analitik & Trafik',
    description:
      'Pantau performa website Anda secara real-time — jumlah pengunjung, klik tombol WhatsApp, rasio konversi, dan tren 7 hari terakhir.',
    target: '[data-tour="nav-analytics"]',
    position: 'right',
    highlightPadding: 6,
  },
  {
    id: 'marketing',
    icon: <QrCode className="w-5 h-5" />,
    title: 'Promosi & QR Meja',
    description:
      'Buat QR Code khusus untuk meja kasir atau spanduk promosi Anda. Pelanggan bisa langsung scan untuk membuka halaman bisnis Anda.',
    target: '[data-tour="nav-marketing"]',
    position: 'right',
    highlightPadding: 6,
  },
  {
    id: 'templates',
    icon: <LayoutTemplate className="w-5 h-5" />,
    title: 'Galeri Template',
    description:
      'Jelajahi puluhan template siap pakai yang dirancang khusus untuk berbagai jenis bisnis lokal. Pilih, kustomisasi, dan langsung publish!',
    target: '[data-tour="nav-templates"]',
    position: 'right',
    highlightPadding: 6,
  },
  {
    id: 'upgrade',
    icon: <Zap className="w-5 h-5" />,
    title: 'Upgrade ke PRO 🚀',
    description:
      'Dapatkan fitur premium seperti unlimited website, analitik lanjutan, domain custom, dan prioritas dukungan tim Loka. Klik tombol "Upgrade ke Pro" di header untuk melihat paket yang tersedia.',
    target: '[data-tour="upgrade-btn"]',
    position: 'bottom',
    highlightPadding: 6,
  },
];

/* ─── Props ──────────────────────────────────────────────────────── */
interface Props {
  onClose: () => void;
}

/* ─── Tooltip Position ───────────────────────────────────────────── */
interface TooltipRect {
  top: number;
  left: number;
  width: number;
  maxWidth: number;
}

function computeTooltipRect(
  targetEl: Element | null,
  position: TutorialStep['position'],
  tooltipW: number,
  tooltipH: number
): TooltipRect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 16;

  if (!targetEl || position === 'center') {
    return {
      top: vh / 2 - tooltipH / 2,
      left: vw / 2 - tooltipW / 2,
      width: tooltipW,
      maxWidth: Math.min(tooltipW, vw - pad * 2),
    };
  }

  const r = targetEl.getBoundingClientRect();
  let top = 0;
  let left = 0;

  if (position === 'right') {
    top = r.top + r.height / 2 - tooltipH / 2;
    left = r.right + 16;
  } else if (position === 'bottom') {
    top = r.bottom + 12;
    left = r.left + r.width / 2 - tooltipW / 2;
  } else if (position === 'left') {
    top = r.top + r.height / 2 - tooltipH / 2;
    left = r.left - tooltipW - 16;
  } else {
    top = r.top - tooltipH - 12;
    left = r.left + r.width / 2 - tooltipW / 2;
  }

  // Clamp within viewport
  top = Math.max(pad, Math.min(top, vh - tooltipH - pad));
  left = Math.max(pad, Math.min(left, vw - tooltipW - pad));

  return { top, left, width: tooltipW, maxWidth: tooltipW };
}

/* ─── Spotlight Overlay ──────────────────────────────────────────── */
interface SpotlightProps {
  targetEl: Element | null;
  padding: number;
}

function Spotlight({ targetEl, padding }: SpotlightProps) {
  if (!targetEl) {
    return (
      <div className="fixed inset-0 z-[9000] bg-slate-900/60 pointer-events-none" />
    );
  }

  const r = targetEl.getBoundingClientRect();
  const top = r.top - padding;
  const left = r.left - padding;
  const width = r.width + padding * 2;
  const height = r.height + padding * 2;

  return (
    <>
      {/* Top */}
      <div
        className="fixed z-[9000] bg-slate-900/60 pointer-events-none"
        style={{ top: 0, left: 0, right: 0, height: Math.max(0, top) }}
      />
      {/* Bottom */}
      <div
        className="fixed z-[9000] bg-slate-900/60 pointer-events-none"
        style={{
          top: top + height,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      {/* Left */}
      <div
        className="fixed z-[9000] bg-slate-900/60 pointer-events-none"
        style={{ top, left: 0, width: Math.max(0, left), height }}
      />
      {/* Right */}
      <div
        className="fixed z-[9000] bg-slate-900/60 pointer-events-none"
        style={{
          top,
          left: left + width,
          right: 0,
          height,
        }}
      />
      {/* Highlight ring */}
      <div
        className="fixed z-[9001] rounded-[14px] pointer-events-none"
        style={{
          top,
          left,
          width,
          height,
          boxShadow: '0 0 0 3px #76C0EC, 0 0 0 6px rgba(118,192,236,0.25)',
        }}
      />
    </>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
const TOOLTIP_W = 360;
const TOOLTIP_H_ESTIMATE = 240;

export const DashboardTutorial: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [tooltipRect, setTooltipRect] = useState<TooltipRect>({
    top: 0,
    left: 0,
    width: TOOLTIP_W,
    maxWidth: TOOLTIP_W,
  });
  const [animKey, setAnimKey] = useState(0);

  const current = TUTORIAL_STEPS[step];
  const total = TUTORIAL_STEPS.length;

  const updatePosition = useCallback(() => {
    const targetEl = current.target
      ? document.querySelector(current.target)
      : null;
    const rect = computeTooltipRect(
      targetEl,
      current.position,
      TOOLTIP_W,
      TOOLTIP_H_ESTIMATE
    );
    setTooltipRect(rect);
  }, [current]);

  useEffect(() => {
    updatePosition();
    setAnimKey((k) => k + 1);

    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [step, updatePosition]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && step < total - 1) setStep((s) => s + 1);
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, total, onClose]);

  const targetEl = current.target
    ? document.querySelector(current.target)
    : null;

  const handleNext = () => {
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const progress = ((step + 1) / total) * 100;

  const content = (
    <>
      {/* Spotlight overlay */}
      <Spotlight
        targetEl={targetEl}
        padding={current.highlightPadding ?? 8}
      />

      {/* Tooltip Card */}
      <div
        key={animKey}
        className="fixed z-[9100] font-poppins"
        style={{
          top: tooltipRect.top,
          left: tooltipRect.left,
          width: tooltipRect.width,
          maxWidth: tooltipRect.maxWidth,
          animation: 'tutorialCardIn 0.28s cubic-bezier(0.2,1.2,0.4,1) both',
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Top navy accent bar */}
          <div className="h-1 bg-[#425B9A]" />

          {/* Header */}
          <div className="px-5 pt-4 pb-3 flex items-start gap-3">
            {/* Step icon */}
            <div className="w-9 h-9 rounded-xl bg-[#425B9A]/10 text-[#425B9A] flex items-center justify-center shrink-0 mt-0.5">
              {current.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[10px] font-semibold text-[#425B9A] uppercase tracking-widest">
                  Langkah {step + 1} dari {total}
                </span>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-0.5 rounded-lg hover:bg-slate-100"
                  title="Tutup tutorial"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {current.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <div className="px-5 pb-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mx-5 mb-4 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#425B9A] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {TUTORIAL_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === step
                    ? 'w-4 h-1.5 bg-[#425B9A]'
                    : 'w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="px-5 pb-5 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer font-medium"
            >
              Lewati semua
            </button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Kembali
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#425B9A] hover:bg-[#374d87] rounded-xl transition cursor-pointer shadow-sm shadow-[#425B9A]/30 active:scale-95"
              >
                {step < total - 1 ? (
                  <>
                    Selanjutnya
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Selesai
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Caret arrow pointing to target */}
        {targetEl && current.position === 'right' && (
          <div
            className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0"
            style={{
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '8px solid white',
              filter: 'drop-shadow(-2px 0 2px rgba(0,0,0,0.08))',
            }}
          />
        )}
        {targetEl && current.position === 'bottom' && (
          <div
            className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid white',
              filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.08))',
            }}
          />
        )}
      </div>

      {/* Keyframe style injection */}
      <style>{`
        @keyframes tutorialCardIn {
          from { opacity: 0; transform: scale(0.90) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );

  return ReactDOM.createPortal(content, document.body);
};

/* ─── "Lihat Tutorial" Trigger Button ───────────────────────────── */
interface TriggerProps {
  onClick: () => void;
}

export const TutorialTriggerButton: React.FC<TriggerProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 h-[34px] text-white/80 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-[10px] text-xs font-poppins font-medium transition cursor-pointer"
    title="Lihat panduan penggunaan dashboard"
  >
    <BookOpen className="w-3.5 h-3.5" />
    <span className="hidden sm:inline">Lihat Tutorial</span>
  </button>
);
