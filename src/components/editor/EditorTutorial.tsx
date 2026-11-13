import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  Sparkles,
  Layers,
  Palette,
  Monitor,
  Sliders,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

/* ─── Tutorial Step Definition ───────────────────────────────────── */
interface TutorialStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlightPadding?: number;
}

const EDITOR_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Selamat Datang di Editor Visual Loka! 🎨',
    description:
      'Ini adalah studio tempat Anda mendesain dan menyesuaikan seluruh tampilan landing page bisnis Anda secara visual dan langsung. Mari kita pelajari fungsi tiap panelnya.',
    position: 'center',
  },
  {
    id: 'sections',
    icon: <Layers className="w-5 h-5" />,
    title: 'Urutan Seksi & Tambah Konten 📑',
    description:
      'Di panel kiri ini, Anda dapat mengatur urutan tampilan seksi dengan drag & drop, memindahkan naik/turun, atau klik tombol "+ Tambah" untuk menambahkan seksi baru (seperti Menu/Layanan, Testimoni, Galeri, atau FAQ).',
    target: '[data-tour="editor-sections"]',
    position: 'right',
    highlightPadding: 8,
  },
  {
    id: 'tabs',
    icon: <Palette className="w-5 h-5" />,
    title: 'Kustomisasi Tema, Bisnis & SEO 🖌️',
    description:
      'Gunakan tab navigasi ini untuk mengatur palet warna & jenis font bisnis Anda (Tema), nomor kontak WhatsApp & jam buka (Bisnis), serta pratinjau judul link saat dibagikan ke media sosial (SEO).',
    target: '[data-tour="editor-tabs"]',
    position: 'right',
    highlightPadding: 6,
  },
  {
    id: 'viewport',
    icon: <Monitor className="w-5 h-5" />,
    title: 'Pratinjau Multi-Device & Grid 📱',
    description:
      'Uji responsivitas website Anda di layar Desktop, Tablet, dan Smartphone. Anda juga bisa menyalakan panduan Grid 12-kolom atau masuk ke Mode Preview Interaktif untuk mencoba klik tautan seperti pengunjung asli.',
    target: '[data-tour="editor-viewport"]',
    position: 'bottom',
    highlightPadding: 6,
  },
  {
    id: 'inspector',
    icon: <Sliders className="w-5 h-5" />,
    title: 'Panel Pengaturan Konten (Inspector) ⚙️',
    description:
      'Klik seksi manapun di kanvas preview atau dari daftar kiri. Panel di kanan ini akan membuka pengaturan untuk mengganti teks judul, deskripsi, foto banner, tata letak grid, hingga teks tombol WhatsApp.',
    target: '[data-tour="editor-inspector"]',
    position: 'left',
    highlightPadding: 8,
  },
  {
    id: 'actions',
    icon: <Globe className="w-5 h-5" />,
    title: 'Simpan & Publikasikan Website 🚀',
    description:
      'Klik "Simpan" kapan saja untuk menyimpan progres perubahan draf Anda. Jika sudah siap, klik "Publish Website" agar website bisnis Anda langsung online dan dapat diakses pelanggan!',
    target: '[data-tour="editor-actions"]',
    position: 'bottom',
    highlightPadding: 6,
  },
];

/* ─── Props ──────────────────────────────────────────────────────── */
interface Props {
  onClose: () => void;
}

/* ─── Tooltip Geometry ───────────────────────────────────────────── */
interface TooltipRect {
  top: number;
  left: number;
  width: number;
  maxWidth: number;
}

const TOOLTIP_W = 370;
const TOOLTIP_H_ESTIMATE = 250;

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
      top: Math.max(pad, vh / 2 - tooltipH / 2),
      left: Math.max(pad, vw / 2 - tooltipW / 2),
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
  } else if (position === 'left') {
    top = r.top + r.height / 2 - tooltipH / 2;
    left = r.left - tooltipW - 16;
  } else if (position === 'bottom') {
    top = r.bottom + 14;
    left = r.left + r.width / 2 - tooltipW / 2;
  } else {
    top = r.top - tooltipH - 14;
    left = r.left + r.width / 2 - tooltipW / 2;
  }

  // Viewport clamping
  top = Math.max(pad, Math.min(top, vh - tooltipH - pad));
  left = Math.max(pad, Math.min(left, vw - tooltipW - pad));

  return { top, left, width: tooltipW, maxWidth: Math.min(tooltipW, vw - pad * 2) };
}

/* ─── Spotlight Overlay ──────────────────────────────────────────── */
interface SpotlightProps {
  targetEl: Element | null;
  padding: number;
}

function Spotlight({ targetEl, padding }: SpotlightProps) {
  if (!targetEl) {
    return (
      <div className="fixed inset-0 z-[9000] bg-slate-950/65 backdrop-blur-[1px] pointer-events-none transition-all duration-300" />
    );
  }

  const r = targetEl.getBoundingClientRect();
  const top = Math.max(0, r.top - padding);
  const left = Math.max(0, r.left - padding);
  const width = r.width + padding * 2;
  const height = r.height + padding * 2;

  return (
    <>
      {/* Top Overlay */}
      <div
        className="fixed z-[9000] bg-slate-950/65 backdrop-blur-[1px] pointer-events-none transition-all duration-300"
        style={{ top: 0, left: 0, right: 0, height: top }}
      />
      {/* Bottom Overlay */}
      <div
        className="fixed z-[9000] bg-slate-950/65 backdrop-blur-[1px] pointer-events-none transition-all duration-300"
        style={{
          top: top + height,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      {/* Left Overlay */}
      <div
        className="fixed z-[9000] bg-slate-950/65 backdrop-blur-[1px] pointer-events-none transition-all duration-300"
        style={{ top, left: 0, width: left, height }}
      />
      {/* Right Overlay */}
      <div
        className="fixed z-[9000] bg-slate-950/65 backdrop-blur-[1px] pointer-events-none transition-all duration-300"
        style={{
          top,
          left: left + width,
          right: 0,
          height,
        }}
      />
      {/* Target Highlight Ring */}
      <div
        className="fixed z-[9001] rounded-2xl pointer-events-none transition-all duration-300"
        style={{
          top,
          left,
          width,
          height,
          boxShadow: '0 0 0 3px #76C0EC, 0 0 0 8px rgba(118,192,236,0.28), 0 8px 30px rgba(0,0,0,0.3)',
        }}
      />
    </>
  );
}

/* ─── Main EditorTutorial Component ───────────────────────────────── */
export const EditorTutorial: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [tooltipRect, setTooltipRect] = useState<TooltipRect>({
    top: 0,
    left: 0,
    width: TOOLTIP_W,
    maxWidth: TOOLTIP_W,
  });
  const [animKey, setAnimKey] = useState(0);

  const current = EDITOR_TUTORIAL_STEPS[step];
  const total = EDITOR_TUTORIAL_STEPS.length;

  const updatePosition = useCallback(() => {
    const targetEl = current.target ? document.querySelector(current.target) : null;
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

  const targetEl = current.target ? document.querySelector(current.target) : null;

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
      {/* Dark Spotlight overlay */}
      <Spotlight
        targetEl={targetEl}
        padding={current.highlightPadding ?? 8}
      />

      {/* Tooltip Floating Card */}
      <div
        key={animKey}
        className="fixed z-[9100] font-poppins"
        style={{
          top: tooltipRect.top,
          left: tooltipRect.left,
          width: tooltipRect.width,
          maxWidth: tooltipRect.maxWidth,
          animation: 'editorTutorialIn 0.28s cubic-bezier(0.16,1.25,0.4,1) both',
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden">
          {/* Top Brand Navy Gradient Bar */}
          <div className="h-1 bg-gradient-to-r from-[#425B9A] via-[#76C0EC] to-[#425B9A]" />

          {/* Header */}
          <div className="px-5 pt-4 pb-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#425B9A]/10 text-[#425B9A] flex items-center justify-center shrink-0 shadow-xs">
              {current.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-[#425B9A] uppercase tracking-wider">
                  Langkah {step + 1} dari {total}
                </span>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
                  title="Tutup tutorial"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {current.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <div className="px-5 pb-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mx-5 mb-3.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#425B9A] to-[#76C0EC] rounded-full transition-all duration-400 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {EDITOR_TUTORIAL_STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === step
                    ? 'w-5 h-1.5 bg-[#425B9A]'
                    : 'w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Lompat ke langkah ${i + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="px-5 pb-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer font-medium"
            >
              Lewati panduan
            </button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer active:scale-95 shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Kembali
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#425B9A] hover:bg-[#344b82] rounded-xl transition cursor-pointer shadow-sm shadow-[#425B9A]/30 active:scale-95"
              >
                {step < total - 1 ? (
                  <>
                    Selanjutnya
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Mulai Mengedit
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Caret Arrows pointing to target */}
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
        {targetEl && current.position === 'left' && (
          <div
            className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0"
            style={{
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: '8px solid white',
              filter: 'drop-shadow(2px 0 2px rgba(0,0,0,0.08))',
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

      <style>{`
        @keyframes editorTutorialIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );

  return ReactDOM.createPortal(content, document.body);
};

/* ─── "Lihat Tutorial" Trigger Button for Editor Top Bar ─────────── */
interface TriggerButtonProps {
  onClick: () => void;
}

export const EditorTutorialTriggerButton: React.FC<TriggerButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#425B9A] bg-[#425B9A]/10 hover:bg-[#425B9A]/20 transition cursor-pointer active:scale-95 border border-[#425B9A]/20"
    title="Lihat panduan cara mengedit website"
  >
    <BookOpen className="w-3.5 h-3.5 text-[#425B9A]" />
    <span className="hidden sm:inline">Lihat Tutorial</span>
  </button>
);
